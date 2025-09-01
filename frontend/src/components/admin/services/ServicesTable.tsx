"use client";

import { Edit, Trash, Eye } from "lucide-react";
import TableHeader from "../TableHeader";
import Button from "@/components/common/Button";

const services = [
  { id: 1, name: "Lắp PC", desc: "Là một màn hình chuyên game ...", price: 150000, status: "Đã mở" },
  { id: 2, name: "Thay - Nâng cấp RAM", desc: "Là một màn hình chuyên game ...", price: 150000, status: "Đã mở" },
  { id: 3, name: "Thay - Nâng cấp ổ cứng (SSD & HDD)", desc: "Là một màn hình chuyên game ...", price: 150000, status: "Đã mở" },
  { id: 4, name: "Thay linh kiện khác (GPU, CPU, ...)", desc: "Là một màn hình chuyên game ...", price: 150000, status: "Đã mở" },
  { id: 5, name: "Thay - Sửa Mainboard", desc: "Là một màn hình chuyên game ...", price: 150000, status: "Đã mở" },
  { id: 6, name: "Vệ sinh PC văn phòng", desc: "Là một màn hình chuyên game ...", price: 150000, status: "Đã mở" },
  { id: 7, name: "Vệ sinh PC lắp tản nhiệt nước (AIO)", desc: "Là một màn hình chuyên game ...", price: 150000, status: "Đã đóng" },
];

export default function ServicesTable() {
  return (
    <div className="bg-white shadow rounded p-4">
      {/* Header */}
      <TableHeader
        title="Quản lý dịch vụ sửa chữa"
        breadcrumb={["Admin", "Dịch vụ"]}
        actions={
          <>
            <Button variant="secondary">📤 Xuất file</Button>
            <Button variant="primary">+ Thêm dịch vụ</Button>
          </>
        }
      />

      {/* Search + Filter */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm dịch vụ"
          className="border rounded px-3 py-2 w-1/3"
        />
        <Button variant="secondary">Bộ lọc</Button>
      </div>

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
            <tr key={s.id} className="border-b hover:bg-gray-50">
              <td className="p-2"><input type="checkbox" /></td>
              <td className="p-2">{s.name}</td>
              <td className="p-2">{s.desc}</td>
              <td className="p-2">{s.price.toLocaleString()} đ</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    s.status === "Đã mở"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {s.status}
                </span>
              </td>
              <td className="p-2 flex gap-2">
                <Eye className="w-4 h-4 cursor-pointer text-blue-600" />
                <Edit className="w-4 h-4 cursor-pointer text-yellow-600" />
                <Trash className="w-4 h-4 cursor-pointer text-red-600" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-end gap-2 mt-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <Button key={n} variant="secondary">{n}</Button>
        ))}
      </div>
    </div>
  );
}
