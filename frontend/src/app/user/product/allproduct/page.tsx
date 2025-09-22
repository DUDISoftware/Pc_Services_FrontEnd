"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { productService } from "@/services/product.service";
import { Product } from "@/types/Product";
import CategoryNav from "@/components/common/CategoryNav";

export default function AllProductsPage() {
  const params = useSearchParams();
  const category = params.get("category") || "all";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { products } = await productService.getAll();
        setProducts(products);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = products;
    // category === "Tất cả"
    //   ? products
    //   : products.filter((p) =>
    //       typeof p.category === "object"
    //         ? p.category.name === category
    //         : p.category === category
    //     );

  console.log("Filtered products:", filtered);
  console.log("Current category:", category);
  if (loading) return <p className="text-center">Đang tải sản phẩm...</p>;

  return (
    <>
      <CategoryNav
        selectedCategory={category}
        onSelectCategory={(newCategory: string) => {
          const url = new URL(window.location.href);
          url.searchParams.set("category", newCategory);
          window.history.pushState({}, "", url.toString());
          window.location.reload();
        }}
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-6">
          {category === "all" ? "Tất cả sản phẩm" : category}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <div
              key={item._id}
              className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition"
            >
              <div className="relative w-full h-40 mb-3">
                <Image
                  src={item.images?.[0]?.url || "/images/product.png"}
                  alt={item.name}
                  fill
                  className="object-contain rounded"
                />
              </div>
              <h3 className="text-sm font-medium line-clamp-2">{item.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-red-500 font-semibold text-sm">
                  {item.price.toLocaleString()}₫
                </span>
                <div className="flex items-center text-xs text-gray-500">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  4.5
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="text-gray-500 text-sm col-span-full">
              Chưa có sản phẩm nào trong danh mục này.
            </p>
          )}
        </div>
      </div>
    </>
  );
}