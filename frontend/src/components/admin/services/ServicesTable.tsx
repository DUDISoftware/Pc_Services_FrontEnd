"use client";

import { useEffect, useState } from "react";
import { Edit, Trash, Eye } from "lucide-react";
import TableHeader from "../TableHeader";
import Button from "@/components/common/Button";
import { serviceService } from "@/services/service.service";
import { categoryServiceService } from "@/services/categoryservice.service";
import { Service } from "@/types/Service";
import { CategoryService } from "@/types/CategoryService";
import Modal from "@/components/admin/services/Modal";
import ServiceForm from "@/components/admin/services/ServiceForm";

export default function ServicesTable() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<CategoryService[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const fetchServices = async () => {
    try {
      const data = await serviceService.getAll();
      setServices(data);
    } catch (error) {
      console.error("Lỗi khi tải dịch vụ:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryServiceService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    }
  };

  useEffect(() => {
    Promise.all([fetchServices(), fetchCategories()]).finally(() =>
      setLoading(false)
    );
  }, []);

  const handleAdd = () => {
    setEditingService(null);
    setModalOpen(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa dịch vụ này?")) {
      await serviceService.delete(id);
      fetchServices();
    }
  };

  const handleSubmit = async (data: Partial<Service> & { category_id: string }) => {
    try {
      if (editingService) {
        await serviceService.update(editingService._id, data);
      } else {
        await serviceService.create(data);
      }
      setModalOpen(false);
      fetchServices();
    } catch (err) {
      console.error("Lỗi khi lưu dịch vụ:", err);
      alert("Không thể lưu dịch vụ, vui lòng kiểm tra dữ liệu nhập!");
    }
  };
   //excel export
    const handleExport = async () => {
      try {
        const res = await serviceService.exportServicesToExcel();
        const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'services.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Export failed', error);
      }
    };
  

  if (loading) return <p className="p-4">Đang tải dữ liệu...</p>;

  return (
    <div className="bg-white shadow rounded p-4">
      <TableHeader
        title="Quản lý dịch vụ sửa chữa"
        breadcrumb={["Admin", "Dịch vụ"]}
        actions={
          <>
            <Button variant="secondary" onClick={handleExport}>📤 Xuất file</Button>
            <Button variant="primary" onClick={handleAdd}>
              + Thêm dịch vụ
            </Button>
          </>
        }
      />

      {/* Table cho màn hình lớn */}
      <table className="w-full text-left border-collapse hidden lg:table mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2"><input type="checkbox" /></th>
            <th className="p-2">Tên dịch vụ</th>
            <th className="p-2">Mô tả</th>
            <th className="p-2">Giá</th>
            <th className="p-2">Danh mục</th>
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
                {typeof s.category_id === "string"
                  ? "Chưa có"
                  : s.category_id?.name || "Chưa có"}
              </td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  s.status === "active"
                    ? "bg-green-100 text-green-600"
                    : s.status === "inactive"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                }`}>
                  {s.status === "active"
                    ? "Đã mở"
                    : s.status === "inactive"
                      ? "Tạm ngừng"
                      : "Đã ẩn"}
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

      {/* Dạng dọc cho màn hình nhỏ */}
      <div className="lg:hidden space-y-4 mt-4">
        {services.map((s) => (
          <div key={s._id} className="border rounded p-4 shadow-sm">
            <p><strong>Tên:</strong> {s.name}</p>
            <p><strong>Mô tả:</strong> {s.description}</p>
            <p><strong>Giá:</strong> {s.price.toLocaleString()} đ</p>
            <p><strong>Danh mục:</strong> {typeof s.category_id === "string" ? "Chưa có" : s.category_id?.name}</p>
            <p className="flex items-center gap-2">
              <strong>Trạng thái:</strong>
              <span className={`px-2 py-1 rounded text-sm ${
                s.status === "active"
                  ? "bg-green-100 text-green-600"
                  : s.status === "inactive"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-600"
              }`}>
                {s.status === "active"
                  ? "Đã mở"
                  : s.status === "inactive"
                    ? "Tạm ngừng"
                    : "Đã ẩn"}
              </span>
            </p>
            <div className="flex gap-4 pt-2">
              <Eye className="w-4 h-4 cursor-pointer text-blue-600" />
              <Edit className="w-4 h-4 cursor-pointer text-yellow-600" onClick={() => handleEdit(s)} />
              <Trash className="w-4 h-4 cursor-pointer text-red-600" onClick={() => handleDelete(s._id)} />
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingService ? "Sửa dịch vụ" : "Thêm dịch vụ"}
      >
        <ServiceForm
          initialData={editingService || undefined}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
