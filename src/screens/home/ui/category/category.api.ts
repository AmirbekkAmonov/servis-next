import { getHome } from '@/shared/api/services/home';

export const getHomeCategories = async () => {
  try {
    const data = await getHome();
    return data || [];
  } catch (error) {
    console.error('getHomeCategories Error:', error);
    return [];
  }
};
