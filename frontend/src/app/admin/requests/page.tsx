"use client";

import { useState, useEffect } from "react";
import TableHeader from "@/components/admin/TableHeader";
import RequestBoard from "@/components/admin/requests/RequestBoard";
import Button from "@/components/common/Button";
import { seachRequests } from "@/services/search.service";
import { Request } from "@/types/Request";

export default function RequestsPage() {
  const [query, setQuery] = useState(""); // ✅ từ input
  const [requests, setRequests] = useState<Request[]>([]); // ✅ từ API
  const [loading, setLoading] = useState(false);

  // ✅ Gọi API khi query thay đổi (có debounce)
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!query.trim()) {
        setRequests([]); // hoặc giữ nguyên nếu muốn
        return;
      }

      try {
        setLoading(true);
        const data = await seachRequests(query);
        setRequests(data);
      } catch (err) {
        console.error("❌ Lỗi khi tìm kiếm:", err);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    }, 400); // ⏱ debounce 400ms

    return () => clearTimeout(timeout); // cleanup
  }, [query]);

  return (
    <div className="p-6 flex-1">
      {/* Header */}
      <TableHeader
        title="Quản lý yêu cầu khách hàng"
        breadcrumb={["Admin", "Yêu cầu"]}
        actions={<Button variant="secondary">Bộ lọc</Button>}
      />

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm yêu cầu khách hàng"
          className="border rounded px-3 py-2 w-1/3"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Loading indicator */}
      {loading && <p className="text-sm text-gray-500">Đang tìm kiếm...</p>}

      {/* Board */}
      <RequestBoard requests={requests} />
    </div>
  );
}
