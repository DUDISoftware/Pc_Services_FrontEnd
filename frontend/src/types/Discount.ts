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
export interface DiscountCategoryService {
  _id: string;
  sale_off: number;
  type: string;
  category_service_id: {
    _id: string;
    name: string;
    slug: string;
  };
  start_date: string;
  end_date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DiscountCategoryProduct {
  _id: string;
  sale_off: number;
  type: string;
  category_product_id: {
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
export interface DiscountCategoryServiceResponse {
  status: string;
  message: string;
  discount: {
    message: string;
    SaleOf: DiscountCategoryService;
  } | null;
}
export interface DiscountCategoryProductResponse {
  status: string;
  message: string;
  discount: {
    message: string;
    SaleOf: DiscountCategoryProduct;
  } | null;
}
