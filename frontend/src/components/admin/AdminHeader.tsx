"use client";

import { useState } from "react";
import { Menu, User, ChevronDown, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AdminHeader({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace("/auth/login");
  };

  const handleProfile = () => {
    router.push("/admin/profile");
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b relative z-10">
      {/* Sidebar Toggle always visible on tablet */}
      <button
        className="flex items-center justify-center text-gray-700 lg:hidden"
        onClick={onToggleSidebar}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Placeholder to push content right */}
      <div className="flex-1" />

      {/* User Profile */}
      <div
        className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition"
        onClick={() => setOpen(!open)}
      >
        <User className="w-5 h-5 text-gray-700" />
        <ChevronDown className="w-4 h-4 text-gray-600" />
        <span className="ml-1 text-sm font-medium hidden sm:inline-block truncate max-w-[80px]">
          {user?.username || "Unknown"}
        </span>
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute top-12 right-4 w-48 bg-white border rounded shadow-md z-50">
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
    </header>
  );
}
