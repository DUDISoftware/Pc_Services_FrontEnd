import api from "@/lib/api";
import { create } from "domain";
// import { User } from "@/types/user";

// export const userService = {
//   getAll: () => api.get<User[]>("/users"),
//   getById: (id: string) => api.get<User>(`/users/${id}`),
//   update: (id: string, data: Partial<User>) =>
//     api.put(`/users/${id}`, data),
// };

export const userService = {
  async sendOTP(email: string) {
    return await api.post("/auth/send-email-otp", { email })
  },

  async verifyOTP(email: string, otp: string) {
    return await api.post("/auth/verify-email", { email, otp })
  },

  async sendEmail(email: string, subject: string, text: string) {
    return await api.post("/auth/send-email", { email, subject, text })
  },

  async createAccount(data: { username: string; password: string; role: string }) {
    return await api.post("/auth/register", data);
  },

  async getProfile() {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      throw new Error("User not found in localStorage");
    }
    const user = JSON.parse(userStr);
    const userId = user._id;
    return await api.get(`/users/${userId}`);
  },

  async updateProfile(data: { name?: string; phone?: string; password?: string }) {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      throw new Error("User not found in localStorage");
    }
    const user = JSON.parse(userStr);
    const userId = user._id;
    return await api.put(`/users/${userId}`, data);
  },

  async getAllUsers() {
    const data = await api.get("/users");
    return data;
  },

  async deleteUser(id: string) {
    return await api.delete(`/users/${id}`);
  }
}