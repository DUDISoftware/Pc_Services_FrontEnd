"use client";

import { User, ChevronDown } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="flex justify-end items-center p-4 bg-white border-b">
      {/* User avatar + dropdown */}
      <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded">
        <User className="w-6 h-6 text-gray-700" />
        <span className="font-medium">Quốc Hưng</span>
        <ChevronDown className="w-4 h-4 text-gray-600" />
      </div>
    </header>
  );
}
