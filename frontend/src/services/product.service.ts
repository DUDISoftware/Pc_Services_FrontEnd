import api from "@/lib/api";
import { Product, ProductApi } from "@/types/Product";
import { mapProduct } from "@/lib/mappers";

export const productService = {
  getAll: async (): Promise<{ products: Product[] }> => {
    const res = await api.get("/products");
    return { products: res.data.products.map((p: ProductApi) => mapProduct(p)) };
  },

  getById: async (id: string): Promise<Product> => {
    const res = await api.get(`/products/${id}`);
    return mapProduct(res.data.product);
  },
  getBySlug: async (slug: string): Promise<Product> => {
    const res = await api.get(`/products/slug/${slug}`);
    return mapProduct(res.data.product);
  },
  getFeatured: async (): Promise<Product[]> => {
    const res = await api.get("/products/featured");
    return res.data.products.map((p: ProductApi) => mapProduct(p));
  },
  getRelated: async (id: string, limit = 4): Promise<Product[]> => {
    const res = await api.get(`/products/${id}/related?limit=${limit}`);
    return res.data.products.map((p: ProductApi) => mapProduct(p));
  },

  create: async (data: Partial<ProductApi>): Promise<Product> => {
    const formData = new FormData();
    formData.append("name", data.name || "");
    formData.append("description", data.description || "");
    formData.append("tags", JSON.stringify(data.tags || []));
    formData.append("slug", data.slug || "");
    formData.append("price", String(data.price || 0));
    formData.append("quantity", String(data.quantity || 0));
    formData.append("status", data.status || "available");
    formData.append("brand", data.brand || "");
    formData.append(
      "category_id",
      typeof data.category_id === "object"
        ? data.category_id._id
        : (data.category_id || "")
    );

    if (data.images && Array.isArray(data.images)) {
      if (data.images.length > 0 && data.images[0] instanceof File) {
        (data.images as File[]).forEach((file) => {
          formData.append("images", file);
        });
      }
    }

    const res = await api.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return mapProduct(res.data.product);
  },

  update: async (id: string, data: Partial<ProductApi>): Promise<Product> => {
    const formData = new FormData();
    formData.append("name", data.name || "");
    formData.append("description", data.description || "");
    formData.append("price", String(data.price || 0));
    formData.append("quantity", String(data.quantity || 0));
    formData.append("status", data.status || "available");
    formData.append("brand", data.brand || "");
    formData.append(
      "category_id",
      typeof data.category_id === "object"
        ? data.category_id._id
        : (data.category_id || "")
    );

    if (data.images && Array.isArray(data.images)) {
      if (data.images.length > 0 && data.images[0] instanceof File) {
        (data.images as File[]).forEach((file) => {
          formData.append("images", file);
        });
      }
    }

    const res = await api.put(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return mapProduct(res.data.product);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
