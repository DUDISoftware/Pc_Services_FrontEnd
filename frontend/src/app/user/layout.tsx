// src/app/(user)/layout.tsx
"use client";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Phone, MessageCircle } from "lucide-react"; // icon từ lucide-react

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <div className="flex-1 relative">
        <Header />
        <main>{children}</main>
        <Footer />

        {/* 🔹 Nút gọi điện bên trái */}
        <a
          href="tel:0123456789" // thay số điện thoại
          className="fixed bottom-6 left-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition z-50"
        >
          <Phone className="w-6 h-6" />
        </a>

        {/* 🔹 Nút Zalo bên phải */}
        <a
          href="https://zalo.me/0123456789" // thay link zalo
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
}
