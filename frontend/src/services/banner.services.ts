import api from "@/lib/api";
import { Banner, BannerApi } from "@/types/Banner";
import { mapBanner } from "@/lib/mappers";

export const bannerService = {
    getAll: async (): Promise<{ banners: Banner[] }> => {
        const res = await api.get("/banners");
        return { banners: res.data.banners.map((b: BannerApi) => mapBanner(b)) };
    },
    create: async (data: Partial<BannerApi>): Promise<Banner> => {
        const res = await api.post("/banners", data);
        return mapBanner(res.data);
    },
    update: async (id: string, data: Partial<BannerApi>): Promise<Banner> => {
        const res = await api.put(`/banners/${id}`, data);
        return mapBanner(res.data);
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/banners/${id}`);
    },
};