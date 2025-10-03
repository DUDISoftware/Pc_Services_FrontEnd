import api from "@/lib/api";
import { Product, ProductApi } from "@/types/Product";
import { mapProduct } from "@/lib/mappers";
import { get } from "http";

type Featured = {
  products: {
    id: string;
    views: number;
  }[];
}

export const productService = {
  getAll: async (): Promise<{ products: Product[] }> => {
    const res = await api.get("/products");
    return { products: res.data.products.map((p: ProductApi) => mapProduct(p)) };
  },

  getBySlug: async (slug: string): Promise<Product> => {
    const res = await api.get(`/products/slug/${slug}`);
    return mapProduct(res.data.product);
  },
  getFeatured: async (limit: number): Promise<Featured> => {
    const res = await api.get(`/products/featured?limit=${limit}`);
    return res.data as Featured;
  },
  getRelated: async (id: string, limit = 4): Promise<Product[]> => {
    const res = await api.get(`/products/${id}/related?limit=${limit}`);
    return res.data.products.map((p: ProductApi) => mapProduct(p));
  },
  getByCategory: async (category: string): Promise<Product[]> => {
    const res = await api.get(`/products/category/${category}`);
    return res.data.products.map((p: ProductApi) => mapProduct(p));
  },
  getByCategorySlug: async (slug: string): Promise<Product[]> => {
    const res = await api.get(`/products/category/slug/${slug}`);
    return res.data.products.map((p: ProductApi) => mapProduct(p));
  }, // lấy sản phẩm theo slug của category (PHẢI CÓ API Ở BACKEND)
  getById: async (id: string): Promise<Product> => {
    const res = await api.get(`/products/${id}`);
    return mapProduct(res.data.product);
  },

  create: async (data: Partial<ProductApi>): Promise<Product> => {
    const formData = new FormData();
    formData.append("name", data.name || "");
    formData.append("description", data.description || "");
    formData.append("slug", data.slug || "");
    formData.append("price", String(data.price || 0));
    formData.append("quantity", String(data.quantity || 0));
    formData.append("status", data.status || "available");
    formData.append("brand", data.brand || "");
    formData.append("panel", data.panel || "");
    formData.append("size", data.size || "");
    formData.append("model", data.model || "");
    formData.append("resolution", data.resolution || "");
    formData.append(
      "category_id",
      typeof data.category_id === "object"
        ? data.category_id._id
        : (data.category_id || "")
    );

    (data.tags || []).forEach((tag, i) => {
      formData.append(`tags[${i}]`, tag);
    });

    (data.ports || []).forEach((port, i) => {
      formData.append(`ports[${i}]`, port);
    });

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
    formData.append("slug", data.slug || "");
    formData.append("price", String(data.price || 0));
    formData.append("quantity", String(data.quantity || 0));
    formData.append("status", data.status || "available");
    formData.append("brand", data.brand || "");
    formData.append("panel", data.panel || "");
    formData.append("size", data.size || "");
    formData.append("model", data.model || "");
    formData.append("resolution", data.resolution || "");
    formData.append(
      "category_id",
      typeof data.category_id === "object"
        ? data.category_id._id
        : (data.category_id || "")
    );
    
    (data.tags || []).forEach((tag, i) => {
      formData.append(`tags[${i}]`, tag);
    });

    (data.ports || []).forEach((port, i) => {
      formData.append(`ports[${i}]`, port);
    });

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

  updateQuantity: async (id: string, quantity: number): Promise<Product> => {
    const res = await api.patch(`/products/${id}/quantity`, { quantity });
    return mapProduct(res.data.product);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  getView: async(id: string): Promise<number> => {
    const res = await api.get(`/products/${id}/views`);
    return res.data.views;
  },

  countViewRedis: async(id: string): Promise<void> => {
    await api.post(`/products/${id}/views`);
  }

};
