"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  img: string;
  title: string;
  gallery: string[];
}

export default function ProductGallery({ product }: { product: Product }) {
  return (
    <div>
      {/* Main image */}
      <div className="w-full h-96 relative border rounded-lg mb-4 flex items-center justify-center">
        <Image src={product.img} alt={product.title} fill className="object-contain" />
      </div>

      {/* Gallery */}
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 flex items-center justify-center border rounded-lg hover:bg-gray-100">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-3 overflow-x-auto">
          {product.gallery.map((img, i) => (
            <div
              key={i}
              className="w-20 h-20 border rounded-lg relative cursor-pointer hover:border-blue-500"
            >
              <Image src={img} alt={`thumb-${i}`} fill className="object-contain" />
            </div>
          ))}
        </div>
        <button className="w-8 h-8 flex items-center justify-center border rounded-lg hover:bg-gray-100">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
