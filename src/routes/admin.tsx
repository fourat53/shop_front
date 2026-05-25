import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router"
import { Avatar } from "@heroui/react"
import {
  Sidebar,
  MobileSidebar,
  sidebarItems,
} from "@/components/admin/Sidebar"

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
})

function AdminLayout() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  const activeItem =
    sidebarItems.find((item) => currentPath.startsWith(item.path)) ||
    sidebarItems[0]

  return (
    <div className="relative flex min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-surface/20 px-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-tight capitalize">
              {activeItem?.label} Management
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="size-9 rounded-full ring-2 ring-accent/30" />
          </div>
        </header>

        {/* Mobile Sidebar */}
        <MobileSidebar />

        {/* Main Section */}
        <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
