"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import Button from "@/components/common/Button";
import Template from "@/components/common/Template";
import { bannerService } from "@/services/banner.services";

export default function BannerForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // hiển thị preview
    const url = URL.createObjectURL(selected);
    setPreview(url);

    // gọi API upload
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", selected);
      formData.append("description", "This is description");
      formData.append("title", "Banner Title");
      formData.append("link", "#");
      formData.append("position", "0");

      const res = await bannerService.create(formData as any); // cast to any to bypass type issue

      if (!res) throw new Error("Upload thất bại");

      alert("Cập nhật banner thành công!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Có lỗi xảy ra khi tải lên.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Banner */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cập nhật Banner
        </label>
        <Template />
        <label className="flex h-28 w-28 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 relative">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover rounded-md"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-400 text-sm">
              <Upload className="h-6 w-6 mb-1" />
              {uploading ? "Đang tải..." : "Tải hình ảnh lên"}
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Viết mô tả cho Banner của bạn..."
          rows={4}
          className="w-full rounded-md border border-gray-200 bg-gray-100 p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
