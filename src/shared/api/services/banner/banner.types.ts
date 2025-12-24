export type BannerDto = {
  id: number;
  title: string;
  description: string;
  image: string;
  is_active: boolean;
  position: number;
  starts_at: string;
  ends_at: string;
};

export type BannerListResponse = {
  data: BannerDto[];
  message: {
    uz?: string;
    ru?: string;
    en?: string;
  };
  accept: boolean;
};
