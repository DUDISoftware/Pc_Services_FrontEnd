"use client";

import Image from "next/image";
import { ChevronRightCircle, Star } from "lucide-react";
import Link from "next/link";
import { serviceService } from "@/services/service.service";
import { useState, useEffect } from "react";
import { Service } from "@/types/Service";
import DefaultServiceImage from "@/assets/image/service/services.png"; // 👈 import ảnh mặc định

type SaleServices = Service & {
  rating: number;
  discount: string;
};


export default function FeaturedServices() {
  const [services, setServices] = useState<SaleServices[]>([]);
  const [featured, setFeatured] = useState<{ id: string; views: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        const res = await serviceService.getFeatured(5);
        setFeatured(res.services || []);
      } catch (error) {
        console.error("Failed to fetch featured services:", error);
      }
    };
    fetchFeaturedServices();
  }, []);

  useEffect(() => {
    if (featured.length === 0) return;

    const fetchServices = async () => {
      try {
        const allServices = await serviceService.getAll(4, 1);

        const discountOptions = ["20%", "25%", "30%", "15%"];
        const mapped = allServices
          .map((s, idx) => ({
            ...s,
            oldPrice: s.price * 1.2 || 0,
            price: s.price || 0,
            rating: 4 + Math.random(),
            images: s.images?.length
              ? s.images
              : [{ url: DefaultServiceImage.src, public_id: "default" }],
            slug: s.slug || "",
            discount: discountOptions[idx % discountOptions.length],
          }))
          .sort((a, b) => {
            const aFeatured = featured.find((f) => f.id === a._id);
            const bFeatured = featured.find((f) => f.id === b._id);

            if (aFeatured && bFeatured) return bFeatured.views - aFeatured.views;
            if (aFeatured) return -1;
            if (bFeatured) return 1;
            return 0;
          });

        setServices(mapped.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [featured]);

  if (loading) return <p className="text-center py-6">Đang tải...</p>;

  return (
  <div className="max-w-6xl mx-auto px-4 py-8">
    {/* Header */}
    <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
      <h2 className="text-lg font-semibold">Dịch vụ nổi bật</h2>
      <Link
        href="/user/service"
        className="text-sm text-blue-500 hover:underline flex items-center"
      >
        Xem tất cả <ChevronRightCircle className="w-4 h-4 ml-1" />
      </Link>
    </div>

    {/* Grid layout (same as products) */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {services.map((item) => (
        <div
          key={item._id}
          className="flex flex-col border border-gray-200 rounded-lg p-3 hover:shadow-md transition h-full relative"
        >
          <Link href={`/user/service/detail/${item.slug}`}>
            {/* Optional discount or tag */}
            {item.discount && (
              <span className="absolute top-2 left-2 bg-[#FB5F2F] text-white text-xs px-2 py-1 rounded z-10">
                {item.discount}
              </span>
            )}

            {/* Image */}
            <div className="relative w-full h-36 sm:h-40 mb-3">
              <Image
                src={item.images?.[0]?.url || "/images/placeholder.png"}
                alt={item.description || item.name || "Dịch vụ"}
                fill
                className="object-cover rounded"
              />
            </div>

            {/* Name */}
            <h3 className="text-xs sm:text-sm font-medium line-clamp-2 flex-1 mb-2 text-center md:text-left">
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
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                {item.rating?.toFixed(1) || "5.0"}
              </div>
            </div>
          </Link>
        </div>
      ))}

      {/* Empty state */}
      {services.length === 0 && (
        <p className="text-gray-500 text-sm col-span-full">
          Không có dịch vụ nổi bật nào.
        </p>
      )}
    </div>
  </div>
);
}
