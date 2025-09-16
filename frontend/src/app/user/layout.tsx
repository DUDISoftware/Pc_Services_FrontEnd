// src/app/(user)/layout.tsx
"use client";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Phone } from "lucide-react"; // icon từ lucide-react
import Image from "next/image";
import Zalo from "@/assets/image/icons8-zalo.svg";
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          href="https://zalo.me/0123456789"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-blue-500  rounded-full shadow-lg hover:bg-blue-600 transition z-50 flex items-center justify-center"
        >
          <div className="w-14 h-14 relative">
            <Image src={Zalo} alt="Zalo" fill className="object-contain" />
          </div>
        </a>
      </div>
    </div>
  );
}
