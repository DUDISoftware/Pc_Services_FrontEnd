"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // ✅ đọc query
import BrandScreen from "./components/BrandScreen";
import HotProduct from "./components/HotProduct";
import Products from "./components/Products";
import CategoryNav from "@/components/common/CategoryNav";

export default function UserProductPage() {
  const searchParams = useSearchParams();
  const categoryFromQuery = searchParams.get("category") || "Tất cả";

  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  // Đồng bộ state với query
  useEffect(() => {
    setSelectedCategory(categoryFromQuery);
  }, [categoryFromQuery]);

  return (
    <div>
      {/* Thanh category */}
      <CategoryNav
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Danh sách sản phẩm */}
      <Products category={selectedCategory} />

      {/* Các section khác */}
      <HotProduct />
      <BrandScreen />
    </div>
  );
}
