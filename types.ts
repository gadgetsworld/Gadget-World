export type DeviceType = "phone" | "laptop" | "tablet"

export interface User {
  _id?: string
  name: string
  email: string
  passwordHash: string
  createdAt: Date
}

export interface Device {
  _id?: string
  title: string
  brand: string
  model: string
  storage?: string
  condition?: "new" | "like-new" | "good" | "fair"
  price: number
  images?: string[]
  createdAt: Date
}

export interface TradeIn {
  _id?: string
  userId?: string | null
  deviceType: DeviceType
  brand: string
  model: string
  storage?: string
  condition: string
  expectedPrice?: number
  name: string
  phone: string
  email?: string
  city?: string
  createdAt: Date
}

export interface RepairRequest {
  _id?: string
  userId?: string | null
  brand: string
  model: string
  issue: string
  name: string
  phone: string
  createdAt: Date
}

export interface AutomobileLead {
  _id?: string
  name: string
  phone: string
  city?: string
  brand: string
  model: string
  year?: string
  createdAt: Date
}

export interface ContactMessage {
  _id?: string
  name: string
  email: string
  message: string
  createdAt: Date
}
