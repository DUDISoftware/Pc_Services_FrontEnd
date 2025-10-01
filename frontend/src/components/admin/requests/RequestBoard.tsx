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
import { userService } from "@/services/user.service";
import RequestCard from "./RequestCard";
import { productService } from "@/services/product.service";

interface Column {
  id: string;
  title: string;
  requests: Request[];
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
          _id: req._id,
          name: req.name,
          problem_description: req.problem_description ?? req.items?.[0]?.name ?? "",
          updatedAt: new Date(req.updatedAt).toLocaleDateString("vi-VN"),
          phone: req.phone,
          address: req.address,
          email: req.email,
          items: req.items,
          service_id: req.service_id,
          images: req.images,
          estimated_time: "",
          status: req.status,
          createdAt: req.createdAt ?? ""
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

    const [movedRequest] = sourceCol.requests.splice(source.index, 1) as [Request];
    destCol.requests.splice(destination.index, 0, movedRequest);

    setColumns(updatedColumns);

    // Gửi update trạng thái
    try {
      if (tab === "service") {
        await requestService.updateRepair(
          String(movedRequest._id),
          {
            status: destCol.id as Request["status"],
            images: movedRequest.images,
          }
        );
        if (destCol.id === "completed" && movedRequest._id) {
          // Gửi email thông báo hoàn thành
          if (movedRequest.email) {
            try {
              await userService.sendEmail(
                movedRequest.email,
                "Yêu cầu của bạn đã được hoàn thành",
                `<p>Xin chào ${movedRequest.name || "khách hàng"},</p>
                <p>Yêu cầu của bạn với mã <strong>${movedRequest._id}</strong> đã được hoàn thành. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
                <p>Trân trọng,<br/>Đội ngũ hỗ trợ</p>`
              );
            } catch (err) {
              console.error("❌ Lỗi khi gửi email hoàn thành:", err);
            }
          }
        }
      } else {
        await requestService.updateOrder(
          String(movedRequest._id),
          {
            status: destCol.id as Request["status"],
          }
        );
        if (destCol.id === "completed" && movedRequest.items) {
          // ✅ Giảm tồn kho
          for (const item of movedRequest.items) {
            if (typeof item.product_id._id === "string") {
              const prod = await productService.getById(item.product_id._id);
              const newStock = (prod.quantity || 0) - (item.quantity || 1);
              await productService.updateQuantity(item.product_id._id, newStock);
            }
          }
          // Gửi email thông báo hoàn thành
          if (movedRequest.email) {
            try {
              await userService.sendEmail(
                movedRequest.email,
                "Yêu cầu của bạn đã được hoàn thành",
                `<p>Xin chào ${movedRequest.name || "khách hàng"},</p>
                <p>Yêu cầu của bạn với mã <strong>${movedRequest._id}</strong> đã được hoàn thành. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
                <p>Trân trọng,<br/>Đội ngũ hỗ trợ</p>`
              );
            } catch (err) {
              console.error("❌ Lỗi khi gửi email hoàn thành:", err);
            }
          }
        }
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
                  className={`p-4 rounded-xl shadow-md bg-white transition ${snapshot.isDraggingOver ? "bg-blue-50" : ""
                    }`}
                >
                  <h3 className="text-lg font-semibold mb-3">{col.title}</h3>
                  <div className="space-y-4">
                    {col.requests.map((req, index) => (
                      <Draggable key={String(req._id)} draggableId={String(req._id)} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`border rounded-lg shadow-sm bg-gray-50 p-2 transition ${snapshot.isDragging
                              ? "bg-blue-100 border-blue-400"
                              : "hover:bg-gray-100"
                              }`}
                          >
                            <RequestCard
                              req={{
                                _id: String(req._id),
                                name: req.name || "Khách hàng",
                                problem_description: req.problem_description || req.note || "Không có mô tả",
                                phone: req.phone || "",
                                address: req.address || "",
                                email: req.email || "",
                                items: req.items,
                                service_id: req.service_id,
                                updatedAt: req.updatedAt,
                                createdAt: req.createdAt,
                                estimated_time: "",
                                status: col.id as Request["status"],
                                images: req.images || [],
                              }}
                              services={services}
                              onDeleted={() => {
                                // ✅ Gọi lại API để cập nhật
                                const reload = async () => {
                                  const updated = tab === "service"
                                    ? await requestService.getAllRepairs()
                                    : await requestService.getAllOrders();
                                  setColumns(mapRequestsToColumns(updated));
                                };
                                reload();
                              }}
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
