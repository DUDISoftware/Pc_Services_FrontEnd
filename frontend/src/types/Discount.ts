export interface Discount {
  _id: string;
  sale_off: number;
  type: string;
  product_id: {
    _id: string;
    name: string;
    slug: string;
  };
  start_date: string;
  end_date: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface DiscountService {
  _id: string;
  sale_off: number;
  type: string;
  service_id: {
    _id: string;
    name: string;
    slug: string;
  };
  start_date: string;
  end_date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DiscountResponse {
  status: string;
  message: string;
  discount: {
    message: string;
    SaleOf: Discount;
  } | null;
}

export interface DiscountServiceResponse {
  status: string;
  message: string;
  discount: {
    message: string;
    SaleOf: DiscountService;
  } | null;
}
