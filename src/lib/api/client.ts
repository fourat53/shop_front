import { z } from "zod"

export const BACK_BASE_URL = process.env.BACK_BASE_URL || ""

export async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${BACK_BASE_URL}${path}`
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `API Error ${response.status}: ${errorText || response.statusText}`
    )
  }

  if (response.status === 204) {
    return {} as T
  }

  return response.json()
}

export function validateWithSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    console.error("Zod validation failure details:", result.error.format())
    throw new Error(`Data validation failed: ${result.error.message}`)
  }
  return result.data
}
