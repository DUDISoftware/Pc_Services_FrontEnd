"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { MoreHorizontal } from "lucide-react";

interface Request {
  id: string;
  customer: string;
  description: string;
  date: string;
}

interface Column {
  id: string;
  title: string;
  requests: Request[];
}

const initialData: Column[] = [
  {
    id: "new",
    title: "🆕 Mới",
    requests: [
      {
        id: "1",
        customer: "Nguyễn Văn A",
        description: "Máy tính không lên nguồn",
        date: "2025-09-01",
      },
      {
        id: "2",
        customer: "Trần Thị B",
        description: "Cài đặt Windows 11 + Office",
        date: "2025-08-31",
      },
    ],
  },
  {
    id: "inprogress",
    title: "⚙️ Đang xử lý",
    requests: [
      {
        id: "3",
        customer: "Lê Văn C",
        description: "Thay RAM 16GB",
        date: "2025-08-30",
      },
    ],
  },
  {
    id: "done",
    title: "✅ Hoàn thành",
    requests: [
      {
        id: "4",
        customer: "Phạm Thị D",
        description: "Vệ sinh laptop",
        date: "2025-08-29",
      },
    ],
  },
];

export default function RequestBoard() {
  const [columns, setColumns] = useState<Column[]>(initialData);

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
                            className={`p-4 border rounded-lg shadow-sm bg-gray-50 transition ${
                              snapshot.isDragging
                                ? "bg-blue-100 border-blue-400"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {req.customer}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {req.description}
                                </p>
                              </div>
                              <button className="text-gray-500 hover:text-gray-700">
                                <MoreHorizontal size={18} />
                              </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                              Ngày: {req.date}
                            </p>
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
