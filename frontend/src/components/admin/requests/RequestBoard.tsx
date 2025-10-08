"use client";

import { useState, useEffect, use } from "react";
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
import { infoService } from "@/services/info.services";
import { Info } from "@/types/Info";

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
  const [products, setProducts] = useState<{ _id: string; name: string }[]>([]);
  const [info, setInfo] = useState<Info>({} as Info);

  useEffect(() => {
    console.log("Requests prop changed:", requests);
  }, [requests]);

  // Load thông tin cửa hàng (dùng cho email)
  useEffect(() => {
    const loadInfo = async () => {
      try {
        const data = await infoService.getInfo();
        setInfo(data);
      } catch (err) {
        console.error("❌ Lỗi khi tải thông tin cửa hàng:", err);
      }
    };
    loadInfo();
  }, []);

  // Load danh sách dịch vụ (dùng cho title)
  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = (await serviceService.getAll());
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
          createdAt: req.createdAt ?? "",
          hidden: req.hidden
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
            ? (await requestService.getAllRepairs()).filter(r => r.hidden !== true)
            : (await requestService.getAllOrders()).filter(r => r.hidden !== true);
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

    // Chặn thao tác ngược hoặc sai quy trình
    const allowedMoves: Record<string, string[]> = {
      new: ["in_progress", "completed"],
      in_progress: ["completed"],
      completed: [], // không được kéo đi đâu
    };

    if (!allowedMoves[source.droppableId]?.includes(destination.droppableId)) {
      alert("Không thể chuyển yêu cầu sang trạng thái này!");
      return;
    }

    const updatedColumns = [...columns];
    const sourceCol = updatedColumns.find((col) => col.id === source.droppableId)!;
    const destCol = updatedColumns.find((col) => col.id === destination.droppableId)!;

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
                `Xin chào ${movedRequest.name || "khách hàng"},
                Yêu cầu của bạn với mã <strong>${movedRequest._id}</strong> đã được hoàn thành. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
                Trân trọng,
                Đội ngũ hỗ trợ`
              );
              await userService.sendEmail(
                info.email,
                `Yêu cầu ${movedRequest._id} đã hoàn thành`,
                `Yêu cầu sửa chữa với mã ${movedRequest._id} của khách hàng ${movedRequest.name || "khách hàng"} đã được hoàn thành.`
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
              if (newStock === 0) {
                await productService.updateStatus(item.product_id._id, "out_of_stock");
              }
            }
          }
          // Gửi email thông báo hoàn thành
          if (movedRequest.email) {
            try {
              await userService.sendEmail(
                movedRequest.email,
                "Yêu cầu của bạn đã được hoàn thành",
                `Xin chào ${movedRequest.name || "khách hàng"},
                Yêu cầu của bạn với mã ${movedRequest._id} đã được hoàn thành. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
                Trân trọng,
                Đội ngũ hỗ trợ`
              );
              await userService.sendEmail(
                info.email,
                `Yêu cầu ${movedRequest._id} đã hoàn thành`,
                `Yêu cầu sửa chữa với mã ${movedRequest._id} của khách hàng ${movedRequest.name || "khách hàng"} đã được hoàn thành.`
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
    <div className="p-4 bg-gray-100 min-h-screen w-full">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">
        📋 Bảng quản lý yêu cầu khách hàng
      </h2>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col md:grid md:grid-cols-1 lg:flex lg:flex-row gap-8 items-center lg:items-start">
          {columns.map((col) => (
            <Droppable key={col.id} droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`w-full lg:w-[32%] max-w-2xl p-4 rounded-xl shadow-md bg-white transition-all ${snapshot.isDraggingOver ? "bg-blue-50" : ""
                    }`}
                >
                  <h3 className="text-lg font-semibold mb-4">{col.title}</h3>
                  <div className="flex flex-col items-center gap-4">
                    {col.requests.map((req, index) => (
                      <Draggable
                        key={String(req._id)}
                        draggableId={String(req._id)}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`w-full max-w-md border rounded-lg shadow-sm bg-gray-50 p-3 transition ${snapshot.isDragging
                                ? "bg-blue-100 border-blue-400"
                                : "hover:bg-gray-100"
                              }`}
                          >
                            <RequestCard
                              req={{
                                _id: String(req._id),
                                name: req.name || "Khách hàng",
                                problem_description:
                                  req.problem_description || req.note || "Không có mô tả",
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
                              onDeleted={async () => {
                                const updated =
                                  tab === "service"
                                    ? (await requestService.getAllRepairs()).filter(r => r.hidden !== true)
                                    : (await requestService.getAllOrders()).filter(r => r.hidden !== true);
                                setColumns(mapRequestsToColumns(updated));
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
