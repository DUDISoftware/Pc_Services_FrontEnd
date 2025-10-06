"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { productService } from "@/services/product.service";
import { Product } from "@/types/Product";
import CategoryNav from "@/components/common/CategoryNav";
import { categoryService } from "@/services/category.service";
import { useRouter } from "next/navigation";


export default function AllProductsPage() {
  const params = useSearchParams();
  const category = params.get("category") || "all";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category_id, setCategory_id] = useState<string | undefined>();
  const router = useRouter();



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let products: Product[] = [];

        if (category !== "all" && !category_id) return;

        if (category === "all") {
          let allProducts: Product[] = [];
          let page = 1;
          const limit = 50;
          let fetched: Product[] = [];

          do {
            const res = await productService.getAll(limit, page);
            fetched = res.products;
            allProducts = allProducts.concat(fetched);
            page++;
          } while (fetched.length !== 0);

          products = allProducts;
        } else {
          products = await productService.getByCategory(category_id!);
        }

        setProducts(products);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, category_id]);

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

  if (loading) return <p className="text-center">Đang tải sản phẩm...</p>;


  return (
    <>

      <CategoryNav
        selectedCategory={category}
        onSelectCategory={(newCategory: string) => {
          const url = new URL(window.location.href);
          url.searchParams.set("category", newCategory);
          router.push(url.toString()); // ✅ updates URL without reload
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
      </div>
    </>
  );
}