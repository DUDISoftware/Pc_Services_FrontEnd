"use client";

import { useEffect, useState, useRef } from "react";
import { Edit, Trash, Eye } from "lucide-react";
import TableHeader from "../TableHeader";
import Button from "@/components/common/Button";
import { categoryService } from "@/services/category.service";
import { Category } from "@/types/Category";
import { mapCategory } from "@/lib/mappers";
import { toast } from "react-toastify";
import { showConfirmToast } from "@/components/common/ConfirmToast";
import "react-toastify/dist/ReactToastify.css";
import { discountService } from "@/services/discount.service";


export default function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", description: "", slug: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [discountForm, setDiscountForm] = useState({
  sale_off: 0,
  start_date: "",
  end_date: "",
  });
  const [isDiscounting, setIsDiscounting] = useState(false);


  const initialFormRef = useRef({ name: "", description: "", slug: "" });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll(20, 1);
      setCategories(data.categories.map(mapCategory));
    } catch (err) {
      console.error("Error fetching categories", err);
      toast.error("Không thể tải danh mục. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // get discount   
 useEffect(() => {
  const fetchGlobalDiscount = async () => {
    try {
      const data = await discountService.getDiscountProductAll();

      if (data) {
        const discount = data.discount?.SaleOf || data;

        const formatDateTimeLocal = (dateString: string) => {
          const date = new Date(dateString);
          return date.toISOString().slice(0, 16);
        };

        setDiscountForm({
          sale_off: discount.sale_off || 0,
          start_date: formatDateTimeLocal(discount.start_date),
          end_date: formatDateTimeLocal(discount.end_date),
        });
       // toast.info("Đã tải thông tin giảm giá hiện tại!");
      } else {
       //toast.info("Chưa có giảm giá chung nào được áp dụng.");
      }
    } catch (error) {
      console.error("❌ Lỗi khi lấy giảm giá chung:", error);
      //toast.error("Không thể tải thông tin giảm giá hiện tại.");
    }
  };

  fetchGlobalDiscount();
}, []);



  const openFormForNew = () => {
    setEditing(null);
    const base = { name: "", description: "", slug: "" };
    setForm(base);
    initialFormRef.current = base;
    setShowForm(true);
  };

  const openFormForEdit = (c: Category) => {
    const base = {
      name: c.name,
      description: c.description || "",
      slug: c.name.toLowerCase().replace(/\s+/g, "-"),
    };
    setEditing(c);
    setForm(base);
    initialFormRef.current = base;
    setShowForm(true);
  };

  const isDirty = () => {
    const init = initialFormRef.current;
    return init.name !== form.name || init.description !== form.description || init.slug !== form.slug;
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (showForm && isDirty()) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [showForm, form]);

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Tên danh mục không được để trống.");
      return;
    }

    const slug = form.name.toLowerCase().trim().replace(/\s+/g, "-");
    const payload = { ...form, slug };

    const toastId = toast.loading(editing ? "Đang cập nhật danh mục..." : "Đang tạo danh mục...");
    try {
      setIsSubmitting(true);
      if (editing) {
        await categoryService.update(editing._id, payload);
        toast.update(toastId, { render: "Cập nhật thành công", type: "success", isLoading: false, autoClose: 2000 });
      } else {
        await categoryService.create(payload);
        toast.update(toastId, { render: "Tạo danh mục thành công", type: "success", isLoading: false, autoClose: 2000 });
      }
      setShowForm(false);
      setForm({ name: "", description: "", slug: "" });
      setEditing(null);
      initialFormRef.current = { name: "", description: "", slug: "" };
      await fetchCategories();
    } catch (err) {
      console.error("Error saving category", err);
      toast.update(toastId, { render: "Lỗi khi lưu danh mục", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirmToast({
      message: "Bạn có chắc muốn xóa danh mục này?",
      confirmText: "Xóa",
      cancelText: "Hủy",
    });
    if (!confirmed) {
      toast.info("Đã hủy xóa.");
      return;
    }

    const toastId = toast.loading("Đang xóa danh mục...");
    try {
      await categoryService.delete(id);
      await fetchCategories();
      toast.update(toastId, { render: "Đã xóa danh mục", type: "success", isLoading: false, autoClose: 2000 });
    } catch (err) {
      console.error("Error deleting category", err);
      toast.update(toastId, { render: "Xóa thất bại", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const handleCloseForm = async () => {
    if (isDirty()) {
      const confirmed = await showConfirmToast({
        message: "Bạn đã thay đổi form nhưng chưa lưu. Rời đi sẽ mất thay đổi. Bạn có chắc?",
        confirmText: "Rời đi",
        cancelText: "Ở lại",
      });
      if (!confirmed) {
        toast.info("Tiếp tục chỉnh sửa.");
        return;
      }
    }
    setShowForm(false);
    setEditing(null);
    setForm({ name: "", description: "", slug: "" });
    initialFormRef.current = { name: "", description: "", slug: "" };
  };

  // Filter categories by name or description
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  // discount all
  const handleApplyGlobalDiscount = async () => {
   
    const start = new Date(discountForm.start_date);
    const end = new Date(discountForm.end_date);
    const today = new Date();
    const value = discountForm.sale_off;

    if( value == 0){
      const confirmed = await showConfirmToast({
        message: `Bạn có chắc xóa giảm giá chứ ?`,
        confirmText: "Áp dụng",
        cancelText: "Hủy",
      });
      if (!confirmed) return;

    }else if(value != 0){
      if ( !discountForm.start_date || !discountForm.end_date) {
        toast.error("Vui lòng nhập đầy đủ thông tin giảm giá.");
        return;
      }
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        toast.error("Ngày bắt đầu hoặc kết thúc không hợp lệ!");
        return;
      }

      if (start <= today) {
        toast.error("Ngày bắt đầu không được nhỏ hơn hôm nay!");
        return;
      }
      if (value<0) {
        toast.error("Giảm giá không được nhỏ hơn 0!");
        return;
      }

      if (end <= start) {
        toast.error("Ngày kết thúc phải sau ngày bắt đầu!");
        return;
      }
    } else{
      const confirmed = await showConfirmToast({
        message: `Áp dụng giảm giá ${discountForm.sale_off}% cho tất cả sản phẩm?`,
        confirmText: "Áp dụng",
        cancelText: "Hủy",
      });
        if (!confirmed) return;
    }

    const toastId = toast.loading("Đang áp dụng giảm giá cho tất cả sản phẩm...");
    try {
      setIsDiscounting(true);
      await discountService.createDiscountProductAll({
        sale_off: Number(discountForm.sale_off),
        start_date: new Date(discountForm.start_date), 
        end_date: new Date(discountForm.end_date),   
      });

      toast.update(toastId, {
        render: "Áp dụng giảm giá thành công!",
        type: "success",
        isLoading: false,
        autoClose: 2500,
      });
    } catch (err) {
      console.error("Error applying global discount", err);
      toast.update(toastId, {
        render: "Lỗi khi áp dụng giảm giá.",
        type: "error",
        isLoading: false,
        autoClose: 2500,
      });
    } finally {
      setIsDiscounting(false);
    }
  };


  return (
    <div className="bg-white shadow rounded p-4">
      <TableHeader
        title="Quản lý danh mục sản phẩm"
        breadcrumb={["Admin", "Danh mục sản phẩm"]}
        actions={
          <Button variant="primary" onClick={openFormForNew}>
            + Thêm danh mục
          </Button>
        }
      />

      {/* Search Box */}
      <div className="relative w-full md:w-1/2 lg:w-1/3 mb-4">
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Tìm kiếm danh mục..."
          className="border pl-10 pr-4 py-2 rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
          {/* Form giảm giá chung */}
      <div className="border p-4 rounded-lg mb-6 bg-gray-50">
        <h3 className="font-semibold text-lg mb-3">Siêu sale sản phẩm</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 items-end gap-4">
          <div>
            <label className="block text-sm mb-1">Phần trăm giảm (%)</label>
            <input
              type="number"
              className="border rounded px-2 py-1 w-full"
              placeholder="Nhập % giảm"
              value={discountForm.sale_off}
              onChange={(e) =>
                setDiscountForm({ ...discountForm, sale_off: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Ngày bắt đầu</label>
            <input
              type="datetime-local"
              className="border rounded px-2 py-1 w-full"
              value={discountForm.start_date}
              onChange={(e) =>
                setDiscountForm({ ...discountForm, start_date: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Ngày kết thúc</label>
            <input
              type="datetime-local"
              className="border rounded px-2 py-1 w-full"
              value={discountForm.end_date}
              onChange={(e) =>
                setDiscountForm({ ...discountForm, end_date: e.target.value })
              }
            />
          </div>

          <div className="flex md:justify-center">
            <Button
              variant="primary"
              onClick={handleApplyGlobalDiscount}
              disabled={isDiscounting}
              className="w-full md:w-auto mt-1"
            >
              {isDiscounting ? "Đang áp dụng..." : "Áp dụng giảm giá chung"}
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full text-left border-collapse hidden lg:table">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Tên danh mục</th>
                <th className="p-2">Mô tả</th>
                <th className="p-2">Ngày tạo</th>
                <th className="p-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((c) => (
                <tr key={c._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.description}</td>
                  <td className="p-2">{new Date(c.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td className="p-2 flex gap-2">
                    <Eye className="w-4 h-4 cursor-pointer text-blue-600" />
                    <Edit className="w-4 h-4 cursor-pointer text-yellow-600" onClick={() => openFormForEdit(c)} />
                    <Trash className="w-4 h-4 cursor-pointer text-red-600" onClick={() => handleDelete(c._id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Responsive CARD view for small & medium screens */}
          <div className="lg:hidden space-y-4 mt-4">
            {filteredCategories.map((c) => (
              <div key={c._id} className="border rounded p-4 shadow-sm flex flex-col gap-2">
                <p><span className="font-semibold">Tên:</span> {c.name}</p>
                <p><span className="font-semibold">Mô tả:</span> {c.description}</p>
                <p><span className="font-semibold">Ngày tạo:</span> {new Date(c.createdAt).toLocaleDateString("vi-VN")}</p>
                <div className="flex gap-4 pt-2">
                  <Eye className="w-4 h-4 cursor-pointer text-blue-600" />
                  <Edit className="w-4 h-4 cursor-pointer text-yellow-600" onClick={() => openFormForEdit(c)} />
                  <Trash className="w-4 h-4 cursor-pointer text-red-600" onClick={() => handleDelete(c._id)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96 relative">
            <h2 className="text-lg font-bold mb-4">{editing ? "Sửa danh mục" : "Thêm danh mục"}</h2>

            <div className="mb-3">
              <label className="block text-sm">Tên danh mục</label>
              <input
                className="w-full border p-2 rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={isSubmitting}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm">Mô tả</label>
              <textarea
                className="w-full border p-2 rounded"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={handleCloseForm} disabled={isSubmitting}>
                Hủy
              </Button>
              <Button variant="primary" onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
