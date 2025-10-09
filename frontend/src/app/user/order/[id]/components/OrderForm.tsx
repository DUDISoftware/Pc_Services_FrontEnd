/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { toast } from "react-toastify";
import { useState } from "react";
import { User, Mail, MapPin, Phone, FileText } from "lucide-react";
import { requestService } from "@/services/request.service";
import { Cart, CartItem } from "@/types/Cart";
import { userService } from "@/services/user.service";
import { OTPModal } from "./OtpModal";
import { Items } from "@/types/Request";

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

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const handleOtpVerify = async (otp: string) => {
    try {
      const verifyResponse = await userService.verifyOTP(form.email, otp);
      return verifyResponse.status === 200;
    } catch {
      return false;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const cartItems: CartItem[] = cart.items || [];

    if (!cartItems.length) {
      toast.error("Giỏ hàng của bạn đang trống.");
      setIsSubmitting(false);
      return;
    }

    const items = cartItems.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      name: item.name,
      price: item.price,
      image: item.image,
    }));

    // Validate phone theo regex
    const phoneRegex = /^(?:\+84|84|0)[0-9]{1,9}$/;
    if (!phoneRegex.test(form.phone)) {
      toast.error("Số điện thoại không hợp lệ. Vui lòng nhập theo định dạng +84xxxx hoặc 0xxxx.");
      setIsSubmitting(false);
      return;
    }

    // Nếu có email thì yêu cầu xác thực OTP
    if (form.email && form.email.trim() !== "") {
      try {
        await userService.sendOTP(form.email);
        setShowOtpModal(true);
        setIsSubmitting(false);
        return;

      } catch (err) {
        console.error("Không thể gửi OTP:", err);
        toast.error("Không thể gửi mã OTP đến email. Vui lòng thử lại.");
        setIsSubmitting(false);
        return;
      }
      // toast.success("Email đã được xác thực thành công ✅");
    }

    // Nếu tới đây tức là OTP ok hoặc không cần OTP
    try {
      await requestService.createOrder({
        ...form,
        items: items as {
          name: string;
          product_id: string;
          quantity: number;
          price: number;
          image: string;
        }[] as any,
      });

      setIsPopupOpen(true);

      // Reset giỏ hàng
      const emptyCart: Cart = {
        _id: "",
        items: [],
        totalPrice: 0,
        updated_at: new Date().toISOString(),
      };
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cart_updated"));
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
      toast.error("Không thể đặt hàng. Vui lòng thử lại.");
    }
    setIsSubmitting(false);
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
          required={false}
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

      {showOtpModal && (
        <OTPModal
          email={form.email}
          onVerify={handleOtpVerify}
          onClose={() => setShowOtpModal(false)}
          onSuccess={async () => {
            setShowOtpModal(false);
            try {
              const cartItems: CartItem[] = cart.items || [];
              const items = cartItems.map((item) => ({
                name: item.name,
                product_id: {
                  _id: item.product_id,
                  name: item.name,
                  price: item.price,
                },
                quantity: item.quantity,
                price: item.price,
              }));

              if (form.email && form.email.trim() !== "") {
                items.forEach(i => { i.product_id = (i.product_id as any)._id; });
              }

              await requestService.createOrder({
                ...form,
                items,
              });
              toast.success("Đặt hàng thành công 🎉");
              setIsPopupOpen(true);
              // Reset giỏ hàng
              const emptyCart: Cart = {
                _id: "",
                items: [],
                totalPrice: 0,
                updated_at: new Date().toISOString(),
              };
              localStorage.removeItem("cart");
              window.dispatchEvent(new Event("cart_updated"));
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
              toast.error("Không thể đặt hàng. Vui lòng thử lại.");
            } finally {
              setIsSubmitting(false);
            }
          }}
        />
      )}



      {/* Popup modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50">
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
  required = true,
}: {
  icon: React.ReactNode;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  const isPhone = name === "phone";
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
      onKeyPress={(e) => {
        if (
        name === "phone" &&
        (!/[0-9+]/.test(e.key) || value.replace(/\D/g, "").length >= 10)
        ) {
        e.preventDefault();
        }
      }}
      inputMode={isPhone ? "numeric" : undefined}
      pattern={isPhone ? "^(\\+84|84|0)[0-9]{9,}$" : undefined}
      maxLength={isPhone ? 13 : undefined}
      />
    </div>
  );
}
