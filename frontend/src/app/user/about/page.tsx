"use client";

import { Phone, Mail, MapPin } from "lucide-react";

export default function UserAboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Thông tin liên hệ */}
      <div className="bg-blue-600 text-white rounded-xl p-8 flex flex-col justify-between">
        <h2 className="text-xl font-semibold mb-6">THÔNG TIN LIÊN HỆ</h2>
        <p className="mb-6">Nói điều gì đó để bắt đầu trò chuyện trực tiếp!</p>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5" />
            <span>(+84) 909 163 821</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5" />
            <span>contact@diudsoftware.com</span>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 mt-1" />
            <span>
              49/2 đường số 14, phường Thủ Đức, <br /> Thành phố Hồ Chí Minh
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

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập họ và tên"
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
