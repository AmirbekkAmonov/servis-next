import { API } from '../..';
import type { ProfileMeResponse, ProfileServicesResponse } from './profile.types';

export const getProfileMe = async (): Promise<ProfileMeResponse> => {
  const response = await API.get<ProfileMeResponse>('/profile/me');
  return response.data;
};

export const getProfileServices = async (): Promise<ProfileServicesResponse> => {
  const response = await API.get<ProfileServicesResponse>('/profile/services');
  return response.data;
};
