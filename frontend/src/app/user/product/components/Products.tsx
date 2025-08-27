"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { ChevronRightCircle, Star } from "lucide-react";

import Product1 from "@/assets/image/product/product1.jpg";
import Product2 from "@/assets/image/product/product2.jpg";
import Product3 from "@/assets/image/product/product3.png";
import Product4 from "@/assets/image/product/product4.png";

type ProductType = {
  title: string;
  brand: string;
  type: string;
  oldPrice: number;
  price: number;
  inStock: boolean;
  discount?: string;
  rating: number;
  img: StaticImageData;
  category: string;
  fastDelivery: boolean;
};

const products: ProductType[] = [
  {
    title: "Màn Hình LG 24MR400-B (23.8 inch - FHD - IPS - 100Hz - 5ms)",
    oldPrice: 23000000,
    price: 20999999,
    discount: "20%",
    rating: 4.2,
    img: Product1,
    category: "Màn hình",
    brand: "LG",
    type: "Màn văn phòng",
    inStock: true,
    fastDelivery: true,
  },
  {
    title: "Màn hình Samsung Odyssey G5 (27 inch - QHD - 144Hz - VA)",
    oldPrice: 11000000,
    price: 8900000,
    discount: "18%",
    rating: 4.5,
    img: Product2,
    category: "Màn hình",
    brand: "Samsung",
    type: "Màn gaming",
    inStock: true,
    fastDelivery: false,
  },
  {
    title: "Màn hình MSI PRO MP241 (24 inch - FHD - IPS - 75Hz)",
    oldPrice: 4500000,
    price: 3900000,
    discount: "10%",
    rating: 4.0,
    img: Product3,
    category: "Màn hình",
    brand: "MSI",
    type: "Màn văn phòng",
    inStock: true,
    fastDelivery: true,
  },
  {
    title: "CPU Intel Core i9-13900K",
    oldPrice: 15999999,
    price: 12999999,
    discount: "15%",
    rating: 4.7,
    img: Product4,
    category: "CPU",
    brand: "Intel",
    type: "Khác",
    inStock: true,
    fastDelivery: false,
  },
  {
    title: "Mainboard ASUS ROG STRIX Z790-E",
    oldPrice: 2900000,
    price: 3900000,
    discount: "12%",
    rating: 4.6,
    img: Product3,
    category: "MainBoard",
    brand: "ASUS",
    type: "Khác",
    inStock: false,
    fastDelivery: true,
  },
];

type ProductsProps = {
  category: string;
};

export default function Products({ category }: ProductsProps) {
  const filteredProducts =
    category === "Tất cả"
      ? products.slice(0, 4) // chỉ show 4 sp đầu tiên (preview)
      : products.filter((p) => p.category === category).slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
        <h2 className="text-lg font-semibold">
          {category === "Tất cả" ? "Tất cả sản phẩm" : category}
        </h2>
        <Link
          href={`/user/product/allproduct?category=${encodeURIComponent(category)}`}
          className="text-sm text-blue-500 hover:underline flex items-center"
        >
          Xem thêm <ChevronRightCircle className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* Grid Products */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col border border-gray-200 rounded-lg p-3 hover:shadow-md transition h-full relative"
          >
            {/* Badge */}
            {item.discount && (
              <span className="absolute top-2 left-2 bg-[#FB5F2F] text-white text-xs px-2 py-1 rounded z-10">
                {item.discount}
              </span>
            )}

            {/* Image */}
            <div className="relative w-full h-36 sm:h-40 mb-3">
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="object-contain rounded"
              />
            </div>

            {/* Title */}
            <h3 className="text-xs sm:text-sm font-medium line-clamp-2 flex-1 mb-2">
              {item.title}
            </h3>

            {/* Price + Rating */}
            <div className="flex items-center justify-between mt-auto">
              {/* Giá */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-gray-400 line-through">
                  {item.oldPrice.toLocaleString()}₫
                </span>
                <span className="text-red-500 font-semibold text-sm">
                  {item.price.toLocaleString()}₫
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center text-xs text-gray-500 ml-2 shrink-0">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                {item.rating.toFixed(1)}
              </div>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <p className="text-gray-500 text-sm col-span-full">
            Chưa có sản phẩm nào trong danh mục này.
          </p>
        )}
      </div>
    </div>
  );
}
