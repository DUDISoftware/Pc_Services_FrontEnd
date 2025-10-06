"use client";

import { useEffect, useState } from "react";
import { Edit, Trash, Eye } from "lucide-react";
import TableHeader from "../TableHeader";
import Button from "@/components/common/Button";
import { categoryService } from "@/services/category.service";
import { Category } from "@/types/Category";
import { mapCategory } from "@/lib/mappers";

export default function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", description: "", slug: "" });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data.categories.map(mapCategory));
    } catch (err) {
      console.error("Error fetching categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async () => {
    try {
      form.slug = form.name.toLowerCase().replace(/\s+/g, "-");
      if (editing) {
        await categoryService.update(editing._id, form);
      } else {
        await categoryService.create(form);
      }
      setShowForm(false);
      setForm({ name: "", description: "", slug: "" });
      setEditing(null);
      fetchCategories();
    } catch (err) {
      console.error("Error saving category", err);
    }
  };

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
                setForm({ name: "", description: "", slug: "" });
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
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full text-left border-collapse hidden lg:table">
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
                        setForm({
                          name: c.name,
                          description: c.description,
                          slug: c.name.toLowerCase().replace(/\s+/g, "-"),
                        });
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

          {/* Responsive CARD view for small & medium screens */}
          <div className="lg:hidden space-y-4 mt-4">
            {categories.map((c) => (
              <div
                key={c._id}
                className="border rounded p-4 shadow-sm flex flex-col gap-2"
              >
                <p>
                  <span className="font-semibold">Tên:</span> {c.name}
                </p>
                <p>
                  <span className="font-semibold">Mô tả:</span> {c.description}
                </p>
                <p>
                  <span className="font-semibold">Ngày tạo:</span>{" "}
                  {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                </p>
                <div className="flex gap-4 pt-2">
                  <Eye className="w-4 h-4 cursor-pointer text-blue-600" />
                  <Edit
                    className="w-4 h-4 cursor-pointer text-yellow-600"
                    onClick={() => {
                      setEditing(c);
                      setForm({
                        name: c.name,
                        description: c.description,
                        slug: c.name.toLowerCase().replace(/\s+/g, "-"),
                      });
                      setShowForm(true);
                    }}
                  />
                  <Trash
                    className="w-4 h-4 cursor-pointer text-red-600"
                    onClick={() => handleDelete(c._id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
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
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
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
