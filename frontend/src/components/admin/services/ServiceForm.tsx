"use client";

import { useState, useEffect } from "react";
import { Service } from "@/types/Service";
import { CategoryService } from "@/types/CategoryService";
import { serviceApi } from "@/services/service.service";

type Props = {
  initialData?: Service;
  categories: CategoryService[];
  onSubmit: (data: Partial<Service> & { category_id: string }) => void;
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
            : initialData.category_id || "",
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

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const payload = {
    ...form,
    price: Number(form.price),
    type: form.type as "at_store" | "at_home",
    status: form.status as "active" | "inactive" | "hidden",
    category_id: form.category_id,
    slug: form.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  };

  try {
    alert("Thao tác thành công!");
    onSubmit( payload);
  } catch (err) {
    console.error("Lỗi khi tạo dịch vụ:", err);
    alert("Đã xảy ra lỗi khi tạo dịch vụ");
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
