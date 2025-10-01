"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link"; // 👈 import Link
import { ChevronRightCircle, Star } from "lucide-react";
import { serviceService } from "@/services/service.service";
import DefaultServiceImage from "@/assets/image/service/services.png";
import { Service } from "@/types/Service";

export default function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await serviceService.getFeatured();
        setServices(data);
      } catch (err) {
        console.error("Lỗi khi tải dịch vụ nổi bật:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) return <p>Đang tải dịch vụ nổi bật...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
        <h2 className="text-lg font-semibold">Dịch vụ nổi bật</h2>
        <Link
          href="/user/service"
          className="text-sm text-blue-500 hover:underline flex items-center"
        >
          Xem thêm <ChevronRightCircle className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {services.map((item) => (
         <Link href={`/user/service/${item._id}`} key={item._id}>
  <div className="flex flex-col border border-gray-200 rounded-lg p-3 hover:shadow-md transition h-full relative cursor-pointer">
    {/* Badge */}
    <span className="absolute top-2 left-2 bg-[#FB5F2F] text-white text-xs px-2 py-1 rounded z-10">
      Giảm 20%
    </span>

    {/* Image */}
    <div className="relative w-full h-36 sm:h-40 mb-3">
      <Image
        src={DefaultServiceImage}
        alt={item.name}
        fill
        className="object-contain rounded"
      />
    </div>

    {/* Title */}
    <h3 className="text-xs sm:text-sm font-medium line-clamp-2 flex-1 mb-2">
      {item.name}
    </h3>

    {/* Price + Rating */}
    <div className="flex items-center justify-between mt-auto">
      <div className="flex items-center gap-1">
        <span className="text-[11px] text-gray-400 line-through">
          {(item.price * 1.2).toLocaleString()}₫
        </span>
        <span className="text-red-500 font-semibold text-sm">
          {item.price.toLocaleString()}₫
        </span>
      </div>

      <div className="flex items-center text-xs text-gray-500 ml-2 shrink-0">
        <Star className="w-4 h-4 text-yellow-400 mr-1" /> 4.5
      </div>
    </div>
  </div>
</Link>

        ))}
      </div>
    </div>
  );
}
