// services/banner.service.ts
import api from "@/lib/api";
import { Banner, BannerApi } from "@/types/Banner";
import { mapBanner, mapLayoutToApi } from "@/lib/mappers";

export const bannerService = {
  getAll: async (): Promise<{ banners: Banner[] }> => {
    const res = await api.get("/banners");
    return {
      banners: res.data.banners.map((b: BannerApi) => mapBanner(b)),
    };
  },

  getById: async (id: string): Promise<Banner> => {
    const res = await api.get(`/banners/${id}`);
    return mapBanner(res.data.banner);
  },

  create: async (data: FormData | Partial<Banner>): Promise<Banner> => {
    if (data instanceof FormData) {
      if (data.has("layout")) {
        const raw = data.get("layout");
        if (typeof raw === "string") {
          const mapped = mapLayoutToApi(raw as Banner["layout"]);
          if (mapped !== undefined) data.set("layout", String(mapped));
        }
      }
      const res = await api.post("/banners", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return mapBanner(res.data.banner);
    } else {
      const payload: Partial<BannerApi> = {
        ...data,
        layout: mapLayoutToApi(data.layout),
      };
      const res = await api.post("/banners", payload);
      return mapBanner(res.data.banner);
    }
  },

  update: async (id: string, data: FormData | Partial<Banner>): Promise<Banner> => {
    if (data instanceof FormData) {
      if (data.has("layout")) {
        const raw = data.get("layout");
        if (typeof raw === "string") {
          const mapped = mapLayoutToApi(raw as Banner["layout"]);
          if (mapped !== undefined) data.set("layout", String(mapped));
        }
      }
      const res = await api.put(`/banners/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return mapBanner(res.data.banner);
    } else {
      const payload: Partial<BannerApi> = {
        ...data,
        layout: mapLayoutToApi(data.layout),
      };
      const res = await api.put(`/banners/${id}`, payload);
      return mapBanner(res.data.banner);
    }
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/banners/${id}`);
  },
};
