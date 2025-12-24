export interface IHeaderCategoriesResponse {
  success: boolean;
  data: ICategory[];
}

export interface ICategory {
  id: number;
  name: string;
  slug: string;
  image: string;
  type: string;
  services_count: number;
  products_count?: number;
}

export interface IUser {
  id: number;
  name: string;
  phone: string;
  role: string;
  is_premium: boolean | number;
  premium_days_left?: number;
  access_token?: string;
  refresh_token?: string;
}
