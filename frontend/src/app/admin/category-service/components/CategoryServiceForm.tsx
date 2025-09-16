"use client"

import { useState, useEffect } from "react"
import { CategoryService } from "@/types/CategoryService"

interface Props {
  initialData?: Partial<CategoryService>
  onSubmit: (data: Partial<CategoryService>) => void
  onCancel: () => void
}

export default function CategoryServiceForm({ initialData, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<Partial<CategoryService>>({
    name: "",
    description: "",
    status: "active",
  })

  useEffect(() => {
    if (initialData) setForm(initialData)
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
      />
      <textarea
        name="description"
        placeholder="Mô tả"
        value={form.description}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <select name="status" value={form.status} onChange={handleChange} className="w-full border p-2 rounded">
        <option value="active">Đã mở</option>
        <option value="inactive">Tạm ngừng</option>
        <option value="hidden">Đã ẩn</option>
      </select>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Hủy</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Lưu</button>
      </div>
    </form>
  )
}
