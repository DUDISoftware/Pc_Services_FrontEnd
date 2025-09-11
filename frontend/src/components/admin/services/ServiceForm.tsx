"use client"

import { useState, useEffect } from "react"
import { Service } from "@/types/Service"

interface ServiceFormProps {
  initialData?: Partial<Service>
  onSubmit: (data: Partial<Service>) => void
  onCancel: () => void
}

export default function ServiceForm({ initialData, onSubmit, onCancel }: ServiceFormProps) {
  const [form, setForm] = useState<Partial<Service>>({
    name: "",
    description: "",
    price: 0,
    type: "store",
    estimated_time: "",
    status: "active",
  })

useEffect(() => {
  if (initialData) {
    setForm({
      name: initialData.name || "",
      description: initialData.description || "",
      price: initialData.price || 0,
      type: initialData.type || "store",
      estimated_time: initialData.estimated_time || "",
      status: initialData.status || "active"
    })
  }
}, [initialData])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  const payload = {
    name: form.name,
    description: form.description,
    price: Number(form.price),
    type: form.type,
    estimated_time: form.estimated_time,
    status: form.status
  }
  onSubmit(payload)
}


  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        name="name"
        placeholder="Tên dịch vụ"
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
      <input
        type="number"
        name="price"
        placeholder="Giá"
        value={form.price}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        name="estimated_time"
        placeholder="Thời gian ước tính"
        value={form.estimated_time}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <select name="status" value={form.status} onChange={handleChange} className="w-full border p-2 rounded">
        <option value="active">Đã mở</option>
        <option value="inactive">Tạm ngừng</option>
        <option value="hidden">Đã ẩn</option>
      </select>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
          Hủy
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Lưu
        </button>
      </div>
    </form>
  )
}
