export type UploadedImage = { url: string; public_id: string };

export interface Request {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    problem_description?: string;
    items?: { name: string; product_id: string; quantity: number; price: number }[];
    note?: string;
    repair_type?: "at_home" | "at_store";
    estimated_time: string;
    status: "new" | "in_progress" | "completed" | "cancelled";
    service_id?: string;
    images?: UploadedImage[];
    created_at: string;
    updated_at: string;
}

export interface RepairRequestPayload {
  service_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  problem_description: string;
  estimated_time: string;
  repair_type: "at_home" | "at_store";
  status: "new" | "in_progress" | "completed" | "cancelled";
  images?: UploadedImage[];
}

export interface RequestApi {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    problem_description?: string;
    items?: { name: string; product_id: string; quantity: number; price: number }[];
    note?: string;
    repair_type?: "at_home" | "at_store";
    estimated_time: string;
    status: "new" | "in_progress" | "completed" | "cancelled";
    service_id?: string;
    images?: UploadedImage[];
    createdAt: string;
    updatedAt: string;
}