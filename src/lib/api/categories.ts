import { z } from "zod"
import { request, validateWithSchema } from "./client"

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  gender: z.enum(["MALE", "FEMALE"]),
})

export type Category = z.infer<typeof CategorySchema>

const CategoriesResponseSchema = z.object({
  _embedded: z
    .object({
      categories: z.array(CategorySchema),
    })
    .optional(),
})

export const categoriesApi = {
  async getCategories(): Promise<Category[]> {
    try {
      const data = await request("/categories")
      const validated = validateWithSchema(CategoriesResponseSchema, data)
      return validated._embedded?.categories || []
    } catch (e) {
      console.error("Failed to fetch categories:", e)
      return []
    }
  },

  async createCategory(categoryData: Omit<Category, "id">): Promise<Category> {
    const data = await request("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    })
    return validateWithSchema(CategorySchema, data)
  },

  async updateCategory(
    id: number,
    categoryData: Partial<Omit<Category, "id">>
  ): Promise<Category> {
    const data = await request(`/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(categoryData),
    })
    return validateWithSchema(CategorySchema, data)
  },

  async deleteCategory(id: number): Promise<void> {
    await request<void>(`/categories/${id}`, { method: "DELETE" })
  },
}
