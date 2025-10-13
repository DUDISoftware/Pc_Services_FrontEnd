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
  getAll: async (limit = 10, page = 1): Promise<{ products: Product[] }> => {
    try {
      const res = await api.get(`/products?limit=${limit}&page=${page}`);
      return { products: res.data.products.map((p: ProductApi) => mapProduct(p)) };
    } catch (error) {
      throw error;
    }
  },
  //excel
  exportProductsToExcel: async (): Promise<Blob> => {
    try {
      const res = await api.get('/products/export', {
        responseType: 'blob', 
      });
      return res.data; 
    } catch (error) {
      throw error;
    }
  },

  
  //slug

  getBySlug: async (slug: string): Promise<Product> => {
    try {
      const res = await api.get(`/products/slug/${slug}`);
      return mapProduct(res.data.product);
    } catch (error) {
      throw error;
    }
  },

  getFeatured: async (limit: number): Promise<Featured> => {
    try {
      const res = await api.get(`/products/featured?limit=${limit}`);
      return res.data as Featured;
    } catch (error) {
      throw error;
    }
  },

  getRelated: async (id: string, limit = 4): Promise<Product[]> => {
    try {
      const res = await api.get(`/products/${id}/related?limit=${limit}`);
      return res.data.products.map((p: ProductApi) => mapProduct(p));
    } catch (error) {
      throw error;
    }
  },

  getByCategory: async (category: string, limit = 10, page = 1): Promise<Product[]> => {
    try {
      const res = await api.get(`/products/category/${category}?limit=${limit}&page=${page}`);
      return res.data.products.map((p: ProductApi) => mapProduct(p));
    } catch (error) {
      throw error;
    }
  },

  getById: async (id: string): Promise<Product> => {
    try {
      const res = await api.get(`/products/${id}`);
      return mapProduct(res.data.product);
    } catch (error) {
      throw error;
    }
  },

  create: async (data: Partial<ProductApi>): Promise<Product> => {
    try {
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
    } catch (error) {
      throw error;
    }
  },

  update: async (id: string, data: Partial<ProductApi>): Promise<Product> => {
    try {
      const formData = new FormData();
      formData.append("name", data.name || "");
      formData.append("description", data.description || "");
      formData.append("slug", data.slug || "");
      formData.append("price", String(data.price || 0));
            formData.append("discount", String(data.discount || 0));

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
    } catch (error) {
      throw error;
    }
  },

  updateQuantity: async (id: string, quantity: number): Promise<Product> => {
    try {
      const res = await api.patch(`/products/${id}/quantity`, { quantity });
      return mapProduct(res.data.product);
    } catch (error) {
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      throw error;
    }
  },

  getView: async(id: string): Promise<number> => {
    try {
      const res = await api.get(`/products/${id}/views`);
      return res.data.views;
    } catch (error) {
      throw error;
    }
  },

  countViewRedis: async(id: string): Promise<void> => {
    try {
      await api.post(`/products/${id}/views`);
    } catch (error) {
      throw error;
    }
  }
};
