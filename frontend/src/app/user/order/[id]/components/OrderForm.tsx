"use client";

import { User, Mail, MapPin, Phone, FileText } from "lucide-react";

export default function OrderForm() {
  return (
    <div className="w-full lg:w-2/3">
      <h2 className="text-2xl font-semibold mb-4">THÔNG TIN</h2>
      <form className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Họ và tên"
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="email"
            placeholder="Email"
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Địa chỉ"
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <div className="relative">
          <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Số điện thoại"
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <div className="relative">
          <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <textarea
            placeholder="Ghi chú"
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-1 focus:ring-blue-600"
            rows={3}
          ></textarea>
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
