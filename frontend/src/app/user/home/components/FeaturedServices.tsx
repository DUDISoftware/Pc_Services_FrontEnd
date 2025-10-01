"use client";

import Image from "next/image";
import { ChevronRightCircle } from "lucide-react";
import Link from "next/link";
import { serviceService } from "@/services/service.service";
import { useState, useEffect } from "react";


export default function FeaturedFixServices() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [featured, setFeatured] = useState<{ id: string; views: number }[]>([]);
  const [loading, setLoading] = useState(true);

  // lấy danh sách featured ids + views
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

  // fetch tất cả service, lọc & sort theo featured
  useEffect(() => {
    if (featured.length === 0) return;

    const fetchServices = async () => {
      try {
        const { services } = await serviceService.getAll();

        const mapped: ServiceType[] = services
          .map((s: any) => ({
            _id: s._id,
            title: s.name,
            price: s.price || 0,
            rating: 4 + Math.random(),
            img: s.images?.[0]?.url || "/images/placeholder.png",
          }))
          .filter((s) => featured.some((f) => f.id === s._id)) // lọc chỉ featured
          .sort((a, b) => {
            const aViews = featured.find((f) => f.id === a._id)?.views || 0;
            const bViews = featured.find((f) => f.id === b._id)?.views || 0;
            return bViews - aViews; // sort giảm dần theo views
          });

        setServices(mapped);
      } catch (err) {
        console.error("Failed to fetch featured services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [featured]);

  if (loading) return <p className="text-center py-6">Đang tải...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Dịch vụ nổi bật</h2>
        <Link
          href="/user/service"
          className="text-sm text-blue-500 hover:underline flex items-center"
        >
          Xem tất cả <ChevronRightCircle className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {services.map((item) => (
          <div
            key={item._id}
            className="flex flex-col items-center rounded-lg border border-gray-200 p-3 hover:shadow transition"
          >
            <Link href={`/user/service/${item._id}`}>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-2">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-xs sm:text-sm text-center">{item.title}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
