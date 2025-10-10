"use client";

import { useEffect, useState } from "react";
import { serviceService } from "@/services/service.service";
import { Service } from "@/types/Service";

import ServiceCard from "./ServiceCard";
import DefaultServiceImage from "@/assets/image/service/services.png"; // 👈 import ảnh mặc định

export default function ServiceList() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await serviceService.getAll();
        setServices(data);
      } catch (err) {
        console.error("Lỗi khi tải dịch vụ:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return <p>Đang tải dịch vụ...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Các dịch vụ sửa chữa</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {services.map((s) => (
          <ServiceCard
            key={s._id}
            service={{
              id: s._id,
              title: s.name,
              oldPrice: Math.round(s.price / 0.8), // Giả sử giá cũ cao hơn giá hiện tại 20%
              price: s.price,
              discount: "Giảm 20%",
              rating: 4.5,
              slug: s.slug,
              img: (Array.isArray(s.images) && s.images.length > 0 ? s.images[0].url : DefaultServiceImage), // 👈 nếu s.images có ít nhất 1 ảnh thì lấy url ảnh đầu tiên, nếu không thì dùng ảnh mặc định
            }}
          />
        ))}
      </div>
    </div>
  );
}
