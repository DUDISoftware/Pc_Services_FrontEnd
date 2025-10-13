"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { productService } from "@/services/product.service";
import { ratingService } from "@/services/rating.service";
import { serviceService } from "@/services/service.service";
import { Service } from "@/types/Service";
import ServiceCard from "@/app/user/service/components/ServiceCard";
import DefaultServiceImage from "@/assets/image/service/services.png";
import { motion, AnimatePresence } from "framer-motion";


type ProductType = {
  _id: string;
  title: string;
  oldPrice: number;
  price: number;
  discount: number;
  rating: number;
  img: string;
  slug: string;
};

export default function HomePage() {
  // ===== Discounted Products =====
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

 const bannerImages = [
    "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H2_614x212_1653d7eed1.png",
    "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H2_614x212_8_62c8d858cc.png",
    "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H2_614x212_9a92f2d875.png",
  ];

  // Auto-slide banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 2500); // 4s đổi hình
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    async function fetchDiscountedProducts() {
      try {
        const res = await productService.getAll(20, 1);
        const discountedProducts: ProductType[] = await Promise.all(
          res.products
            .filter((p) => p.discount && p.discount > 0)
            .map(async (p) => {
              const rating = (await ratingService.getScoreByProductId(p._id)) || 5.0;
              const discountPercent = p.discount;
              const newPrice = Math.round(p.price - (p.price * discountPercent) / 100);
              return {
                _id: p._id,
                title: p.name,
                oldPrice: p.price,
                price: newPrice,
                discount: discountPercent,
                rating,
                img: p.images?.[0]?.url || "/images/placeholder.png",
                slug: p.slug,
              };
            })
        );
        setProducts(discountedProducts);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm giảm giá:", err);
      } finally {
        setLoadingProducts(false);
      }
    }

    fetchDiscountedProducts();
  }, []);

  // ===== Services =====
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await serviceService.getAll();
        setServices(data);
      } catch (err) {
        console.error("Lỗi khi tải dịch vụ:", err);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  // ===== Loading =====
  if (loadingProducts || loadingServices) return <p className="px-4">Đang tải dữ liệu...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
       {/* ===== Banner slider ===== */}
      <div className="relative w-full h-52 sm:h-64 mb-10 overflow-hidden rounded-lg shadow">
        <AnimatePresence>
          {bannerImages.map(
            (src, index) =>
              index === currentSlide && (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={src}
                    alt={`banner-${index}`}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              )
          )}
        </AnimatePresence>
        {/* Nút chuyển thủ công (optional) */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {bannerImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2.5 h-2.5 rounded-full transition ${
                i === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
      {/* Discounted Products */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-6 border-b border-gray-200 pb-2">
          Các sản phẩm giảm giá
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((item) => (
            <div
              key={item._id}
              className="flex flex-col border border-gray-200 rounded-lg p-3 hover:shadow-md transition h-full relative"
            >
              <Link href={`/user/product/detail/${item.slug}`}>
                {/* Tag giảm giá */}
                {item.discount > 0 && (
                  <span className="absolute top-2 left-2 bg-[#FB5F2F] text-white text-xs px-2 py-1 rounded z-10">
                    -{item.discount}%
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
          {products.length === 0 && (
            <p className="text-gray-500 text-sm col-span-full">
              Không có sản phẩm giảm giá nào.
            </p>
          )}
        </div>
      </div>

      {/* Services with discount */}
      <div>
        <h1 className="text-2xl font-bold mb-6">Các dịch vụ giảm giá</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {services
            .filter((s) => s.discount > 0)
            .map((s) => (
              <ServiceCard
                key={s._id}
                service={{
                  id: s._id,
                  title: s.name,
                  oldPrice: s.price,
                  price: Math.round(s.price - (s.price * s.discount) / 100),
                  discount: `${s.discount}%`,
                  rating: 4.5,
                  slug: s.slug,
                  img:
                    Array.isArray(s.images) && s.images.length > 0
                      ? s.images[0].url
                      : DefaultServiceImage,
                }}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
