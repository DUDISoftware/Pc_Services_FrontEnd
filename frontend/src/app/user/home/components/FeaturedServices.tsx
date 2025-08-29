"use client";

import Image from "next/image";
import { ChevronRightCircle } from "lucide-react";
import Service from "@/assets/image/service/service.svg";
import Service1 from "@/assets/image/service/service1.svg";
import Service2 from "@/assets/image/service/service2.svg";
import Service3 from "@/assets/image/service/service3.svg";
import Service4 from "@/assets/image/service/service4.svg";

const services = [
  { title: "Nâng cấp RAM", img: Service4 },
  { title: "Vệ sinh PC", img: Service3 },
  { title: "Thay - Nâng cấp ổ cứng", img: Service2 },
  { title: "Lắp ráp PC theo yêu cầu", img: Service1 },
  { title: "Thay linh kiện", img: Service },
];

export default function FeaturedFixServices() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Dịch vụ nổi bật</h2>
        <a
          href="#"
          className="text-sm text-blue-500 hover:underline flex items-center"
        >
          Xem tất cả <ChevronRightCircle className="w-4 h-4 ml-1" />
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {services.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center rounded-lg border border-gray-200 p-3 hover:shadow transition"
          >
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-2">
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-xs sm:text-sm text-center">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
