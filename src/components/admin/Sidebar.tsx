import { Link, useRouterState } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import {
  IconPackage,
  IconCategory,
  IconUsers,
  IconShoppingCart,
  IconLayoutDashboard,
  IconArrowLeft,
} from "@tabler/icons-react"
import ThemeSwitch from "../ThemeSwitch"

interface SidebarItem {
  id: string
  path: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export const sidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    path: "/admin/dashboard",
    label: "Dashboard",
    icon: IconLayoutDashboard,
  },
  {
    id: "products",
    path: "/admin/products",
    label: "Products",
    icon: IconPackage,
  },
  {
    id: "categories",
    path: "/admin/categories",
    label: "Categories",
    icon: IconCategory,
  },
  { id: "users", path: "/admin/users", label: "Users", icon: IconUsers },
  {
    id: "orders",
    path: "/admin/orders",
    label: "Orders",
    icon: IconShoppingCart,
  },

  {
    id: "home",
    path: "/",
    label: "Store",
    icon: IconArrowLeft,
  },
] as const

function SidebarItem({ item }: { item: SidebarItem }) {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  const Icon = item.icon
  const active = currentPath.startsWith(item.path) && item.path !== "/"
  return (
    <Link
      key={item.id}
      to={item.path}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-all hover:opacity-80",
        {
          "bg-accent text-accent-foreground": active,
          "text-muted hover:bg-accent/15 hover:text-foreground dark:hover:bg-surface":
            !active,
        }
      )}
    >
      <Icon className="size-5" />
      {item.label}
    </Link>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-surface/50 backdrop-blur-md md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex size-8 items-center justify-center rounded-full bg-accent font-black tracking-tighter text-accent-foreground">
          SF
        </div>
        <span className="text-lg font-bold tracking-tight">Shopo Floor</span>
      </div>
      <div className="mx-3 border-b border-border" />
      <nav className="flex-1 space-y-2 p-3">
        {sidebarItems.slice(0, -1).map((item) => {
          return <SidebarItem key={item.id} item={item} />
        })}
      </nav>
      <div className="mx-3 border-b border-border" />
      <div className="flex items-center justify-between gap-2 p-3.5">
        <SidebarItem item={sidebarItems[sidebarItems.length - 1]} />
        <ThemeSwitch />
      </div>
    </aside>
  )
}

export function MobileSidebar() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  return (
    <div className="flex scrollbar-none justify-between gap-1 overflow-x-auto border-b border-border bg-surface/10 px-4 py-2 md:hidden">
      {sidebarItems.map((item) => {
        const active = currentPath.startsWith(item.path)
        const Icon = item.icon
        return (
          <Link
            key={item.id}
            to={item.path}
            className={`flex shrink-0 flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
              active ? "bg-accent/10 text-accent" : "text-muted"
            }`}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}
