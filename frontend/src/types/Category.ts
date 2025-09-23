export interface CategoryApi {
  _id: string;
  name: string;
  slug: string;
  tags?: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
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
