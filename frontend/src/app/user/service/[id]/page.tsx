"use client";

import { useState } from "react";
import Image from "next/image";
import Services from "@/assets/image/service/services.png";
import FeaturedFixServices from "./components/FeaturedFixServices";
import ServiceRequestModal from "./components/ServiceRequestModal";

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [open, setOpen] = useState(false);

  const service = {
    id,
    title: "Dịch Vụ Vệ Sinh Máy Tính Bàn (PC, Desktop) Chuyên Nghiệp",
    price: 20999999,
    oldPrice: 23000000,
    description: "Dịch vụ vệ sinh chuyên nghiệp, đảm bảo hiệu suất tối đa cho PC.",
    img: Services,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative w-full h-80">
          <Image src={service.img} alt={service.title} fill className="object-contain" />
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-4">{service.title}</h1>
          <div className="flex gap-3 mb-6">
            <span className="text-gray-400 line-through">
              {new Intl.NumberFormat("vi-VN").format(service.oldPrice)}₫
            </span>
            <span className="text-red-500 text-2xl font-semibold">
              {new Intl.NumberFormat("vi-VN").format(service.price)}₫
            </span>
          </div>
          <p className="text-gray-700 mb-6">{service.description}</p>
          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Yêu cầu dịch vụ
          </button>
        </div>
      </div>

      <FeaturedFixServices />

      {/* Popup Modal */}
      <ServiceRequestModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}
