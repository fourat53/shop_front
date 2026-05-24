import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  IconPackage,
  IconCategory,
  IconUsers,
  IconShoppingCart,
  IconLayoutDashboard,
  IconArrowLeft,
} from "@tabler/icons-react";

interface SidebarItem {
  id: string;
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const sidebarItems: SidebarItem[] = [
  { id: "dashboard", path: "/admin/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
  { id: "products", path: "/admin/products", label: "Products", icon: IconPackage },
  { id: "categories", path: "/admin/categories", label: "Categories", icon: IconCategory },
  { id: "users", path: "/admin/users", label: "Users", icon: IconUsers },
  { id: "orders", path: "/admin/orders", label: "Orders", icon: IconShoppingCart },
];

export function Sidebar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-surface/50 backdrop-blur-md md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground font-black tracking-tighter">
          A
        </div>
        <span className="text-lg font-bold tracking-tight">ACME Admin</span>
      </div>
      <nav className="flex-1 space-y-2 p-3">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const active = currentPath.startsWith(item.path);
          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn("flex items-center gap-3 w-full rounded-xl px-3 py-2 text-sm font-medium transition-all hover:opacity-80", {
                "bg-accent text-accent-foreground shadow-lg shadow-accent/20": active,
                "text-muted hover:bg-background-muted hover:text-foreground": !active,
              })}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-muted hover:bg-surface hover:text-foreground transition-all"
        >
          <IconArrowLeft className="size-5" />
          Back to Store
        </Link>
      </div>
    </aside>
  );
}

export function MobileSidebar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="border-b border-border px-4 py-2 bg-surface/10 md:hidden flex justify-between gap-1 overflow-x-auto scrollbar-none">
      {sidebarItems.map((item) => {
        const active = currentPath.startsWith(item.path);
        const Icon = item.icon;
        return (
          <Link
            key={item.id}
            to={item.path}
            className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold shrink-0 transition-all ${active ? "bg-accent/10 text-accent" : "text-muted"
              }`}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
