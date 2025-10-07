/* eslint-disable @next/next/no-img-element */
import Modal from "@/components/common/Model";
import { Request } from "@/types/Request";
import { serviceService } from "@/services/service.service";
import { requestService } from "@/services/request.service";
import { useEffect, useState } from "react";

interface RequestEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: Request | null;
  onSuccess?: () => void;
}

export default function RequestEditModal({
  isOpen,
  onClose,
  request,
  onSuccess,
}: RequestEditModalProps) {
  const [services, setServices] = useState<{ _id: string; name: string }[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "new" as Request["status"],
    problem_description: "",
    service_id: "",
  });

  useEffect(() => {
    const fetchServices = async () => {
      const res = await serviceService.getAll();
      setServices(res);
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (request) {
      setForm({
        name: request.name || "",
        email: request.email || "",
        phone: request.phone || "",
        address: request.address || "",
        status: request.status || "new",
        problem_description: request.problem_description || "",
        service_id: typeof request.service_id === "string"
          ? request.service_id
          : request.service_id?._id || "",
      });
    }
  }, [request]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!request) return;

      if (request.service_id) {
        await requestService.updateRepair(request._id, form);
      } else {
        const { name, email, phone, address, status } = form;
        await requestService.updateOrder(request._id, { name, email, phone, address, status });
      }

      alert("Cập nhật thành công ✅");
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error("❌ Lỗi cập nhật:", err);
      alert("Cập nhật thất bại");
    }
  };

  if (!request) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">✏️ Cập nhật yêu cầu</h2>

      <div className="space-y-3 text-sm">
        <input className="w-full border p-2 rounded" name="name" value={form.name} onChange={handleChange} placeholder="Tên" />
        <input className="w-full border p-2 rounded" name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        <input className="w-full border p-2 rounded" name="phone" value={form.phone} onChange={handleChange} placeholder="SĐT" />
        <input className="w-full border p-2 rounded" name="address" value={form.address} onChange={handleChange} placeholder="Địa chỉ" />

        {request.service_id && (
          <>
            <select
              name="service_id"
              value={form.service_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">-- Chọn dịch vụ --</option>
              {services.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>

            <textarea
              name="problem_description"
              value={form.problem_description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Mô tả vấn đề"
              rows={3}
            />
          </>
        )}

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="new">🆕 Mới</option>
          <option value="in_progress">⚙️ Đang xử lý</option>
          <option value="completed">✅ Hoàn thành</option>
          <option value="cancelled">❌ Đã hủy</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
        >
          Lưu thay đổi
        </button>
      </div>
    </Modal>
  );
}
