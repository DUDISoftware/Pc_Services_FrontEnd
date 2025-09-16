export interface CategoryService {
  _id: string
  name: string
  description?: string
  status: "active" | "inactive" | "hidden"
  createdAt?: string
  updatedAt?: string
}
