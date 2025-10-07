/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { productService } from "@/services/product.service";
import { Product } from "@/types/Product";
import CategoryNav from "@/components/common/CategoryNav";
import { categoryService } from "@/services/category.service";

export default function AllProductsPage() {
  const params = useSearchParams();
  const category = params.get("category") || "all";
  const PAGE_SIZE = 10;

  const [products, setProducts] = useState<Product[]>([]);
  const [nextProducts, setNextProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category_id, setCategory_id] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const router = useRouter();

  // ✅ Fetch category_id when category changes
  useEffect(() => {
    setLoading(true);
    if (category === "all") {
      setCategory_id(undefined);
      return;
    }
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getBySlug(category);
        setCategory_id(res._id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, [category]);

  // ✅ Fetch products (handles both "all" and category)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let products: Product[] = [];

        if (category !== "all" && !category_id) return;

        // 🔹 Common logic for both "all" and category
        const getPageData = async (pageNum: number) => {
          return category === "all"
            ? (await productService.getAll(PAGE_SIZE, pageNum)).products
            : await productService.getByCategory(category_id!, PAGE_SIZE, pageNum);
        };

        // If preloaded and going forward → use cache
        if (nextProducts.length > 0 && page > 1) {
          products = nextProducts;
          setNextProducts([]);
        } else {
          products = await getPageData(page);
        }

        // Prefetch next page
        const nextPageProducts = await getPageData(page + 1);
        if (nextPageProducts.length > 0) {
          setNextProducts(nextPageProducts);
          setHasMore(true);
        } else {
          setHasMore(false);
        }

        setProducts(products);
      } catch (err) {
        console.error("❌ Lỗi khi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, category_id, page]);

  // ✅ Pagination Handlers
  const handlePrev = () => {
    if (page > 1) {
      setPage((p) => p - 1);
      window.scrollTo({ top: 0, behavior: "smooth" }); // scroll top
    }
  };

  const handleNext = () => {
    if (hasMore) {
      setPage((p) => p + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) return <p className="text-center py-10">Đang tải sản phẩm...</p>;

  return (
    <>
      <CategoryNav
        selectedCategory={category}
        onSelectCategory={(newCategory: string) => {
          const url = new URL(window.location.href);
          url.searchParams.set("category", newCategory);
          router.push(url.toString());
          setPage(1);
          setNextProducts([]);
        }}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-6">
          {category === "all" ? "Tất cả sản phẩm" : category}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <div
              key={item._id}
              className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition"
            >
              <a href={`/user/product/detail/${item.slug}`}>
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
              </a>
            </div>
          ))}

          {products.length === 0 && (
            <p className="text-gray-500 text-sm col-span-full">
              Chưa có sản phẩm nào trong danh mục này.
            </p>
          )}
        </div>

        {/* ✅ Pagination Controls (always visible) */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className={`px-4 py-2 rounded-md border ${
              page === 1
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            &lt; Trang trước
          </button>

          <span className="text-sm font-medium">
            Trang <span className="font-semibold">{page}</span>
          </span>

          <button
            onClick={handleNext}
            disabled={!hasMore}
            className={`px-4 py-2 rounded-md border ${
              !hasMore
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            Trang tiếp &gt;
          </button>
        </div>
      </div>
    </>
  );
}
