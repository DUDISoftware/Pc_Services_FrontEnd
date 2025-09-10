"use client";

import { useEffect, useState } from "react";
import { Edit, Trash, Eye } from "lucide-react";
import TableHeader from "../TableHeader";
import Button from "@/components/common/Button";
import { categoryService } from "@/services/category.service";
import { Category, CategoryApi } from "@/types/Category";
import { mapCategory } from "@/lib/mappers";

export default function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });

  // Fetch
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      const mapped: Category[] = data.categories.map(mapCategory);
      setCategories(mapped);
    } catch (err) {
      console.error("Error fetching categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Save (create or update)
  const handleSave = async () => {
    try {
      if (editing) {
        await categoryService.update(editing._id, form);
      } else {
        await categoryService.create(form);
      }
      setShowForm(false);
      setForm({ name: "", description: "" });
      setEditing(null);
      fetchCategories();
    } catch (err) {
      console.error("Error saving category", err);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      await categoryService.delete(id);
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category", err);
    }
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <TableHeader
        title="Quản lý danh mục"
        breadcrumb={["Admin", "Danh mục"]}
        actions={
          <>
            <Button variant="secondary">📤 Xuất file</Button>
            <Button
              variant="primary"
              onClick={() => {
                setEditing(null);
                setForm({ name: "", description: "" });
                setShowForm(true);
              }}
            >
              + Thêm danh mục
            </Button>
          </>
        }
      />

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Tên danh mục</th>
              <th className="p-2">Mô tả</th>
              <th className="p-2">Ngày tạo</th>
              <th className="p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.description}</td>
                <td className="p-2">
                  {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="p-2 flex gap-2">
                  <Eye className="w-4 h-4 cursor-pointer text-blue-600" />
                  <Edit
                    className="w-4 h-4 cursor-pointer text-yellow-600"
                    onClick={() => {
                      setEditing(c);
                      setForm({ name: c.name, description: c.description });
                      setShowForm(true);
                    }}
                  />
                  <Trash
                    className="w-4 h-4 cursor-pointer text-red-600"
                    onClick={() => handleDelete(c._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">
              {editing ? "Sửa danh mục" : "Thêm danh mục"}
            </h2>
            <div className="mb-3">
              <label className="block text-sm">Tên danh mục</label>
              <input
                className="w-full border p-2 rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm">Mô tả</label>
              <textarea
                className="w-full border p-2 rounded"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Hủy
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Lưu
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
