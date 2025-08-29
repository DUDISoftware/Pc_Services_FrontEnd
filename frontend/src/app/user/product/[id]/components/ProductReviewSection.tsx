"use client";

import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import Image from "next/image";
import bannerImg from "@/assets/image/banner/bannerdetailproduct.png"; // bạn thay ảnh này

const reviews = [
  {
    id: 1,
    rating: 4.2,
    author: "Hoàng Long",
    time: "12 ngày trước",
    content: `So với phiên bản tiền nhiệm, việc có thể điều chỉnh được vị trí của màn hình đã là điểm nâng cấp lớn, chưa nói tới các trang bị khác. 
Độ phân giải FHD 144Hz 1ms (GtG) và tấm nền IPS hỗ trợ HDR10 cũng như là những điểm nổi bật hiện thấy trong tầm giá.`,
    pros: ["Màn hình 144Hz 1ms HDR10", "Menu OSD tối ưu cho game"],
    likes: 12,
    dislikes: 10,
  },
  {
    id: 2,
    rating: 3.87,
    author: "Kiệt Lạc",
    time: "8 ngày trước",
    content: `LG UltraGear 32GS95UE sở hữu những thông số vô cùng cao cấp mà hầu như anh em game thủ nào cũng mơ ước, đó chính là kích thước 32 inch, độ phân giải 4K, tần số quét 240Hz và thời gian phản hồi 0,03ms, đây đều là những màn hình này đều là các lựa chọn rất tốt.`,
    pros: [
      "Tấm nền có chất lượng hiển thị hình ảnh quá đã",
      "Hiệu suất HDR ấn tượng",
      "Chế độ Dual Mode, chuyển đổi tần số quét siêu nhanh",
    ],
    likes: 16,
    dislikes: 3,
  },
];

export default function ProductReviewSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 mt-16">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold uppercase">Đánh giá</h2>
        <button className="text-blue-600 text-sm hover:underline">
          Xem tất cả
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating summary */}
        <div className="border rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold mb-2">Đánh giá từ khách hàng</h3>
          <div className="flex items-center gap-1 text-yellow-400 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400" />
            ))}
          </div>

          {/* Progress bars */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="w-10">{star} star</span>
                <div className="flex-1 h-2 bg-gray-200 rounded">
                  <div
                    className="h-2 bg-green-500 rounded"
                    style={{ width: `${[75, 30, 22, 41, 12][i]}%` }}
                  ></div>
                </div>
                <span className="w-10 text-gray-600">
                  {[75, 30, 22, 41, 12][i]}%
                </span>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Hãy chia sẻ phản hồi của bạn và tạo ra trải nghiệm mua sắm tốt hơn
            cho mọi người. Cảm ơn bạn đã dành thời gian chia sẻ ý kiến.
          </p>

          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:opacity-90 transition">
            Viết đánh giá
          </button>
        </div>

        {/* Review list */}
        <div className="lg:col-span-2 space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              {/* Rating + meta */}
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(review.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-medium">
                    {review.rating.toFixed(2)}
                  </span>
                </div>
                <span>
                  {review.time} • <span>{review.author}</span>
                </span>
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-2">{review.content}</p>
              <ul className="list-disc pl-5 text-gray-700 mb-3">
                {review.pros.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>

              {/* Like / Dislike */}
              <div className="flex items-center gap-4 text-gray-600 text-sm">
                <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                  <ThumbsDown className="w-4 h-4" /> {review.dislikes}
                </div>
                <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                  <ThumbsUp className="w-4 h-4" /> {review.likes}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Banner Service */}
      <div className="mt-10 relative rounded-lg overflow-hidden h-86 bg-gradient-to-r from-[#A0B3F8] to-[#A978D6]">
        {/* Nếu bạn vẫn muốn thêm ảnh điện thoại / tai nghe thì để absolute */}
        <Image
          src={bannerImg}
          alt="Dịch vụ sửa chữa"
          className="absolute right-0 bottom-0 h-full object-contain"
        />

        <div className="absolute inset-0 flex flex-col justify-center items-end p-12">
          <h3 className="text-xl font-semibold text-white mb-3 max-w-md">
            Dịch vụ sửa chữa tại <br />nhà chỉ cần 1 cú click
          </h3>
          <button className="bg-blue-600 text-white px-12 py-3 mr-8 rounded-lg hover:opacity-90 transition">
            Click
          </button>
        </div>
      </div>
    </div>
  );
}
