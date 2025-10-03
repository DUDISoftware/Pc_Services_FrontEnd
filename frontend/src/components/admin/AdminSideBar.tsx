"use client";

import Link from "next/link";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLinkClick: () => void;
}

export default function AdminSidebar({ isOpen, onClose, onLinkClick }: Props) {
  return (
    <aside
      className={`bg-white border-r p-4 fixed top-0 left-0 h-full z-50 w-64 transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block`}
    >
      {/* Close button on mobile */}
      <div className="flex justify-between items-center md:hidden mb-4">
        <span className="font-bold text-lg">Admin</span>
        <button onClick={onClose}>
          <X />
        </button>
      </div>

      <nav className="space-y-2">
        <Link href="/admin/products" onClick={onLinkClick} className="block px-3 py-2 rounded hover:bg-gray-100">📦 Sản phẩm</Link>
        <Link href="/admin/category" onClick={onLinkClick} className="block px-3 py-2 rounded hover:bg-gray-100">📂 Danh mục sản phẩm</Link>
        <Link href="/admin/services" onClick={onLinkClick} className="block px-3 py-2 rounded hover:bg-gray-100">🛠️ Dịch vụ</Link>
        <Link href="/admin/category-service" onClick={onLinkClick} className="block px-3 py-2 rounded hover:bg-gray-100">📂 Danh mục dịch vụ</Link>
        <Link href="/admin/requests" onClick={onLinkClick} className="block px-3 py-2 rounded hover:bg-gray-100">📋 Yêu cầu</Link>
        <Link href="/admin/content" onClick={onLinkClick} className="block px-3 py-2 rounded hover:bg-gray-100">📰 Nội dung tĩnh</Link>
        <Link href="/admin/dashboard" onClick={onLinkClick} className="block px-3 py-2 rounded hover:bg-gray-100">📊 Thống kê</Link>
      </nav>
    </aside>
  );
}
