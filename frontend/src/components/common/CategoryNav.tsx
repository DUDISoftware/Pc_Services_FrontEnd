"use client";

import { useRouter } from "next/navigation";
import { categoryService } from "@/services/category.service";
import { useEffect, useState } from "react";
// import { 
//   Monitor,
//   Cpu,
//   Gpu,
//   MemoryStick,
//   HardDrive,
//   CircuitBoardIcon,
//   Box
// } from "lucide-react";

// const categories = [
//   { label: "Màn hình", icon: Monitor, slug: "Màn hình" },
//   { label: "CPU", icon: Cpu, slug: "CPU" },
//   { label: "GPU", icon: Gpu, slug: "GPU" },
//   { label: "RAM", icon: MemoryStick, slug: "RAM" },
//   { label: "SSD", icon: HardDrive, slug: "SSD" },
//   { label: "MainBoard", icon: CircuitBoardIcon, slug: "MainBoard" },
//   { label: "Vỏ CASE", icon: Box, slug: "Vỏ Case" },
// ];

interface CategoryItem {
  name: string;
  slug: string;
  id: string;
}

interface Props {
  selectedCategory?: string;
  onSelectCategory?: (cat: string) => void; // optional
}

export default function CategoryNav({ selectedCategory, onSelectCategory }: Props) {
  const router = useRouter();

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAll(1, 20);
        setCategories(res.categories.map(cat => ({
          name: cat.name,
          slug: cat.slug,
          id: cat._id
        })));
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleClick = (cat: typeof categories[number]) => {
    if (onSelectCategory) {
      onSelectCategory(cat.name);
    } else {
      // 🔥 sửa path đúng với route thật
      router.push(`/user/product?category=${encodeURIComponent(cat.slug)}`);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto flex justify-between px-4 py-3 overflow-x-auto gap-6 text-center">
        {categories.map((c, i) => (
          <div
            key={i}
            className={`flex flex-col items-center gap-1 cursor-pointer min-w-[60px]
              ${selectedCategory === c.name ? "text-blue-600 font-medium" : "hover:text-blue-600"}`}
            onClick={() => handleClick(c)}
          >
            {/* <c.image size={28} /> */}
            <span className="text-xs">{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
