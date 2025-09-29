import api from "@/lib/api";
import { Stats, StatsApi } from "@/types/Stats";
import { statsMapper } from "@/lib/mappers";
import { requestService } from "./request.service";
import { serviceService } from "./service.service";

export const statsService = {
    async getAllStats(): Promise<Stats[]> {
        const response = await api.get("/stats");
        return response.data.stats.map((s: StatsApi) => statsMapper(s));
    },

    async getStatsByDate(date: string): Promise<Stats> {
        const response = await api.get(`/stats/${date}`);
        return statsMapper(response.data.stats);
    },

    async getMonthStats(month: number, year: number): Promise<Stats[]> {
        const response = await api.get(`/stats/month/${month}/${year}`);
        return response.data.stats.map((s: StatsApi) => statsMapper(s));
    },

    async updateStats(data: Stats, date?: string): Promise<Stats> {
        const today = date || new Date().toISOString().split("T")[0];
        try {
            const response = await api.put(`/stats?date=${today}`, data);
            return statsMapper(response.data.stats);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return this.createStats(data, today);
            }
            console.error("Lỗi cập nhật thống kê:", error);
            throw error;
        }
    },

    async createStats(data: Stats, date: string): Promise<Stats> {
        console.log("Tạo mới stats cho ngày:", date);
        const response = await api.post(`/stats?date=${date}`, {
            ...data, visits: 0
        });
        return statsMapper(response.data.stats);
    },

    async countVisits(date?: string): Promise<number> {
        const today = date || new Date().toISOString().split("T")[0];
        const response = await api.patch(`/stats/visit?date=${today}`);
        return response.data.stats.visits;
    },

    async calculateMonthProfit(): Promise<number> {
        const [orders, repairs] = await Promise.all([
            (await requestService.getAllOrders()).filter(item =>
                item.status === "completed" &&
                item.updatedAt?.startsWith(new Date().toISOString().split("T")[0].slice(0, 7))
            ),
            (await requestService.getAllRepairs()).filter(item =>
                item.status === "completed" &&
                item.updatedAt?.startsWith(new Date().toISOString().split("T")[0].slice(0, 7))
            )
        ]);

        let total = 0;

        // Tính profit từ Orders
        for (const order of orders) {
            for (const item of order.items || []) {
                const price =
                    typeof item.product_id === "object"
                        ? (item.product_id as { price: number }).price
                        : item.price || 0;
                const qty = item.quantity || 1;
                total += price * qty;
            }
        }

        // Tính profit từ Repairs
        for (const repair of repairs) {
            for (const item of repair.items || []) {
                total += item.price || 0;
            }
        }

        return total;
    },

    async calculateTodayProfit(dateString?: string): Promise<number> {
        const today = dateString || new Date().toISOString().split("T")[0];

        const [orders, repairs] = await Promise.all([
            requestService.getAllOrders(),
            requestService.getAllRepairs(),
        ]);

        const filteredOrders = orders.filter(
            (item) => item.status === "completed" && item.updatedAt?.startsWith(today)
        );

        const filteredRepairs = repairs.filter(
            (item) => item.status === "completed" && item.updatedAt?.startsWith(today)
        );

        let total = 0;

        // ✅ Tính lợi nhuận từ đơn hàng
        for (const order of filteredOrders) {
            for (const item of order.items || []) {
                const price =
                    typeof item.price === "number"
                        ? item.price // lấy snapshot giá tại thời điểm đặt hàng
                        : typeof item.product_id === "object"
                            ? (item.product_id as { price: number }).price
                            : 0;

                const qty = item.quantity || 1;
                total += price * qty;
            }
        }

        // ✅ Tính lợi nhuận từ sửa chữa
        for (const repair of filteredRepairs) {
            const service = await serviceService.getById(repair.service_id as string);
            total += service.price || 0;
        }

        return total;
    }

};
