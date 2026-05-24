import { z } from "zod"
import { request, validateWithSchema, BACK_BASE_URL } from "./client"
import { CategorySchema } from "./categories"

export const ImageSchema = z.object({
  id: z.number(),
  fileName: z.string(),
  fileType: z.string(),
  downloadUrl: z.string(),
})

export type Image = z.infer<typeof ImageSchema>

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  brand: z.string(),
  price: z.number(),
  inventory: z.number(),
  description: z.string(),
  category: CategorySchema.nullable().optional(),
  images: z.array(ImageSchema).optional(),
})

export type Product = z.infer<typeof ProductSchema>

const ProductsResponseSchema = z.object({
  _embedded: z
    .object({
      products: z.array(ProductSchema),
    })
    .optional(),
})

export const productsApi = {
  async getProducts(): Promise<Product[]> {
    try {
      const data = await request("/products")
      const validated = validateWithSchema(ProductsResponseSchema, data)
      return validated._embedded?.products || []
    } catch (e) {
      console.error("Failed to fetch products:", e)
      return []
    }
  },

  async createProduct(
    productData: Omit<Product, "id" | "images">,
    categoryId?: number,
    imageUrls?: string[]
  ): Promise<Product> {
    const payload: any = { ...productData }
    if (categoryId) {
      payload.category = `${BACK_BASE_URL}/categories/${categoryId}`
    }
    const createdData = await request("/products", {
      method: "POST",
      body: JSON.stringify(payload),
    })
    const createdProduct = validateWithSchema(ProductSchema, createdData)

    if (imageUrls && imageUrls.length > 0 && createdProduct.id) {
      await Promise.all(
        imageUrls.map((url) =>
          request("/images", {
            method: "POST",
            body: JSON.stringify({
              fileName: "product-image",
              fileType: "image/jpeg",
              downloadUrl: url,
              product: `${BACK_BASE_URL}/products/${createdProduct.id}`,
            }),
          })
        )
      )
      // Refetch to get updated product with images
      const refetched = await request(`/products/${createdProduct.id}`)
      return validateWithSchema(ProductSchema, refetched)
    }

    return createdProduct
  },

  async updateProduct(
    id: number,
    productData: Partial<Omit<Product, "id" | "images">>,
    categoryId?: number,
    imageUrls?: string[],
    existingImages?: Image[]
  ): Promise<Product> {
    const payload: any = { ...productData }
    if (categoryId) {
      payload.category = `${BACK_BASE_URL}/categories/${categoryId}`
    } else if (categoryId === null) {
      payload.category = null
    }

    const updatedData = await request(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
    const updatedProduct = validateWithSchema(ProductSchema, updatedData)

    if (imageUrls) {
      if (existingImages && existingImages.length > 0) {
        await Promise.all(
          existingImages.map((img) =>
            request(`/images/${img.id}`, { method: "DELETE" }).catch((err) =>
              console.warn("Failed to delete image", img.id, err)
            )
          )
        )
      }

      await Promise.all(
        imageUrls.map((url) =>
          request("/images", {
            method: "POST",
            body: JSON.stringify({
              fileName: "product-image",
              fileType: "image/jpeg",
              downloadUrl: url,
              product: `${BACK_BASE_URL}/products/${id}`,
            }),
          })
        )
      )

      const refetched = await request(`/products/${id}`)
      return validateWithSchema(ProductSchema, refetched)
    }

    return updatedProduct
  },

  async deleteProduct(id: number): Promise<void> {
    await request<void>(`/products/${id}`, { method: "DELETE" })
  },
}
