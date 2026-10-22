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
    role: 'user' | 'admin';
    created_at: string;
};
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
export type NoticeBoard = 'notice' | 'free';
/** notice는 관리자만, free는 로그인 사용자 누구나 작성. author_nickname은 작성 시점 스냅샷. */
export type NoticePostRow = {
    id: number;
    board: NoticeBoard;
    title: string;
    content: string;
    author_id: string;
    author_nickname: string;
    views: number;
    created_at: string;
};
/** parent_id가 null이면 댓글, 있으면 답글. */
export type NoticeCommentRow = {
    id: number;
    post_id: number;
    parent_id: number | null;
    author_id: string;
    author_nickname: string;
    text: string;
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
            profiles: Table<ProfileRow, 'created_at' | 'name' | 'role'>;
            cart_items: Table<CartRow, 'user_id'>;
            orders: Table<OrderRow, 'id' | 'status' | 'created_at' | 'paid_at'>;
            order_items: Table<OrderItemRow>;
            payments: Table<
                PaymentRow,
                'id' | 'provider' | 'status' | 'created_at'
            >;
            notice_posts: Table<
                NoticePostRow,
                'id' | 'author_id' | 'views' | 'created_at'
            >;
            notice_comments: Table<
                NoticeCommentRow,
                'id' | 'parent_id' | 'author_id' | 'created_at'
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
            increase_notice_views: {
                Args: { p_post_id: number };
                Returns: undefined;
            };
        };
        Enums: { [_ in never]: never };
        CompositeTypes: { [_ in never]: never };
    };
};
