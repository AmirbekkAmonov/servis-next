import api from '../../api.interface';
import type { IAuthVerifyRequest, IAuthVerifyResponse } from './auth.types';

export const verifyTelegramCode = async (code: string) => {
  const response = await api.post<IAuthVerifyResponse>(
    '/auth/telegram/verify',
    { code } as IAuthVerifyRequest
  );
  return response.data;
};
