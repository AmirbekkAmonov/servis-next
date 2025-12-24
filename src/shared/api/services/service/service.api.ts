import { API } from '../..';
import type {
  CreateServicePayload,
  CreateServiceResponse,
  IPopularService,
  IPopularServiceResponse,
  ServiceDetailResponse,
} from './service.types';

export const getPopularServices = async (): Promise<IPopularService[]> => {
  const response = await API.get<IPopularServiceResponse>(
    '/service/popular-view'
  );
  return response.data.data || [];
};

export const getPremiumServices = async (): Promise<IPopularService[]> => {
  const response = await API.get<IPopularServiceResponse>(
    '/service/premium-view'
  );
  return response.data.data || [];
};

export const createService = async (
  payload: CreateServicePayload
): Promise<CreateServiceResponse> => {
  const response = await API.post<CreateServiceResponse>(
    '/service/create',
    payload
  );
  return response.data;
};

export const getServiceBySlug = async (
  slug: string
): Promise<ServiceDetailResponse> => {
  const response = await API.get<ServiceDetailResponse>(`/service/${slug}`);
  return response.data;
};

export const deleteService = async (
  serviceId: number
): Promise<{ success: boolean; message: string }> => {
  const response = await API.delete<{ success: boolean; message: string }>(
    `/service/${serviceId}/delete`
  );
  return response.data;
};

export const updateService = async (
  serviceId: number,
  payload: CreateServicePayload
): Promise<CreateServiceResponse> => {
  const response = await API.put<CreateServiceResponse>(
    `/service/${serviceId}/update`,
    payload
  );
  return response.data;
};

export const getSimilarServices = async (
  slug: string,
  size: number = 10
): Promise<IPopularService[]> => {
  const response = await API.get<{ data: IPopularService[] }>(
    `/service/${slug}/similar?size=${size}`
  );
  return response.data.data || [];
};
