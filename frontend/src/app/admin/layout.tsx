"use client";
import AdminSidebar from "@/components/admin/AdminSideBar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminFooter from "@/components/admin/AdminFooter";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar cố định */}
      <AdminSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Header chung */}
        <AdminHeader />

        {/* Nội dung riêng từng page */}
        <main className="flex-1 p-6">
          {children}
        </main>

        {/* Footer chung */}
        <AdminFooter />
      </div>
    </div>
  );
}
