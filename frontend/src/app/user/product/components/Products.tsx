/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRightCircle,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { productService } from "@/services/product.service";
import { Product } from "@/types/Product";
import { categoryService } from "@/services/category.service";
import { ratingService } from "@/services/rating.service";

type ProductType = {
  slug: string;
  _id: string;
  title: string;
  brand?: string;
  oldPrice: number;
  price: number;
  inStock: boolean;
  discount?: string;
  rating: number;
  img: string;
  category: string;
};

type ProductsProps = {
  category: string;
};

const PAGE_SIZE = 8;

export default function Products({ category }: ProductsProps) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [category_ids, setCategory_ids] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let products: Product[] = [];
        let totalProducts = 0;

        if (category !== "all") {
          const catRes = await categoryService.getBySlug(category);
          const category_id = catRes._id;
          const res = await productService.getByCategory(category_id);
          products = res;
          totalProducts = res.length || 0;
        }

        const mapped = await Promise.all(
          products.map(async (p) => {
            const oldPrice = Math.round(p.price * 1.2);
            const discount =
              oldPrice > p.price
                ? `${Math.round(((oldPrice - p.price) / oldPrice) * 100)}%`
                : undefined;

            return {
              _id: p._id,
              title: p.name,
              brand: typeof p.brand === "string" ? p.brand : undefined,
              price: p.price,
              oldPrice,
              slug: p.slug,
              img: p.images?.[0]?.url || "/images/placeholder.png",
              inStock: p.status === "available",
              category:
                typeof p.category_id === "object"
                  ? p.category_id.slug
                  : p.category_id || "Khác",
              rating: await ratingService.getScoreByProductId(p._id) || 5.0,
              discount,
            };
          })
        );

        setProducts(mapped);
        setTotal(totalProducts);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, page]);

  useEffect(() => {
    setPage(1); // Reset to first page when category changes
    if (category === "all") {
      setCategory_ids(undefined);
      return;
    }
    const fetchCategories = async () => {
      try {
        // category = decodeURIComponent(category.toLowerCase().trim());
        const res = await categoryService.getBySlug(category);
        setCategory_ids(res._id);
      } catch (err) {
        console.error(err);
      }
    };

    if (category !== "all") {
      fetchCategories();
    }
  }, [category]);

  useEffect(() => {
    // scroll back to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (loading) return <p>Đang tải sản phẩm...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
        <h2 className="text-lg font-semibold">
          {category === "all" ? "Tất cả sản phẩm" : category.toUpperCase()}
        </h2>
        <Link
          href={`/user/product/allproduct?category=${encodeURIComponent(
            category
          )}`}
          className="text-sm text-blue-500 hover:underline flex items-center"
        >
          Xem thêm <ChevronRightCircle className="w-4 h-4 ml-1" />
        </Link>
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
              <h3 className="text-xs sm:text-sm font-medium line-clamp-2 flex-1 mb-2 hover:text-blue-600">
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
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  {item.rating.toFixed(1)}
                </div>
              </div>
            </Link>
          </div>
        ))}

        {products.length === 0 && (
          <p className="text-gray-500 text-sm col-span-full">
            Chưa có sản phẩm nào trong danh mục này.
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`px-3 py-1 rounded border ${page === 1
              ? "bg-gray-200 text-gray-400"
              : "bg-white text-blue-600 hover:bg-blue-50"
              }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 text-sm">
            Trang {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className={`px-3 py-1 rounded border ${page === totalPages
              ? "bg-gray-200 text-gray-400"
              : "bg-white text-blue-600 hover:bg-blue-50"
              }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
