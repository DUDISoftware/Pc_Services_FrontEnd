import api from "@/lib/api"
import { CategoryService } from "@/types/CategoryService"

export const categoryServiceService = {
  // Lấy tất cả danh mục
  getAll: async (): Promise<CategoryService[]> => {
    const res = await api.get("/service-categories")
    return res.data.categories
  },

  // Lấy chi tiết
  getById: async (id: string): Promise<CategoryService> => {
    const res = await api.get(`/service-categories/${id}`)
    return res.data.category
  },

  // Lấy theo slug
  getBySlug: async (slug: string): Promise<CategoryService> => {
    const res = await api.get(`/service-categories/slug/${slug}`)
    return res.data.category
  },

  // Tạo mới
  create: async (payload: Partial<CategoryService>): Promise<CategoryService> => {
    //payload.slug = payload.name!.toLowerCase().replace(/\s+/g, "-")
    const res = await api.post("/service-categories", payload)
    return res.data.category
  },

  // Cập nhật
  update: async (id: string, payload: Partial<CategoryService>): Promise<CategoryService> => {
    const res = await api.put(`/service-categories/${id}`, payload)
    return res.data.category
  },

  // Xóa
  delete: async (id: string): Promise<void> => {
    await api.delete(`/service-categories/${id}`)
  },
}
