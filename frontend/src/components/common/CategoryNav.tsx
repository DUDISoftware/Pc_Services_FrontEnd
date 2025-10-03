"use client";

import { useRouter } from "next/navigation";
import { categoryService } from "@/services/category.service";
import { useEffect, useState } from "react";

interface CategoryItem {
  name: string;
  slug: string;
  id: string;
}

interface Props {
  selectedCategory?: string;
  onSelectCategory?: (cat: string) => void;
}

export default function CategoryNav({ selectedCategory, onSelectCategory }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAll(1, 20);
        setCategories(res.categories.map((cat) => ({
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

  const handleClick = (cat: CategoryItem) => {
    if (onSelectCategory) {
      onSelectCategory(cat.name);
    }
    router.push(`/user/product?category=${encodeURIComponent(cat.slug)}`);
  };

  return (
    <div className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex gap-4 overflow-x-auto hide-scrollbar">
          {categories.map((c, i) => (
            <div
              key={i}
              className={`flex-shrink-0 flex flex-col items-center gap-1 cursor-pointer min-w-[64px]
                ${selectedCategory === c.name ? "text-blue-600 font-semibold" : "hover:text-blue-600"}`}
              onClick={() => handleClick(c)}
            >
              <span className="text-xs">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
