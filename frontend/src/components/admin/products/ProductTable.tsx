"use client";

import { Edit, Trash, Eye } from "lucide-react";
import TableHeader from "../TableHeader";
import Button from "@/components/common/Button";

const products = [
  { id: 1, name: "Màn hình LG", desc: "Là một màn hình c", price: 39000000, category: "Màn hình", qty: 50, status: "còn hàng" },
  { id: 2, name: "Màn hình LG", desc: "Là một màn hình c", price: 39000000, category: "Màn hình", qty: 50, status: "ngừng bán" },
  { id: 3, name: "Màn hình LG", desc: "Là một màn hình c", price: 39000000, category: "Màn hình", qty: 50, status: "hết hàng" },
];

export default function ProductTable() {
  return (
    <div className="bg-white shadow rounded p-4">
      {/* Header */}
      <TableHeader
        title="Quản lý sản phẩm"
        breadcrumb={["Admin", "Sản phẩm"]}
        actions={
          <>
            <Button variant="secondary">📤 Xuất file</Button>
            <Button variant="primary">+ Thêm sản phẩm</Button>
          </>
        }
      />

      {/* Search + Filter */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm"
          className="border rounded px-3 py-2 w-1/3"
        />
        <Button variant="secondary">Bộ lọc</Button>
      </div>

      {/* Table */}
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2"><input type="checkbox" /></th>
            <th className="p-2">Sản phẩm</th>
            <th className="p-2">Mô tả</th>
            <th className="p-2">Giá</th>
            <th className="p-2">Danh mục</th>
            <th className="p-2">Số lượng</th>
            <th className="p-2">Trạng thái</th>
            <th className="p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="p-2"><input type="checkbox" /></td>
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.desc}</td>
              <td className="p-2">{p.price.toLocaleString()} đ</td>
              <td className="p-2">{p.category}</td>
              <td className="p-2">{p.qty}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    p.status === "còn hàng"
                      ? "bg-green-100 text-green-600"
                      : p.status === "hết hàng"
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {p.status}
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
