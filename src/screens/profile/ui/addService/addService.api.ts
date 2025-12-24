import { API } from '@/shared/api';
import {
  getCategories,
  getRegions,
  getDistricts,
} from '@/screens/category/category.api';
import type {
  CategoryItem,
  Region,
  District,
} from '@/screens/category/category.api';

export { getCategories, getRegions, getDistricts };
export type { CategoryItem, Region, District };

export interface Feature {
  id: number;
  name: string;
}

export const getFeatures = async (): Promise<Feature[]> => {
  try {
    const response = await API.get<{ data: Feature[] }>('/feature/view');
    return response.data.data || [];
  } catch {
    return [];
  }
};

export interface UploadImageResponse {
  accept: boolean;
  data: string;
  message: {
    image: {
      id: number;
      type: string;
      large: string;
      medium: string;
      small: string;
      created_at: string;
      updated_at: string;
      service_id: number | null;
      banner_id: number | null;
      product_id: number | null;
    };
  };
}

export const uploadImage = async (file: File): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'service');

  const response = await API.post<UploadImageResponse>(
    '/image/create',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};
