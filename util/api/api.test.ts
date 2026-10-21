import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import { createClient } from '@supabase/supabase-js';
import { createDreambigApi, type ApiClient, type Database } from './index';
import { createDreambigServerApi } from './server';

test('로그인 세션이 없으면 현재 사용자는 null, 개인 데이터는 AUTH_REQUIRED다', async () => {
    const client = createClient<Database>(
        'https://example.supabase.co',
        'test-key',
        {
            auth: { persistSession: false, autoRefreshToken: false },
        },
    );
    const api = createDreambigApi(client);
    assert.equal(await api.auth.getCurrentUser(), null);
    await assert.rejects(api.cart.listMyCartItems(), { code: 'AUTH_REQUIRED' });
});

test('서버 전용 API를 일반 클라이언트 환경에서 import하면 차단된다', () => {
    const child = spawnSync(
        process.execPath,
        ['--import', 'tsx', '-e', "import('./util/api/server.ts')"],
        { encoding: 'utf8' },
    );
    assert.notEqual(child.status, 0);
    assert.match(child.stderr, /cannot be imported from a Client Component/);
});

test('회원가입 메타데이터는 연락처/기본 배송지의 공백을 정리하고 우편번호 앞자리 0을 보존한다', async () => {
    const { client, requests } = fixture(() => ({ id: userId }));
    await createDreambigApi(client).auth.signUp({
        email: ' sample@example.invalid ',
        password: 'unchanged password ',
        nickname: ' 샘플 ',
        name: ' 이름 ',
        phone: ' 01012345678 ',
        zip_code: ' 01234 ',
        address: ' 기본 주소 ',
        address_detail: ' 101동 1001호 ',
    });
    assert.equal(requests[0].url.pathname, '/auth/v1/signup');
    const body = requests[0].body as {
        email: string;
        password: string;
        data: unknown;
    };
    assert.equal(body.email, 'sample@example.invalid');
    assert.equal(body.password, 'unchanged password ');
    assert.deepEqual(body.data, {
        nickname: '샘플',
        name: '이름',
        phone: '01012345678',
        zip_code: '01234',
        address: '기본 주소',
        address_detail: '101동 1001호',
    });
});

test('회원가입의 연락처는 생략 가능하고 빈 값/null은 null로 전달한다', async () => {
    const { client, requests } = fixture(() => ({ id: userId }));
    const api = createDreambigApi(client);
    const input = {
        email: 'sample@example.invalid',
        password: 'password',
        nickname: '샘플',
    };
    await api.auth.signUp(input);
    assert.deepEqual((requests[0].body as { data: unknown }).data, {
        nickname: '샘플',
    });
    await api.auth.signUp({
        ...input,
        phone: ' ',
        zip_code: null,
        address: '',
        address_detail: null,
    });
    assert.deepEqual((requests[1].body as { data: unknown }).data, {
        nickname: '샘플',
        phone: null,
        zip_code: null,
        address: null,
        address_detail: null,
    });
    await assert.rejects(
        api.auth.signUp({ ...input, phone: '010-1234-5678' }),
        { code: 'INVALID_INPUT' },
    );
    assert.equal(requests.length, 2);
});

const userId = '11111111-1111-4111-8111-111111111111';
const orderId = '22222222-2222-4222-8222-222222222222';
const order = {
    id: orderId,
    user_id: userId,
    amount_minor: 8000,
    currency: 'KRW',
    status: 'pending_payment',
};
type Request = { url: URL; method: string; body: unknown };
function fixture(
    handler: (request: Request) => unknown = () => [],
    signedIn = true,
) {
    const requests: Request[] = [];
    const client = createClient<Database>(
        'https://example.supabase.co',
        'test-key',
        {
            auth: { persistSession: false, autoRefreshToken: false },
            global: {
                fetch: async (input, init) => {
                    const request = {
                        url: new URL(String(input)),
                        method: init?.method ?? 'GET',
                        body: init?.body
                            ? JSON.parse(String(init.body))
                            : undefined,
                    };
                    requests.push(request);
                    return new Response(JSON.stringify(handler(request)), {
                        status: 200,
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Range': '0-0/3',
                        },
                    });
                },
            },
        },
    );
    client.auth.getUser = async () =>
        ({
            data: { user: signedIn ? { id: userId } : null },
            error: null,
        }) as Awaited<ReturnType<ApiClient['auth']['getUser']>>;
    return { client, requests };
}

