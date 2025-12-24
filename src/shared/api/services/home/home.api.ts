import { API } from '../..';
import type { IHomeCategory } from './home.types';

type HomeApiResponse = {
  data: IHomeCategory[];
  message: {
    uz: string;
    ru: string;
    en: string;
  };
  accept: boolean;
};

export const getHome = async (): Promise<IHomeCategory[]> => {
  const response = await API.get<HomeApiResponse>('/category/view');
  return response.data.data || [];
};
