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
}

export default function HomeBanner() {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [layout, setLayout] = useState<string>("option1");
  const [currentIndex, setCurrentIndex] = useState(0); // Slide index cho option3

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await bannerService.getAll();
        const all = res.banners;

        const mainBanner = all.find((b: any) => b.position === 1);
        const layoutStr = mainBanner?.layout || "option1";

        const valid = all
          .filter((b: any) => b.layout === layoutStr && b.position > 0)
          .sort((a: any, b: any) => a.position - b.position);

        setLayout(layoutStr);
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

  const getImage = (pos: number) => {
    const item = banners.find((b) => b.position === pos);
    return typeof item?.image === "string"
      ? item.image
      : item?.image?.url || "";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Option 1: 1 ảnh lớn trái, 2 ảnh nhỏ phải */}
      {layout === "option1" && (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-8">
            <div className="relative w-full h-full aspect-[3/2] rounded-lg overflow-hidden shadow">
              {getImage(1) && (
                <img
                  src={getImage(1)}
                  alt="Banner 1"
                  className="object-cover w-full h-full"
                />
              )}
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
            {[2, 3].map((pos) => (
              <div
                key={pos}
                className="relative flex-1 w-full rounded-lg overflow-hidden shadow aspect-[3/2]"
              >
                {getImage(pos) && (
                  <img
                    src={getImage(pos)}
                    alt={`Banner ${pos}`}
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Option 2: 1 ảnh lớn toàn banner */}
      {layout === "option2" && (
        <div className="w-full aspect-[3/1] rounded-lg overflow-hidden shadow">
          {getImage(1) && (
            <img
              src={getImage(1)}
              alt="Banner 1"
              className="object-cover w-full h-full"
            />
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
              <div
                key={banner._id}
                className="min-w-full aspect-[3/1] px-2"
              >
                <img
                  src={
                    typeof banner.image === "string"
                      ? banner.image
                      : banner.image?.url || ""
                  }
                  alt="Banner"
                  className="object-cover w-full h-full rounded-lg shadow"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
