"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronRightCircle, Star } from "lucide-react";
import { productService } from "@/services/product.service";
import { Product } from "@/types/Product";

// ✅ type cho sản phẩm hiển thị
type ProductType = {
  _id: string;
  title: string;
  oldPrice: number;
  price: number;
  discount?: string;
  rating: number;
  img: string;
};

// Danh sách discount có sẵn
const discountOptions = ["20%", "30% Today Only!", "10%", "10%"];

function getRandomProducts(products: ProductType[], count: number) {
  return [...products]
    .sort(() => 0.5 - Math.random())
    .slice(0, count)
    .map((p) => ({
      ...p,
      discount:
        discountOptions[Math.floor(Math.random() * discountOptions.length)],
    }));
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { products } = await productService.getAll();

        const mapped: ProductType[] = products.map((p: Product) => ({
          _id: p._id,
          title: p.name,
          oldPrice: Math.round(p.price * 1.2), // giả định giá gốc cao hơn 20%
          price: p.price,
          rating: 4 + Math.random(), // random 4.0 - 5.0
          img: p.images?.[0]?.url || "/images/placeholder.png",
        }));

        setProducts(getRandomProducts(mapped, 4)); // ✅ random 4 sản phẩm
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="px-4">Đang tải sản phẩm...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
        <h2 className="text-lg font-semibold">Sản phẩm nổi bật</h2>
        <a
          href="#"
          className="text-sm text-blue-500 hover:underline flex items-center"
        >
          Xem thêm <ChevronRightCircle className="w-4 h-4 ml-1" />
        </a>
      </div>

      {/* Grid Products */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((item) => (
          <div
            key={item._id}
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
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-gray-400 line-through">
                  {item.oldPrice.toLocaleString()}₫
                </span>
                <span className="text-red-500 font-semibold text-sm">
                  {item.price.toLocaleString()}₫
                </span>
              </div>
              <div className="flex items-center text-xs text-gray-500 ml-2 shrink-0">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />{" "}
                {item.rating.toFixed(1)}
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && !loading && (
          <p className="text-gray-500 text-sm col-span-full">
            Không có sản phẩm nổi bật nào.
          </p>
        )}
      </div>
    </div>
  );
}
