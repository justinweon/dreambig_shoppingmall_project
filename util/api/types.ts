/** 2026-10-21 dreambig-shoppingmall-dev public 스키마를 대시보드에서 대조한 타입. */
export type Json =
    | string
    | number
    | boolean
    | null
    | Json[]
    | { [key: string]: Json | undefined };
export type ProductRow = {
    id: number;
    name: string;
    price_minor: number;
    currency: 'KRW' | 'USD' | 'JPY';
    category: string;
    image_url: string;
    erase_image_url: string;
    description: string;
    display_order: number;
};
export type ProductDetailRow = {
    product_id: number;
    template_id: string;
    collection_name: string;
    summary: string;
    notice: string;
    images: Json;
    specifications: Json;
    highlights: Json;
    features: Json;
};
export type ReviewRow = {
    id: string;
    product_id: number;
    author_name: string;
    is_example: boolean;
    rating: number;
    body: string;
    created_at: string;
    images: Json;
    display_order: number;
};
export type BannerRow = {
    id: string;
    product_id: number;
    headline: string;
    supporting_text: string;
    desktop_image: Json;
    mobile_image: Json;
    actions: Json;
    display_order: number;
};
export type CarouselRow = {
    id: string;
    product_id: number;
    hover_image: Json;
    marketing_description: string | null;
    display_order: number;
};
export type ProfileRow = {
    id: string;
    nickname: string;
    name: string | null;
    phone: string | null;
    zip_code: string | null;
    address: string | null;
    address_detail: string | null;
    role: 'user' | 'admin';
    created_at: string;
};
export type ProfileContactInput = Partial<
    Pick<ProfileRow, 'phone' | 'zip_code' | 'address' | 'address_detail'>
>;
export type CartRow = { user_id: string; product_id: number; quantity: number };
export type OrderItemInput = { productId: number; quantity: number };
export type OrderRow = {
    id: string;
    user_id: string;
    request_id: string;
    request_items: Json;
    status: 'pending_payment' | 'paid';
    amount_minor: number;
    currency: 'KRW';
    created_at: string;
    paid_at: string | null;
};
export type OrderItemRow = {
    order_id: string;
    product_id: number;
    product_name: string;
    unit_price_minor: number;
    quantity: number;
    display_order: number;
};
export type PaymentRow = {
    id: string;
    order_id: string;
    provider: 'toss';
    payment_key: string;
    amount_minor: number;
    currency: 'KRW';
    status: 'DONE';
    approved_at: string;
    created_at: string;
};
type Table<Row extends object, Optional extends keyof Row = never> = {
    Row: Row;
    Insert: Omit<Row, Optional> & Partial<Pick<Row, Optional>>;
    Update: Partial<Row>;
    Relationships: [];
};
export type Database = {
    public: {
        Tables: {
            products: Table<ProductRow>;
            product_details: Table<
                ProductDetailRow,
                'images' | 'specifications' | 'highlights' | 'features'
            >;
            reviews: Table<ReviewRow, 'is_example' | 'images'>;
            product_banners: Table<BannerRow, 'mobile_image' | 'actions'>;
            carousel_items: Table<
                CarouselRow,
                'hover_image' | 'marketing_description'
            >;
            profiles: Table<
                ProfileRow,
                | 'created_at'
                | 'name'
                | 'role'
                | 'phone'
                | 'zip_code'
                | 'address'
                | 'address_detail'
            >;
            cart_items: Table<CartRow, 'user_id'>;
            orders: Table<OrderRow, 'id' | 'status' | 'created_at' | 'paid_at'>;
            order_items: Table<OrderItemRow>;
            payments: Table<
                PaymentRow,
                'id' | 'provider' | 'status' | 'created_at'
            >;
        };
        Views: { [_ in never]: never };
        Functions: {
            add_my_cart_item: {
                Args: { p_product_id: number; p_quantity: number };
                Returns: Json;
            };
            create_order: {
                Args: { p_request_id: string; p_items: Json };
                Returns: Json;
            };
            apply_toss_payment: {
                Args: {
                    p_order_id: string;
                    p_payment_key: string;
                    p_amount_minor: number;
                    p_currency: string;
                    p_approved_at: string;
                };
                Returns: Json;
            };
        };
        Enums: { [_ in never]: never };
        CompositeTypes: { [_ in never]: never };
    };
};
