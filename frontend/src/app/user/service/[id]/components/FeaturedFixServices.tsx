"use client";

import Image from "next/image";
import { ChevronRightCircle, Star } from "lucide-react";
import Services from "@/assets/image/service/services.png";

const services = [
  {
    id: "1",
    title: "Dịch Vụ Vệ Sinh Máy Tính Bàn (PC, Desktop) Chuyên Nghiệp",
    oldPrice: 23000000,
    price: 20999999,
    discount: "10%",
    rating: 4.8,
    img: Services,
  },
  {
    id: "2",
    title: "Dịch Vụ Nâng Cấp Laptop RAM SSD Chuyên Nghiệp",
    oldPrice: 18000000,
    price: 12999999,
    discount: "30%",
    rating: 4.6,
    img: Services,
  },
  {
    id: "3",
    title: "Dịch Vụ Vệ Sinh Laptop và Thay Keo Tản Nhiệt Chuyên Nghiệp",
    oldPrice: 20000000,
    price: 15999999,
    discount: "15%",
    rating: 4.7,
    img: Services,
  },
  {
    id: "4",
    title: "Dịch Vụ Kiểm Tra Sửa Chữa Máy Tính Tận Nơi",
    oldPrice: 25000000,
    price: 21999999,
    discount: "20%",
    rating: 4.3,
    img: Services,
  },
];

export default function FeaturedServices() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
        <h2 className="text-lg font-semibold">Dịch vụ nổi bật</h2>
        <a
          href="#"
          className="text-sm text-blue-500 hover:underline flex items-center"
        >
          Xem thêm <ChevronRightCircle className="w-4 h-4 ml-1" />
        </a>
      </div>

      {/* Grid Products */}
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {services.map((item, idx) => (
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
