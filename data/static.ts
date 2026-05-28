import { type SelectItem } from "@/components/ui/select"
import type { User } from "@/lib/api"

type AccessRole = {
  id: User["role"]
  name: string
}

const GENDERS: SelectItem[] = [
  { id: "MALE", value: "Male" },
  { id: "FEMALE", value: "Female" },
] as const

const ACCESS_ROLES: AccessRole[] = [
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

const STATUS_OPTIONS: string[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]

export { ACCESS_ROLES, GENDERS, STATUS_OPTIONS }
