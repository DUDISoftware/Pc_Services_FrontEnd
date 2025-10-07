"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSideBar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || (user.role !== "admin" && user.role !== "staff"))) {
      router.replace("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) return <p className="p-6">Đang kiểm tra phiên đăng nhập...</p>;
  if (!user || (user.role !== "admin" && user.role !== "staff"))
    return <p className="p-6">Không có quyền truy cập</p>;

  return (
    <div className="flex min-h-screen min-w-[360px] sm:min-w-[640px]">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLinkClick={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col bg-gray-50">
        <AdminHeader onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 p-4 md:p-6 sm:p-6 overflow-x-auto">{children}</main>
      </div>
    </div>
  );
}
