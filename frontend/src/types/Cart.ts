export interface Cart {
    _id: string;
    items:  CartItem[];
    totalPrice: number;
    updated_at: string;
}

export interface CartItem {
  name: string;
  product_id: string;
  quantity: number;
  price: number;
  image?: string;
}