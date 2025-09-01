"use client";
import TableHeader from "@/components/admin/TableHeader";
import RequestBoard from "@/components/admin/requests/RequestBoard";
import Button from "@/components/common/Button";

export default function RequestsPage() {
  return (
    <div className="p-6 flex-1">
      {/* Header */}
      <TableHeader
        title="Quản lý yêu cầu khách hàng"
        breadcrumb={["Admin", "Yêu cầu"]}
        actions={<Button variant="secondary">Bộ lọc</Button>}
      />

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm yêu cầu khách hàng"
          className="border rounded px-3 py-2 w-1/3"
        />
      </div>

      {/* Board */}
      <RequestBoard />
    </div>
  );
}
