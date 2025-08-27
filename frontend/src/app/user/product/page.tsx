"use client";

import { useState } from "react";
import BrandScreen from "./components/BrandScreen";
import HotProduct from "./components/HotProduct";
import ProductHeader from "./components/ProductHeader";
import Products from "./components/Products";

export default function UserProductPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  return (
    <div>
      {/* Thanh category */}
      <ProductHeader
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
