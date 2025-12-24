import api from '../../api.interface';
import type { IHeaderCategoriesResponse } from './header.types';

export const getHeaderCategories = async () => {
  const response = await api.get<IHeaderCategoriesResponse>('/category/view');
  return response.data.data || [];
};
