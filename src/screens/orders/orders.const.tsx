import type { IOrderItem } from '@/shared/api/services/order/order.types';

// Status helpers
export const getStatusColor = (status: IOrderItem['status']): string => {
  const statusColors = {
    new: 'blue',
    in_progress: 'orange',
    taken: 'yellow',
    closed: 'green',
    cancelled: 'red',
  };
  return statusColors[status] || 'gray';
};

export const getStatusText = (status: IOrderItem['status']): string => {
  const statusTexts = {
    new: 'Yangi',
    in_progress: 'Jarayonda',
    taken: 'Qabul qilingan',
    closed: 'Yakunlangan',
    cancelled: 'Bekor qilingan',
  };
  return statusTexts[status] || status;
};

export const getStatusIcon = (status: IOrderItem['status']) => {
  const icons = {
    new: '✨',
    in_progress: '🔄',
    taken: '🤝',
    closed: '✅',
    cancelled: '❌',
  };
  return icons[status] || '•';
};

// Format functions
export const formatPrice = (price: number | string): string => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
  }).format(numericPrice);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// Filter options
export type OrderStatusFilter = 'all' | IOrderItem['status'];
export type OrderSortOption = 'newest' | 'oldest' | 'price_high' | 'price_low';
