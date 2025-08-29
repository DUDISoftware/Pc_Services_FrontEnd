"use client";

import { useParams } from "next/navigation";
import ProductHeader from "../components/ProductHeader";

import ProductBreadcrumb from "./components/ProductBreadcrumb";
import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";
import ProductDescription from "./components/ProductDescription";
import ProductSpecs from "./components/ProductSpecs";
import ProductReviewSection from "./components/ProductReviewSection";

import Product1 from "@/assets/image/product/product1.jpg";
import Product2 from "@/assets/image/product/product2.jpg";
import Product3 from "@/assets/image/product/product3.png";
import Product4 from "@/assets/image/product/product4.png";
import ProductSample from "./components/ProductSample";

const products = [
  {
    id: "1",
    title: "Màn Hình Gaming LG UltraGear 45GS95QE-B ...",
    oldPrice: 39000000,
    price: 31499999,
    discount: "20%",
    rating: 4.53,
    reviews: 436,
    img: Product1.src, // <-- Use .src for string URL
    gallery: [Product1.src, Product2.src, Product3.src, Product4.src, Product1.src], // <-- Use .src for each
    category: "Màn hình",
    brand: "LG",
    model: "24MR400-B",
    size: "23.8 inch",
    resolution: "Full HD (1920x1080)",
    panel: "IPS",
    ports: "D-Sub, HDMI, Headphone Out",
    description: `Màn hình LG 24MR400-B có kích thước 23.8 inch...`,
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-gray-500">Sản phẩm không tồn tại.</p>
      </div>
    );
  }

  return (
    <>
      <ProductBreadcrumb category={product.category} />
      <ProductHeader selectedCategory={product.category} onSelectCategory={() => {}} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <ProductGallery product={product} />
          <ProductInfo product={product} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-12">
          <ProductDescription description={product.description} />
          <ProductSpecs product={product} />
        </div>

        <ProductReviewSection />
        <ProductSample/>
      </div>
    </>
  );
}