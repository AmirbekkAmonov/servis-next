export interface IAuthVerifyResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      phone: string;
      role: string;
      is_premium: boolean;
    };
    token: string;
  };
}

export interface IAuthVerifyRequest {
  code: string;
}
