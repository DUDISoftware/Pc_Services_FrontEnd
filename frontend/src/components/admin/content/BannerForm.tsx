// components/static-content/BannerForm.tsx
"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

export default function BannerForm() {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Banner */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cập nhật Banner
        </label>
        <label className="flex h-28 w-28 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover rounded-md"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-400 text-sm">
              <Upload className="h-6 w-6 mb-1" />
              Tải hình ảnh lên
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Mô tả */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Thêm mô tả
        </label>
        <textarea
          placeholder="Viết mô tả cho Banner của bạn..."
          rows={4}
          className="w-full rounded-md border border-gray-200 bg-gray-100 p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
