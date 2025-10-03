/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/api";
import { Rating, RatingApi } from "@/types/Rating";
import { mapRating } from "@/lib/mappers";
import { get } from "http";

export const ratingService = {
    getAll: async (): Promise<{ ratings: Rating[] }> => {
        const res = await api.get("/ratings");
        return { ratings: res.data.ratings.map((r: RatingApi) => mapRating(r)) };
    },

    getByProductId: async (productId: string): Promise<{ ratings: Rating[] }> => {
        const res = await api.get(`/ratings/product/${productId}`);
        return {
            ratings: res.data.map((r: RatingApi) => mapRating(r)),
        };
    },

    getScoreByProductId: async (productId: string): Promise<number> => {
        const res = await api.get(`/ratings/product/${productId}`);
        return res.data.score;
    },
    getByServiceId: async (serviceId: string): Promise<{ ratings: Rating[] }> => {
        const res = await api.get(`/ratings/service/${serviceId}`);
        return { ratings: res.data.ratings.map((r: RatingApi) => mapRating(r)) };
    },
    create: async (data: any) => {
        const res = await api.post("/ratings", data);
        console.log("Response from creating rating:", res.data);
        return res.data;
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/ratings/${id}`);
    },
};