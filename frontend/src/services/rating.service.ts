import api from "@/lib/api";
import { Rating, RatingApi } from "@/types/Rating";
import { mapRating } from "@/lib/mappers";
import { get } from "http";

export const ratingService = {
    getAll: async (): Promise<{ ratings: Rating[] }> => {
        const res = await api.get("/ratings");
        return { ratings: res.data.ratings.map((r: RatingApi) => mapRating(r)) };
    },

    getByProductId: async (productId: string): Promise<RatingApi> => {
        const res = await api.get(`/ratings/product/${productId}`);
        return res.data;
    },
    getByServiceId: async (serviceId: string): Promise<{ ratings: Rating[] }> => {
        const res = await api.get(`/ratings/service/${serviceId}`);
        return { ratings: res.data.ratings.map((r: RatingApi) => mapRating(r)) };
    },
    create: async (data: { product_id?: string; service_id?: string; name: string; score: number; comment: string; }): Promise<Rating> => {
        const formData = new FormData();
        if (data.product_id) {
            formData.append("product_id", data.product_id);
        }
        if (data.service_id) {
            formData.append("service_id", data.service_id);
        }
        formData.append("name", data.name);
        formData.append("score", String(data.score));
        formData.append("comment", data.comment);        
        
        const res = await api.post("/ratings", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return mapRating(res.data.rating);
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/ratings/${id}`);
    },
};