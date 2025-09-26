import { MoreHorizontal } from "lucide-react";
import Button from "@/components/common/Button";

interface RequestCardProps {
  title?: string;           // Tên dịch vụ (nếu có)
  customer: string;
  phone?: string;
  address?: string;
  details?: string[];
  date: string;
}

export default function RequestCard({
  title,
  customer,
  phone,
  address,
  details = [],
  date,
}: RequestCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          {title && (
            <h3 className="font-semibold text-gray-800 mb-1">
              📌 {title}
            </h3>
          )}
        </div>
        <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />
      </div>

      {/* Info */}
      <div className="text-sm text-gray-600 space-y-1 mb-3">
        <p>👤 {customer}</p>
        {phone && <p>📞 {phone}</p>}
        {address && <p>📍 {address}</p>}
        {details.length > 0 && (
          <ul className="list-disc list-inside mt-1">
            {details.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        )}
        <div className="text-xs text-gray-400 mt-2">📅 Ngày: {date}</div>
      </div>

      {/* Action buttons — hiện tại tạm thời ẩn */}
      {/* <div className="flex gap-2 mt-2">
        <Button variant="secondary">Xem chi tiết</Button>
        <Button variant="primary">Duyệt yêu cầu</Button>
      </div> */}
    </div>
  );
}
