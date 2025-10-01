import api from "@/lib/api";
import { Service } from "@/types/Service";
import { mapService } from "@/lib/mappers";

interface Featured {
  services: {
    id: string; views: number;
  }[];
}

export const serviceService = {
  getAll: async (): Promise<Service[]> => {
    const res = await api.get("/services");
    return res.data.services.map(mapService);
  },

  getById: async (id: string): Promise<Service> => {
    const res = await api.get(`/services/${id}`);
    return mapService(res.data.service);
  },

  getBySlug: async (slug: string): Promise<Service> => {
    const res = await api.get(`/services/slug/${slug}`);
    return mapService(res.data.service);
  },

  create: async (payload: Partial<Service>): Promise<Service> => {
    const res = await api.post("/services", payload);
    return mapService(res.data.service);
  },

  update: async (id: string, payload: Partial<Service>): Promise<Service> => {
    const res = await api.put(`/services/${id}`, payload);
    return mapService(res.data.service);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/services/${id}`);
  },

  getFeatured: async (limit: number = 5): Promise<Featured[]> => {
    const res = await api.get(`/services/featured?limit=${limit}`);
    return res.data.services;
  },

  getView: async(id: string): Promise<number> => {
    const res = await api.get(`/services/${id}/views`);
    return res.data.views;
  },

  countViewRedis: async(id: string): Promise<void> => {
    await api.post(`/services/${id}/views`);
  }


};
