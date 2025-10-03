"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { productService } from "@/services/product.service";
import { Product } from "@/types/Product";

import ProductBreadcrumb from "./components/ProductBreadcrumb";
import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";
import ProductDescription from "./components/ProductDescription";
import ProductSpecs from "./components/ProductSpecs";
import ProductReviewSection from "./components/ProductReviewSection";
import ProductSample from "./components/ProductSample";
import CategoryNav from "@/components/common/CategoryNav";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getBySlug(slug as string);
        setProduct(data);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchProduct();
  }, [slug]);

  useEffect(() => {
    const countView = async () => {
      try {
        if (product && product._id) {
          await productService.countViewRedis(product._id as string);
        }
      } catch (err) {
        console.error("Lỗi khi tăng view:", err);
      }
    };
    if (slug && product) countView();
  }, [slug, product]);

  if (loading) return <p className="text-center py-10">Đang tải...</p>;
  if (!product)
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-gray-500">Sản phẩm không tồn tại.</p>
      </div>
    );

  const oldPrice = Math.round(product.price * 1.2);

  return (
    <>
      <CategoryNav
        selectedCategory={
          typeof product.category_id === "object"
            ? product.category_id.name
            : (product.category_id as string)
        }
        onSelectCategory={() => {}}
      />
      <ProductBreadcrumb
        category={
          typeof product.category_id === "object"
            ? product.category_id.name
            : (product.category_id as string)
        }
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <ProductGallery
            product={{
              img: product.images?.[0]?.url || "/images/placeholder.png",
              title: product.name,
              gallery: product.images?.map((i) => i.url) || [],
            }}
          />
          <ProductInfo
            product={{
              id: product._id,
              title: product.name,
              rating: product.rating || 4.5,
              reviews: 34,
              oldPrice,
              price: product.price,
              discount: `${Math.round(
                ((oldPrice - product.price) / oldPrice) * 100
              )}%`,
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-12">
          <ProductDescription
            description={product.description || "Chưa có mô tả."}
          />
          <ProductSpecs
            product={{
              brand: product.brand || "Đang cập nhật",
              model: product.model || "Đang cập nhật",
              size: product.size || "Đang cập nhật",
              resolution: product.resolution || "Đang cập nhật",
              panel: product.panel || "Đang cập nhật",
              ports: Array.isArray(product.ports)
                ? product.ports
                : typeof product.ports === "string"
                ? [product.ports]
                : ["Đang cập nhật"],
            }}
          />
        </div>

        <ProductReviewSection productId={product._id} />
     <ProductSample productId={product._id} />

      </div>
    </>
  );
}
