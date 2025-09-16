import api from "@/lib/api";
import { Service } from "@/types/Service";

export const serviceApi = {
  getAll: async (): Promise<Service[]> => {
    const res = await api.get("/services");
    return res.data.services;
  },

  getById: async (id: string): Promise<Service> => {
    const res = await api.get(`/services/${id}`);
    return res.data.service;
  },

  create: async (payload: Partial<Service>): Promise<Service> => {
    const res = await api.post("/services", payload);
    return res.data.service;
  },

  update: async (id: string, payload: Partial<Service>): Promise<Service> => {
    const res = await api.put(`/services/${id}`, payload);
    return res.data.service;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/services/${id}`);
  },
};
