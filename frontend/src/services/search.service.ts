/* eslint-disable @typescript-eslint/no-explicit-any */
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
export async function searchProducts(query: string, limit: number = 30, page: number = 1, filter = {"status":"available"}): Promise<{ products: Product[]; total: number }> {
  try {
    const res = await api.get(`/products/search?query=${decodeURIComponent(query)}&limit=${limit}&page=${page}&filter=${JSON.stringify(filter)}`);
    const json = res.data;
    const products = json.products.products;

    if (!Array.isArray(products)) {
      console.error("❌ Dữ liệu trả về không đúng định dạng:", json);
      throw new Error("Invalid product response");
    }
    return {
      products: products.map((item: ProductApi) => mapProduct(item)),
      total: json.total,
    }
  } catch (err) {
    console.error("🔥 Lỗi khi gọi searchProducts:", err);
    return { products: [], total: 0 }; // fallback an toàn
  }
}

export async function searchRequests(query: string, type: "service" | "product"): Promise<Request[]> {
  try {
    const res = await api.get(`/requests/search?query=${encodeURIComponent(query)}`);
    const json = res.data;

    if (type === "service") {
      const serviceRequests = json.repair;
      return Array.isArray(serviceRequests) ? serviceRequests.map((item: RequestApi) => mapRequest(item)) : [];
    } else if (type === "product") {
      const productRequests = json.order;
      
      return Array.isArray(productRequests) ? productRequests.map((item: RequestApi) => mapRequest(item)) : [];
    }
    return [];
  } catch (err) {
    console.error("Lỗi khi gọi searchRequests:", err);
    return [];
  }
}

export async function searchHistoryRequests(query: string): Promise<Request[]> {
  try {
    const res = await api.get(`/requests/search?query=${encodeURIComponent(query)}`);
    const requests = [
      ...(res.data.order || []),
      ...(res.data.repair || [])
    ];
    const data: RequestApi[] = requests || [];
    const filtered = data.filter((r) => r.hidden === true);
    return filtered.map((item: RequestApi) => mapRequest(item));
  } catch (err) {
    console.error("Lỗi khi gọi searchHistoryRequests:", err);
    return [];
  }
}


export async function searchServices(query: string): Promise<Service[]> {
  try {
    const res = await api.get(`/services/search?query=${encodeURIComponent(query)}`);
    const json = res.data;
    const services = json.results as { services: ServiceApi[] };
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