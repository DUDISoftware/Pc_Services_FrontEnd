import api from "@/lib/api";
import { Discount, DiscountCategoryService, DiscountCategoryServiceResponse, DiscountResponse } from "@/types/Discount";
import { DiscountService, DiscountServiceResponse } from "@/types/Discount";


export const discountService = {
  // 🟢 Lấy giảm giá theo productId
  async getByProductId(productId: string): Promise<Discount | null> {
    try {
      if (!productId || typeof productId !== "string" || productId.length !== 24) {
        throw new Error("productId không hợp lệ");
      }

      //console.log("📡 GET discount at:", `/discounts/product/${productId}`);

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
  async updateDiscount(productId: string, body: { sale_off: number, start_date:Date, end_date: Date}) {
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

        //console.log("📡 GET discount at:", `/discounts/service/${serviceId}`);

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
  async updateDiscountService(serviceId: string, body: { sale_off: number, start_date:Date | null, end_date: Date | null}) {
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
    async createDiscount(productId: string,body: { sale_off: number; start_date: Date; end_date: Date }) {
      try {
        if (!productId || typeof productId !== "string" || productId.length !== 24) {
          throw new Error("productId không hợp lệ");
        }
        console.log("📡 POST create discount:", `/discounts/product/${productId}`, body);
        const res = await api.post(`/discounts/product/${productId}`, body);
        console.log("✅ Tạo giảm giá mới thành công:", res.data);
        return res.data.discount;
      } catch (error) {
        console.error("❌ Lỗi khi tạo giảm giá:", error);
        throw error;
      }
  },
  async createService(ServiceId: string,body: { sale_off: number; start_date: Date; end_date: Date }) {
      try {
        if (!ServiceId || typeof ServiceId !== "string" || ServiceId.length !== 24) {
          throw new Error("productId không hợp lệ");
        }
        console.log("📡 POST create service:", `/discounts/service/${ServiceId}`, body);
        const res = await api.post(`/discounts/service/${ServiceId}`, body);
        console.log("✅ Tạo giảm giá mới thành công:", res.data);
        return res.data.discount || res.data;
      } catch (error) {
        console.error("❌ Lỗi khi tạo giảm giá:", error);
        throw error;
      }
  },

  async createDiscountProductAll(body: { sale_off: number; start_date: Date; end_date: Date }) {
      try {
        const res = await api.post(`/discounts/productAll`, body);
        console.log("✅ Tạo giảm giá mới thành công:", res.data);
        return res.data.discount;
      } catch (error) {
        console.error("❌ Lỗi khi tạo giảm giá:", error);
        throw error;
      }
  },
  // 🟢 Lấy thông tin giảm giá chung cho tất cả sản phẩm
  async getDiscountProductAll() {
      try {
        const res = await api.get("/discounts/productAll");
        console.log("✅ Lấy giảm giá chung thành công:", res.data);

        // Kiểm tra và chuẩn hóa dữ liệu trả về
        return res.data.discount?.SaleOf || null;
      } catch (error: any) {
        console.error("❌ Lỗi khi lấy giảm giá chung:", error);
        throw error;
      }
  },
  async createDiscountServiceAll(body: { sale_off: number; start_date: Date; end_date: Date }) {
      try {
        const res = await api.post(`/discounts/serviceAll`, body);
        console.log("✅ Tạo giảm giá mới thành công:", res.data);
        return res.data.discount;
      } catch (error) {
        console.error("❌ Lỗi khi tạo giảm giá:", error);
        throw error;
      }
  },
  // 🟢 Lấy thông tin giảm giá chung cho tất cả sản phẩm
  async getDiscountServicetAll() {
      try {
        const res = await api.get("/discounts/serviceAll");
        console.log("✅ Lấy giảm giá chung thành công:", res.data);

        // Kiểm tra và chuẩn hóa dữ liệu trả về
        return res.data.discount?.SaleOf || null;
      } catch (error: any) {
        console.error("❌ Lỗi khi lấy giảm giá chung:", error);
        throw error;
      }
  },
  //
  async createCategoryDiscount(categoryId: string, body: { sale_off: number; start_date: Date; end_date: Date }) {
    try {
      if (!categoryId || typeof categoryId !== "string" || categoryId.length !== 24) {
        throw new Error("categoryId không hợp lệ");
      }

      console.log("📡 POST create category discount:", `/discounts/categoryService/${categoryId}`, body);

      const res = await api.post(`/discounts/categoryService/${categoryId}`, body);

      console.log("✅ Tạo giảm giá cho category thành công:", res.data);
      return res.data.discount || res.data;
    } catch (error) {
      console.error("❌ Lỗi khi tạo giảm giá cho category:", error);
      throw error;
    }
  },
  async getCategoryDiscount(categoryId: string): Promise<DiscountCategoryService | null> {
      try {
        if (!categoryId || typeof categoryId !== "string" || categoryId.length !== 24) {
          throw new Error("categoryId không hợp lệ");
        }

        //console.log("📡 GET discount at:", `/discounts/product/${productId}`);

        const res = await api.get<DiscountCategoryServiceResponse>(`/discounts/categoryService/${categoryId}`);

        const saleOfData = res.data?.discount?.SaleOf;

        if (!saleOfData) {
          console.warn("⚠️ Không tìm thấy discount cho sản phẩm này.");
          return null;
        }

        // Map dữ liệu backend → model FE
        const discount: DiscountCategoryService = {
          _id: saleOfData._id,
          sale_off: saleOfData.sale_off,
          type: saleOfData.type,
          category_service_id: saleOfData.category_service_id,
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
  async updateCategoryDiscount(categoryId: string, body: { sale_off: number; start_date: Date; end_date: Date }) {
    try {
      console.log("📡 PUT update category discount:", `/discounts/categoryService/${categoryId}`, body);
      const res = await api.put(`/discounts/categoryService/${categoryId}`, body);
      console.log("✅ Cập nhật discount thành công:", res.data);
      return res.data.discount || res.data;
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật discount:", error);
      throw error;
    }
  },
  async updateCategoryProduct(categoryId: string, body: { sale_off: number; start_date: Date; end_date: Date }) {
    try {
      console.log("📡 PUT update category discount:", `/discounts/categoryService/${categoryId}`, body);
      const res = await api.put(`/discounts/categoryProduct/${categoryId}`, body);
      console.log("✅ Cập nhật discount thành công:", res.data);
      return res.data.discount || res.data;
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật discount:", error);
      throw error;
    }
  }
};

