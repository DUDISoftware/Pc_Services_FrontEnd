export interface Service {
  _id: string
  name: string
  description: string
  price: number
  type: "home" | "store"
  estimated_time: string
  status: "active" | "inactive" | "hidden"
  created_at?: string
  updated_at?: string
}
