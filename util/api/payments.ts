import 'server-only';
import {
    type ApiClient,
    DreambigApiError,
    requireText,
    requireUser,
    requireUuid,
    unwrap,
} from './core';
import type { PaymentRow } from './types';

/** Toss 승인 응답 검증 후에만 service-role RPC로 결제를 반영한다. */
export function createPaymentsApi(
    userClient: ApiClient,
    serviceClient: ApiClient,
    secretKey?: string,
) {
    return {
        async confirmTossPayment(input: {
            orderId: string;
            paymentKey: string;
            amount: number;
        }) {
            const user = await requireUser(userClient);
            const id = requireUuid(input.orderId);
            const paymentKey = requireText(input.paymentKey, 'paymentKey');
            if (paymentKey.length > 200)
                throw new DreambigApiError(
                    'INVALID_PAYMENT',
                    'Invalid paymentKey',
                );
            const order = unwrap(
                await serviceClient
                    .from('orders')
                    .select('*')
                    .eq('id', id)
                    .eq('user_id', user.id)
                    .maybeSingle(),
            );
            if (!order)
                throw new DreambigApiError(
                    'ORDER_NOT_FOUND',
                    'Order not found',
                );
            if (input.amount !== order.amount_minor || order.currency !== 'KRW')
                throw new DreambigApiError(
                    'PAYMENT_AMOUNT_MISMATCH',
                    'Payment amount mismatch',
                );
            if (!secretKey)
                throw new DreambigApiError(
                    'CONFIG_REQUIRED',
                    'TOSS_SECRET_KEY is required on the server',
                );
            const headers = {
                Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
            };
            let response = await fetch(
                'https://api.tosspayments.com/v1/payments/confirm',
                {
                    method: 'POST',
                    headers: {
                        ...headers,
                        'Content-Type': 'application/json',
                        'Idempotency-Key': `dreambig-${id}`,
                    },
                    body: JSON.stringify({
                        paymentKey,
                        orderId: id,
                        amount: order.amount_minor,
                    }),
                    cache: 'no-store',
                    signal: AbortSignal.timeout(15000),
                },
            );
            let body = await response.json();
            // 승인 후 DB 반영 실패/응답 유실의 재시도는 Toss에서 기존 결제를 조회해 복구한다.
            if (!response.ok && body.code === 'ALREADY_PROCESSED_PAYMENT') {
                response = await fetch(
                    `https://api.tosspayments.com/v1/payments/${encodeURIComponent(paymentKey)}`,
                    {
                        headers,
                        cache: 'no-store',
                        signal: AbortSignal.timeout(15000),
                    },
                );
                body = await response.json();
            }
            if (!response.ok)
                throw new DreambigApiError(
                    body.code ?? 'PAYMENT_FAILED',
                    'Toss payment confirmation failed',
                );
            if (
                body.orderId !== id ||
                body.paymentKey !== paymentKey ||
                body.totalAmount !== order.amount_minor ||
                body.currency !== order.currency ||
                body.status !== 'DONE' ||
                typeof body.approvedAt !== 'string' ||
                !Number.isFinite(Date.parse(body.approvedAt))
            )
                throw new DreambigApiError(
                    'INVALID_PAYMENT_RESPONSE',
                    'Payment is not a matching completed payment',
                );
            const payment = unwrap(
                await serviceClient.rpc('apply_toss_payment', {
                    p_order_id: id,
                    p_payment_key: paymentKey,
                    p_amount_minor: order.amount_minor,
                    p_currency: order.currency,
                    p_approved_at: body.approvedAt,
                }),
            ) as unknown as PaymentRow;
            const {
                id: paymentId,
                order_id,
                provider,
                amount_minor,
                currency,
                status,
                approved_at,
                created_at,
            } = payment;
            return {
                id: paymentId,
                order_id,
                provider,
                amount_minor,
                currency,
                status,
                approved_at,
                created_at,
            };
        },
    };
}
