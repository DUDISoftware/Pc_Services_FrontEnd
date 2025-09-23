export interface Cart {
    _id: string;
    items: { name: string; product_id: string; quantity: number; price: number }[];
    totalPrice: number;
    updated_at: string;
}