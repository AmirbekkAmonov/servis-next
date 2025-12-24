import type { IUser } from '@/shared/api/services/header';

// Fake data types
export interface IStatistics {
  totalServices: number;
  totalViews: number;
  totalReviews: number;
  averageRating: number;
  activeServices: number;
  inactiveServices: number;
}

export interface IService {
  id: number;
  name: string;
  description: string;
  price: number;
  views: number;
  reviews: number;
  rating: number;
  status: 'active' | 'inactive';
  image: string;
  category: string;
  createdAt: string;
}

export interface IReview {
  id: number;
  serviceName: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Fake data generators
export const generateFakeStatistics = (_user: IUser | null): IStatistics => {
  return {
    totalServices: 12,
    totalViews: 3450,
    totalReviews: 28,
    averageRating: 4.6,
    activeServices: 8,
    inactiveServices: 4,
  };
};

export const generateFakeServices = (): IService[] => {
  return [
    {
      id: 1,
      name: 'Uy tozalash xizmati',
      description: 'Professional uy va ofislarni tozalash',
      price: 250000,
      views: 450,
      reviews: 12,
      rating: 4.8,
      status: 'active',
      image: 'https://via.placeholder.com/300x200?text=Service+1',
      category: 'Tozalash',
      createdAt: '2025-01-15',
    },
    {
      id: 2,
      name: 'Elektrik xizmatlari',
      description: "Elektrik o'rnatish va tuzatish",
      price: 150000,
      views: 320,
      reviews: 8,
      rating: 4.5,
      status: 'active',
      image: 'https://via.placeholder.com/300x200?text=Service+2',
      category: 'Elektrik',
      createdAt: '2025-01-10',
    },
    {
      id: 3,
      name: 'Santexnika xizmatlari',
      description: "Santexnika o'rnatish va tuzatish",
      price: 200000,
      views: 280,
      reviews: 5,
      rating: 4.2,
      status: 'active',
      image: 'https://via.placeholder.com/300x200?text=Service+3',
      category: 'Santexnika',
      createdAt: '2025-01-08',
    },
    {
      id: 4,
      name: 'Klima xizmatlari',
      description: "Klima o'rnatish va xizmat ko'rsatish",
      price: 300000,
      views: 190,
      reviews: 3,
      rating: 4.0,
      status: 'inactive',
      image: 'https://via.placeholder.com/300x200?text=Service+4',
      category: 'Klima',
      createdAt: '2025-01-05',
    },
  ];
};

export const generateFakeReviews = (): IReview[] => {
  return [
    {
      id: 1,
      serviceName: 'Uy tozalash xizmati',
      userName: 'Ali Valiyev',
      userAvatar: 'https://via.placeholder.com/40?text=AV',
      rating: 5,
      comment: 'Ajoyib xizmat! Juda sifatli va tez ishlashdi. Tavsiya qilaman.',
      createdAt: '2025-01-20',
    },
    {
      id: 2,
      serviceName: 'Elektrik xizmatlari',
      userName: 'Dilshod Karimov',
      userAvatar: 'https://via.placeholder.com/40?text=DK',
      rating: 4,
      comment:
        'Yaxshi ishladi, lekin biroz kechikdi. Umuman olganda qoniqarli.',
      createdAt: '2025-01-18',
    },
    {
      id: 3,
      serviceName: 'Santexnika xizmatlari',
      userName: 'Olimjon Toshmatov',
      userAvatar: 'https://via.placeholder.com/40?text=OT',
      rating: 5,
      comment: "Professional ish! Juda mamnun bo'ldim. Rahmat!",
      createdAt: '2025-01-15',
    },
    {
      id: 4,
      serviceName: 'Uy tozalash xizmati',
      userName: 'Farida Norboyeva',
      userAvatar: 'https://via.placeholder.com/40?text=FN',
      rating: 4,
      comment: 'Yaxshi xizmat, lekin narx biroz yuqori.',
      createdAt: '2025-01-12',
    },
  ];
};

// Format functions
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const getStatusBadgeColor = (status: 'active' | 'inactive'): string => {
  return status === 'active' ? 'green' : 'gray';
};

export const getStatusBadgeText = (status: 'active' | 'inactive'): string => {
  return status === 'active' ? 'Faol' : 'Nofaol';
};
