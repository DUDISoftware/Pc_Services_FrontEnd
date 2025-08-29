"use client";

import { useState } from "react";
import { X, Upload, FlagIcon } from "lucide-react";

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ServiceRequestModal({ isOpen, onClose }: ServiceRequestModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg relative p-6">
         <button
          onClick={onClose}
          className="absolute top-3 left-3 text-gray-500 hover:text-gray-800"
        >
          <FlagIcon className="w-5 h-5" />
        </button>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold mb-4 mt-4">ĐĂNG KÝ DỊCH VỤ SỬA CHỮA</h2>

        {/* Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Họ và tên</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập họ và tên..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập email..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Số điện thoại</label>
            <input
              type="tel"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập số điện thoại..."
              required
            />
          </div>

             <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập địa chỉ..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mô tả chi tiết</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mô tả chi tiết vấn đề..."
              rows={3}
            />
          </div>

          {/* Upload hình ảnh */}
          <div>
            <label className="block text-sm font-medium mb-2">Hình ảnh mô tả</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-gray-50">
                <Upload className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">Tải ảnh lên</span>
              </div>
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-gray-50">
                <Upload className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">Tải ảnh lên</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Gửi yêu cầu
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
