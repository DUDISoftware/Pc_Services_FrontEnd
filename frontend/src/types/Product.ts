export type UploadedImage = {
  url: string;
  public_id: string;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  tags: string[];
  description: string;
  rating?: number;
  price: number;
  quantity: number;
  status: "available" | "out_of_stock" | "hidden";
  brand: string;
  panel?: string;
  size?: string;
  resolution?: string;
  model?: string;
  ports: string[];
  category_id: {
    _id: string;
    name: string;
    slug: string;
  } | string;
  images: UploadedImage[];
  createdAt: string;
  updatedAt: string;
};

// Kiểu dữ liệu raw từ API (BE có thể snake_case)
export interface ProductApi {
  _id: string;
  name: string;
  slug: string;
  tags?: string[];
  rating?: number;
  description?: string;
  price: number;
  quantity: number;
  status: "available" | "out_of_stock" | "hidden";
  brand: string;
  panel?: string;
  size?: string;
  resolution?: string;
  model?: string;
  ports?: string[];
  category_id: { _id: string; name: string; slug: string } | string;
  images: (File | UploadedImage)[];
  createdAt: string; // nếu BE trả camelCase
  updatedAt: string;
  // created_at: string; // nếu BE trả snake_case thì dùng dòng này thay cho createdAt
  // updated_at: string;
}
