"use client"

import { useEffect, useState } from "react"
import { CategoryService } from "@/types/CategoryService"
import { showConfirmToast } from "@/components/common/ConfirmToast"
import { toast } from "react-toastify"

interface Props {
  initialData?: Partial<CategoryService>
  onSubmit: (data: Partial<CategoryService>) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export default function CategoryServiceForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: Props) {
  const [form, setForm] = useState<Partial<CategoryService>>({
    name: "",
    description: "",
    status: "active",
  })

  const [initial, setInitial] = useState(JSON.stringify(form))

  useEffect(() => {
    if (initialData) {
      setForm(initialData)
      setInitial(JSON.stringify(initialData))
    }
  }, [initialData])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCancel = async () => {
    const current = JSON.stringify(form)
    if (current !== initial) {
      const confirmed = await showConfirmToast({
        message: "Bạn có chắc muốn hủy? Dữ liệu chưa lưu sẽ bị mất.",
        confirmText: "Hủy bỏ",
        cancelText: "Tiếp tục chỉnh sửa",
      })
      if (!confirmed) return
    }
    onCancel()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name?.trim()) {
      toast.error("Tên danh mục không được để trống.")
      return
    }

    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        name="name"
        placeholder="Tên danh mục"
        value={form.name}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        disabled={isSubmitting}
      />

      <textarea
        name="description"
        placeholder="Mô tả"
        value={form.description}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        disabled={isSubmitting}
      />

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        disabled={isSubmitting}
      >
        <option value="active">Đã mở</option>
        <option value="inactive">Tạm ngừng</option>
        <option value="hidden">Đã ẩn</option>
      </select>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border rounded"
          disabled={isSubmitting}
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </button>
      </div>
    </form>
  )
}
