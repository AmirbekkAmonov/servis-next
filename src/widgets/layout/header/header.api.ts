import { getHeaderCategories } from '@/shared/api/services/header';

export const fetchHeaderCategories = async () => {
  try {
    const data = await getHeaderCategories();
    return data || [];
  } catch (error) {
    console.error('getHeaderCategories Error:', error);
    return [];
  }
};
