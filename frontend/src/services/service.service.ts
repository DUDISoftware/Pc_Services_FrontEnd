/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/api";
import { Service } from "@/types/Service";
import { mapService } from "@/lib/mappers";

type Featured = {
  services: {
    id: string; 
    views: number;
  }[];
}

export const serviceService = {
  getAll: async (limit=10, page=1): Promise<Service[]> => {
    try {
      const res = await api.get(`/services?limit=${limit}&page=${page}`);
      const services = res.data.services as Service[];
      return services.map(mapService);
    } catch (error) {
      console.error("Error in getAll:", error);
      return [];
    }
  },
   //excel
  exportServicesToExcel: async (): Promise<Blob> => {
    try {
      const res = await api.get('/services/export', {
        responseType: 'blob', 
      });
      return res.data; 
    } catch (error) {
      throw error;
    }
  },

  getById: async (id: string): Promise<Service> => {
    try {
      const res = await api.get(`/services/${id}`);
      return mapService(res.data.service);
    } catch (error) {
      console.error("Error in getById:", error);
      throw error;
    }
  },

  getBySlug: async (slug: string): Promise<Service> => {
    try {
      const res = await api.get(`/services/slug/${slug}`);
      return mapService(res.data.service);
    } catch (error) {
      console.error("Error in getBySlug:", error);
      throw error;
    }
  },

  create: async (payload: Partial<Service>): Promise<Service> => {
    try {
      if (typeof payload.category_id === "object" && payload.category_id !== null) {
        payload.category_id = (payload.category_id as unknown as any)._id;
      }
      const res = await api.post("/services", payload);
      return mapService(res.data.service);
    } catch (error) {
      console.error("Error in create:", error);
      throw error;
    }
  },

  update: async (id: string, payload: Partial<Service>): Promise<Service> => {
    try {
      if (typeof payload.category_id === "object" && payload.category_id !== null) {
        payload.category_id = (payload.category_id as unknown as any)._id;
      }
      const res = await api.put(`/services/${id}`, payload);
      return mapService(res.data.service);
    } catch (error) {
      console.error("Error in update:", error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/services/${id}`);
    } catch (error) {
      console.error("Error in delete:", error);
      throw error;
    }
  },

  getFeatured: async (limit: number = 5): Promise<Featured> => {
    try {
      const res = await api.get(`/services/featured?limit=${limit}`);
      if (res.data.services.length === 0) {
        const services = (await serviceService.getAll()).slice(0, limit);
        return { services: services.map(s => ({ id: s._id, views: 0 })) };
      }
      return res.data as Featured;
    } catch (error) {
      console.error("Error in getFeatured:", error);
      return { services: [] };
    }
  },

  getView: async(id: string): Promise<number> => {
    try {
      const res = await api.get(`/services/${id}/views`);
      return res.data.views;
    } catch (error) {
      console.error("Error in getView:", error);
      return 0;
    }
  },

  countViewRedis: async(id: string): Promise<void> => {
    try {
      await api.post(`/services/${id}/views`);
    } catch (error) {
      console.error("Error in countViewRedis:", error);
      throw error;
    }
  }
  
};
