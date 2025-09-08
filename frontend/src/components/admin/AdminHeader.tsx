"use client";

import { useState } from "react";
import { User, ChevronDown, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace("/auth/login");
  };

  const handleProfile = () => {
    router.push("/admin/profile"); // hoặc "/profile" tuỳ bạn muốn
  };

  return (
    <header className="flex justify-end items-center p-4 bg-white border-b relative">
      {/* User avatar + dropdown */}
      <div
        className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded"
        onClick={() => setOpen(!open)}
      >
        <User className="w-6 h-6 text-gray-700" />
        <span className="font-medium">{user?.username || "Unknown User"}</span>
        <ChevronDown className="w-4 h-4 text-gray-600" />
      </div>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute top-14 right-4 w-48 bg-white border rounded shadow-lg z-50">
          <button
            onClick={handleProfile}
            className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            <Settings className="w-4 h-4" />
            <span>Chỉnh sửa thông tin</span>
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
