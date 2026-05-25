import { type SelectItem } from "@/components/ui/select"
import type { User } from "@/lib/api"

type AccessRole = {
  id: User["role"]
  name: string
}

export const genders: SelectItem[] = [
  { id: "MALE", value: "Male" },
  { id: "FEMALE", value: "Female" },
] as const

export const accessRoles: AccessRole[] = [
  {
    id: "USER",
    name: "User",
  },
  {
    id: "ADMIN",
    name: "Admin",
  },
  {
    id: "GUEST",
    name: "Guest",
  },
] as const
