"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { bannerService } from "@/services/banner.service";
import Image from "next/image";
import { mapLayoutToApi } from "@/lib/mappers";
import type { LayoutOption } from "@/types/Banner";

export default function BannerForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [layout, setLayout] = useState<LayoutOption>("option1");
  const [slot, setSlot] = useState<number>(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const url = URL.createObjectURL(selected);
    setPreview(url);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", selected);
      formData.append("description", description || "");
      formData.append("title", title || "");
      formData.append("link", link || "#");

      // convert layout string -> number for backend validation
      const layoutNum = mapLayoutToApi(layout);
      if (layoutNum !== undefined) formData.append("layout", String(layoutNum));
      formData.append("position", String(slot));

      await bannerService.create(formData);
      alert("Tạo banner thành công!");

      setPreview(null);
      setDescription("");
      setTitle("");
      setLink("");
      setSlot(0);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Có lỗi xảy ra khi tải lên.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Tiêu đề</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border px-3 py-2"
          placeholder="Nhập tiêu đề"
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
        <label className="block text-sm font-medium mb-2">Layout</label>
        <select
          value={layout}
          onChange={(e) => setLayout(e.target.value as LayoutOption)}
          className="w-full rounded border px-3 py-2"
        >
          <option value="option1">Option 1: 1 lớn trái + 2 nhỏ phải</option>
          <option value="option2">Option 2: 1 banner lớn</option>
          <option value="option3">Option 3: 2 banner lớn (trái + phải)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Vị trí (slot)</label>
        <select
          value={slot}
          onChange={(e) => setSlot(Number(e.target.value))}
          className="w-full rounded border px-3 py-2"
        >
          <option value={0}>Gallery (chưa gắn)</option>
          <option value={1}>Slot 1</option>
          <option value={2}>Slot 2</option>
          <option value={3}>Slot 3</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Hình ảnh</label>
        <label className="flex h-28 w-28 cursor-pointer items-center justify-center rounded-md border-2 border-dashed bg-gray-50 hover:bg-gray-100 relative">
          {preview ? (
            // For preview object URLs, Next Image can't optimize — using <img> is OK,
            // but if you want to keep next/image, pass src that is allowed. Using <img> simpler:
            // <Image src={preview} alt="Preview" fill sizes="100vw" />
            // Use native img:
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className="h-full w-full object-cover rounded-md" />
          ) : (
            <div className="flex flex-col items-center text-gray-400 text-sm">
              <Upload className="h-6 w-6 mb-1" />
              {uploading ? "Đang tải..." : "Tải ảnh lên"}
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      </div>
    </div>
  );
}