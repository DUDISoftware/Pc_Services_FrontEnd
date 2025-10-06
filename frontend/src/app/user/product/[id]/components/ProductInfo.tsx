"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductPolicies from "./ProductPolicies";
import { cartService } from "@/services/cart.service";

interface Product {
  id: string;
  title: string;
  rating: number;
  reviews: number;
  oldPrice: number;
  price: number;
  discount: string;
  quantity: number; // ✅ bổ sung tồn kho
}

export default function ProductInfo({ product }: { product: Product }) {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    try {
      await cartService.addToCart(product.id, quantity);
      window.dispatchEvent(new Event("cart_updated"));
      setShowPopup(false); // đóng popup
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      alert("Thêm vào giỏ hàng thất bại. Vui lòng thử lại.");
    }
  };

  const handleOrder = async () => {
    await handleAddToCart();
    router.push(`/user/order/${product.id}`);
  };

  useEffect(() => {
    const checkCart = async () => {
      try {
        await cartService.getCart();
      } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
      }
    };
    checkCart();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">{product.title}</h1>

      <div className="flex items-center gap-2 mb-4 text-sm">
        <Star className="w-5 h-5 text-yellow-400" />
        <span>
          {product.rating.toFixed(2)} ({product.reviews} đánh giá)
        </span>
      </div>

      {/* Giá */}
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

      {/* Nút hành động */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleOrder}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
        >
          Đặt hàng
        </button>
        <button
          className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition"
          onClick={() => setShowPopup(true)}
        >
          Thêm vào giỏ hàng
        </button>
      </div>

      {/* UI chọn số lượng */}
      <div className="mt-8 max-w-xs">
        <h3 className="text-sm font-medium mb-2">Chọn số lượng</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className={`px-3 py-1 text-lg font-bold rounded border 
              ${quantity <= 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-black hover:bg-gray-300"}`}
          >
            −
          </button>

          <input
            type="number"
            value={quantity}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (!isNaN(val)) {
                setQuantity(Math.max(1, Math.min(product.quantity, val)));
              }
            }}
            className="w-16 text-center border rounded py-1"
            min={1}
            max={product.quantity}
          />

          <button
            onClick={() => setQuantity((q) => Math.min(product.quantity, q + 1))}
            disabled={quantity >= product.quantity}
            className={`px-3 py-1 text-lg font-bold rounded border 
              ${quantity >= product.quantity
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-black hover:bg-gray-300"}`}
          >
            +
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-1">
          Tồn kho: {product.quantity}
        </p>
      </div>

      {/* Chính sách */}
      <ProductPolicies />

      {/* Popup modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
            <h2 className="text-lg font-semibold mb-4">Chọn số lượng</h2>
            <input
              type="number"
              min={1}
              max={product.quantity}
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.max(1, Math.min(product.quantity, Number(e.target.value)))
                )
              }
              className="w-full border rounded px-3 py-2 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleAddToCart}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:opacity-90"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
