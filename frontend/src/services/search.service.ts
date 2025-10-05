import { Product, ProductApi } from "@/types/Product";
import { mapProduct } from "@/lib/mappers";
import { Request, RequestApi } from "@/types/Request";
import { mapRequest } from "@/lib/mappers";
import { Service, ServiceApi } from "@/types/Service";
import { mapService } from "@/lib/mappers";
import api from "@/lib/api";

/**
 * Gọi API tìm kiếm sản phẩm theo query.
 * Trả về danh sách sản phẩm đã map về kiểu FE.
 */
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const res = await api.get(`/products/search?query=${decodeURIComponent(query)}`);
    const json = res.data;
    const products = json.products;

    if (!Array.isArray(products)) {
      console.error("❌ Dữ liệu trả về không đúng định dạng:", json);
      throw new Error("Invalid product response");
    }

    // 🟩 Ghi log sản phẩm đầu tiên nếu cần

    return products.map((item: ProductApi) => mapProduct(item));
  } catch (err) {
    console.error("🔥 Lỗi khi gọi searchProducts:", err);
    return []; // fallback an toàn
  }
}

export async function searchRequests(query: string): Promise<Request[]> {
  try {
    const res = await api.get(`/requests/search?query=${encodeURIComponent(query)}`);
    const json = res.data;
    const allRequests = [...(json.repair || []), ...(json.order || [])];

    if (!Array.isArray(allRequests)) {
      console.error("❌ Dữ liệu trả về không đúng định dạng:", json);
      throw new Error("Invalid request response");
    }

    return allRequests.map((item: RequestApi) => mapRequest(item));
  } catch (err) {
    console.error("Lỗi khi gọi searchRequests:", err);
    return [];
  }
}

export async function searchServices(query: string): Promise<Service[]> {
  try {
    const res = await api.get(`/services/search?query=${encodeURIComponent(query)}`);
    const json = res.data;
    const services = json.services;
    if (!Array.isArray(services)) {
      console.error("❌ Dữ liệu trả về không đúng định dạng:", json);
      throw new Error("Invalid service response");
    }
    return services.map((item: ServiceApi) => mapService(item));
  } catch (err) {
    console.error("Lỗi khi gọi searchServices:", err);
    return []; // fallback an toàn
  } 
}