"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSideBar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminFooter from "@/components/admin/AdminFooter";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false); // 🔹 responsive sidebar

  useEffect(() => {
    if (!loading && (!user || (user.role !== "admin" && user.role !== "staff"))) {
      router.replace("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) return <p className="p-6">Đang kiểm tra phiên đăng nhập...</p>;
  if (!user || (user.role !== "admin" && user.role !== "staff"))
    return <p className="p-6">Không có quyền truy cập</p>;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLinkClick={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col bg-gray-50">
        <AdminHeader onToggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 overflow-x-auto">{children}</main>
        <AdminFooter />
      </div>
    </div>
  );
}
