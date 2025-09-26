"use client";

import { useEffect, useState } from "react";
import OrderBreadcrumb from "./components/OrderBreadcrumb";
import OrderForm from "./components/OrderForm";
import OrderSummary from "./components/OrderSummary";
import { Cart } from "@/types/Cart";

export default function OrderPage() {
  const [cart, setCart] = useState<Cart>({
    _id: "",
    items: [],
    totalPrice: 0,
    updated_at: "",
  });
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        const parsed: Cart = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.items)) {
          setCart(parsed);
        }
      } catch (err) {
        console.error("Lỗi đọc cart từ localStorage:", err);
      }
    }
    setIsFirstLoad(false);
  }, []);

  useEffect(() => {
    if (isFirstLoad) return;
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <OrderBreadcrumb />
      <div className="flex flex-col lg:flex-row gap-8">
        <OrderForm cart={cart} setCart={setCart} />
        <OrderSummary cart={cart} setCart={setCart} />
      </div>
    </div>
  );
}
