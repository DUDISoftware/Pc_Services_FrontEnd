"use client";

import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Request } from "@/types/Request";
import { requestService } from "@/services/request.service";
import { serviceService } from "@/services/service.service";
import RequestCard from "./RequestCard";

interface RequestPayload {
  id: string;
  customer: string;
  description: string;
  phone?: string;
  address?: string;
  email?: string;
  date: string;
  items?: { name: string; product_id: string; quantity: number; price: number }[];
  service_id?: string;
}

interface Column {
  id: string;
  title: string;
  requests: RequestPayload[];
}

export default function RequestBoard({
  requests,
  tab,
}: {
  requests: Request[];
  tab: "service" | "product";
}) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [services, setServices] = useState<{ _id: string; name: string }[]>([]);

  // Load danh sách dịch vụ (dùng cho title)
  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await serviceService.getAll();
        setServices(data);
      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách dịch vụ:", err);
      }
    };

    if (tab === "service") {
      loadServices();
    }
  }, [tab]);

  const getServiceNameById = (id?: string): string => {
    if (!id) return "Không rõ dịch vụ";
    return services.find((s) => s._id === id)?.name ?? "Đơn đặt hàng";
  };

  // Gộp request thành các column theo status
  function mapRequestsToColumns(requests: Request[]): Column[] {
    const columns: Column[] = [
      { id: "new", title: "🆕 Mới", requests: [] },
      { id: "in_progress", title: "⚙️ Đang xử lý", requests: [] },
      { id: "completed", title: "✅ Hoàn thành", requests: [] },
    ];

    for (const req of requests) {
      const col = columns.find((c) => c.id === req.status);
      if (col) {
        col.requests.push({
          id: req._id,
          customer: req.name,
          description: req.problem_description ?? req.items?.[0]?.name ?? "",
          date: new Date(req.updatedAt).toLocaleDateString("vi-VN"),
          phone: req.phone,
          address: req.address,
          email: req.email,
          items: req.items,
          service_id: req.service_id,
        });
      }
    }

    return columns;
  }

  // Load data khi đổi tab hoặc props.requests
  useEffect(() => {
    const load = async () => {
      let data: Request[] = [];

      if (requests.length > 0) {
        data = requests;
      } else {
        data =
          tab === "service"
            ? await requestService.getAllRepairs()
            : await requestService.getAllOrders();
      }

      const cols = mapRequestsToColumns(data);
      setColumns(cols);
    };

    load();
  }, [requests, tab]);

  // Drag & Drop
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const updatedColumns = [...columns];

    const sourceCol = updatedColumns.find(
      (col) => col.id === source.droppableId
    )!;
    const destCol = updatedColumns.find(
      (col) => col.id === destination.droppableId
    )!;

    const [movedRequest] = sourceCol.requests.splice(source.index, 1);
    destCol.requests.splice(destination.index, 0, movedRequest);

    setColumns(updatedColumns);

    // Gửi update trạng thái
    try {
      if (tab === "service") {
        await requestService.updateRepair(movedRequest.id, {
          status: destCol.id as Request["status"],
        });
      } else {
        await requestService.updateOrder(movedRequest.id, {
          status: destCol.id as Request["status"],
        });
      }
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", err);
      // Optional: rollback UI hoặc hiện toast lỗi
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">
        📋 Bảng quản lý yêu cầu khách hàng
      </h2>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((col) => (
            <Droppable key={col.id} droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-4 rounded-xl shadow-md bg-white transition ${
                    snapshot.isDraggingOver ? "bg-blue-50" : ""
                  }`}
                >
                  <h3 className="text-lg font-semibold mb-3">{col.title}</h3>
                  <div className="space-y-4">
                    {col.requests.map((req, index) => (
                      <Draggable key={req.id} draggableId={req.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`border rounded-lg shadow-sm bg-gray-50 p-2 transition ${
                              snapshot.isDragging
                                ? "bg-blue-100 border-blue-400"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <RequestCard
                              title={getServiceNameById(req.service_id)}
                              customer={req.customer}
                              phone={req.phone ?? ""}
                              address={req.address ?? ""}
                              details={[req.description ?? ""]}
                              date={req.date}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
