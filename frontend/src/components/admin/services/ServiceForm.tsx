"use client";

import { useState, useEffect } from "react";
import { Service } from "@/types/Service";
import { CategoryService } from "@/types/CategoryService";

type Props = {
  initialData?: Service;
  categories: CategoryService[];
  onSubmit: (data: Partial<Service> & { category: string }) => void;
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
    type: "store" as "store" | "home", // ✅ ép kiểu
    estimated_time: "",
    status: "active" as "active" | "inactive" | "hidden", // ✅ ép kiểu
    category: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || 0,
        type: (initialData.type as "store" | "home") || "store", // ✅
        estimated_time: initialData.estimated_time || "",
        status: (initialData.status as "active" | "inactive" | "hidden") || "active", // ✅
        category:
          typeof initialData.category === "string"
            ? initialData.category
            : initialData.category?._id || "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price),
      type: form.type as "store" | "home", // ✅ ép kiểu trước khi gửi
      status: form.status as "active" | "inactive" | "hidden", // ✅
      category: form.category,
    });
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
        <option value="store">Tại cửa hàng</option>
        <option value="home">Tại nhà</option>
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
        name="category"
        value={form.category}
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
