"use client";

import { useState, useEffect } from "react";
import TableHeader from "@/components/admin/TableHeader";
import RequestBoard from "@/components/admin/requests/RequestBoard";
import Button from "@/components/common/Button";
import { searchRequests } from "@/services/search.service";
import { Request } from "@/types/Request";

export default function RequestsPage() {
  const [query, setQuery] = useState("");
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"service" | "product">("service");

  // Search (chỉ áp dụng cho "service")
  useEffect(() => {
    if (activeTab !== "service") return;

    const timeout = setTimeout(async () => {
      if (!query.trim()) {
        setRequests([]);
        return;
      }

      try {
        setLoading(true);
        const data = await searchRequests(query);
        setRequests(data || []);
      } catch (err) {
        console.error("❌ Lỗi khi tìm kiếm:", err);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query, activeTab]);

  // Reset khi đổi tab
  useEffect(() => {
    setQuery("");
    setRequests([]);
  }, [activeTab]);

  return (
    <div className="p-6 flex-1 w-full">
      {/* Header */}
      <TableHeader
        title="Quản lý yêu cầu khách hàng"
        breadcrumb={["Admin", "Yêu cầu"]}
        actions={<Button variant="secondary">Bộ lọc</Button>}
      />

      {/* Tabs */}
      <div className="flex space-x-4 border-b w-full max-w-full overflow-x-auto mb-4">
        <button
          className={`pb-2 px-4 font-medium ${
            activeTab === "service"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("service")}
        >
          Dịch vụ
        </button>
        <button
          className={`pb-2 px-4 font-medium ${
            activeTab === "product"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("product")}
        >
          Sản phẩm
        </button>
      </div>

      {/* Search input */}
      {activeTab === "service" && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm yêu cầu dịch vụ..."
            className="border rounded px-3 py-2 w-full max-w-md"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      )}

      {/* Loading */}
      {loading && <p className="text-sm text-gray-500">🔄 Đang tìm kiếm...</p>}

      {/* Request Board */}
      <RequestBoard
        requests={activeTab === "service" ? requests : []}
        tab={activeTab}
      />
    </div>
  );
}
