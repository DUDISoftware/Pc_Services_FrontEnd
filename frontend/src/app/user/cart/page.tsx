"use client";

import { useEffect, useState } from "react";
import { cartService } from "@/services/cart.service";
import { Cart } from "@/types/Cart";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await cartService.getCart();
        setCart(data);
      } catch (err) {
        console.error("Lỗi khi tải giỏ hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  if (loading) return <p className="text-center py-10">Đang tải giỏ hàng...</p>;

  if (!cart || cart.items.length === 0)
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <h2 className="text-xl font-semibold mb-4">Giỏ hàng của bạn đang trống</h2>
        <Link
          href="/user/product"
          className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:opacity-90"
        >
          Mua sắm ngay
        </Link>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Giỏ hàng của bạn</h1>

      <div className="space-y-4">
        {cart.items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border rounded shadow-sm bg-white"
          >
            <div className="flex items-center gap-4">
              <Image
                src={`/images/products/${item.product_id}.jpg`}
                alt={`Product ${item.product_id}`}
                width={60}
                height={60}
                className="rounded"
              />
              <div>
                <p className="font-medium">Tên sản phẩm: {item.name}</p>
                <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {item.price.toLocaleString("vi-VN")}₫
              </p>
              <p className="text-sm text-gray-500">
                Tổng: {(item.price * item.quantity).toLocaleString("vi-VN")}₫
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-right">
        <p className="text-lg font-semibold">
          Tổng cộng: {cart.totalPrice.toLocaleString("vi-VN")}₫
        </p>
        <Link
          href="/user/checkout"
          className="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded hover:opacity-90"
        >
          Thanh toán
        </Link>
      </div>
    </div>
  );
}