test('주문 RPC에는 상품 ID/수량만 전달하고 같은 요청 ID를 유지한다', async () => {
    const { client, requests } = fixture(() => order);
    const api = createDreambigApi(client);
    await api.orders.createOrder(orderId, [{ productId: 101, quantity: 1 }]);
    await api.orders.createOrder(orderId, [{ productId: 101, quantity: 1 }]);
    assert.equal(requests[0].url.pathname, '/rest/v1/rpc/create_order');
    assert.deepEqual(requests[0].body, {
        p_request_id: orderId,
        p_items: [{ productId: 101, quantity: 1 }],
    });
    assert.deepEqual(requests[0].body, requests[1].body);
});
test('중복 상품, 빈 주문, 잘못된 UUID와 정수 범위를 DB 호출 전에 거부한다', async () => {
    const { client, requests } = fixture();
    const api = createDreambigApi(client);
    await assert.rejects(api.orders.createOrder(orderId, []), {
        code: 'INVALID_ITEM_COUNT',
    });
    await assert.rejects(
        api.orders.createOrder(orderId, [
            { productId: 101, quantity: 1 },
            { productId: 101, quantity: 2 },
        ]),
        { code: 'DUPLICATE_PRODUCT' },
    );
    await assert.rejects(
        api.orders.createOrder('bad', [{ productId: 101, quantity: 1 }]),
        { code: 'INVALID_INPUT' },
    );
    for (const quantity of [0, -1, 1.5, NaN, Infinity, 2147483648])
        await assert.rejects(api.cart.addMyCartItem(101, quantity), {
            code: 'INVALID_INPUT',
        });
    assert.equal(requests.length, 0);
});
test('로그인하지 않은 주문/카트 호출을 거부한다', async () => {
    const { client, requests } = fixture(undefined, false);
    await assert.rejects(createDreambigApi(client).cart.listMyCartItems(), {
        code: 'AUTH_REQUIRED',
    });
    assert.equal(requests.length, 0);
});
test('내 카트는 사용자 ID를 제한하고 추가 수량은 원자적 RPC로 전달한다', async () => {
    const { client, requests } = fixture();
    const api = createDreambigApi(client);
    await api.cart.listMyCartItems();
    assert.equal(requests[0].url.searchParams.get('user_id'), `eq.${userId}`);
    await api.cart.addMyCartItem(101, 2);
    assert.equal(requests[1].url.pathname, '/rest/v1/rpc/add_my_cart_item');
    assert.deepEqual(requests[1].body, { p_product_id: 101, p_quantity: 2 });
});
test('상품 페이지 범위를 제한하고 잘못된 페이지를 거부한다', async () => {
    const { client, requests } = fixture();
    const api = createDreambigApi(client);
    await api.products.listProducts({
        page: 2,
        pageSize: 10,
        category: 'goods',
    });
    assert.equal(requests[0].url.searchParams.get('offset'), '10');
    assert.equal(requests[0].url.searchParams.get('limit'), '10');
    assert.equal(requests[0].url.searchParams.get('category'), 'eq.goods');
    await assert.rejects(api.products.listProducts({ page: 0 }), {
        code: 'INVALID_INPUT',
    });
    await assert.rejects(api.products.listProducts({ pageSize: 101 }), {
        code: 'INVALID_INPUT',
    });
});

test('상세와 메인은 화면 데이터 묶음을 한 함수로 가져온다', async () => {
    const { client, requests } = fixture(({ url }) => {
        if (url.pathname.endsWith('/products'))
            return url.searchParams.has('id') ? { id: 101 } : [{ id: 101 }];
        if (url.pathname.endsWith('/product_details'))
            return { product_id: 101 };
        if (url.pathname.endsWith('/product_banners'))
            return [{ id: 'banner', product_id: 101 }];
        if (url.pathname.endsWith('/carousel_items'))
            return [{ id: 'carousel', product_id: 101 }];
        return [];
    });
    const api = createDreambigApi(client);
    const detail = await api.products.getProductPageData(101);
    assert.equal(detail?.product.id, 101);
    assert.equal(detail?.detail?.product_id, 101);
    const home = await api.products.getHomeData();
    assert.equal(home.banners.length, 1);
    assert.equal(home.carouselItems.length, 1);
    assert.equal(requests.at(-1)?.url.searchParams.get('id'), 'in.(101)');
});

