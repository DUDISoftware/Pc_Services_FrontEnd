/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { bannerService } from "@/services/banner.service";

interface BannerData {
  _id: string;
  image: string;
  position: number;
  layout: string;
  link: string;
  alt: string;
}

export default function HomeBanner() {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [layout, setLayout] = useState<string>("option1");
  const [currentIndex, setCurrentIndex] = useState(0); // Slide index cho option3

 useEffect(() => {
  const fetchBanners = async () => {
    try {
      const res = await bannerService.getAll(5, 1);
      const all = res.banners;

      // ✅ Lặp từ 0 đến 4 → tìm banner đầu tiên có position > 0
      let layoutStr = "option1";
      for (let i = 0; i < all.length; i++) {
        if (all[i].position > 0 && typeof all[i].layout === "string") {
          layoutStr = all[i]?.layout?.toLowerCase() as string;
          break;
        }
      }

      // ✅ Lọc các banner đúng layout + position > 0
      const valid = all
        .filter((b: any) => b.layout === layoutStr && b.position > 0)
        .sort((a: any, b: any) => a.position - b.position)
        .map((b: any) => ({
          _id: b._id,
          image:
            typeof b.image === "string"
              ? b.image
              : b.image?.url || "",
          position: b.position,
          layout: b.layout,
          link: b.link || "#",
          alt: b.alt || "Banner",
        }));

      // ✅ Điều chỉnh layout theo số lượng valid banners
      let finalLayout = layoutStr;
      if (valid.length === 1) {
        finalLayout = "option2"; // slide 1 ảnh tự động
      } else if (valid.length === 2) {
        finalLayout = "option3"; // layout tùy ý (ví dụ 2 ảnh ngang)
      }

      setLayout(finalLayout);
      setBanners(valid);
    } catch (err) {
      console.error("❌ Lỗi khi tải banner:", err);
    }
  };

  fetchBanners();
}, []);



  // Auto slide mỗi 5s nếu layout === option3
  useEffect(() => {
    if (layout !== "option3" || banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [layout, banners]);

  const getBanner = (pos: number) => {
    return banners.find((b) => b.position === pos);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Option 1: 1 ảnh lớn trái, 2 ảnh nhỏ phải */}
      {layout === "option1" && (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-8">
            <div className="relative w-full h-full aspect-[3/2] rounded-lg overflow-hidden shadow">
              {getBanner(1) && (
                <a href={getBanner(1)?.link} target="_blank" rel="noopener noreferrer">
                  <img
                    src={getBanner(1)?.image}
                    alt={getBanner(1)?.alt || "Banner 1"}
                    className="object-cover w-full h-full"
                  />
                </a>
              )}
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
            {[2, 3].map((pos) => {
              const banner = getBanner(pos);
              return (
                <div
                  key={pos}
                  className="relative flex-1 w-full rounded-lg overflow-hidden shadow aspect-[3/2]"
                >
                  {banner && (
                    <a href={banner.link} target="_blank" rel="noopener noreferrer">
                      <img
                        src={banner.image}
                        alt={banner.alt || `Banner ${pos}`}
                        className="object-cover w-full h-full"
                      />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Option 2: 1 ảnh lớn toàn banner */}
      {layout === "option2" && (
        <div className="w-full aspect-[3/1] rounded-lg overflow-hidden shadow">
          {getBanner(1) && (
            <a href={getBanner(1)?.link} target="_blank" rel="noopener noreferrer">
              <img
                src={getBanner(1)?.image}
                alt={getBanner(1)?.alt || "Banner 1"}
                className="object-cover w-full h-full"
              />
            </a>
          )}
        </div>
      )}

      {/* Option 3: Slide ngang tự động */}
      {layout === "option3" && (
        <div className="relative w-full overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {banners.map((banner) => (
              <div key={banner._id} className="min-w-full aspect-[3/1] px-2">
                <a href={banner.link} target="_blank" rel="noopener noreferrer">
                  <img
                    src={banner.image}
                    alt={banner.alt || "Banner"}
                    className="object-cover w-full h-full rounded-lg shadow"
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
