import { API } from '@/shared/api';
import type { BannerListResponse } from './banner.types';

export const fetchBanners = async (): Promise<BannerListResponse> => {
  const res = await API.get<BannerListResponse>('/banner/view');
  return res.data;
};
