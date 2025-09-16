"use client";

import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <nav className="space-y-2">
        <Link href="/admin/products" className="block px-3 py-2 rounded hover:bg-gray-100">
          📦 Sản phẩm
        </Link>
         <Link href="/admin/category" className="block px-3 py-2 rounded hover:bg-gray-100">
          📦 Danh mục sản phẩm
        </Link>
        <Link href="/admin/services" className="block px-3 py-2 rounded hover:bg-gray-100">
          🛠️ Sửa chữa
        </Link>
         <Link href="/admin/category-service" className="block px-3 py-2 rounded hover:bg-gray-100">
          📦 Danh mục dịch vụ
        </Link>
        <Link href="/admin/requests" className="block px-3 py-2 rounded hover:bg-gray-100">
          📋 Yêu cầu
        </Link>
        <Link href="/admin/content" className="block px-3 py-2 rounded hover:bg-gray-100">
          📰 Nội dung tĩnh
        </Link>
        <Link href="/admin/dashboard" className="block px-3 py-2 rounded hover:bg-gray-100">
          📊 Thống kê
        </Link>
      </nav>
    </aside>
  );
}
