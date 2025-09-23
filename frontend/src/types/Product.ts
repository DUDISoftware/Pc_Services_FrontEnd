export type UploadedImage = { url: string; public_id: string };

export type Product = {
  _id: string;
  name: string;
  tags: string[];
  slug: string;
  description: string;
  rating: number;
  price: number;
  quantity: number;
  status: "available" | "out_of_stock" | "hidden";
  brand?: string;
  panel?: string;
  size?: string;
  resolution?: string;
  model?: string;
  ports?: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  } | string;
  images: UploadedImage[]; // FE luôn hiển thị mảng ảnh đã upload
  createdAt: string;
  updatedAt: string;
};

export interface ProductApi {
  _id: string;
  name: string;
  tags?: string[];
  slug: string;
  description?: string;
  rating?: number;
  price: number;
  quantity: number;
  brand: string;
  panel?: string;
  size?: string;
  resolution?: string;
  model?: string;
  ports?: string;
  status: string;
  category_id: { _id: string; name: string; slug: string } | string;

  // BE có thể trả UploadedImage[], FE có thể gửi File[]
  images: (File | UploadedImage)[]; // ✅ cho phép mixed
  created_at: string;
  updated_at: string;
}
