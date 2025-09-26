import api from "@/lib/api";
import { Request, RequestApi } from "@/types/Request";
import { mapRequest } from "@/lib/mappers";
import { get } from "http";

function isRepair (request: Request): boolean {
    return request.repair_type !== undefined && request.service_id !== undefined;
}

function isOrder (request: Request): boolean {
    return request.items !== undefined && request.items.length > 0;
}

function findType (request: Request): "repair" | "order" | null {
    if (isRepair(request)) {
        return "repair";
    } else if (isOrder(request)) {
        return "order";
    }
    return null;
}

export const requestService = {
    createRepair: async (data: Partial<RequestApi>): Promise<Request> => {
        const formData = new FormData();
        formData.append("service_id", data.service_id || "");
        formData.append("name", data.name || "");
        formData.append("email", data.email || "");
        formData.append("phone", data.phone || "");
        formData.append("address", data.address || "");
        formData.append("problem_description", data.problem_description || "");
        formData.append("repair_type", data.repair_type || "at_store");
        formData.append("estimated_time", data.estimated_time || "1 ngày");
        formData.append("status", data.status || "new");
        if (data.images && Array.isArray(data.images)) {
          if (data.images.length > 0 && data.images[0] instanceof File) {
            (data.images as File[]).forEach((file) => {
              formData.append("images", file);
            });
          }
        }
        const res = await api.post("/requests/repairs", formData);
        return mapRequest(res.data.request);
    },

    createOrder: async (data: Partial<RequestApi>): Promise<Request> => {
        const res = await api.post("/requests/orders", data);
        return mapRequest(res.data.request);
    },

    create: async (data: Partial<Request>): Promise<unknown> => {
        console.log("Creating request with data:", data);
        const type = findType(data as Request);
        console.log("Detected type:", type);
        let res;
        if (type === "repair") {
            res = await requestService.createRepair(data);
        } else if (type === "order") {
            res = await requestService.createOrder(data);
        } else {
            throw new Error("Không thể xác định loại yêu cầu (sửa chữa hoặc đặt hàng)");
        }
        return res;
    },

    getAllRepairs: async (): Promise<Request[]> => {
        const res = await api.get("/requests/repairs");
        return res.data.requests.map((reqData: RequestApi) => mapRequest(reqData));
    },

    getAllOrders: async (): Promise<Request[]> => {
        const res = await api.get("/requests/orders");
        return res.data.requests.map((reqData: RequestApi) => mapRequest(reqData));
    },

    getAll: async (): Promise<Request[]> => {
        const repairs = await requestService.getAllRepairs();
        const orders = await requestService.getAllOrders();
        return [...repairs, ...orders];
    },

    updateOrder: async (id: string, data: Partial<Request>): Promise<Request> => {
        const res = await api.put(`/requests/orders/${id}`, data);
        return mapRequest(res.data.request);
    },
    updateRepair: async (id: string, data: Partial<Request>): Promise<Request> => {
        const res = await api.put(`/requests/repairs/${id}`, data);
        return mapRequest(res.data.request);
    },

    getRepairById: async (id: string): Promise<Request> => {
        const res = await api.get(`/requests/repairs/${id}`);
        return mapRequest(res.data.request);
    },
    getOrderById: async (id: string): Promise<Request> => {
        const res = await api.get(`/requests/orders/${id}`);
        return mapRequest(res.data.request);
    },

    // update: async (id: string, data: Partial<Request>): Promise<Request> => {
    //     const repair = requestService.getRepairById(id).catch(() => null);
    //     const order = requestService.getOrderById(id).catch(() => null);
    //     const existingRequest = await repair || await order;
    //     if (!existingRequest) {
    //         throw new Error("Yêu cầu không tồn tại");
    //     }
    //     const type = findType(existingRequest as Request);
    //     const endpoint = type === "repair" ? `/requests/repairs/${id}` : type === "order" ? `/requests/orders/${id}` : `/requests/${id}`;
    //     const res = await api.put(endpoint, { id: id, status: data.status });
    //     return mapRequest(res.data.updatedRequest);
    // },

    hideRepair: async (id: string): Promise<void> => {
        await api.patch(`/requests/repairs/${id}`, { hidden: true });
    },

    hideOrder: async (id: string): Promise<void> => {
        await api.patch(`/requests/orders/${id}`, { hidden: true });
    },

    hide: async (id: string, data: Partial<Request>): Promise<void> => {
        const type = findType(data as Request);
        const endpoint = type === "repair" ? `/requests/repairs/${id}` : type === "order" ? `/requests/orders/${id}` : `/requests/${id}`;
        await api.patch(endpoint, { hidden: true });
    }

};