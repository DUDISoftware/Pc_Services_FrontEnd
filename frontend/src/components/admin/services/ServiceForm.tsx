/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { Service } from "@/types/Service";
import { CategoryService } from "@/types/CategoryService";
import { serviceService } from "@/services/service.service";
import { X } from "lucide-react";
import { toast } from "react-toastify";

type Props = {
  initialData?: Service;
  categories: CategoryService[];
  onSubmit: (data: FormData & { category_id: string }) => Promise<void>;
  onCancel: () => void;
};

export default function ServiceForm({
  initialData,
  categories,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    type: "at_store" as "at_store" | "at_home", // ✅ ép kiểu
    estimated_time: "",
    status: "active" as "active" | "inactive" | "hidden", // ✅ ép kiểu
    category_id: "",
    images: [] as (File | { url: string; public_id?: string })[],
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || 0,
        type: (initialData.type as "at_store" | "at_home") || "at_store", // ✅
        estimated_time: initialData.estimated_time || "",
        status: (initialData.status as "active" | "inactive" | "hidden") || "active", // ✅
        category_id:
          typeof initialData.category_id === "string"
            ? initialData.category_id
            : initialData.category_id &&
              typeof initialData.category_id === "object" &&
              "_id" in initialData.category_id
              ? (initialData.category_id as { _id: string })._id
              : "",
        images: initialData.images || [],
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);

    setForm((prev) => {
      const current = prev.images || [];
      if (current.length + newFiles.length > 3) {
        toast("Chỉ được phép upload tối đa 3 ảnh!");
        return { ...prev, images: current.slice(0, 3) };
      }
      return { ...prev, images: [...current, ...newFiles].slice(0, 3) };
    });
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const selectedCategory = categories.find(c => c._id === form.category_id);

  const isAnyNewFile = form.images.some(img => img instanceof File);

  if (isAnyNewFile) {
    // 👉 Trường hợp có ảnh mới: dùng FormData
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", String(form.price));
    formData.append("type", form.type);
    formData.append("estimated_time", form.estimated_time);
    formData.append("status", form.status);
    formData.append("slug", form.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
    );
    formData.append("category_id", form.category_id);

    form.images.forEach((img) => {
      if (img instanceof File) {
        formData.append("images", img);
      }
    });

    onSubmit(formData as FormData & { category_id: string }); // FormData path ✅
  } else {
    // 👉 Trường hợp không đổi ảnh (hoặc ảnh cũ): gửi JSON thường
    const payload = {
      ...form,
      price: Number(form.price),
      category_id: form.category_id,
      slug: form.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    };
    onSubmit(payload as any); // JSON path ✅
  }
};


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Tên dịch vụ"
        className="w-full border p-2 rounded"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Mô tả"
        className="w-full border p-2 rounded"
      />

      <input
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        placeholder="Giá"
        className="w-full border p-2 rounded"
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="at_store">Tại cửa hàng</option>
        <option value="at_home">Tại nhà</option>
      </select>

      <input
        name="estimated_time"
        value={form.estimated_time}
        onChange={handleChange}
        placeholder="Thời gian ước tính"
        className="w-full border p-2 rounded"
      />

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="active">Hoạt động</option>
        <option value="inactive">Không hoạt động</option>
        <option value="hidden">Ẩn</option>
      </select>

      {/* chọn danh mục sửa chữa */}
      <select
        name="category_id"
        value={form.category_id}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="">-- Chọn danh mục --</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      <div>
        <label className="block mb-1 font-medium">Hình ảnh (tối đa 3)</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
          disabled={(form.images?.length || 0) >= 3}
        />
        <div className="flex flex-wrap gap-3 mt-3">
          {form.images &&
            form.images.map((img, index) => {
              const url =
                img instanceof File ? URL.createObjectURL(img) : img.url;
              return (
                <div
                  key={index}
                  className="relative w-24 h-24 border rounded overflow-hidden"
                >
                  <img
                    src={url}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Lưu
        </button>
      </div>
    </form>
  );
}