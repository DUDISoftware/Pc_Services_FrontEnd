"use client";

import Image from "next/image";
import { ChevronRightCircle, Star } from "lucide-react";
import Product1 from "@/assets/image/product/product1.jpg";
import Product2 from "@/assets/image/product/product2.jpg";
import Product3 from "@/assets/image/product/product3.png";
import Product4 from "@/assets/image/product/product4.png";

const products = [
  {
    title: "Nguồn máy tính ASUS PRIME 650B (650W, 80 Plus Bronze)",
    oldPrice: 4399999,
    price: 3000000,
    discount: "20%",
    rating: 4.6,
    img: Product1,
  },
  {
    title: "Mainboard Asus B760M-AYW WIFI DDR4",
    oldPrice: 12440290,
    price: 9999999,
    discount: "30% Today Only!",
    rating: 4.5,
    img: Product2,
  },
  {
    title: "Vỏ CASE ASUS TUF GAMING GT302 ARGB BLACK",
    oldPrice: 3999999,
    price: 3119999,
    discount: "10%",
    rating: 4.33,
    img: Product3,
  },
  {
    title: "Vỏ CASE ASUS TUF GAMING GT302 ARGB BLACK",
    oldPrice: 3999999,
    price: 3119999,
    discount: "10%",
    rating: 4.33,
    img: Product4,
  },
];

export default function DiscountProducts() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
        <h2 className="text-lg font-semibold">Sản phẩm giảm giá</h2>
        <a
          href="#"
          className="text-sm text-blue-500 hover:underline flex items-center"
        >
          Xem thêm <ChevronRightCircle className="w-4 h-4 ml-1" />
        </a>
      </div>

      {/* Grid Products */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col border border-gray-200 rounded-lg p-3 hover:shadow-md transition h-full relative"
          >
            {/* Badge */}
            <span className="absolute top-2 left-2 bg-[#FB5F2F] text-white text-xs px-2 py-1 rounded z-10">
              {item.discount}
            </span>

            {/* Image */}
            <div className="relative w-full h-36 sm:h-40 mb-3">
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="object-contain rounded"
              />
            </div>

            {/* Title */}
            <h3 className="text-xs sm:text-sm font-medium line-clamp-2 flex-1 mb-2">
              {item.title}
            </h3>

            {/* Price + Rating */}
            <div className="flex items-center justify-between mt-auto">
              {/* Giá */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-gray-400 line-through">
                  {item.oldPrice.toLocaleString()}₫
                </span>
                <span className="text-red-500 font-semibold text-sm">
                  {item.price.toLocaleString()}₫
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center text-xs text-gray-500 ml-2 shrink-0">
                <Star className="w-4 h-4 text-yellow-400 mr-1" /> {item.rating}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
