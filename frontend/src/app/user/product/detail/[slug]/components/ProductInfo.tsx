"use client";

import { Star } from "lucide-react";
import ProductPolicies from "./ProductPolicies";
import { useRouter } from "next/navigation";

interface Product {
  id: string; // thêm id để điều hướng
  title: string;
  rating: number;
  reviews: number;
  oldPrice: number;
  price: number;
  discount: string;
}

export default function ProductInfo({ product }: { product: Product }) {
  const router = useRouter();

  const handleOrder = () => {
    // điều hướng đến trang đặt hàng theo id sản phẩm
    router.push(`/user/order/${product.id}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">{product.title}</h1>
      <div className="flex items-center gap-2 mb-4 text-sm">
        <Star className="w-5 h-5 text-yellow-400" />
        <span>
          {product.rating.toFixed(2)} ({product.reviews} đánh giá)
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-gray-400 line-through text-lg">
          {product.oldPrice.toLocaleString("vi-VN")}₫
        </span>
        <span className="text-red-500 font-semibold text-2xl">
          {product.price.toLocaleString("vi-VN")}₫
        </span>
        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
          -{product.discount}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleOrder}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
        >
          Đặt hàng
        </button>
        <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition">
          Thêm vào giỏ hàng
        </button>
      </div>

      {/* Policies */}
      <ProductPolicies />
    </div>
  );
}
