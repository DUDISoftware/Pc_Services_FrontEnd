"use client"

import { useEffect, useState } from "react"
import { Edit, Trash } from "lucide-react"
import { categoryServiceService } from "@/services/categoryservice.service"
import { CategoryService } from "@/types/CategoryService"
import TableHeader from "@/components/admin/TableHeader"
import Button from "@/components/common/Button"
import Modal from "@/components/admin/services/Modal"
import CategoryServiceForm from "./CategoryServiceForm"
import { toast } from "react-toastify"
import { showConfirmToast } from "@/components/common/ConfirmToast"
import "react-toastify/dist/ReactToastify.css"

export default function CategoryServiceTable() {
  const [categories, setCategories] = useState<CategoryService[]>([])
  const [filteredCategories, setFilteredCategories] = useState<CategoryService[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CategoryService | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchData = async () => {
    try {
      const data = await categoryServiceService.getAll()
      setCategories(data)
      setFilteredCategories(data)
    } catch (err) {
      console.error("Lỗi tải danh mục:", err)
      toast.error("Không thể tải danh mục. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      const query = searchQuery.trim().toLowerCase()
      if (!query) {
        setFilteredCategories(categories)
      } else {
        setFilteredCategories(
          categories.filter(
            (c) =>
              c.name.toLowerCase().includes(query) ||
              c.description?.toLowerCase().includes(query)
          )
        )
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [searchQuery, categories])

  const handleSubmit = async (payload: Partial<CategoryService>) => {
    try {
      if (!payload.name?.trim()) {
        toast.error("Tên danh mục không được để trống.")
        return
      }

      payload.slug = payload.name.toLowerCase().replace(/\s+/g, "-")
      setIsSubmitting(true)
      const toastId = toast.loading(editing ? "Đang cập nhật..." : "Đang thêm danh mục...")

      if (editing) {
        await categoryServiceService.update(editing._id, payload)
        toast.update(toastId, { render: "✅ Cập nhật thành công", type: "success", isLoading: false, autoClose: 2000 })
      } else {
        await categoryServiceService.create(payload)
        toast.update(toastId, { render: "✅ Thêm mới thành công", type: "success", isLoading: false, autoClose: 2000 })
      }

      setModalOpen(false)
      setEditing(null)
      fetchData()
    } catch (err) {
      console.error("Lỗi khi lưu danh mục:", err)
      toast.error("❌ Không thể lưu danh mục!")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    const confirm = await showConfirmToast({
      message: "Bạn có chắc muốn xóa danh mục này?",
      confirmText: "Xóa",
      cancelText: "Hủy"
    })
    if (!confirm) {
      toast.info("Đã hủy xóa.")
      return
    }

    const toastId = toast.loading("Đang xóa danh mục...")
    try {
      await categoryServiceService.delete(id)
      fetchData()
      toast.update(toastId, { render: "✅ Đã xóa danh mục", type: "success", isLoading: false, autoClose: 2000 })
    } catch (err) {
      console.error("Lỗi khi xóa danh mục:", err)
      toast.update(toastId, { render: "❌ Xóa thất bại", type: "error", isLoading: false, autoClose: 3000 })
    }
  }

  if (loading) return <p className="p-4">Đang tải dữ liệu...</p>

  return (
    <div className="bg-white shadow rounded p-4">
      <TableHeader
        title="Quản lý danh mục dịch vụ"
        breadcrumb={["Admin", "Danh mục dịch vụ"]}
        actions={
          <Button
            variant="primary"
            onClick={() => {
              setEditing(null)
              setModalOpen(true)
            }}
          >
            + Thêm danh mục
          </Button>
        }
      />

      <div className="my-4">
        <input
          type="text"
          className="border px-3 py-2 rounded w-full max-w-xs"
          placeholder="Tìm kiếm danh mục..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

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
          {filteredCategories.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-4 text-gray-500">
                Không có danh mục nào phù hợp.
              </td>
            </tr>
          ) : (
            filteredCategories.map((c) => (
              <tr key={c._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.description}</td>
                <td className="p-2">
                  {c.status === "active"
                    ? "Hoạt động"
                    : c.status === "inactive"
                      ? "Ngừng hoạt động"
                      : c.status === "hidden"
                        ? "Đã ẩn"
                        : c.status}
                </td>
                <td className="p-2 flex gap-2">
                  <Edit
                    className="w-4 h-4 text-yellow-600 cursor-pointer"
                    onClick={() => {
                      setEditing(c)
                      setModalOpen(true)
                    }}
                  />
                  <Trash
                    className="w-4 h-4 text-red-600 cursor-pointer"
                    onClick={() => handleDelete(c._id)}
                  />
                </td>
              </tr>
            ))
          )}
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
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  )
}
