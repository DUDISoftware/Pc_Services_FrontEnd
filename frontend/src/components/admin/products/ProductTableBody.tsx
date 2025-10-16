import React from "react";
import { Edit, Trash, Eye } from "lucide-react";
import { Product } from "@/types/Product";
import { Discount } from "@/types/Discount";


export interface ProductTableBodyProps {
  products: Product[];
  loading?: boolean;              // cho phép không truyền
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  totalCols?: number;   
  discounts: Record<string, Discount | null>; // 👈 thêm
          // số cột để colSpan (mặc định 8)

}

const currency = new Intl.NumberFormat("vi-VN");

export default function ProductTableBody({
  products,
  loading = false,
  onEdit,
  onDelete,
  totalCols = 8,
  discounts
}: ProductTableBodyProps) {
  if (loading) {
    // hàng loading gọn — có thể thay bằng skeleton nếu muốn
    return (
      <tbody>
        <tr>
          <td colSpan={totalCols} className="p-4 text-center">
            Đang tải...
          </td>
        </tr>
      </tbody>
    );
  }

  if (!products || products.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={totalCols} className="p-6 text-center text-gray-500">
            Không có sản phẩm nào.
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {products.map((p) => (
        <React.Fragment key={p._id}>
          {/* Desktop row */}
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
            {/* <td className="p-2">{p.description}</td> */}
            <td className="p-2">{currency.format(p.price)} đ</td>
            <td className="p-2">
              {discounts?.[p._id]?.sale_off
                ? `${discounts[p._id]!.sale_off}%`
                : "—"}
            </td>
            <td className="p-2">
              {discounts?.[p._id]?.sale_off
                ? `${(p.price - (p.price * discounts[p._id]!.sale_off) / 100).toLocaleString()} đ`
                : `${p.price.toLocaleString()} đ`}
            </td>
            <td className="p-2">
              {typeof p.category_id === "object" ? p.category_id.name : p.category_id}
            </td>
            <td className="p-2">{p.quantity}</td>
            <td className="p-2">
              <span
                className={`px-2 py-1 rounded text-sm ${
                  p.status === "available"
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
              <Eye
                className="w-4 h-4 cursor-pointer text-blue-600"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    const w = window.open(`/user/product/detail/${p.slug}`, "_blank");
                    if (!w) alert("Trình duyệt đã chặn popup!");
                  }
                }}
              />
              <Edit className="w-4 h-4 cursor-pointer text-yellow-600" onClick={() => onEdit(p)} />
              <Trash className="w-4 h-4 cursor-pointer text-red-600" onClick={() => onDelete(p._id)} />
            </td>
          </tr>

          {/* Mobile row */}
          <tr className="lg:hidden">
            <td colSpan={totalCols} className="py-4 px-2 border-b">
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
                  <p><span className="font-semibold">Tên:</span> {p.name}</p>
                  <p><span className="font-semibold">Mô tả:</span> {p.description}</p>
                  <p><span className="font-semibold">Giá:</span> {currency.format(p.price)} đ</p>
                  <p>
                    <span className="font-semibold">Giảm giá:</span>{" "}
                    {discounts?.[p._id]?.sale_off
                      ? `${discounts[p._id]!.sale_off}%`
                      : "—"}
                  </p>

                  <p>
                    <span className="font-semibold">Danh mục:</span>{" "}
                    {typeof p.category_id === "object" ? p.category_id.name : p.category_id}
                  </p>
                  <p><span className="font-semibold">Số lượng:</span> {p.quantity}</p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold">Trạng thái:</span>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        p.status === "available"
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
                    <Eye
                      className="w-4 h-4 cursor-pointer text-blue-600"
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          const w = window.open(`/user/product/detail/${p.slug}`, "_blank");
                          if (!w) alert("Trình duyệt đã chặn popup!");
                        }
                      }}
                    />
                    <Edit className="w-4 h-4 cursor-pointer text-yellow-600" onClick={() => onEdit(p)} />
                    <Trash className="w-4 h-4 cursor-pointer text-red-600" onClick={() => onDelete(p._id)} />
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </React.Fragment>
      ))}
    </tbody>
  );
}
