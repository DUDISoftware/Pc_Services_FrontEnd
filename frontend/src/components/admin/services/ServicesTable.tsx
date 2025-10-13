"use client";

import { useEffect, useState } from "react";
import { Edit, Trash, Eye } from "lucide-react";
import TableHeader from "../TableHeader";
import Button from "@/components/common/Button";
import { serviceService } from "@/services/service.service";
import { searchServices } from "@/services/search.service";
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
  const [query, setQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.max(1, Math.ceil(services.length / itemsPerPage));
  const displayedServices = services.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth < 1024 ? 5 : 10);
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

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

  const handleSubmit = async (data: FormData & { category_id: string }) => {
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
  

  const getPaginationRange = (
    totalPages: number,
    currentPage: number,
    siblingCount = 1
  ): (number | string)[] => {
    const totalPageNumbers = siblingCount * 2 + 5;
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);
    const shouldShowLeftDots = leftSibling > 2;
    const shouldShowRightDots = rightSibling < totalPages - 2;
    const firstPage = 1;
    const lastPage = totalPages;
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const range = [...Array(3 + siblingCount * 2)].map((_, i) => i + 1);
      return [...range, "...", lastPage];
    }
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const range = [...Array(3 + siblingCount * 2)].map(
        (_, i) => totalPages - (2 + siblingCount * 2) + i
      );
      return [firstPage, "...", ...range];
    }
    if (shouldShowLeftDots && shouldShowRightDots) {
      const range = Array.from(
        { length: rightSibling - leftSibling + 1 },
        (_, i) => leftSibling + i
      );
      return [firstPage, "...", ...range, "...", lastPage];
    }
    return [];
  };

  const handleSearch = async (value: string) => {
    setQuery(value);
    setCurrentPage(1);
    if (value.trim() === "") {
      fetchServices();
    } else {
      const results = await searchServices(value);
      setServices(results);
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

      <div className="my-4">
        <input
          type="text"
          placeholder="Tìm kiếm dịch vụ..."
          className="border px-3 py-2 rounded w-full max-w-xs"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Table for desktop */}
      <table className="w-full text-left border-collapse hidden lg:table mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2"><input type="checkbox" /></th>
            <th className="p-2">Tên dịch vụ</th>
            {/* <th className="p-2">Mô tả</th> */}
            <th className="p-2">Giá gốc</th>
            <th className="p-2">Giảm giá</th>
            <th className="p-2">Giá đã giảm</th>
            <th className="p-2">Danh mục</th>
            <th className="p-2">Trạng thái</th>
            <th className="p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {displayedServices.map((s) => (
            <tr key={s._id} className="border-b hover:bg-gray-50">
              <td className="p-2"><input type="checkbox" /></td>
              <td className="p-2">{s.name}</td>
              {/* <td className="p-2">{s.description}</td> */}
              <td className="p-2">{s.price.toLocaleString()} đ</td>
              <td className="p-2">{s.discount} %</td>
              <td className="p-2">{(s.price - (s.price * s.discount / 100)).toLocaleString()} đ</td>
              <td className="p-2">
                {typeof s.category_id === "string"
                  ? "Chưa có"
                  : s.category_id?.name || "Chưa có"}
              </td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-sm ${s.status === "active"
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
                <Eye className="w-4 h-4 cursor-pointer text-blue-600"
                  onClick={() => {
                    try {
                      if (typeof window !== "undefined") {
                        const newWindow = window.open(`/user/service/detail/${s.slug}`, "_blank");
                        if (!newWindow) {
                          alert("Trình duyệt đã chặn cửa sổ mới. Vui lòng cho phép popup!");
                        }
                      }
                    } catch (err) {
                      alert("Không thể mở trang chi tiết sản phẩm.");
                    }
                  }}
                />
                <Edit className="w-4 h-4 cursor-pointer text-yellow-600" onClick={() => handleEdit(s)} />
                <Trash className="w-4 h-4 cursor-pointer text-red-600" onClick={() => handleDelete(s._id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Responsive cards for mobile */}
      <div className="lg:hidden space-y-4 mt-4">
        {displayedServices.map((s) => (
          <div key={s._id} className="border rounded p-4 shadow-sm">
            <p><strong>Tên:</strong> {s.name}</p>
            {/* <p><strong>Mô tả:</strong> {s.description}</p> */}
            <p><strong>Giá:</strong> {s.price.toLocaleString()} đ</p>
            <p><strong>Giảm giá:</strong> {s.discount} %</p>
            <p><strong>Giảm giá:</strong> {(s.price - (s.price * s.discount / 100)).toLocaleString()}</p>
            <p><strong>Danh mục:</strong> {typeof s.category_id === "string" ? "Chưa có" : s.category_id?.name}</p>
            <p className="flex items-center gap-2">
              <strong>Trạng thái:</strong>
              <span className={`px-2 py-1 rounded text-sm ${s.status === "active"
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
              <Eye className="w-4 h-4 cursor-pointer text-blue-600"
                onClick={() => {
                  try {
                    if (typeof window !== "undefined") {
                      const newWindow = window.open(`/user/service/detail/${s.slug}`, "_blank");
                      if (!newWindow) {
                        alert("Trình duyệt đã chặn cửa sổ mới. Vui lòng cho phép popup!");
                      }
                    }
                  } catch (err) {
                    alert("Không thể mở trang chi tiết sản phẩm.");
                  }
                }}
              />
              <Edit className="w-4 h-4 cursor-pointer text-yellow-600" onClick={() => handleEdit(s)} />
              <Trash className="w-4 h-4 cursor-pointer text-red-600" onClick={() => handleDelete(s._id)} />
            </div>
          </div>
        ))}
      </div>

      {/* Modal form */}
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

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-1 flex-wrap">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          &lt;
        </button>
        {getPaginationRange(totalPages, currentPage).map((page, i) => (
          <button
            key={i}
            onClick={() => typeof page === "number" && setCurrentPage(page)}
            className={`px-3 py-1 rounded ${currentPage === page
                ? "bg-blue-600 text-white"
                : "bg-blue-50 text-blue-600"
              } ${page === "..." ? "cursor-default opacity-50" : ""}`}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          &gt;
        </button>
      </div>

      <p className="text-sm text-center text-gray-500 mt-2">
        Hiển thị {(currentPage - 1) * itemsPerPage + 1}
        -
        {Math.min(currentPage * itemsPerPage, services.length)}
        {" "}trong {services.length} dịch vụ
      </p>
    </div>
  );
}