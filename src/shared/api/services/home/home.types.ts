export interface IHome {
  success: boolean;
  data: IHomeCategory[];
}

export interface ISubCategory {
  id: number;
  name: string;
  slug: string;
}

export interface IHomeCategory {
  id: number;
  name: string;
  slug: string;
  image: string;
  type: string;
  services_count: number;
  products_count?: number;
  sub_categories?: ISubCategory[];
}
