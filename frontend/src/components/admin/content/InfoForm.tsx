// components/static-content/InfoForm.tsx
"use client";

export default function InfoForm() {
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

      {/* Sứ mệnh */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Sứ mệnh
        </label>
        <textarea
          placeholder="Sứ mệnh của bạn là"
          rows={3}
          className="w-full rounded-md border border-gray-200 bg-gray-100 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tầm nhìn */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Tầm nhìn
        </label>
        <textarea
          placeholder="Tầm nhìn"
          rows={3}
          className="w-full rounded-md border border-gray-200 bg-gray-100 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
