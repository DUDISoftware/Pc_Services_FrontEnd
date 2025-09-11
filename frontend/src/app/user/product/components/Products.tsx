"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRightCircle, Star } from "lucide-react";
import { productService } from "@/services/product.service";
import { Product } from "@/types/Product";

type ProductType = {
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

export default function Products({ category }: ProductsProps) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { products } = await productService.getAll();

        const mapped: ProductType[] = products.map((p: Product) => {
          const oldPrice = Math.round(p.price * 1.2);

          return {
            _id: p._id,
            title: p.name,
            brand: typeof p.brand === "string" ? p.brand : undefined,
            oldPrice,
            price: p.price,
            inStock: p.status === "available",
            discount:
              oldPrice > p.price
                ? `${Math.round(((oldPrice - p.price) / oldPrice) * 100)}%`
                : undefined,
            rating: 4.5,
            img: p.images?.[0]?.url || "/images/placeholder.png",
            category:
              typeof p.category === "object"
                ? p.category.name
                : p.category || "Khác",
          };
        });

        setProducts(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts =
    category === "Tất cả"
      ? products.slice(0, 4)
      : products.filter((p) => p.category === category).slice(0, 4);

  if (loading) return <p>Đang tải sản phẩm...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
        <h2 className="text-lg font-semibold">
          {category === "Tất cả" ? "Tất cả sản phẩm" : category}
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
        {filteredProducts.map((item) => (
          <div
            key={item._id} // ✅ sửa lại cho đúng
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
            <Link href={`/user/product/${item._id}`}>
              <h3 className="text-xs sm:text-sm font-medium line-clamp-2 flex-1 mb-2 hover:text-blue-600">
                {item.title}
              </h3>
            </Link>

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
