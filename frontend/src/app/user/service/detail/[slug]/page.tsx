// "use client";

// import { use, useEffect, useState } from "react";
// import Image from "next/image";
// import { serviceService } from "@/services/service.service";
// import { Service } from "@/types/Service";
// import DefaultServiceImage from "@/assets/image/service/services.png";

// import FeaturedFixServices from "./components/FeaturedFixServices";
// import ServiceRequestModal from "./components/ServiceRequestModal";

// export default function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
//   // ✅ unwrap params
//   const { slug } = use(params);

//   const [service, setService] = useState<Service | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     const fetchService = async () => {
//       try {
//         const data = await serviceService.getBySlug(slug);
//         setService(data);
//         const views = await serviceService.countViewRedis(data._id);
//       } catch (err) {
//         console.error("Lỗi khi tải chi tiết dịch vụ:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchService();
//   }, [slug]);

//   if (loading) return <p>Đang tải chi tiết dịch vụ...</p>;
//   if (!service) return <p>Không tìm thấy dịch vụ.</p>;

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-10">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="relative w-full h-80">
//           <Image
//             src={DefaultServiceImage}
//             alt={service.name}
//             fill
//             className="object-contain"
//           />
//         </div>

//         <div>
//           <h1 className="text-2xl font-bold mb-4">{service.name}</h1>
//           <div className="flex gap-3 mb-6">
//             <span className="text-gray-400 line-through">
//               {new Intl.NumberFormat("vi-VN").format(service.price * 1.2)}₫
//             </span>
//             <span className="text-red-500 text-2xl font-semibold">
//               {new Intl.NumberFormat("vi-VN").format(service.price)}₫
//             </span>
//           </div>
//           <p className="text-gray-700 mb-6">{service.description}</p>
//           <button
//             onClick={() => setOpen(true)}
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg"
//           >
//             Yêu cầu dịch vụ
//           </button>
//         </div>
//       </div>

//       <FeaturedFixServices />

//       <ServiceRequestModal serviceData = {service} isOpen={open} onClose={() => setOpen(false)} />
//     </div>
//   );
// }
"use client";

import { use, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { serviceService } from "@/services/service.service";
import { ratingService } from "@/services/rating.service";
import { Service } from "@/types/Service";
import { Rating } from "@/types/Rating";
import DefaultServiceImage from "@/assets/image/service/services.png";

import FeaturedFixServices from "./components/FeaturedFixServices";
import ServiceRequestModal from "./components/ServiceRequestModal";
import ServiceReviewSection from "./components/ServiceReviewSection";

export default function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [ratings, setRatings] = useState<Rating[]>([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [score, setScore] = useState(5);
  const reviewFormRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await serviceService.getBySlug(slug);
        setService(data);
        await serviceService.countViewRedis(data._id);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết dịch vụ:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [slug]);

  const averageRating =
    ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length).toFixed(1)
      : "5.0";

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;
    try {
      const payload = {
        service_id: service._id,
        name,
        comment,
        score,
      };
      await ratingService.create(payload);
      setName("");
      setComment("");
      setScore(5);
      const updated = await ratingService.getByServiceId(service._id);
      setRatings(updated.ratings || []);
      alert("Đánh giá đã được gửi!");
    } catch (err) {
      console.error("Lỗi gửi đánh giá:", err);
      alert("Gửi đánh giá thất bại.");
    }
  };

  if (loading) return <p>Đang tải chi tiết dịch vụ...</p>;
  if (!service) return <p>Không tìm thấy dịch vụ.</p>;

  // ✅ Chỉ tính giá giảm nếu có giảm giá thật
  const hasDiscount = service.discount && Number(service.discount) > 0;
  const discountedPrice = hasDiscount
    ? Math.round(service.price - (service.price * Number(service.discount)) / 100)
    : service.price;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative w-full h-80">
          <Image
            src={
              service.images && service.images.length > 0
                ? service.images[0].url
                : DefaultServiceImage
            }
            alt={service.name}
            fill
            className="object-contain"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-4">{service.name}</h1>

          <div className="flex gap-3 mb-6 items-center">
            {/* ✅ Chỉ hiển thị giá gốc & giảm nếu discount > 0 */}
            {hasDiscount ? (
              <>
                <span className="text-gray-400 line-through text-sm">
                  {new Intl.NumberFormat("vi-VN").format(service.price)}₫
                </span>
                <span className="text-red-500 text-2xl font-semibold">
                  {new Intl.NumberFormat("vi-VN").format(discountedPrice)}₫
                </span>
                <span className="text-sm bg-red-500 text-white px-2 py-1 rounded">
                  -{service.discount}%
                </span>
              </>
            ) : (
              // ✅ Nếu không có discount, chỉ hiện giá bình thường
              <span className="text-red-500 text-2xl font-semibold">
                {new Intl.NumberFormat("vi-VN").format(service.price)}₫
              </span>
            )}
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

      {/* Đánh giá người dùng */}
      <div className="mt-12 border-t pt-8">
        <h3 className="text-xl font-semibold mb-4">Đánh giá dịch vụ</h3>

        <ServiceReviewSection
          serviceId={service._id}
          scrollToFormRef={reviewFormRef}
        />


        <form ref={reviewFormRef} onSubmit={handleSubmitReview} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium mb-1">Tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bình luận</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={4}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Đánh giá sao</label>
            <select
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              required
              className="w-full border px-3 py-2 rounded"
            >
              {[1, 2, 3, 4, 5].map((s) => (
                <option key={s} value={s}>
                  {s} sao
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Gửi đánh giá
          </button>
        </form>
      </div>

      <FeaturedFixServices />

      <ServiceRequestModal
        serviceData={service}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
