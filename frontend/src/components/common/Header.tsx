"use client";

import {
  Globe,
  Heart,
  ShoppingCart,
  Search,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSearch } from "@/hooks/useSearch";
import { cartService } from "@/services/cart.service";
import { Cart } from "@/types/Cart";
import { useEffect } from "react";

export default function Header() {
  const [lang, setLang] = useState("VN");
  const [openMenu, setOpenMenu] = useState(false);
  const [active, setActive] = useState("Trang chủ"); // 🔹 menu đang active
  const [langOpen, setLangOpen] = useState(false); // 🔹 mở dropdown ngôn ngữ
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const loadCart = () => {
      const stored = localStorage.getItem("cart");
      if (stored) {
        try {
          const parsed: Cart = JSON.parse(stored);
          setCart(parsed);
          setCartCount(parsed.items.length);
        } catch (err) {
          console.error("Lỗi parse cart:", err);
        }
      }
    };

    loadCart(); // Lấy cart ban đầu

    const handleCartUpdate = () => {
      loadCart(); // reload khi có sự kiện
    };
    window.addEventListener("cart_updated", handleCartUpdate);
    return () => {
      window.removeEventListener("cart_updated", handleCartUpdate);
    };
  }, []);


  //const wishlistCount = cart?.wishlist?.length || 0;

  const links = [
    { href: "/user/home", label: "Trang chủ" },
    { href: "/user/product", label: "Sản phẩm" },
    { href: "/user/service", label: "Dịch vụ" },
    { href: "/user/about", label: "Về chúng tôi" },
  ];

  const { handleSearch, loading, error } = useSearch();
  const langs = ["EN", "VN"]; // 🔹 danh sách ngôn ngữ

  return (
    <header className="w-full shadow bg-white relative z-50 sticky top-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        {/* Menu trái (desktop) */}
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setActive(link.label)}
              className={`pb-1 transition-all ${active === link.label
                ? "font-semibold border-b-2 border-black"
                : "hover:text-dark-600"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu icon */}
        <button className="md:hidden" onClick={() => setOpenMenu(true)}>
          <Menu size={22} />
        </button>

        {/* Ô tìm kiếm */}
        <div className="bg-gray-100 flex items-center overflow-hidden w-40 sm:w-52 md:w-64 mx-3 md:mx-0">
          <input
            type="text"
            placeholder="Bạn đang tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch(searchQuery);
            }}
            className="flex-1 px-2 md:px-3 py-1 text-sm outline-none"
          />
          <button
            className="bg-gray-100 px-2 md:px-3"
            onClick={() => handleSearch(searchQuery)}
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin h-4 w-4 border-t-2 border-black rounded-full" />
            ) : (
              <Search size={18} />
            )}
          </button>
        </div>

        {/* Icon phải */}
        <div className="flex items-center gap-3 md:gap-4 relative">
          {/* Dropdown ngôn ngữ */}
          <div
            className="flex items-center gap-1 cursor-pointer relative"
            onClick={() => setLangOpen(!langOpen)}
          >
            <Globe size={18} />
            <span className="hidden sm:inline text-sm">{lang}</span>
            <ChevronDown size={16} />
          </div>

          {langOpen && (
            <div className="absolute top-10 right-20 bg-white shadow-md rounded-md border w-20 text-sm z-50">
              {langs.map((l) => (
                <div
                  key={l}
                  onClick={() => {
                    setLang(l);
                    setLangOpen(false);
                  }}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${lang === l ? "font-semibold" : ""
                    }`}
                >
                  {l}
                </div>
              ))}
            </div>
          )}

          <div className="relative cursor-pointer">
            <Heart size={20} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              2
            </span>
          </div>

          <div className="relative cursor-pointer">
            <button onClick={() => (window.location.href = "/user/cart")}>
              <ShoppingCart size={20} className="relative top-1" />
            </button>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                {cartCount}
              </span>
            )}
          </div>

        </div>
      </div>

      {/* Overlay mờ */}
      {openMenu && (
        <div
          onClick={() => setOpenMenu(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Drawer menu mobile */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 md:hidden
        ${openMenu ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <span className="font-bold text-lg">Menu</span>
          <button onClick={() => setOpenMenu(false)}>
            <X size={22} />
          </button>
        </div>

        <nav className="flex flex-col gap-4 px-4 py-6 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => {
                setActive(link.label);
                setOpenMenu(false);
              }}
              className={`${active === link.label
                ? "underline text-dark-600"
                : "hover:underline"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
