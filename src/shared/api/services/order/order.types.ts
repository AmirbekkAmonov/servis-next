export interface OrderCreatePayload {
    title: string;
    description: string;
    category_id: number;
    city_id: number;
    district_id: number;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    expected_price: number;
    sub_category_ids?: number[];
    comment: string;
    contact_name: string;
    contact_phone: string;
    contact_telegram?: string;
}

export interface OrderResponse {
    data: IOrderItem;
    message: string;
    accept: boolean;
}

export interface IOrderItem {
    id: number;
    title: string;
    description: string;
    category: {
        id: number;
        name: string;
        slug: string;
        type: string;
        image?: string | null;
    } | null;
    city: {
        id: number;
        name: string;
        slug: string;
    } | null;
    district: {
        id: number;
        name: string;
        slug: string;
    } | null;
    date: string;
    time: string;
    expected_price: string;
    comment: string;
    status: 'new' | 'in_progress' | 'taken' | 'closed' | 'cancelled';
    contacts: any;
    created_at: string;
}

export interface OrdersListResponse {
    accept: boolean;
    message: string;
    data: IOrderItem[];
    meta: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
}

export interface OrderFilters {
    search?: string;
    status?: string;
    category_id?: number;
    city_id?: number;
    district_id?: number;
    size?: number;
    page?: number;
}
