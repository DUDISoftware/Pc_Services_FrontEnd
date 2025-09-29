"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import { Request } from "@/types/Request";
import { requestService } from "@/services/request.service";
import { serviceService } from "@/services/service.service";
import RequestDetailModal from "./RequestDetailModal";
import RequestEditModal from "./RequestEditModal";

interface RequestCardProps {
  req: Request;
  services: { _id: string; name: string }[];
  onDeleted?: () => void;
}

export default function RequestCard({ req, services, onDeleted }: RequestCardProps) {
  const [openMenu, setOpenMenu] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [servicePrice, setServicePrice] = useState<number | null>(null);

  const getServiceNameById = (id?: string): string => {
    if (!id) return "Không rõ dịch vụ";
    return services.find((s) => s._id === id)?.name ?? "Đơn đặt hàng";
  };

  // 🔒 Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔄 Lấy giá dịch vụ nếu là yêu cầu sửa chữa (và service_id là string)
  useEffect(() => {
    const fetchServicePrice = async () => {
      if (req.service_id && typeof req.service_id === "string") {
        try {
          const service = await serviceService.getById(req.service_id);
          setServicePrice(service.price || 0);
        } catch (error) {
          console.error("❌ Không lấy được giá dịch vụ:", error);
        }
      }
    };

    fetchServicePrice();
  }, [req.service_id]);

  return (
    <>
      {/* Modal chi tiết */}
      <RequestDetailModal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        request={req}
      />

      {/* Modal cập nhật */}
      <RequestEditModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        request={req}
        onSuccess={onDeleted}
      />

      <div className="bg-white shadow rounded-lg p-4 mb-4 relative">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">
              {req.service_id ? "🔧 Yêu cầu sửa chữa" : "📦 Đơn đặt hàng"}
            </h3>

            {/* Nếu là sửa chữa thì hiện tên dịch vụ */}
            {req.service_id && (
              <p className="text-sm text-gray-500">
                📌 {getServiceNameById(typeof req.service_id === "string" ? req.service_id : req.service_id?._id)}
              </p>
            )}
          </div>

          <div className="relative" ref={menuRef}>
            <button onClick={() => setOpenMenu((prev) => !prev)}>
              <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />
            </button>

            {openMenu && (
              <div className="absolute right-0 z-10 mt-2 w-40 bg-white border rounded shadow-lg py-1 text-sm text-gray-700">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setShowDetail(true);
                    setOpenMenu(false);
                  }}
                >
                  🔍 Xem chi tiết
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setShowEdit(true);
                    setOpenMenu(false);
                  }}
                >
                  ✏️ Cập nhật
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  onClick={async () => {
                    setOpenMenu(false);
                    try {
                      if (req.service_id) {
                        await requestService.deleteRepair(req._id);
                      } else {
                        await requestService.hideOrder(req._id);
                      }
                      onDeleted?.(); // ✅ callback reload danh sách
                    } catch (err) {
                      console.error("❌ Lỗi khi xóa:", err);
                      alert("Xóa thất bại");
                    }
                  }}
                >
                  🗑 Xóa
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="text-sm text-gray-600 space-y-1 mb-3">
          {req.name && <p>👤 {req.name}</p>}
          {req.phone && <p>📞 {req.phone}</p>}
          {req.address && <p>📍 {req.address}</p>}

          {req.items && req.items.length > 0 && (
            <ul className="list-disc list-inside mt-1">
              {req.items.map((item, i) => (
                <li key={i}>
                  {typeof item.product_id === "object"
                    ? `${item.product_id.name}: ${item.quantity} x ${item.product_id.price}₫`
                    : `${item.name}: ${item.quantity} x ${item.price}₫`}
                </li>
              ))}
            </ul>
          )}

          {/* Tổng tiền */}
          <div className="text-xs text-gray-700 mt-1 font-semibold">
            💰 Tổng tiền:{" "}
            {req.service_id
              ? `${(
                  typeof req.service_id === "object"
                    ? req.service_id.price
                    : servicePrice || 0
                ).toLocaleString()}₫`
              : `${req.items?.reduce(
                  (sum, item) =>
                    sum +
                    (item.quantity || 0) *
                      (typeof item.product_id === "object"
                        ? item.product_id.price || 0
                        : item.price || 0),
                  0
                ).toLocaleString()}₫`}
          </div>

          <div className="text-xs text-gray-400 mt-2">
            📅 Ngày: {req.updatedAt}
          </div>
        </div>
      </div>
    </>
  );
}
