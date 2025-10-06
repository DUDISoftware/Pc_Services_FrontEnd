"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import { infoService } from "@/services/info.services";
import { useEffect, useState } from "react";
import { Info } from "@/types/Info";

export default function UserAboutPage() {
  const [info, setInfo] = useState<Info | null>(null);
  const [contact, setContact] = useState({
    name: "",
    phone: "",
    message: ""
  });

  useEffect(() => {
    const fetchInfo = async () => {
      const data = await infoService.getInfo();
      setInfo(data);
    };
    fetchInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!info?.email) {
        alert("Không tìm thấy địa chỉ email liên hệ.");
        return;
      }
      await infoService.sendEmail(info.email, `Liên hệ từ khách hàng ${contact.name}`, contact.message + "\nSố điện thoại: " + contact.phone);
      alert("Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm.");
      setContact({ name: "", phone: "", message: "" });
    } catch (err) {
      console.error("Lỗi khi gửi liên hệ:", err);
      alert("Có lỗi xảy ra khi gửi liên hệ. Vui lòng thử lại.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Thông tin liên hệ */}
      <div className="bg-blue-600 text-white rounded-xl p-8 flex flex-col justify-between">
        <h2 className="text-xl font-semibold mb-6">THÔNG TIN LIÊN HỆ</h2>
        <p className="mb-6">Nói điều gì đó để bắt đầu trò chuyện trực tiếp!</p>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5" />
            <span>{info?.phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5" />
            <span>{info?.email}</span>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 mt-1" />
            <span>
              {info?.address}
            </span>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <div className="w-20 h-20 rounded-full bg-yellow-400 opacity-80"></div>
        </div>
      </div>

      {/* Form liên hệ */}
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Liên Hệ Với Chúng Tôi</h2>
        <p className="text-gray-600 mb-6">
          Hãy để lại thông tin, chúng tôi sẽ liên hệ với bạn sớm nhất
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập họ và tên"
              value={contact.name}
              onChange={(e) => setContact({ ...contact, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Số điện thoại
            </label>
            <input
              type="tel"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập số điện thoại"
              value={contact.phone}
              maxLength={11}
              pattern="\d*"
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setContact({ ...contact, phone: value });
                }
              }}
            />

          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Tin nhắn
            </label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Gửi tin nhắn cho chúng tôi"
              value={contact.message}
              onChange={(e) => setContact({ ...contact, message: e.target.value })}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
          >
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
}
