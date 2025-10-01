"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { bannerService } from "@/services/banner.service";

export default function BannerForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");

  // chỉ chọn ảnh + preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreview(url);
  };

  // submit toàn bộ form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Vui lòng chọn ảnh trước khi tạo banner.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("description", description || "");
      formData.append("title", title || "");
      formData.append("link", link || "#");
      formData.append("layout", "1");
      formData.append("position", "0");

      await bannerService.create(formData);
      alert("Tạo banner thành công!");

      // reset form
      setPreview(null);
      setFile(null);
      setDescription("");
      setTitle("");
      setLink("");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Có lỗi xảy ra khi tạo banner.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Tiêu đề</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border px-3 py-2"
          placeholder="Nhập tiêu đề"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Liên kết</label>
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full rounded border px-3 py-2"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Mô tả</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded border px-3 py-2"
          rows={3}
          placeholder="Mô tả banner..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Hình ảnh</label>
        <label className="flex h-28 w-28 cursor-pointer items-center justify-center rounded-md border-2 border-dashed bg-gray-50 hover:bg-gray-100 relative">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover rounded-md"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-400 text-sm">
              <Upload className="h-6 w-6 mb-1" />
              Chọn ảnh
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

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:opacity-90 transition"
        disabled={uploading}
      >
        {uploading ? "Đang tải..." : "Tạo banner"}
      </button>
    </form>
  );
}
