import { z } from "zod"
import { request, validateWithSchema } from "./client"
import { ProductSchema } from "./products"
import { UserSchema } from "./users"

export const OrderItemSchema = z.object({
  id: z.number(),
  quantity: z.number(),
  price: z.number(),
  product: ProductSchema.optional(),
})

export type OrderItem = z.infer<typeof OrderItemSchema>

export const OrderSchema = z.object({
  orderId: z.number(),
  orderDate: z.string(),
  totalAmount: z.number(),
  orderStatus: z.enum([
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
  orderItems: z.array(OrderItemSchema).optional(),
  user: UserSchema.nullable().optional(),
})

export type Order = z.infer<typeof OrderSchema>

const OrdersResponseSchema = z.object({
  _embedded: z
    .object({
      orders: z.array(OrderSchema),
    })
    .optional(),
})

export const ordersApi = {
  async getOrders(): Promise<Order[]> {
    try {
      const data = await request("/orders")
      const validated = validateWithSchema(OrdersResponseSchema, data)
      return validated._embedded?.orders || []
    } catch (e) {
      console.error("Failed to fetch orders:", e)
      return []
    }
  },

  async updateOrderStatus(
    orderId: number,
    status: Order["orderStatus"]
  ): Promise<Order> {
    const data = await request(`/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({ orderStatus: status }),
    })
    return validateWithSchema(OrderSchema, data)
  },

  async deleteOrder(orderId: number): Promise<void> {
    await request<void>(`/orders/${orderId}`, { method: "DELETE" })
  },
}
