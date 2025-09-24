import { Cart } from "@/types/Cart";
import { Product } from "@/types/Product";
import { get } from "http";
import { productService } from "./product.service";

export const cartService = {
    getCart: async (): Promise<Cart> => {
        const res = localStorage.getItem("cart");
        if (res) {
            return JSON.parse(res);
        }
        return { _id: "", items: [], totalPrice: 0, updated_at: "" };
    },
    saveCart: async (cart: Cart): Promise<void> => {
        localStorage.setItem("cart", JSON.stringify(cart));
    },
    addToCart: async (productId: string, quantity: number): Promise<Cart> => {
        const cart = await cartService.getCart();
        const existingProduct = cart.items.find(p => p.product_id === productId);
        const product = await productService.getById(productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.items.push({ product_id: productId, name: product.name, quantity, price: product.price });
        }
        cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
        cart.updated_at = new Date().toISOString();
        await cartService.saveCart(cart);
        return cart;
    },
    removeFromCart: async (productId: string): Promise<Cart> => {
        const cart = await cartService.getCart();
        cart.items = cart.items.filter(p => p.product_id !== productId);
        cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
        cart.updated_at = new Date().toISOString();
        await cartService.saveCart(cart);
        return cart;
    },
}