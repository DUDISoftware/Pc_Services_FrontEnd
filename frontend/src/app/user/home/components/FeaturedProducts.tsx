"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRightCircle, Star } from "lucide-react";
import { productService } from "@/services/product.service";
import { Product } from "@/types/Product";
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

const discountOptions = ["20%", "30% Today Only!", "10%", "10%"];

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [featured, setFeatured] = useState<{ id: string; views: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await productService.getFeatured(8);
        setFeatured(res.products);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      }
    }
    fetchFeatured();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const featuredIds = featured.map((f) => f.id);

        // Fetch featured products by ID
        const featuredProducts: ProductType[] = await Promise.all(
          featuredIds.map(async (id) => {
            const product = await productService.getById(id);
            return {
              _id: product._id,
              title: product.name,
              oldPrice: Math.round(product.price * 1.2),
              price: product.price,
              rating: (await ratingService.getScoreByProductId(product._id)) || 5.0,
              img: product.images?.[0]?.url || "/images/placeholder.png",
              slug: product.slug,
              discount: discountOptions[Math.floor(Math.random() * discountOptions.length)],
            };
          })
        );

        // If less than 8 featured, fetch extra products
        if (featuredProducts.length < 8) {
          const needed = 8 - featuredProducts.length;
          const res = await productService.getAll(needed, 1);
          const extraProducts: ProductType[] = await Promise.all(
            res.products
              .filter((p) => !featuredIds.includes(p._id))
              .slice(0, needed)
              .map(async (p) => ({
                _id: p._id,
                title: p.name,
                oldPrice: Math.round(p.price * 1.2),
                price: p.price,
                rating: (await ratingService.getScoreByProductId(p._id)) || 5.0,
                img: p.images?.[0]?.url || "/images/placeholder.png",
                slug: p.slug,
                discount: discountOptions[Math.floor(Math.random() * discountOptions.length)],
              }))
          );
          setProducts([...featuredProducts, ...extraProducts]);
        } else {
          setProducts(featuredProducts.slice(0, 8));
        }
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
      } finally {
        setLoading(false);
      }
    }

    if (featured.length > 0) fetchProducts();
  }, [featured]);

  if (loading) return <p className="px-4">Đang tải sản phẩm...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
        <h2 className="text-lg font-semibold">Sản phẩm nổi bật</h2>
        <a href="#" className="text-sm text-blue-500 hover:underline flex items-center">
          Xem thêm <ChevronRightCircle className="w-4 h-4 ml-1" />
        </a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((item) => (
          <div
            key={item._id}
            className="flex flex-col border border-gray-200 rounded-lg p-3 hover:shadow-md transition h-full relative"
          >
            <Link href={`/user/product/detail/${item.slug}`}>
              {item.discount && (
                <span className="absolute top-2 left-2 bg-[#FB5F2F] text-white text-xs px-2 py-1 rounded z-10">
                  {item.discount}
                </span>
              )}
              <div className="relative w-full h-36 sm:h-40 mb-3">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-contain rounded"
                />
              </div>
              <h3 className="text-xs sm:text-sm font-medium line-clamp-2 flex-1 mb-2">
                {item.title}
              </h3>
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
        {products.length === 0 && !loading && (
          <p className="text-gray-500 text-sm col-span-full">
            Không có sản phẩm nổi bật nào.
          </p>
        )}
      </div>
    </div>
  );
}
