"use client";

import {
  Globe,
  ShoppingCart,
  Search,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearch } from "@/hooks/useSearch";
import { cartService } from "@/services/cart.service";
import { Cart } from "@/types/Cart";

export default function Header() {
  const [lang, setLang] = useState("VN");
  const [openMenu, setOpenMenu] = useState(false);
  const [active, setActive] = useState("Trang chủ");
  const [langOpen, setLangOpen] = useState(false);
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

    loadCart();
    const handleCartUpdate = () => loadCart();
    window.addEventListener("cart_updated", handleCartUpdate);
    window.addEventListener("storage", handleCartUpdate);
    return () => {
      window.removeEventListener("cart_updated", handleCartUpdate);
      window.removeEventListener("storage", handleCartUpdate);
    };
  }, []);

  const links = [
    { href: "/user/home", label: "Trang chủ" },
    { href: "/user/product", label: "Sản phẩm" },
    { href: "/user/service", label: "Dịch vụ" },
    { href: "/user/about", label: "Về chúng tôi" },
  ];

  const { handleSearch, loading } = useSearch();
  const langs = ["EN", "VN"];

  return (
    <header className="w-full shadow bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setOpenMenu(true)}>
            <Menu size={22} />
          </button>
        </div>

        {/* Logo */}
        <div className="text-lg font-semibold hidden sm:block">
          <Link href="/user/home">MyShop</Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setActive(link.label)}
              className={`pb-1 transition-all ${
                active === link.label
                  ? "font-semibold border-b-2 border-black"
                  : "hover:text-gray-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <div className="flex-1 mx-3 hidden sm:flex">
          <div className="bg-gray-100 flex items-center w-full rounded">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch(searchQuery);
              }}
              placeholder="Tìm kiếm..."
              className="flex-1 px-3 py-2 text-sm bg-gray-100 outline-none"
            />
            <button
              onClick={() => handleSearch(searchQuery)}
              className="px-3"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin h-4 w-4 border-t-2 border-black rounded-full" />
              ) : (
                <Search size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          {/* Lang Switch */}
          <div className="relative">
            <button
              className="flex items-center gap-1 text-sm"
              onClick={() => setLangOpen(!langOpen)}
            >
              <Globe size={18} /> {lang} <ChevronDown size={16} />
            </button>
            {langOpen && (
              <div className="absolute top-full mt-2 right-0 w-20 bg-white border rounded shadow z-50">
                {langs.map((l) => (
                  <div
                    key={l}
                    onClick={() => {
                      setLang(l);
                      setLangOpen(false);
                    }}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                      lang === l ? "font-semibold" : ""
                    }`}
                  >
                    {l}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <div className="relative">
            <button onClick={() => (window.location.href = "/user/cart")}>
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {openMenu && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="bg-black/40 absolute inset-0" onClick={() => setOpenMenu(false)} />
          <div className="w-64 bg-white absolute left-0 top-0 h-full shadow-lg z-50 p-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold">Menu</h3>
              <button onClick={() => setOpenMenu(false)}>
                <X size={22} />
              </button>
            </div>

            <nav className="flex flex-col gap-4 mt-4 text-sm">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => {
                    setActive(link.label);
                    setOpenMenu(false);
                  }}
                  className={`${
                    active === link.label
                      ? "text-blue-600 underline"
                      : "hover:underline"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search on mobile */}
            <div className="mt-6">
              <div className="bg-gray-100 flex items-center w-full rounded">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch(searchQuery);
                  }}
                  placeholder="Tìm kiếm..."
                  className="flex-1 px-3 py-2 text-sm bg-gray-100 outline-none"
                />
                <button
                  onClick={() => handleSearch(searchQuery)}
                  className="px-3"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin h-4 w-4 border-t-2 border-black rounded-full" />
                  ) : (
                    <Search size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
