import { API } from '@/shared/api';
import type { OrderCreatePayload, OrderResponse, OrdersListResponse, OrderFilters } from './order.types';

export const createOrder = async (payload: OrderCreatePayload): Promise<OrderResponse> => {
    const response = await API.post<OrderResponse>('/order/create', payload);
    return response.data;
};

export const getOrders = async (params?: OrderFilters): Promise<OrdersListResponse> => {
    const response = await API.get<OrdersListResponse>('/order/all', { params });
    return response.data;
};
