export interface CategoryApi {
  _id: string;
  name: string;
  slug: string;
  tags?: string[];
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  tags: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
}
