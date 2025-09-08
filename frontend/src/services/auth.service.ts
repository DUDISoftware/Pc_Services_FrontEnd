// src/services/auth.service.ts
import { api } from "../lib/api";

export const authService = {
  login: async (username: string, password: string) => {
    const res = await api.post("/auth/login", { username, password });
    return res.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
