"use client";

import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { MoreHorizontal } from "lucide-react";
import { Request } from "@/types/Request";
import { requestApi } from "@/services/request.service";

interface RequestPayload {
  id: string;
  customer: string;
  description: string;
  date: string;
  items?: { name: string; product_id: string; quantity: number; price: number }[];
  service_id?: string;
}

interface Column {
  id: string;
  title: string;
  requests: RequestPayload[];
}

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
      });
    }
  }

  return columns;
}

export default function RequestBoard() {
  const [columns, setColumns] = useState<Column[]>([]);

  // Fetch dữ liệu khi load trang
  useEffect(() => {
    requestApi.getAll().then((requests) => {
      const cols = mapRequestsToColumns(requests);
      setColumns(cols);
    });
  }, []);

  // Xử lý kéo thả
  const handleDragEnd = (result: DropResult) => {
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

    // 👉 Có thể gọi API update status ở đây
    requestApi.update(movedRequest.id, { status: destCol.id as Request["status"] });

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
                  className={`p-4 rounded-xl shadow-md bg-white transition ${snapshot.isDraggingOver ? "bg-blue-50" : ""
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
                            className={`p-4 border rounded-lg shadow-sm bg-gray-50 transition ${snapshot.isDragging
                                ? "bg-blue-100 border-blue-400"
                                : "hover:bg-gray-100"
                              }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-gray-800">{req.customer}</p>

                                {/* ✅ Phần xử lý hiển thị nội dung thông minh */}
                                <p className="text-sm text-gray-600">
                                  {req.description ||
                                    (req.items?.length
                                      ? req.items.map((i) => `${i.name} x${i.quantity}`).join(", ")
                                      : req.service_id
                                        ? "Yêu cầu sửa chữa"
                                        : "Không có mô tả")}
                                </p>
                              </div>

                              <button className="text-gray-500 hover:text-gray-700">
                                <MoreHorizontal size={18} />
                              </button>
                            </div>

                            <p className="text-xs text-gray-400 mt-2">Ngày: {req.date}</p>
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
