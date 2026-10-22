'use server';

import { createServerClient } from '@/shared/lib/supabase';
import { createDreambigServerApi } from '@/util/api/server';
import { ActionState } from '@/shared/types/action.types';

export async function updateProductAction(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const id = Number(formData.get('id'));
    const values = {
        name: String(formData.get('name') ?? '').trim(),
        category: String(formData.get('category') ?? '').trim(),
        imageUrl: String(formData.get('imageUrl') ?? '').trim(),
        description: String(formData.get('description') ?? '').trim(),
        priceMinor: String(formData.get('priceMinor') ?? ''),
        displayOrder: String(formData.get('displayOrder') ?? ''),
    };
    const priceMinor = Number(values.priceMinor);
    const displayOrder = Number(values.displayOrder);

    // 검사
    const errors: Record<string, string> = {};
    if (!values.name) errors.name = '상품 이름을 입력해 주세요.';
    if (!values.category) errors.category = '분류를 입력해 주세요.';
    if (!values.imageUrl) errors.imageUrl = '이미지 주소를 입력해 주세요.';
    if (!values.priceMinor || !Number.isInteger(priceMinor) || priceMinor < 0) {
        errors.priceMinor = '가격은 0 이상의 정수로 입력해 주세요.';
    }
    if (!values.displayOrder || !Number.isInteger(displayOrder)) {
        errors.displayOrder = '순서는 정수로 입력해 주세요.';
    }
    if (Object.keys(errors).length > 0) {
        return { success: false, errors, data: values };
    }

    // 저장 (관리자 API가 관리자인지 다시 확인함)
    try {
        const api = createDreambigServerApi(createServerClient());
        await api.admin.updateProduct(id, {
            name: values.name,
            category: values.category,
            image_url: values.imageUrl,
            description: values.description,
            price_minor: priceMinor,
            display_order: displayOrder,
        });
    } catch {
        return { success: false, message: '저장하지 못했어요. 잠시 후 다시 시도해 주세요.', data: values };
    }

    return { success: true, message: '저장했느니라.', data: values };
}