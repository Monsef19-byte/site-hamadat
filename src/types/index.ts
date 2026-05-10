export type Language = 'fr' | 'ar';

export interface Residence {
  id: string;
  name_fr: string;
  name_ar: string;
  location: string;
  status: 'Projet en cours' | 'Livré' | 'Vendu';
  total_units: number;
  typology: string;
  description_fr: string;
  description_ar: string;
  featured_on_home: boolean;
  featured_image_id?: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface ResidenceImage {
  id: string;
  residence_id: string;
  image_url: string;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export interface ResidenceTour {
  id: string;
  residence_id: string;
  tour_url: string;
  featured_on_pages: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

// Blog Article Types
export interface BlogArticle {
  id: string;
  title: string;
  titleAr: string;
  slug: string;
  excerpt: string;
  excerptAr: string;
  content: string;
  contentAr: string;
  image: string;
  category: string;
  author: string;
  published_at: string;
  updated_at?: string;
  featured: boolean;
  tags: string[];
}

export interface BlogCategory {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description?: string;
}
