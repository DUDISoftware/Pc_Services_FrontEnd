"use client";

import { useState } from "react";
import { User, Mail, MapPin, Phone, FileText } from "lucide-react";
import { requestService } from "@/services/request.service";
import { Cart, CartItem } from "@/types/Cart";

interface OrderFormProps {
  cart: Cart;
  setCart: (cart: Cart) => void;
}

export default function OrderForm({ cart, setCart }: OrderFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    note: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cartItems: CartItem[] = cart.items || [];

    if (!cartItems.length) {
      alert("Giỏ hàng của bạn đang trống.");
      return;
    }

    const items = cartItems.map((item) => ({
      // name: item.name,
      product_id: item.product_id,
      quantity: item.quantity,
      // price: item.price,
    }));

    // const totalPrice = items.reduce(
    //   (sum, i) => sum + i.price * i.quantity,
    //   0
    // );

    try {
      const res = await requestService.create({
        ...form,
        items: items as { name: string; product_id: string; quantity: number; price: number }[],
      });

      alert("Đặt hàng thành công!");

      const emptyCart: Cart = {
        _id: "",
        items: [],
        totalPrice: 0,
        updated_at: new Date().toISOString(),
      };

      localStorage.removeItem("cart"); // Optional: vì setCart đã sync
      setCart(emptyCart);

      setForm({
        name: "",
        email: "",
        address: "",
        phone: "",
        note: "",
      });
    } catch (err) {
      console.error("Lỗi khi gửi đơn hàng:", err);
      alert("Không thể đặt hàng. Vui lòng thử lại.");
    }
  };

  return (
    <div className="w-full lg:w-2/3">
      <h2 className="text-2xl font-semibold mb-4">THÔNG TIN</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          icon={<User />}
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Họ và tên"
        />
        <InputField
          icon={<Mail />}
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
        />
        <InputField
          icon={<MapPin />}
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Địa chỉ"
        />
        <InputField
          icon={<Phone />}
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Số điện thoại"
        />

        <div className="relative">
          <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Ghi chú"
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-1 focus:ring-blue-600"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:opacity-90 transition"
        >
          Gửi yêu cầu
        </button>
      </form>
    </div>
  );
}

function InputField({
  icon,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  icon: React.ReactNode;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3 w-5 h-5 text-gray-400">{icon}</div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-1 focus:ring-blue-600"
        required
      />
    </div>
  );
}
