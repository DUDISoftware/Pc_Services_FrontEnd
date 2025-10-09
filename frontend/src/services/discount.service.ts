// import api from "@/lib/api";
// import { Discount, DiscountApi, DiscountResponse } from "@/types/Discount";

// // Hàm map dữ liệu từ API sang kiểu FE
// function mapDiscount(d: DiscountApi): Discount {
//   if (typeof d.product_id === "string") {
//     throw new Error("product_id phải là object với _id, name, slug");
//   }
//   return {
//     _id: d._id,
//     SaleOf: d.SaleOf,
//     product_id: {
//       _id: d.product_id._id,
//       name: d.product_id.name,
//       slug: d.product_id.slug,
//     },
//     createdAt: d.createdAt,
//     updatedAt: d.updatedAt,
//   };
// }

// export const discountService = {
//   getByProductId: async (productId: string): Promise<Discount | null> => {
//     try {
//       if (!productId || typeof productId !== "string" || productId.length !== 24) {
//         throw new Error("productId không hợp lệ");
//       }
//       console.log("📡 Fetching discount at:", `/discounts/${productId}`);
//       const res = await api.get<DiscountResponse>(`/discounts/${productId}`);
//       console.log("🧩 Raw discount response:", res.data);
//       const d = res.data?.discount;
//       if (!d) return null;
//       return mapDiscount(d);
//     } catch (error: any) {
//       console.error("❌ Error fetching discount:", error.message);
//       throw new Error(error.response?.data?.message || "Không thể lấy giảm giá");
//     }
//   },
//   //update
//   updateDiscount: async (productId: string, body: { discount: number | undefined }): Promise<Discount | null> => {
//     try {
//       if (!productId || typeof productId !== "string" || productId.length !== 24) {
//         throw new Error("productId không hợp lệ");
//       }
//       console.log("📡 Updating discount at:", `/discounts/${productId}`, body);
//       const res = await api.put<DiscountResponse>(`/discounts/${productId}`, body);
//       console.log("🧩 Update discount response:", res.data);
//       const d = res.data?.discount;
//       if (!d) return null;
//       return mapDiscount(d);
//     } catch (error: any) {
//       console.error("❌ Error updating discount:", error.message);
//       throw new Error(error.response?.data?.message || "Không thể cập nhật giảm giá");
//     }
//   },
// };


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

        return discount; // discount.SaleOf = 40, discount.product_id = {...}, ...
    } catch (error) {
        throw error;
  }
    },
    async updateDiscount(productId: string, body: { discount: number | undefined }) {
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
