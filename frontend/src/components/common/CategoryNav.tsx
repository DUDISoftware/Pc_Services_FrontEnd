"use client";

import { Cpu, HardDrive, Monitor, MemoryStick, HardDriveIcon, Box, Percent } from "lucide-react";

const categories = [
  { label: "CPU", icon: Cpu },
  { label: "VGA", icon: HardDrive },
  { label: "Mainboard", icon: Monitor },
  { label: "RAM", icon: MemoryStick },
  { label: "SSD", icon: HardDriveIcon },
  { label: "Vỏ CASE", icon: Box },
  { label: "Giảm giá", icon: Percent },
];

export default function CategoryNav() {
  return (
   <div className="border-t border-gray-200 bg-gray-50">

      <div className="max-w-7xl mx-auto flex justify-between px-4 py-3 overflow-x-auto gap-6 text-center">
        {categories.map((c, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-600 min-w-[60px]"
          >
            <c.icon size={28} />
            <span className="text-xs">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
