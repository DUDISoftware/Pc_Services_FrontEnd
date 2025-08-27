"use client";

import Image from "next/image";
import banner1 from "@/assets/image/banner/homebanner1.svg";
import banner2 from "@/assets/image/banner/homebanner2.svg";
import banner3 from "@/assets/image/banner/homebanner3.svg";

export default function HomeBanner() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Banner Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Banner lớn bên trái */}
        <div className="col-span-12 md:col-span-8">
          <div className="relative w-full h-full">
            <Image
              src={banner3}
              alt="Back To School"
              width={745}
              height={483}
              className="rounded-lg shadow w-full h-auto"
              priority
            />
          </div>
        </div>

        {/* Banner phải chia 2 */}
        <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
          <div className="relative flex-1 w-full">
            <Image
              src={banner1}
              alt="Dịch vụ nâng cấp"
              fill
              className="object-cover rounded-lg shadow"
            />
          </div>
          <div className="relative flex-1 w-full">
            <Image
              src={banner2}
              alt="Freeship"
              fill
              className="object-cover rounded-lg shadow"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
