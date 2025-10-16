import api from "@/lib/api";
import { Discount, DiscountResponse } from "@/types/Discount";
import { DiscountService, DiscountServiceResponse } from "@/types/Discount";


export const discountService = {
  // 🟢 Lấy giảm giá theo productId
  async getByProductId(productId: string): Promise<Discount | null> {
    try {
      if (!productId || typeof productId !== "string" || productId.length !== 24) {
        throw new Error("productId không hợp lệ");
      }

      console.log("📡 GET discount at:", `/discounts/product/${productId}`);

      // Gọi đúng route backend: /discounts/product/:productId
      const res = await api.get<DiscountResponse>(`/discounts/product/${productId}`);

      const saleOfData = res.data?.discount?.SaleOf;

      if (!saleOfData) {
        console.warn("⚠️ Không tìm thấy discount cho sản phẩm này.");
        return null;
      }

      // Map dữ liệu backend → model FE
      const discount: Discount = {
        _id: saleOfData._id,
        sale_off: saleOfData.sale_off,
        type: saleOfData.type,
        product_id: saleOfData.product_id,
        start_date: saleOfData.start_date,
        end_date: saleOfData.end_date,
        createdAt: saleOfData.createdAt,
        updatedAt: saleOfData.updatedAt,
      };

      return discount;
    } catch (error) {
      console.error("❌ Lỗi khi lấy discount:", error);
      return null;
    }
  },
   // 🟡 Cập nhật giảm giá theo productId
  async updateDiscount(productId: string, body: { sale_off: number }) {
    try {
      if (!productId || typeof productId !== "string" || productId.length !== 24) {
        throw new Error("productId không hợp lệ");
      }

      console.log("📡 PUT update discount:", `/discounts/product/${productId}`, body);

      const res = await api.put(`/discounts/product/${productId}`, body);

      console.log("✅ Cập nhật giảm giá thành công:", res.data);
      return res.data.discount;
    } catch (error) {
      console.error("❌ Lỗi khi update discount:", error);
      throw error;
    }
  },  
  /// discount 
  async getByServiceId(serviceId: string): Promise<DiscountService | null> {
    try {
      if (!serviceId || typeof serviceId !== "string" || serviceId.length !== 24) {
        throw new Error("serviceId không hợp lệ");
      }

      console.log("📡 GET discount at:", `/discounts/service/${serviceId}`);

      const res = await api.get<DiscountServiceResponse>(`/discounts/service/${serviceId}`);

      const saleOfData = res.data?.discount?.SaleOf;

      if (!saleOfData) {
        console.warn("⚠️ Không tìm thấy discount cho sản phẩm này.");
        return null;
      }

      // Map dữ liệu backend → model FE
      const discount: DiscountService = {
        _id: saleOfData._id,
        sale_off: saleOfData.sale_off,
        type: saleOfData.type,
        service_id: saleOfData.service_id,
        start_date: saleOfData.start_date,
        end_date: saleOfData.end_date,
        createdAt: saleOfData.createdAt,
        updatedAt: saleOfData.updatedAt,
      };

      return discount;
    } catch (error) {
      console.error("❌ Lỗi khi lấy discount:", error);
      return null;
    }
  },
    async updateDiscountService(serviceId: string, body: { sale_off: number }) {
  try {
    if (!serviceId || typeof serviceId !== "string" || serviceId.length !== 24) {
      throw new Error("serviceId không hợp lệ");
    }

    console.log("📡 PUT update discount service:", `/discounts/service/${serviceId}`, body);

    const res = await api.put(`/discounts/service/${serviceId}`, body);

    console.log("✅ Cập nhật giảm giá dịch vụ thành công:", res.data);
    return res.data.discount;
  } catch (error) {
    console.error("❌ Lỗi khi update discount service:", error);
    throw error;
  }
},

};
