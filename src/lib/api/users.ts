import { z } from "zod"
import { request, validateWithSchema } from "./client"

export const UserSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  password: z.string().optional(),
  role: z.enum(["ADMIN", "USER", "GUEST"]),
})

export type User = z.infer<typeof UserSchema>

const UsersResponseSchema = z.object({
  _embedded: z
    .object({
      users: z.array(UserSchema),
    })
    .optional(),
})

export const usersApi = {
  async getUsers(): Promise<User[]> {
    try {
      const data = await request("/users")
      const validated = validateWithSchema(UsersResponseSchema, data)
      return validated._embedded?.users || []
    } catch (e) {
      console.error("Failed to fetch users:", e)
      return []
    }
  },

  async createUser(userData: Omit<User, "id">): Promise<User> {
    const data = await request("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    })
    return validateWithSchema(UserSchema, data)
  },

  async updateUser(
    id: number,
    userData: Partial<Omit<User, "id">>
  ): Promise<User> {
    const data = await request(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(userData),
    })
    return validateWithSchema(UserSchema, data)
  },

  async deleteUser(id: number): Promise<void> {
    await request<void>(`/users/${id}`, { method: "DELETE" })
  },
}
