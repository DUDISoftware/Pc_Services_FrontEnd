export interface Discount {
  _id: string;
  SaleOf: number;
  product_id: {
    _id: string;
    name: string;
    slug: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface DiscountApi {
  _id: string;
  SaleOf: number;
  product_id: {
    _id: string;
    name: string;
    slug: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface DiscountResponse {
  message: string;
  discount: DiscountApi | null;
}