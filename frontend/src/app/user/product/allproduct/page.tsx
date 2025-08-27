"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";
import Product1 from "@/assets/image/product/product1.jpg";
import Product2 from "@/assets/image/product/product2.jpg";
import Product3 from "@/assets/image/product/product3.png";
import Product4 from "@/assets/image/product/product4.png";
import ProductHeader from "../components/ProductHeader";

// reuse products array
const products = [
  {
    title: "Màn Hình LG 24MR400-B",
    oldPrice: 23000000,
    price: 20999999,
    rating: 4.2,
    img: Product1,
    category: "Màn hình",
  },
  {
    title: "Màn hình Samsung Odyssey G5",
    oldPrice: 11000000,
    price: 8900000,
    rating: 4.5,
    img: Product2,
    category: "Màn hình",
  },
  {
    title: "Màn hình MSI PRO MP241",
    oldPrice: 4500000,
    price: 3900000,
    rating: 4.0,
    img: Product3,
    category: "Màn hình",
  },
  {
    title: "CPU Intel Core i9-13900K",
    oldPrice: 15999999,
    price: 12999999,
    rating: 4.7,
    img: Product4,
    category: "CPU",
  },
];

export default function AllProductsPage() {
  const params = useSearchParams();
  const category = params.get("category") || "Tất cả";

  const filtered =
    category === "Tất cả"
      ? products
      : products.filter((p) => p.category === category);

  return (
    <>
      <ProductHeader
        selectedCategory={category}
        onSelectCategory={(newCategory: string) => {
          // Update the URL with the new category
          const url = new URL(window.location.href);
          url.searchParams.set("category", newCategory);
          window.history.pushState({}, "", url.toString());
          window.location.reload();
        }}
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-6">
          {category === "Tất cả" ? "Tất cả sản phẩm" : category}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition"
            >
              <div className="relative w-full h-40 mb-3">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-sm font-medium line-clamp-2">{item.title}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-red-500 font-semibold text-sm">
                  {item.price.toLocaleString()}₫
                </span>
                <div className="flex items-center text-xs text-gray-500">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  {item.rating.toFixed(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
