"use client";

import { useState, useEffect } from "react";
import TableHeader from "@/components/admin/TableHeader";
import RequestBoard from "@/components/admin/requests/RequestBoard";
import Button from "@/components/common/Button";
import { seachRequests } from "@/services/search.service";
import { Request } from "@/types/Request";

export default function RequestsPage() {
  const [query, setQuery] = useState("");
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"service" | "product">("service");

  // Search chỉ áp dụng khi đang ở tab "service"
  useEffect(() => {
    //if (activeTab !== "service") return;

    const timeout = setTimeout(async () => {
      if (!query.trim()) {
        setRequests([]);
        return;
      }

      try {
        setLoading(true);
        const data = await seachRequests(query);
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

  // Reset state khi chuyển tab
  useEffect(() => {
    setQuery("");
    setRequests([]);
  }, [activeTab]);

  return (
    <div className="p-6 flex-1">
      {/* Header */}
      <TableHeader
        title="Quản lý yêu cầu khách hàng"
        breadcrumb={["Admin", "Yêu cầu"]}
        actions={<Button variant="secondary">Bộ lọc</Button>}
      />

      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b">
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

      {/* Search input (chỉ tab "service") */}
      {/* {activeTab === "service" && ( */}
      { true && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm yêu cầu dịch vụ..."
            className="border rounded px-3 py-2 w-1/3"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      )}

      {/* Loading state */}
      {loading && <p className="text-sm text-gray-500">🔄 Đang tìm kiếm...</p>}

      {/* Request board */}
      <RequestBoard requests={requests} tab={activeTab} />
    </div>
  );
}