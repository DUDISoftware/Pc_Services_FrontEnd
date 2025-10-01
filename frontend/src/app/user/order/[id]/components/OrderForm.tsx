"use client";

import { useState } from "react";
import { User, Mail, MapPin, Phone, FileText } from "lucide-react";
import { requestService } from "@/services/request.service";
import { Cart, CartItem } from "@/types/Cart";
import { userService } from "@/services/user.service";

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

  const [isPopupOpen, setIsPopupOpen] = useState(false); // popup state

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
      product_id: item.product_id,
      quantity: item.quantity,
    }));

    let verified = true;
    if (form.email && form.email.trim() !== "") {
        await userService.sendOTP(form.email);

        let attempts = 0;
        let isVerified = false;

        while (attempts < 3 && !isVerified) {
          const otp = prompt(
            `Vui lòng nhập mã OTP đã gửi đến email của bạn:`
          );
          if (!otp) {
            alert("Bạn phải nhập mã OTP để tiếp tục.");
            return;
          }
          const verifyResponse = await userService.verifyOTP(form.email, otp);
          isVerified = verifyResponse.data?.success === true;
          if (!isVerified) {
            attempts++;
            if (attempts < 3) {
              alert("Mã OTP không hợp lệ, vui lòng thử lại.");
              verified = false;
            }
          } else {
            verified = true;
          }
        }

        if (!isVerified) {
          alert("Bạn đã nhập sai OTP quá 3 lần. Vui lòng thử lại sau.");
          return;
        }

        alert("Email đã được xác thực thành công.");
      }
    if (!verified) return;
    try {
      await requestService.createOrder({
        ...form,
        items: items as {
          name: string;
          product_id: string;
          quantity: number;
          price: number;
          image: string;
        }[],
      });

      // Mở popup
      setIsPopupOpen(true);

      // Reset giỏ hàng
      const emptyCart: Cart = {
        _id: "",
        items: [],
        totalPrice: 0,
        updated_at: new Date().toISOString(),
      };
      localStorage.removeItem("cart");
      setCart(emptyCart);

      // Reset form
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
          placeholder="Email (không bắt buộc)"
          type="email"
          required={false} // email optional
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

      {/* Popup modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-96 text-center">
            <h3 className="text-xl font-semibold mb-4">Đặt hàng thành công 🎉</h3>
            <p className="mb-6">
              Cảm ơn bạn! Đơn hàng của bạn đã được ghi nhận.
            </p>
            <button
              onClick={() => setIsPopupOpen(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:opacity-90 transition"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
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
  required = true, // mặc định là true
}: {
  icon: React.ReactNode;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
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
        required={required}
      />
    </div>
  );
}
