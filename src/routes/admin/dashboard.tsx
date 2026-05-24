import { api, type Product, type User, type Order } from "@/lib/api"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Card, Button, Table, toast } from "@heroui/react"
import { useEffect, useState } from "react"
import {
  IconTrendingUp,
  IconPackage,
  IconShoppingCart,
  IconUsers,
  IconCheck,
} from "@tabler/icons-react"

export const Route = createFileRoute("/admin/dashboard")({
  component: DashboardPage,
})

function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [prods, usrList, ords] = await Promise.all([
          api.getProducts(),
          api.getUsers(),
          api.getOrders(),
        ])
        setProducts(prods)
        setUsers(usrList)
        setOrders(ords)
      } catch (err: any) {
        toast.danger(err.message || "Failed to fetch dashboard data.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalSales = orders
    .filter((o) => o.orderStatus !== "CANCELLED")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0)

  const pendingOrders = orders.filter((o) => o.orderStatus === "PENDING").length

  if (loading) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-3">
        <div className="size-10 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
        <span className="text-sm font-semibold text-muted">
          Loading dashboard...
        </span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wider text-muted uppercase">
              Total Revenue
            </p>
            <h3 className="mt-1 text-2xl font-bold">
              $
              {totalSales.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </h3>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-success/10 text-success">
            <IconTrendingUp className="size-6" />
          </div>
        </div>
      </Card>

      <Card className="border border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wider text-muted uppercase">
              Products
            </p>
            <h3 className="mt-1 text-2xl font-bold">{products.length}</h3>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <IconPackage className="size-6" />
          </div>
        </div>
      </Card>

      <Card className="border border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wider text-muted uppercase">
              Pending Orders
            </p>
            <h3 className="mt-1 text-2xl font-bold">{pendingOrders}</h3>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-warning/10 text-warning">
            <IconShoppingCart className="size-6" />
          </div>
        </div>
      </Card>

      <Card className="border border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wider text-muted uppercase">
              Registered Users
            </p>
            <h3 className="mt-1 text-2xl font-bold">{users.length}</h3>
          </div>
          <div className="bg-info/10 flex size-12 items-center justify-center rounded-2xl text-accent">
            <IconUsers className="size-6" />
          </div>
        </div>
      </Card>

      <Card className="border border-border p-6 lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-lg font-bold">Recent Customer Orders</h4>
          <Link to="/admin/orders">
            <Button className="bg-surface text-foreground hover:bg-surface-secondary">
              View All
            </Button>
          </Link>
        </div>
        <Table
          aria-label="Recent Orders Table"
          className="w-full text-left text-sm"
        >
          <Table.Header>
            <Table.Column>Order ID</Table.Column>
            <Table.Column>Customer</Table.Column>
            <Table.Column>Date</Table.Column>
            <Table.Column>Total</Table.Column>
            <Table.Column>Status</Table.Column>
          </Table.Header>
          <Table.Body>
            {orders.map((order) => (
              <Table.Row
                key={order.orderId}
                className="border-b border-border/50 hover:bg-surface/10"
              >
                <Table.Cell className="py-3 font-semibold">
                  #{order.orderId}
                </Table.Cell>
                <Table.Cell className="py-3">
                  {order.user
                    ? `${order.user.firstName} ${order.user.lastName}`
                    : "Guest"}
                </Table.Cell>
                <Table.Cell className="py-3">{order.orderDate}</Table.Cell>
                <Table.Cell className="py-3 font-semibold">
                  ${order.totalAmount}
                </Table.Cell>
                <Table.Cell className="py-3 text-right">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      order.orderStatus === "DELIVERED"
                        ? "bg-success/15 text-success"
                        : order.orderStatus === "PENDING"
                          ? "bg-warning/15 text-warning"
                          : order.orderStatus === "CANCELLED"
                            ? "bg-danger/15 text-danger"
                            : "bg-accent/15 text-accent"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>

      <Card className="border border-border p-6 lg:col-span-2">
        <h4 className="mb-4 text-lg font-bold">Inventory Alerts</h4>
        <div className="space-y-4">
          {products
            .filter((p) => p.inventory < 10)
            .slice(0, 5)
            .map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <h5 className="text-sm font-semibold">{p.name}</h5>
                  <span className="text-xs text-muted">{p.brand}</span>
                </div>
                <span className="inline-flex rounded-lg bg-danger/10 px-2.5 py-1 text-xs font-bold text-danger">
                  {p.inventory} Left
                </span>
              </div>
            ))}
          {products.filter((p) => p.inventory < 10).length === 0 && (
            <div className="flex h-32 flex-col items-center justify-center text-center text-muted">
              <IconCheck className="mb-2 size-8 text-success" />
              <span className="text-sm">All products fully stocked!</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
