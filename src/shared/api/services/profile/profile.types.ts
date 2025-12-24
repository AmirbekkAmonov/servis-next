export type ProfileMeResponse = {
  data: {
    user: ProfileUser;
    stats: ProfileStats;
  };
  message: string;
  accept: boolean;
};

export type ProfileUser = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  role: string;
  is_premium: boolean;
  is_verified: boolean;
  created_at: string;
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
};

export type ProfileStats = {
  total_views: number;
  services_count: number;
  rating: number;
  reviews_count: number;
  contact_stats: {
    phone: number;
    telegram: number;
    instagram: number;
    website: number;
    facebook: number;
    youtube: number;
    tiktok: number;
  };
};

// User Services Types
export type ProfileServicesResponse = {
  accept: boolean;
  message: string;
  data: UserService[];
};

export type UserService = {
  id: number;
  slug: string;
  name: string;
  is_premium: boolean;
  view_count: number;
  comment_count: number | null;
  price_from: number;
  price_to: number;
  discount_percent: number;
  discount_price: number;
  working_hours: string | null;
  rating: number;
  description: string;
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
  created_at: string;
  discount_start_date: string | null;
  discount_end_date: string | null;
  category: {
    id: number;
    slug: string;
    name: string;
    image: string;
    type: string;
    services_count: number | null;
  };
  sub_category: {
    id: number;
    slug: string;
    name: string;
  } | null;
  images: Array<{
    id: number;
    small: string;
    medium: string;
    large: string;
    type: string;
  }>;
  district: {
    id: number;
    name: string;
    slug: string;
  };
  city: {
    id: number;
    name: string;
    slug: string;
  };
  features: Array<{
    id: number;
    name: string;
    icon: string;
    type: string;
    is_active: number;
  }>;
};
