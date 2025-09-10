import api from "@/lib/api";
import { CategoryApi } from "@/types/Category";

interface GetAllResponse {
  status: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  categories: CategoryApi[];
}

export const categoryService = {
  // Lấy danh sách có phân trang
  getAll: async (
    page: number = 1,
    limit: number = 10
  ): Promise<GetAllResponse> => {
    const res = await api.get(`/categories?page=${page}&limit=${limit}`);
    return res.data as GetAllResponse;
  },

  // Lấy chi tiết 1 category
  getById: async (id: string): Promise<CategoryApi> => {
    const res = await api.get<{ category: CategoryApi }>(`/categories/${id}`);
    return res.data.category;
  },

  // Tạo mới category
  create: async (data: Pick<CategoryApi, "name" | "description">): Promise<CategoryApi> => {
    const res = await api.post<{ category: CategoryApi }>("/categories", data);
    return res.data.category;
  },

  // Cập nhật category
  update: async (
    id: string,
    data: Partial<Pick<CategoryApi, "name" | "description">>
  ): Promise<CategoryApi> => {
    const res = await api.put<{ category: CategoryApi }>(`/categories/${id}`, data);
    return res.data.category;
  },

  // Xoá category
  delete: async (id: string): Promise<{ status: string; message: string }> => {
    const res = await api.delete<{ status: string; message: string }>(`/categories/${id}`);
    return res.data;
  },
};
