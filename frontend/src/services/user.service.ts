import api from "@/lib/api";
// import { User } from "@/types/user";

// export const userService = {
//   getAll: () => api.get<User[]>("/users"),
//   getById: (id: string) => api.get<User>(`/users/${id}`),
//   update: (id: string, data: Partial<User>) =>
//     api.put(`/users/${id}`, data),
// };

export const userService = {
  sendOTP : (email: string) => api.post("/auth/send-otp", { email }),
  verifyOTP : (email: string, otp: string) => api.post("/auth/verify-email", { email, otp }),
  sendEmail : (email: string, subject: string, text: string) => api.post("/auth/send-email", { email, subject, text }),
}