import type { IFooterResponse } from './footer.types';

import { API } from '@/shared/api';

export const getFooter = async () => {
  const response = await API.get<IFooterResponse>('/footer/view');
  return response.data.data;
};
