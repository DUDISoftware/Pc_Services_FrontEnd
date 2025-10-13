/* eslint-disable prefer-const */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { Edit, Trash, Eye, X } from "lucide-react";
import TableHeader from "../TableHeader";
import Button from "@/components/common/Button";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import { Product, UploadedImage } from "@/types/Product";

type Category = {
  _id: string;
  name: string;
};

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<{
    name?: string;
    slug?: string;
    tags?: string[];
    ports?: string[];
    panel?: string;
    resolution?: string;
    size?: string;
    model?: string;
    description?: string;
    price?: number;
    discount?: number;
    quantity?: number;
    status?: "available" | "out_of_stock" | "hidden";
    brand?: string;
    category_id?: string;
    images?: (File | UploadedImage)[];
  }>({ images: [], status: "available" });


  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, products.length);
  const displayedProducts = products.slice(startItem - 1, endItem);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth < 1024 ? 5 : 10);
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const fetchProducts = async () => {
    try {
      let page = 1;
      const limit = 10;
      let allProducts: Product[] = [];
      while (true) {
        const data = await productService.getAll(limit, page);
        if (data.products.length === 0) break;
        allProducts = [...allProducts, ...data.products];
        if (data.products.length < limit) break;
        page++;
      }
      setProducts(allProducts);
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll(100, 1);
      setCategories(data.categories);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  const getPaginationRange = (totalPages: number, currentPage: number, siblingCount = 1): (number | string)[] => {
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
      return [...range, '...', lastPage];
    }
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const range = [...Array(3 + siblingCount * 2)].map((_, i) => totalPages - (2 + siblingCount * 2) + i);
      return [firstPage, '...', ...range];
    }
    if (shouldShowLeftDots && shouldShowRightDots) {
      const range = Array.from({ length: rightSibling - leftSibling + 1 }, (_, i) => leftSibling + i);
      return [firstPage, '...', ...range, '...', lastPage];
    }
    return [];
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        await productService.delete(id);
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category_id) {
      alert("Vui lòng chọn danh mục!");
      return;
    }
    const payload = {
      name: formData.name ?? "",
      slug: formData.slug ?? "",
      tags: formData.tags ?? [],
      ports: formData.ports ?? [],
      panel: formData.panel ?? "",
      resolution: formData.resolution ?? "",
      size: formData.size ?? "",
      model: formData.model ?? "",
      description: formData.description ?? "",
      price: formData.price ?? 0,
      discount: formData.discount ?? 0,
      quantity: formData.quantity ?? 0,
      status: formData.status ?? "available",
      brand: formData.brand ?? "",
      category_id: formData.category_id,
      images: formData.images ?? [],
    };

    try {
      if (editingProduct) {
        const updated = await productService.update(editingProduct._id, payload);
        setProducts((prev) =>
          prev.map((p) => (p._id === updated._id ? updated : p))
        );
      } else {
        console.log("Creating product with payload:", payload);
        const created = await productService.create(payload);
        setProducts((prev) => [...prev, created]);
      }
      setShowForm(false);
      setEditingProduct(null);
      setFormData({ images: [], status: "available" });
    } catch (err) {
      console.error("Save failed", err);
    }
  };
  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      tags: product.tags,
      ports: product.ports,
      panel: product.panel,
      resolution: product.resolution,
      size: product.size,
      model: product.model,
      description: product.description,
      price: product.price,
      discount: product.discount,
      quantity: product.quantity,
      status: product.status,
      brand: product.brand,
     category_id:
  typeof product.category_id === "object" && product.category_id !== null
    ? (product.category_id as { _id: string })._id
    : (product.category_id as string),

      images: product.images,
    });
    setShowForm(true);
  };
  const openAddForm = () => {
    setEditingProduct(null);
    setFormData({ images: [], status: "available" });
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);

    setFormData((prev) => {
      const current = prev.images || [];
      if (current.length + newFiles.length > 3) {
        alert("Chỉ được phép upload tối đa 3 ảnh!");
        return { ...prev, images: current.slice(0, 3) };
      }
      return { ...prev, images: [...current, ...newFiles].slice(0, 3) };
    });
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
    }));
  };


  return (
    <div className="bg-white shadow rounded p-4">
      <TableHeader
        title="Quản lý sản phẩm"
        breadcrumb={["Admin", "Sản phẩm"]}
        actions={
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 gap-2 w-full sm:w-auto">
            <Button className="h-10 px-4 text-sm w-full sm:w-auto" variant="secondary">📤 Xuất file</Button>
            <Button className="h-10 px-4 text-sm w-full sm:w-auto" variant="primary" onClick={() => setShowForm(true)}>+ Thêm sản phẩm</Button>
          </div>
        }
      />

      <div className="my-4">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="border px-3 py-2 rounded w-full max-w-xs"
          onChange={async (e) => {
        const value = e.target.value;
        setLoading(true);
        if (value.trim() === "") {
          await fetchProducts();
        } else {
          try {
            const searchResults = await searchProducts(value, 100, currentPage);
            setCurrentPage(1);
            setProducts(searchResults);
          } catch (err) {
            setProducts([]);
          } finally {
            setLoading(false);
          }
        }
          }}
          onKeyDown={async (e) => {
        if (e.key === "Enter") {
          const value = (e.target as HTMLInputElement).value;
          setLoading(true);
          if (value.trim() === "") {
            await fetchProducts();
          } else {
            try {
          const searchResults = await searchProducts(value, 100, currentPage);
          setCurrentPage(1);
          setProducts(searchResults);
            } catch (err) {
          setProducts([]);
            } finally {
          setLoading(false);
            }
          }
        }
          }}
        />
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="w-full text-left border-collapse mt-4">
          <thead className="bg-gray-100 hidden lg:table-header-group">
            <tr>
              <th className="p-2">Hình ảnh</th>
              <th className="p-2">Sản phẩm</th>
              <th className="p-2">Giá gốc</th>
              <th className="p-2">Giảm giá</th>
              <th className="p-2">Giá đã giảm</th>
              <th className="p-2">Danh mục</th>
              <th className="p-2">Số lượng</th>
              <th className="p-2">Trạng thái</th>
              <th className="p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {displayedProducts.map((p) => (
              <React.Fragment key={p._id}>
                <tr className="border-b hover:bg-gray-50 hidden lg:table-row">
                  <td className="p-2">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0].url}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                        No Img
                      </div>
                    )}
                  </td>
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.price.toLocaleString()} đ</td>
                  <td className="p-2">{p.discount} %</td>
                   <td className="p-2">{(p.price - (p.price * p.discount / 100)).toLocaleString()} đ</td>
                  <td className="p-2">
                    {typeof p.category_id === "object" ? p.category_id.name : p.category_id}
                  </td>
                  <td className="p-2">{p.quantity}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${p.status === "available"
                        ? "bg-green-100 text-green-600"
                        : p.status === "out_of_stock"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {p.status === "available"
                        ? "Còn hàng"
                        : p.status === "out_of_stock"
                          ? "Hết hàng"
                          : "Ẩn"}
                    </span>
                  </td>
                  <td className="p-2 flex gap-2">
                    <Eye className="w-4 h-4 cursor-pointer text-blue-600" 
                      onClick={() => {
                        try {
                          if (typeof window !== "undefined") {
                            const newWindow = window.open(`/user/product/detail/${p.slug}`, "_blank");
                            if (!newWindow) {
                              alert("Trình duyệt đã chặn cửa sổ mới. Vui lòng cho phép popup!");
                            }
                          }
                        } catch (err) {
                          alert("Không thể mở trang chi tiết sản phẩm.");
                        }
                      }}
                    />
                    <Edit
                      className="w-4 h-4 cursor-pointer text-yellow-600"
                      onClick={() => openEditForm(p)}
                    />
                    <Trash
                      className="w-4 h-4 cursor-pointer text-red-600"
                      onClick={() => handleDelete(p._id)}
                    />
                  </td>
                </tr>
                <tr className="lg:hidden">
                  <td colSpan={8} className="py-4 px-2 border-b">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 flex-shrink-0">
                        {p.images?.[0] ? (
                          <img
                            src={p.images[0].url}
                            alt={p.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                            No Img
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-1 text-sm break-words">
                        <p>
                          <span className="font-semibold">Tên:</span> {p.name}
                        </p>
                        <p>
                          <span className="font-semibold">Mô tả:</span> {p.description}
                        </p>
                        <p>
                          <span className="font-semibold">Giá:</span> {p.price.toLocaleString()} đ
                        </p>
                        <p>
                          <span className="font-semibold">Danh mục:</span>{" "}
                          {typeof p.category_id === "object" ? p.category_id.name : p.category_id}
                        </p>
                        <p>
                          <span className="font-semibold">Số lượng:</span> {p.quantity}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">Trạng thái:</span>
                          <span
                            className={`px-2 py-1 rounded text-sm ${p.status === "available"
                              ? "bg-green-100 text-green-600"
                              : p.status === "out_of_stock"
                                ? "bg-red-100 text-red-600"
                                : "bg-gray-100 text-gray-600"
                              }`}
                          >
                            {p.status === "available"
                              ? "Còn hàng"
                              : p.status === "out_of_stock"
                                ? "Hết hàng"
                                : "Ẩn"}
                          </span>
                        </p>
                        <div className="flex gap-4 pt-2">
                          <Eye className="w-4 h-4 cursor-pointer text-blue-600"
                            onClick={() => {
                              try {
                                if (typeof window !== "undefined") {
                                  const newWindow = window.open(`/user/product/detail/${p.slug}`, "_blank");
                                  if (!newWindow) {
                                    alert("Trình duyệt đã chặn cửa sổ mới. Vui lòng cho phép popup!");
                                  }
                                }
                              } catch (err) {
                                alert("Không thể mở trang chi tiết sản phẩm.");
                              }
                            }}
                          />
                          <Edit
                            className="w-4 h-4 cursor-pointer text-yellow-600"
                            onClick={() => openEditForm(p)}
                          />
                          <Trash
                            className="w-4 h-4 cursor-pointer text-red-600"
                            onClick={() => handleDelete(p._id)}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            onClick={() => setShowForm(false)} 
            >
              <div
                className="bg-white p-6 rounded shadow w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()} 
              >
            <h2 className="text-lg font-semibold mb-4">
              {editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Tên sản phẩm"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Slug (URL friendly)"
                value={formData.slug || ""}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Tags (cách nhau bởi dấu ,)"
                value={formData.tags?.join(", ") || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Cổng kết nối (cách nhau bởi dấu ,)"
                value={formData.ports?.join(", ") || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ports: e.target.value.split(",").map((p) => p.trim()).filter(Boolean),
                  })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Panel"
                  value={formData.panel || ""}
                  onChange={(e) => setFormData({ ...formData, panel: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Độ phân giảiiii"
                  value={formData.resolution || ""}
                  onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Kích thước"
                  value={formData.size || ""}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Model"
                  value={formData.model || ""}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <textarea
                placeholder="Mô tả"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Giá"
                  value={formData.price || ""}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full border px-3 py-2 rounded"
                  required
                  min={0}
                />
                <input
                  type="number"
                  placeholder="Số lượng"
                  value={formData.quantity || ""}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="w-full border px-3 py-2 rounded"
                  required
                  min={0}
                />

                <input
                  type="number"
                  placeholder="Discount (%)"
                  value={formData.discount || "0"}
                  onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value)  })}
                  className="w-full border px-3 py-2 rounded"
                  required
                  min={0}
                /> 
                <input
                type="text"
                placeholder="Thương hiệu"
                value={formData.brand || ""}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />

              </div>
              <select
                value={formData.category_id || ""}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
             
              <div className="flex items-center gap-4">
                <select
                  value={formData.status || "available"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "available" | "out_of_stock" | "hidden",
                    })
                  }
                  className="border px-3 py-2 rounded"
                >
                  <option value="available">Còn hàng</option>
                  <option value="out_of_stock">Hết hàng</option>
                  <option value="hidden">Ẩn</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Hình ảnh (tối đa 3)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                  disabled={(formData.images?.length || 0) >= 3}
                />
                <div className="flex flex-wrap gap-3 mt-3">
                  {formData.images &&
                    formData.images.map((img, index) => {
                      const url =
                        img instanceof File ? URL.createObjectURL(img) : img.url;
                      return (
                        <div
                          key={index}
                          className="relative w-24 h-24 border rounded overflow-hidden"
                        >
                          <img
                            src={url}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>
                  Hủy
                </Button>
                <Button variant="primary" type="submit">
                  {editingProduct ? "Cập nhật" : "Thêm"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="mt-4 flex justify-between items-center flex-wrap gap-4">
        <p className="text-sm text-gray-600">
          Hiển thị {startItem}-{endItem} từ {products.length}
        </p>

        <div className="flex items-center gap-1 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-blue-50 text-blue-600 disabled:opacity-50"
          >
            &lt;
          </button>

          {getPaginationRange(totalPages, currentPage).map((page, i) => (
            <button
              key={i}
              onClick={() => typeof page === 'number' && setCurrentPage(page)}
              disabled={page === '...'}
              className={`px-3 py-1 rounded ${currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-600'
                } ${page === '...' ? 'cursor-default opacity-50' : ''}`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-blue-50 text-blue-600 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
