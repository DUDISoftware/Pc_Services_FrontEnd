"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import Services from "@/assets/image/service/services.png";
// Mock data dịch vụ
const services = [
  {
    title: "Dịch Vụ Vệ Sinh Máy Tính Bàn (PC, Desktop) Chuyên Nghiệp",
    oldPrice: 23000000,
    price: 20999999,
    discount: "10%",
    rating: 4.8,
    img: Services,
  },
  {
    title: "Dịch Vụ Nâng Cấp Laptop RAM SSD Chuyên Nghiệp",
    oldPrice: 18000000,
    price: 12999999,
    discount: "30%",
    rating: 4.6,
    img: Services,
  },
  {
    title: "Dịch Vụ Vệ Sinh Laptop và Thay Keo Tản Nhiệt Chuyên Nghiệp",
    oldPrice: 20000000,
    price: 15999999,
    discount: "15%",
    rating: 4.7,
    img: Services,
  },
  {
    title: "Dịch Vụ Kiểm Tra Sửa Chữa Máy Tính Tận Nơi",
    oldPrice: 25000000,
    price: 21999999,
    discount: "20%",
    rating: 4.3,
    img: Services,
  },
];

// FAQ mock
const faqs = [
  {
    q: "Tôi nên chọn Hệ điều hành?",
    a: "Việc lựa chọn hệ điều hành phụ thuộc vào yêu cầu công việc của bạn. Ví dụ: Windows: Tự dựng cho người dùng cần phần mềm hoặc ứng dụng chơi game chuyên biệt. MacOS: Được ưa chuộng bởi những người làm thiết kế đồ họa, chỉnh sửa video và các công việc sáng tạo khác. Linux: Phù hợp nhất cho người dùng cần kiểm soát kỹ thuật nhiều hơn...",
  },
  {
    q: "Máy tính xách tay nào phù hợp với việc học của tôi?",
    a: "Nên chọn dòng laptop nhẹ, pin lâu, CPU tầm trung, RAM ít nhất 8GB.",
  },
  {
    q: "Làm thế nào để chọn được MacBook?",
    a: "Tùy vào nhu cầu: học tập, thiết kế đồ họa hay lập trình, nên chọn MacBook Air hoặc MacBook Pro.",
  },
  {
    q: "Tôi cần máy tính xách tay cũ nào?",
    a: "Nên tham khảo các dòng đã qua sử dụng được kiểm định chất lượng.",
  },
  {
    q: "Tôi cần bộ xử lý nào?",
    a: "Intel i5/i7 thế hệ mới hoặc AMD Ryzen 5/7 là lựa chọn tối ưu cho nhu cầu học tập và công việc.",
  },
];

export default function UserServicePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Services */}
      <h1 className="text-2xl font-bold mb-6">Các dịch vụ sửa chữa</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {services.map((s, i) => (
          <div
            key={i}
            className="relative border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            {s.discount && (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                {s.discount}
              </span>
            )}
            <div className="relative w-full h-36 mb-3">
              <Image
                src={s.img}
                alt={s.title}
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-sm font-medium line-clamp-2 mb-2">{s.title}</h3>
            <div className="flex items-center justify-between mt-auto">
              {/* Giá */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-400 text-xs line-through">
                  {s.oldPrice.toLocaleString()}₫
                </span>
                <span className="text-red-500 font-semibold">
                  {s.price.toLocaleString()}₫
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center text-xs text-gray-500 ml-2 shrink-0">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                {s.rating.toFixed(1)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ + Contact Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FAQ */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">
            Những câu hỏi thường gặp về Dịch vụ sửa chữa
          </h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details
                key={i}
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
                <summary className="cursor-pointer font-medium">{f.q}</summary>
                <p className="mt-2 text-gray-600 text-sm">{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Contact Box */}
        <div className="bg-blue-50 p-6 rounded-xl shadow-sm flex flex-col justify-between">
          <h3 className="text-lg font-semibold mb-2">
            Bạn có thắc mắc? Chúng tôi có câu trả lời!
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Trò chuyện với chuyên gia công nghệ của chúng tôi để được tư vấn và
            nhận giải đáp nhanh chóng. Đội ngũ kỹ thuật sẽ tiếp tục theo dõi
            bạn.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Nhấn để hỏi
          </button>
        </div>
      </div>
    </div>
  );
}
