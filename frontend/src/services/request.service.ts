import api from "@/lib/api";
import { Request, RequestApi } from "@/types/Request";
import { mapRequest } from "@/lib/mappers";

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

export const requestApi = {
    create: async (data: Partial<Request>): Promise<unknown> => {
        const type = findType(data as Request);
        const endpoint = type === "repair" ? "/requests/repairs" : type === "order" ? "/requests/orders" : "/requests";
        const res = await api.post(endpoint, data);
        return mapRequest(res.data.request);
    },

    getAll: async (): Promise<Request[]> => {
        const repairs = await api.get("/requests/repairs");
        repairs.data.requests.map((reqData: RequestApi) => mapRequest(reqData));
        const orders = await api.get("/requests/orders");
        orders.data.requests.map((reqData: RequestApi) => mapRequest(reqData));
        return [...repairs.data.requests, ...orders.data.requests];
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

    update: async (id: string, data: Partial<Request>): Promise<Request> => {
        const repair = requestApi.getRepairById(id).catch(() => null);
        const order = requestApi.getOrderById(id).catch(() => null);
        const existingRequest = await repair || await order;
        if (!existingRequest) {
            throw new Error("Yêu cầu không tồn tại");
        }
        const type = findType(existingRequest as Request);
        const endpoint = type === "repair" ? `/requests/repairs/${id}` : type === "order" ? `/requests/orders/${id}` : `/requests/${id}`;
        const res = await api.put(endpoint, { id: id, status: data.status });
        return mapRequest(res.data.updatedRequest);
    },

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