"use client";

import Image, { StaticImageData } from "next/image";
import { Trash2 } from "lucide-react";

interface OrderSummaryProps {
  product: {
    id: string;
    title: string;
    oldPrice: number;
    price: number;
    img: string | StaticImageData;
  };
}

export default function OrderSummary({ product }: OrderSummaryProps) {
  return (
    <div className="w-full lg:w-1/3 border rounded-md p-4 bg-white">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold">Sản phẩm</h3>
        <Trash2 className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-500" />
      </div>

      {/* Product */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-20 h-20 relative border rounded-md">
          <Image
            src={product.img}
            alt={product.title}
            fill
            className="object-contain"
          />
        </div>
        <div>
          <p className="text-sm font-medium">{product.title}</p>
          <p className="text-gray-400 line-through text-sm">
            {product.oldPrice.toLocaleString("vi-VN")}₫
          </p>
          <p className="text-red-500 font-semibold">
            {product.price.toLocaleString("vi-VN")}₫
          </p>
        </div>
      </div>

      {/* Quantity */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button className="w-8 h-8 border rounded-md">-</button>
        <span>1</span>
        <button className="w-8 h-8 border rounded-md">+</button>
      </div>

      {/* Total */}
      <div className="border-t pt-3 flex justify-between font-medium">
        <span>TỔNG TIỀN</span>
        <span className="text-red-500">{product.price.toLocaleString("vi-VN")}₫</span>
      </div>
    </div>
  );
}
