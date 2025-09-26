export type UploadedImage = { url: string; public_id: string };

export interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  slug: string;
  type: "at_home" | "at_store";
  estimated_time: string;
  status: "active" | "inactive" | "hidden";
  created_at?: string;
  updated_at?: string;
  category_id: {
  _id: string;
    name: string;
    description: string;
    status: "active" | "inactive";
  };
  images?: UploadedImage[];
}

export interface ServiceApi {
  _id: string;
  name: string;
  description: string;
  price: number;
  slug: string;
  type: "at_home" | "at_store";
  estimated_time: string;
  status: "active" | "inactive" | "hidden";
  created_at?: string;
  updated_at?: string;
  category_id: {
    _id: string;
    name: string;
    description: string;
    status: "active" | "inactive";
  };
  images?: UploadedImage[];
}