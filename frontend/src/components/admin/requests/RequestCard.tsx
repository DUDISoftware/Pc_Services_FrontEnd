import { MoreHorizontal } from "lucide-react";
import Button from "@/components/common/Button";

interface RequestCardProps {
  title: string;
  customer: string;
  phone: string;
  address: string;
  details: string[];
  status: "Chờ duyệt" | "Đang thực hiện" | "Đã xong";
}

export default function RequestCard({ title, customer, phone, address, details, status }: RequestCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <span
            className={`text-xs px-2 py-1 rounded ${
              status === "Chờ duyệt"
                ? "bg-yellow-100 text-yellow-600"
                : status === "Đang thực hiện"
                ? "bg-blue-100 text-blue-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {status}
          </span>
        </div>
        <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />
      </div>

      {/* Info */}
      <div className="text-sm text-gray-600 space-y-1 mb-3">
        <p>👤 {customer}</p>
        <p>📞 {phone}</p>
        <p>📍 {address}</p>
        <ul className="list-disc list-inside">
          {details.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      {status === "Chờ duyệt" && (
        <div className="flex gap-2">
          <Button variant="secondary">Xem chi tiết</Button>
          <Button variant="primary">Duyệt yêu cầu</Button>
        </div>
      )}

      {status === "Đang thực hiện" && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Tiến độ:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full ${
                  step <= 2 ? "bg-blue-600" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
