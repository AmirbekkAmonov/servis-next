import { API } from '@/shared/api';
import type { ISubCategory } from '@/shared/api/services/home/home.types';

export type CategoryItem = {
  id: number;
  name: string;
  slug: string;
  image: string;
  type: string;
  services_count: number;
  sub_categories?: ISubCategory[];
};

export type Region = {
  id: number;
  name: string;
  slug: string;
};

export type District = {
  id: number;
  name: string;
  slug: string;
};

export type ServiceItem = {
  id: number;
  slug: string;
  name: string;
  is_premium: boolean;
  view_count: number;
  comment_count: number;
  price_from: number;
  price_to: number;
  rating: number;
  images?: Array<{
    id: number;
    small?: string | null;
    medium?: string | null;
    large?: string | null;
    type?: string;
  }>;
  category: {
    id: number;
    slug: string;
    name: string;
    image: string;
    type: string;
  };
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

export type ServicesResponse = {
  data: ServiceItem[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
};

// Fetch all categories
export const getCategories = async (): Promise<CategoryItem[]> => {
  try {
    const response = await API.get<any>('/category/view');
    const raw = response.data;
    const data: CategoryItem[] = raw?.data?.data ?? raw?.data ?? raw?.results ?? [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

// Fetch all regions/cities
export const getRegions = async (): Promise<Region[]> => {
  try {
    const response = await API.get<any>('/address/cities');
    const raw = response.data;
    const data: Region[] = raw?.data?.data ?? raw?.data ?? raw?.results ?? [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

// Fetch districts by region
export type CityWithDistricts = {
  id: number;
  name: string;
  slug: string;
  districts: District[];
};

export const getDistricts = async (regionSlug: string): Promise<District[]> => {
  try {
    const response = await API.get<any>(`/address/cities/${regionSlug}`);
    const raw = response.data;
    const city: CityWithDistricts | undefined =
      raw?.data?.data ?? raw?.data ?? raw?.result ?? raw?.results;
    const districts = city?.districts ?? [];
    return Array.isArray(districts) ? districts : [];
  } catch {
    return [];
  }
};

// Fetch services with filters
export const getServices = async (
  params: Record<string, string>
): Promise<ServicesResponse> => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await API.get<any>(
      `/service/view${queryString ? `?${queryString}` : ''}`
    );
    const raw = response.data;

    // Supports multiple possible backend shapes:
    // 1) { data: ServiceItem[], meta?: {...} }
    // 2) { data: { data: ServiceItem[], meta?: {...} } }
    // 3) { results: ServiceItem[], meta?: {...} }
    const data: ServiceItem[] =
      raw?.data?.data ?? raw?.data ?? raw?.results ?? [];
    const meta = raw?.data?.meta ?? raw?.meta ?? undefined;

    return { data, meta };
  } catch {
    return { data: [] };
  }
};

// Get single category by slug
export const getCategoryBySlug = async (
  slug: string
): Promise<CategoryItem | null> => {
  try {
    const categories = await getCategories();
    return categories.find(c => c.slug === slug) || null;
  } catch {
    return null;
  }
};
