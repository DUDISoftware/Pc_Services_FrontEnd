"use client";

import Link from "next/link";
import { X, User, ChevronDown, LogOut, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLinkClick: () => void;
}

export default function AdminSidebar({ isOpen, onClose, onLinkClick }: Props) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    logout();
    router.replace("/auth/login");
  };
  const handleProfile = () => router.push("/admin/profile");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper: xác định link đang active
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const linkClass = (href: string) =>
    `block px-3 py-2 rounded transition ${
      isActive(href)
        ? "bg-blue-50 text-blue-700 font-medium"
        : "hover:bg-gray-100"
    } focus:outline-none `;

  return (
    <aside
      className={`bg-white border-r p-4 fixed top-0 left-0 h-full z-50 w-64 transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block overflow-y-auto`}
      role="navigation"
      aria-label="Admin sidebar"
    >
      {/* Mobile Close Button */}
      <div className="flex justify-between items-center md:hidden mb-4">
        <span className="font-bold text-lg">Admin</span>
        <button onClick={onClose} aria-label="Close sidebar">
          <X />
        </button>
      </div>

      <nav className="space-y-2">
        {/* Profile + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition"
            onClick={() => setOpen((p) => !p)}
          >
            <User className="w-5 h-5 text-gray-700" />
            <ChevronDown className="w-4 h-4 text-gray-600" />
            <span className="ml-1 text-sm font-medium hidden sm:inline-block truncate max-w-[100px]">
              {user?.username || "Unknown"}
            </span>
          </div>

          {open && (
            <div className="absolute left-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
              <button
                onClick={handleProfile}
                className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                <Settings className="w-4 h-4" />
                <span>Chỉnh sửa</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Links */}
        <Link
          href="/admin/accounts"
          onClick={onLinkClick}
          className={linkClass("/admin/accounts")}
          aria-current={isActive("/admin/accounts") ? "page" : undefined}
        >
          👤 Phân quyền quản lý
        </Link>

        <Link
          href="/admin/products"
          onClick={onLinkClick}
          className={linkClass("/admin/products")}
          aria-current={isActive("/admin/products") ? "page" : undefined}
        >
          📦 Sản phẩm
        </Link>

        <Link
          href="/admin/category"
          onClick={onLinkClick}
          className={linkClass("/admin/category")}
          aria-current={isActive("/admin/category") ? "page" : undefined}
        >
          📂 Danh mục sản phẩm
        </Link>

        <Link
          href="/admin/services"
          onClick={onLinkClick}
          className={linkClass("/admin/services")}
          aria-current={isActive("/admin/services") ? "page" : undefined}
        >
          🛠️ Dịch vụ
        </Link>

        <Link
          href="/admin/category-service"
          onClick={onLinkClick}
          className={linkClass("/admin/category-service")}
          aria-current={isActive("/admin/category-service") ? "page" : undefined}
        >
          📂 Danh mục dịch vụ
        </Link>

        <Link
          href="/admin/requests"
          onClick={onLinkClick}
          className={linkClass("/admin/requests")}
          aria-current={isActive("/admin/requests") ? "page" : undefined}
        >
          📋 Yêu cầu
        </Link>

        <Link
          href="/admin/content"
          onClick={onLinkClick}
          className={linkClass("/admin/content")}
          aria-current={isActive("/admin/content") ? "page" : undefined}
        >
          📰 Nội dung tĩnh
        </Link>

        <Link
          href="/admin/dashboard"
          onClick={onLinkClick}
          className={linkClass("/admin/dashboard")}
          aria-current={isActive("/admin/dashboard") ? "page" : undefined}
        >
          📊 Thống kê
        </Link>
      </nav>
    </aside>
  );
}
