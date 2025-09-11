"use client"

import { useEffect, useState } from "react"
import { Edit, Trash, Eye } from "lucide-react"
import TableHeader from "../TableHeader"
import Button from "@/components/common/Button"
import { serviceApi } from "@/services/service.service"
import { Service } from "@/types/Service"
import Modal from "@/components/admin/services/Modal"
import ServiceForm from "@/components/admin/services/ServiceForm"

export default function ServicesTable() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const fetchServices = async () => {
    try {
      const data = await serviceApi.getAll()
      setServices(data)
    } catch (error) {
      console.error("Lỗi khi tải dịch vụ:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleAdd = () => {
    setEditingService(null)
    setModalOpen(true)
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa dịch vụ này?")) {
      await serviceApi.delete(id)
      fetchServices()
    }
  }

const handleSubmit = async (data: Partial<Service>) => {
  try {
    if (editingService) {
      await serviceApi.update(editingService._id, data) // chỉ gửi payload sạch
    } else {
      await serviceApi.create(data)
    }
    setModalOpen(false)
    fetchServices()
  } catch (err) {
    console.error("Lỗi khi lưu dịch vụ:", err)
    alert("Không thể lưu dịch vụ, vui lòng kiểm tra dữ liệu nhập!")
  }
}


  if (loading) return <p className="p-4">Đang tải dữ liệu...</p>

  return (
    <div className="bg-white shadow rounded p-4">
      {/* Header */}
      <TableHeader
        title="Quản lý dịch vụ sửa chữa"
        breadcrumb={["Admin", "Dịch vụ"]}
        actions={
          <>
            <Button variant="secondary">📤 Xuất file</Button>
            <Button variant="primary" onClick={handleAdd}>+ Thêm dịch vụ</Button>
          </>
        }
      />

      {/* Table */}
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2"><input type="checkbox" /></th>
            <th className="p-2">Tên dịch vụ</th>
            <th className="p-2">Mô tả</th>
            <th className="p-2">Giá</th>
            <th className="p-2">Trạng thái</th>
            <th className="p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s._id} className="border-b hover:bg-gray-50">
              <td className="p-2"><input type="checkbox" /></td>
              <td className="p-2">{s.name}</td>
              <td className="p-2">{s.description}</td>
              <td className="p-2">{s.price.toLocaleString()} đ</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  s.status === "active" ? "bg-green-100 text-green-600" :
                  s.status === "inactive" ? "bg-yellow-100 text-yellow-600" :
                  "bg-red-100 text-red-600"
                }`}>
                  {s.status === "active" ? "Đã mở" :
                   s.status === "inactive" ? "Tạm ngừng" : "Đã ẩn"}
                </span>
              </td>
              <td className="p-2 flex gap-2">
                <Eye className="w-4 h-4 cursor-pointer text-blue-600" />
                <Edit className="w-4 h-4 cursor-pointer text-yellow-600" onClick={() => handleEdit(s)} />
                <Trash className="w-4 h-4 cursor-pointer text-red-600" onClick={() => handleDelete(s._id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal thêm/sửa */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingService ? "Sửa dịch vụ" : "Thêm dịch vụ"}
      >
        <ServiceForm
          initialData={editingService || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  )
}
