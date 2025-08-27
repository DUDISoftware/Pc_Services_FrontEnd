"use client";

const categories = [
  { label: "Màn hình" },
  { label: "CPU" },
  { label: "GPU" },
  { label: "RAM" },
  { label: "SSD" },
  { label: "MainBoard" },
  { label: "Vỏ Case" },
  { label: "GDA" },
  { label: "Sửa chữa" },
  { label: "Giảm giá" },
];

interface Props {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export default function ProductHeader({ selectedCategory, onSelectCategory }: Props) {
  return (
    <div className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto flex justify-between px-4 py-3 overflow-x-auto gap-6 text-center">
        {categories.map((c, i) => (
          <div
            key={i}
            className={`flex flex-col items-center gap-1 cursor-pointer min-w-[60px] 
              ${selectedCategory === c.label ? "text-blue-600 font-medium" : "hover:text-blue-600"}`}
            onClick={() => onSelectCategory(c.label)}
          >
            <span className="text-xs">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
