import api from "@/lib/api";
import { Discount, DiscountApi, DiscountResponse } from "@/types/Discount";

export const discountService = {
    async getByProductId(productId: string) {
    try {
        if (!productId || typeof productId !== "string" || productId.length !== 24) {
        throw new Error("productId không hợp lệ");
        }
        console.log("📡 lấy discount theo id at:", `/discounts/${productId}`);

        const res = await api.get(`/discounts/${productId}`);
        const discount = res.data?.SaleOf; // 👈 lấy đúng key từ backend
        if (!discount) {
        console.warn("⚠️ Không tìm thấy discount cho sản phẩm này.");
        return null;
        }
        return discount; 
    } catch (error) {
        throw error;
  }
    },
    async updateDiscount(productId: string, body: { discount: number }) {
    try {
      if (!productId || typeof productId !== "string" || productId.length !== 24) {
        throw new Error("productId không hợp lệ");
      }
      console.log("📡 update discount:", `/discounts/${productId}`, body);
      return await api.put(`/discounts/${productId}`, body);
    } catch (error) {
      throw error;
    }
  },
};
