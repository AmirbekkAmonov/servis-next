export interface IFooterResponse {
  success: boolean;
  data: {
    company: ICompany;
    contacts: IContacts;
    socials: ISocials;
    links: ILinks;
    categories: ICategories[];
  };
}

export interface ICompany {
  name: string;
  tagline: string;
  description: string;
}

export interface IContacts {
  phone: string;
  email: string;
  address: string;
}

export interface ISocials {
  telegram: string;
  instagram: string;
  facebook: string | null;
  youtube: string | null;
}

export interface ILinks {
  about: string;
  help_center: string;
  privacy_policy: string;
  terms: string;
  contact: string;
}

export interface ICategories {
  id: number;
  slug: string;
  name: string;
  image: string;
  type: string | null;
  services_count: number | null;
}
