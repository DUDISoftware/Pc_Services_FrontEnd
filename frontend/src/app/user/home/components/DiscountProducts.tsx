"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRightCircle, Star } from "lucide-react";
import { productService } from "@/services/product.service";
import { Product } from "@/types/Product";
import { Rating } from "@/types/Rating";
import { ratingService } from "@/services/rating.service";

type ProductType = {
  _id: string;
  title: string;
  oldPrice: number;
  price: number;
  discount?: string;
  rating: number;
  img: string;
  slug: string;
};

export default function DiscountProducts() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscountProducts = async () => {
      try {
        const { products } = await productService.getAll();

        // ✅ lấy 4 sản phẩm đầu tiên và gán discount theo mảng cố định
        const discountList = [25, 30, 20, 30];

        const mappedPromises = products.slice(0, 4).map(async (p: Product, idx: number) => {
          const discountPercent = discountList[idx] || 20; // fallback = 20%
          const oldPrice = Math.round(p.price / (1 - discountPercent / 100));

          return {
            _id: p._id,
            title: p.name,
            oldPrice,
            price: p.price,
            discount: `${discountPercent}%`,
            rating: await ratingService.getScoreByProductId(p._id) || 5.0,
            img: p.images?.[0]?.url || "/images/placeholder.png",
            slug: p.slug,
          };
        });

        const mapped = await Promise.all(mappedPromises);
        setProducts(mapped);
      } catch (err) {
        console.error("Lỗi khi fetch sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountProducts();
  }, []);

  if (loading) return <p className="px-4">Đang tải sản phẩm...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
        <h2 className="text-lg font-semibold">Sản phẩm giảm giá</h2>
      </div>

      {/* Grid Products */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((item) => (
          <div
            key={item._id}
            className="flex flex-col border border-gray-200 rounded-lg p-3 hover:shadow-md transition h-full relative"
          >
            <Link href={`/user/product/detail/${item.slug}`}>

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
              {/* <Link href={`/user/product/${item._id}`}> */}
              <h3 className="text-xs sm:text-sm font-medium line-clamp-2 flex-1 mb-2 hover:text-blue-600">
                {item.title}
              </h3>
              {/* </Link> */}

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
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  {item.rating.toFixed(1)}
                </div>
              </div>
            </Link>
          </div>
        ))}

        {products.length === 0 && (
          <p className="text-gray-500 text-sm col-span-full">
            Không có sản phẩm giảm giá nào.
          </p>
        )}
      </div>
    </div>
  );
}
