"use client"

import { useEffect, useState } from "react"
import { Edit, Trash } from "lucide-react"
import { categoryServiceService } from "@/services/categoryservice.service"
import { CategoryService } from "@/types/CategoryService"
import TableHeader from "@/components/admin/TableHeader"
import Button from "@/components/common/Button"
import Modal from "@/components/admin/services/Modal"
import CategoryServiceForm from "./CategoryServiceForm"

export default function CategoryServiceTable() {
  const [categories, setCategories] = useState<CategoryService[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CategoryService | null>(null)

  const fetchData = async () => {
    try {
      const data = await categoryServiceService.getAll()
      setCategories(data)
    } catch (err) {
      console.error("Lỗi tải danh mục:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (payload: Partial<CategoryService>) => {
    try {
      if (editing) {
        payload.slug = payload.name!.toLowerCase().replace(/\s+/g, "-")
        await categoryServiceService.update(editing._id, payload)
      } else {
        payload.slug = payload.name!.toLowerCase().replace(/\s+/g, "-")
        await categoryServiceService.create(payload)
      }
      setModalOpen(false)
      fetchData()
    } catch (err) {
      alert("Không thể lưu danh mục!")
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa danh mục này?")) {
      await categoryServiceService.delete(id)
      fetchData()
    }
  }

  if (loading) return <p className="p-4">Đang tải dữ liệu...</p>

  return (
    <div className="bg-white shadow rounded p-4">
      <TableHeader
        title="Quản lý danh mục dịch vụ"
        breadcrumb={["Admin", "Danh mục dịch vụ"]}
        actions={
          <Button variant="primary" onClick={() => { setEditing(null); setModalOpen(true) }}>
            + Thêm danh mục
          </Button>
        }
      />

      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Tên danh mục</th>
            <th className="p-2">Mô tả</th>
            <th className="p-2">Trạng thái</th>
            <th className="p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(c => (
            <tr key={c._id} className="border-b hover:bg-gray-50">
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.description}</td>
              <td className="p-2">{c.status}</td>
              <td className="p-2 flex gap-2">
                <Edit className="w-4 h-4 text-yellow-600 cursor-pointer" onClick={() => { setEditing(c); setModalOpen(true) }} />
                <Trash className="w-4 h-4 text-red-600 cursor-pointer" onClick={() => handleDelete(c._id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Sửa danh mục" : "Thêm danh mục"}
      >
        <CategoryServiceForm
          initialData={editing || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  )
}
