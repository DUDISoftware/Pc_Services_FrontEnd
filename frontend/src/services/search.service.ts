import { Product, ProductApi } from "@/types/Product";
import { mapProduct } from "@/lib/mappers";
import { Request, RequestApi } from "@/types/Request";
import { mapRequest } from "@/lib/mappers";
import { Service, ServiceApi } from "@/types/Service";
import { mapService } from "@/lib/mappers";

/**
 * Gọi API tìm kiếm sản phẩm theo query.
 * Trả về danh sách sản phẩm đã map về kiểu FE.
 */
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/search?query=${encodeURIComponent(query)}`,
      {
        next: { revalidate: 0 }, // 👈 optional: disable caching (Next.js 13+)
      }
    );

    if (!res.ok) {
      console.error("❌ API trả về lỗi", res.status);
      throw new Error("Search failed");
    }

    const json = await res.json();
    const products = json.products;

    if (!Array.isArray(products)) {
      console.error("❌ Dữ liệu trả về không đúng định dạng:", json);
      throw new Error("Invalid product response");
    }

    // 🟩 Ghi log sản phẩm đầu tiên nếu cần
    // console.log("✅ Sản phẩm đầu tiên:", products[0]);

    return products.map((item: ProductApi) => mapProduct(item));
  } catch (err) {
    console.error("🔥 Lỗi khi gọi searchProducts:", err);
    return []; // fallback an toàn
  }
}

export async function seachRequests(query: string): Promise<Request[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/requests/search?query=${encodeURIComponent(query)}`,
      {
        next: { revalidate: 0 }, // 🧠 Không cache
      }
    );

    if (!res.ok) {
      console.error("❌ API trả về lỗi", res.status);
      throw new Error("Search failed");
    }

    const json = await res.json();

    const allRequests = [...(json.repair || []), ...(json.order || [])];

    if (!Array.isArray(allRequests)) {
      console.error("❌ Dữ liệu trả về không đúng định dạng:", json);
      throw new Error("Invalid request response");
    }

    return allRequests.map((item: RequestApi) => mapRequest(item));
  } catch (err) {
    console.error("🔥 Lỗi khi gọi searchRequests:", err);
    return [];
  }
}

export async function searchServices(query: string): Promise<Service[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/services/search?query=${encodeURIComponent(query)}`,
      {
        next: { revalidate: 0 }, // 👈 optional: disable caching (Next.js 13+)
      }
    );
    if (!res.ok) {
      console.error("❌ API trả về lỗi", res.status);
      throw new Error("Search failed");
    }
    const json = await res.json();
    const services = json.services;
    if (!Array.isArray(services)) {
      console.error("❌ Dữ liệu trả về không đúng định dạng:", json);
      throw new Error("Invalid service response");
    }
    return services.map((item: ServiceApi) => mapService(item));
  } catch (err) {
    console.error("🔥 Lỗi khi gọi searchServices:", err);
    return []; // fallback an toàn
  } 
}