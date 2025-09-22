import { Product, ProductApi } from "@/types/Product";
import { mapProduct } from "@/lib/mappers";

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
