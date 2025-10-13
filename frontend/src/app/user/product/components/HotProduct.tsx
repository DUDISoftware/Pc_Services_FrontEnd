/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRightCircle, Star } from "lucide-react";
import { productService } from "@/services/product.service";
import { Product } from "@/types/Product";

type ProductType = {
  slug: string;
  _id: string;
  title: string;
  oldPrice: number;
  price: number;
  discount?: string;
  rating: number;
  img: string;
};

const discountOptions = ["20%", "30% Today Only!", "10%", "15%"];

function getRandomDiscount(): string {
  return discountOptions[Math.floor(Math.random() * discountOptions.length)];
}

export default function HotProduct() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [featured, setFeatured] = useState<{ id: string; views: number }[]>([]);
  const [loading, setLoading] = useState(true);

  // Step 1: Get top 4 product IDs
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const result = await productService.getFeatured(4);
        setFeatured(result as any); // { id, views }
      } catch (err) {
        console.error("Lỗi khi lấy danh sách nổi bật:", err);
      }
    };
    fetchFeatured();
  }, []);

  // Step 2: Get full product data and match IDs
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const { products: all } = await productService.getAll(10, 1);

        const mapped: ProductType[] = all.map((p: Product) => ({
          _id: p._id,
          title: p.name,
          oldPrice: Math.round(p.price * 1.2),
          price: p.price,
          rating: +(4 + Math.random()).toFixed(1),
          img: p.images?.[0]?.url || "/images/placeholder.png",
          slug: p.slug,
        }));

        const featuredProducts = mapped
          .filter((p) => featured.some((f) => f.id === p._id))
          .map((p) => ({
            ...p,
            discount: getRandomDiscount(),
          }))
          .sort((a, b) => {
            const aViews = featured.find((f) => f.id === a._id)?.views || 0;
            const bViews = featured.find((f) => f.id === b._id)?.views || 0;
            return bViews - aViews;
          });

        // Fill up to 4 with random non-featured
        if (featuredProducts.length < 4) {
          const nonFeatured = mapped.filter(
            (p) => !featured.some((f) => f.id === p._id)
          );
          const extra = nonFeatured
            .sort(() => 0.5 - Math.random())
            .slice(0, 4 - featuredProducts.length)
            .map((p) => ({
              ...p,
              discount: getRandomDiscount(),
            }));
          setProducts([...featuredProducts, ...extra]);
        } else {
          setProducts(featuredProducts.slice(0, 4));
        }
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    if (featured.length > 0) {
      fetchAllProducts();
    }
  }, [featured]);

  if (loading) return <p className="px-4">Đang tải sản phẩm hot...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
        <h2 className="text-lg font-semibold">Deal hot hôm nay 🔥</h2>
        <Link
          href="/user/product/allproduct"
          className="text-sm text-blue-500 hover:underline flex items-center"
        >
          Xem thêm <ChevronRightCircle className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((item) => (
          <div
            key={item._id}
            className="flex flex-col border border-gray-200 rounded-lg p-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out h-full relative"
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
              <h3 className="text-xs sm:text-sm font-medium line-clamp-2 mb-2">
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
                <div className="flex items-center text-xs text-gray-500 ml-2">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  {item.rating.toFixed(1)}
                </div>
              </div>
            </Link>
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
