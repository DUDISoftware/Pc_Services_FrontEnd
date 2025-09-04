// components/static-content/FooterForm.tsx
"use client";

import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaFileUpload } from "react-icons/fa";

export default function FooterForm() {
  return (
    <form className="space-y-6">
      {/* Thông tin liên hệ */}
      <h3 className="text-sm font-semibold text-gray-700">
        THÔNG TIN LIÊN HỆ
      </h3>

      {/* Số điện thoại */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Số điện thoại
        </label>
        <input
          type="text"
          placeholder="Nhập Số điện thoại"
          className="w-full rounded-md border border-gray-200 bg-gray-100 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Email
        </label>
        <input
          type="email"
          placeholder="Nhập Email"
          className="w-full rounded-md border border-gray-200 bg-gray-100 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Địa chỉ */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Địa chỉ
        </label>
        <input
          type="text"
          placeholder="Nhập địa chỉ"
          className="w-full rounded-md border border-gray-200 bg-gray-100 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Social media */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center border rounded-md bg-gray-50 px-3">
          <FaFacebook className="text-blue-600 mr-2" />
          <input
            type="text"
            placeholder="Username"
            className="w-full bg-transparent p-2 text-sm focus:outline-none"
          />
        </div>
        <div className="flex items-center border rounded-md bg-gray-50 px-3">
          <FaInstagram className="text-pink-500 mr-2" />
          <input
            type="text"
            placeholder="Username"
            className="w-full bg-transparent p-2 text-sm focus:outline-none"
          />
        </div>
        <div className="flex items-center border rounded-md bg-gray-50 px-3">
          <FaTwitter className="text-sky-500 mr-2" />
          <input
            type="text"
            placeholder="Username"
            className="w-full bg-transparent p-2 text-sm focus:outline-none"
          />
        </div>
        <div className="flex items-center border rounded-md bg-gray-50 px-3">
          <FaYoutube className="text-red-500 mr-2" />
          <input
            type="text"
            placeholder="Username"
            className="w-full bg-transparent p-2 text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Upload files */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Cập nhật Điều khoản sử dụng
          </label>
          <div className="flex items-center justify-center border-2 border-dashed rounded-md p-4 cursor-pointer text-gray-500 hover:bg-gray-50">
            <FaFileUpload className="mr-2" />
            <span>Tải tệp lên</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Cập nhật chính sách
          </label>
          <div className="flex items-center justify-center border-2 border-dashed rounded-md p-4 cursor-pointer text-gray-500 hover:bg-gray-50">
            <FaFileUpload className="mr-2" />
            <span>Tải tệp lên</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end items-center gap-4 pt-4">
        <button
          type="button"
          className="text-gray-600 text-sm font-medium hover:underline"
        >
          Quay lại
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-5 py-2 text-white text-sm font-medium hover:bg-blue-700"
        >
          Cập nhật
        </button>
      </div>
    </form>
  );
}
