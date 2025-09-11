// src/services/service.service.ts
import  api  from "@/lib/api"
import { Service } from "@/types/Service"

export const serviceApi = {
  // Lấy tất cả dịch vụ
  getAll: async (): Promise<Service[]> => {
    const res = await api.get("/services")
    return res.data.services
  },

  // Lấy chi tiết dịch vụ
  getById: async (id: string): Promise<Service> => {
    const res = await api.get(`/services/${id}`)
    return res.data.service
  },
getFeatured: async () => {
    const res = await api.get("/services?featured=true");
    return res.data.services;
  },
  // Tạo dịch vụ mới
  create: async (payload: Partial<Service>): Promise<Service> => {
    const res = await api.post("/services", payload)
    return res.data.service
  },

  // Cập nhật dịch vụ
  update: async (id: string, payload: Partial<Service>): Promise<Service> => {
    const res = await api.put(`/services/${id}`, payload)
    return res.data.service
  },

  // Ẩn dịch vụ
  hide: async (id: string): Promise<void> => {
    await api.patch(`/services/${id}/hide`)
  },

  // Xóa dịch vụ
  delete: async (id: string): Promise<void> => {
    await api.delete(`/services/${id}`)
  }
}
