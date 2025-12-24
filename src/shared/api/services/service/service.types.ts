export type IPopularServiceResponse = {
  success: boolean;
  message: string;
  data: IPopularService[];
};

export type IPopularService = {
  id: number;
  slug: string;
  name: string;
  description: string;
  is_premium: boolean;
  view_count: number;
  comment_count: number;
  price_from: number;
  price_to: number;
  discount_percent?: number | null;
  discount_price?: number | null;
  rating: number;
  created_at: string;
  category: {
    id: number;
    slug: string;
    name: string;
    image: string;
    type: string;
    services_count?: number | null;
  };
  images: Array<{
    id: number;
    large?: string | null;
    medium?: string | null;
    small?: string | null;
  }>;
  city: {
    id: number;
    name: string;
    slug: string;
  };
  district: {
    id: number;
    name: string;
    slug: string;
  };
};

export interface CreateServicePayload {
  category_id: number;
  sub_category_id?: number;
  sub_category_ids?: number[];
  district_id: number;
  city_id: number;
  name: string;
  type?: string;
  description: string;
  phone: string;
  email?: string;
  website?: string;
  working_hours?: string;
  address: string;
  socials?: {
    instagram?: string;
    telegram?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
  };
  price_from: number;
  price_to: number;
  capacity?: number;
  latitude?: number;
  longitude?: number;
  image_ids?: number[];
  feature_ids?: number[];
  new_features?: string[];
}

export interface CreateServiceResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface ServiceDetail {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  price_from: number;
  price_to: number;
  discount_percent: number;
  working_hours: string | null;
  rating: number;
  duration: string | null;
  type: string;
  is_active: boolean;
  is_premium: number;
  phone: string;
  email: string | null;
  website: string | null;
  address: string;
  socials: {
    instagram?: string;
    telegram?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
  } | null;
  view_count: number;
  created_at: string;
  updated_at: string;
  images: Array<{
    id: number;
    large?: string | null;
    medium?: string | null;
    small?: string | null;
  }>;
  city: {
    id: number;
    name: string;
    slug: string;
  };
  district: {
    id: number;
    name: string;
    slug: string;
  };
  category: {
    id: number;
    slug: string;
    name: string;
    image: string;
    type: string;
    services_count: number | null;
  };
  features: Array<{
    id: number;
    name: string;
  }>;
  user: {
    id: number;
    name: string;
    phone: string;
    created_at: string;
  };
  included_services: any[];
  not_included_services: any[];
  comments: any[];
  faq: any[];
}

export interface ServiceDetailResponse {
  data: ServiceDetail;
  message: string;
  accept: boolean;
}

export interface SimilarServicesResponse {
  data: IPopularService[];
}
