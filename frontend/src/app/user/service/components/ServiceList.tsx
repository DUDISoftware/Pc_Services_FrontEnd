"use client";

import ServiceCard from "./ServiceCard";
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

export default function ServiceList() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Các dịch vụ sửa chữa</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {services.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </div>
    </div>
  );
}
