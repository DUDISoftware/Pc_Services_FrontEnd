/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useState } from "react";
import { X, Upload, FlagIcon } from "lucide-react";
import { Service } from "@/types/Service";
import { Request, RepairRequestPayload } from "@/types/Request";
import { requestService } from "@/services/request.service";

interface ServiceRequestModalProps {
  serviceData: Service;
  isOpen: boolean;
  onClose: () => void;
}

export default function ServiceRequestModal({serviceData, isOpen, onClose }: ServiceRequestModalProps) {
  if (!isOpen || !serviceData) return null;

  // State lưu form
  const [form, setForm] = useState({
    service_id: serviceData._id,
    name: "",
    email: "",
    phone: "",
    address: "",
    problem_description: "",
    repair_type: serviceData.type || "at_store", // Giá trị mặc định
    estimated_time: serviceData.estimated_time || "1 ngày",
    status: "new",
    images: [],
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      console.log("Service Data:", serviceData);
      console.log("Gửi yêu cầu với dữ liệu:", form);
      await requestService.create(
        {...form, service_id: serviceData._id} as RepairRequestPayload
      );
      alert("Yêu cầu đã được gửi thành công!");
      setForm({
        service_id: serviceData._id,
        name: "",
        email: "",
        phone: "",
        address: "",
        problem_description: "",
        repair_type: serviceData.type || "at_store", // Giá trị mặc định
        estimated_time: serviceData.estimated_time || "1 ngày",
        status: "new",
        images: [],
      });
      onClose();
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      alert("Gửi yêu cầu thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg relative p-6">
        {/* Flag */}
        <button onClick={onClose} className="absolute top-3 left-3 text-gray-500 hover:text-gray-800">
          <FlagIcon className="w-5 h-5" />
        </button>
        {/* Close */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold mb-4 mt-4">ĐĂNG KÝ DỊCH VỤ SỬA CHỮA</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {[
            { label: "Họ và tên", name: "name", type: "text" },
            { label: "Địa chỉ Email", name: "email", type: "email" },
            { label: "Số điện thoại", name: "phone", type: "tel" },
            { label: "Địa chỉ", name: "address", type: "text" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium mb-1">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                placeholder={`Nhập ${field.label.toLowerCase()}...`}
                required
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-1">Mô tả chi tiết</label>
            <textarea
              name="problem_description"
              value={form.problem_description}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mô tả chi tiết vấn đề..."
              rows={3}
            />
          </div>

          {/* Upload hình ảnh (chưa xử lý thực tế) */}
          <div>
            <label className="block text-sm font-medium mb-2">Hình ảnh mô tả</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-gray-50">
                <Upload className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">Tải ảnh lên</span>
              </div>
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-gray-50">
                <Upload className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">Tải ảnh lên</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