test('관리자 대시보드는 정확한 건수를 집계하고 페이지 크기에 영향받지 않는다', async () => {
    const user = fixture();
    const service = fixture(({ url }) =>
        url.pathname.endsWith('/profiles') && url.searchParams.has('id')
            ? { role: 'admin' }
            : [],
    );
    const api = createDreambigServerApi(user.client, {
        serviceClient: service.client,
    });
    assert.deepEqual(await api.admin.getDashboardSummary(), {
        productCount: 3,
        memberCount: 3,
        pendingOrderCount: 3,
        paidOrderCount: 3,
    });
    assert.equal(
        service.requests.filter((request) => request.method === 'HEAD').length,
        4,
    );
});
test('관리자는 매 요청마다 DB 역할을 확인하고 일반 사용자의 전체 주문 조회를 차단한다', async () => {
    const user = fixture();
    let role = 'user';
    const service = fixture(({ url }) =>
        url.pathname.endsWith('/profiles') ? { role } : [],
    );
    const api = createDreambigServerApi(user.client, {
        serviceClient: service.client,
    });
    await assert.rejects(api.admin.listOrders(), { code: 'FORBIDDEN' });
    assert.equal(service.requests.length, 1);
    role = 'admin';
    await api.admin.listOrders({ status: 'paid' });
    assert.equal(
        service.requests.at(-1)?.url.searchParams.get('status'),
        'eq.paid',
    );
    role = 'user';
    await assert.rejects(api.admin.listProfiles(), { code: 'FORBIDDEN' });
});
test('닉네임 중복은 RLS 제한이 있는 사용자 클라이언트 대신 서버 조회로 boolean만 반환한다', async () => {
    const user = fixture();
    const service = fixture(() => [{ id: userId }]);
    const api = createDreambigServerApi(user.client, {
        serviceClient: service.client,
    });
    assert.equal(await api.auth.checkNicknameDuplicate(' tester '), true);
    assert.equal(
        service.requests[0].url.searchParams.get('nickname'),
        'eq.tester',
    );
    assert.equal(user.requests.length, 0);
});
test('조회 결과가 없으면 null, 소유하지 않은 주문 항목은 빈 배열이다', async () => {
    const { client, requests } = fixture(() => null);
    const api = createDreambigApi(client);
    assert.equal(await api.products.getProduct(999), null);
    assert.deepEqual(await api.orders.listMyOrderItems(orderId), []);
    assert.equal(
        requests.some(({ url }) => url.pathname.endsWith('/order_items')),
        false,
    );
});
test('DB 오류 코드/메시지를 보존한다', async () => {
    const { client } = fixture();
    client.rpc = (() =>
        Promise.resolve({
            data: null,
            error: { code: '22023', message: 'REQUEST_CONFLICT' },
        })) as unknown as ApiClient['rpc'];
    await assert.rejects(
        createDreambigApi(client).orders.createOrder(orderId, [
            { productId: 101, quantity: 1 },
        ]),
        { code: '22023', message: 'REQUEST_CONFLICT' },
    );
});
test('결제 금액 변조와 다른 사용자 주문은 Toss 호출 전에 거부한다', async () => {
    const user = fixture();
    const service = fixture(() => order);
    const api = createDreambigServerApi(user.client, {
        serviceClient: service.client,
        tossSecretKey: 'test-secret',
    });
    await assert.rejects(
        api.payments.confirmTossPayment({
            orderId,
            paymentKey: 'key',
            amount: 1,
        }),
        { code: 'PAYMENT_AMOUNT_MISMATCH' },
    );
    assert.equal(
        service.requests[0].url.searchParams.get('user_id'),
        `eq.${userId}`,
    );
    const missing = createDreambigServerApi(user.client, {
        serviceClient: fixture(() => null).client,
    });
    await assert.rejects(
        missing.payments.confirmTossPayment({
            orderId,
            paymentKey: 'key',
            amount: 8000,
        }),
        { code: 'ORDER_NOT_FOUND' },
    );
});
test('Toss 완료 응답을 검증한 뒤 DB에 반영하고 결제 키는 반환하지 않는다', async () => {
    const user = fixture();
    const service = fixture(({ url }) =>
        url.pathname.endsWith('/orders')
            ? order
            : {
                  id: 'payment-id',
                  order_id: orderId,
                  payment_key: 'key',
                  status: 'DONE',
              },
    );
    const api = createDreambigServerApi(user.client, {
        serviceClient: service.client,
        tossSecretKey: 'test-secret',
    });
    const originalFetch = globalThis.fetch;
    const providerRequests: { url: string; init?: RequestInit }[] = [];
    const completed = {
        orderId,
        paymentKey: 'key',
        totalAmount: 8000,
        currency: 'KRW',
        status: 'DONE',
        approvedAt: '2026-10-21T05:00:00Z',
    };
    globalThis.fetch = async (url, init) => {
        providerRequests.push({ url: String(url), init });
        return Response.json(completed);
    };
    try {
        const result = await api.payments.confirmTossPayment({
            orderId,
            paymentKey: 'key',
            amount: 8000,
        });
        assert.equal(
            providerRequests[0].url,
            'https://api.tosspayments.com/v1/payments/confirm',
        );
        assert.deepEqual(JSON.parse(String(providerRequests[0].init?.body)), {
            paymentKey: 'key',
            orderId,
            amount: 8000,
        });
        assert.equal(
            service.requests.at(-1)?.url.pathname,
            '/rest/v1/rpc/apply_toss_payment',
        );
        assert.equal('payment_key' in result, false);
        const before = service.requests.length;
        globalThis.fetch = async () =>
            Response.json({ ...completed, status: 'WAITING_FOR_DEPOSIT' });
        await assert.rejects(
            api.payments.confirmTossPayment({
                orderId,
                paymentKey: 'key',
                amount: 8000,
            }),
            { code: 'INVALID_PAYMENT_RESPONSE' },
        );
        assert.equal(service.requests.length, before + 1);
        let calls = 0;
        globalThis.fetch = async () =>
            ++calls === 1
                ? Response.json(
                      { code: 'ALREADY_PROCESSED_PAYMENT' },
                      { status: 400 },
                  )
                : Response.json(completed);
        await api.payments.confirmTossPayment({
            orderId,
            paymentKey: 'key',
            amount: 8000,
        });
        assert.equal(calls, 2);
    } finally {
        globalThis.fetch = originalFetch;
    }
});
