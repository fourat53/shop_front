import { IconSearch, IconPlus, IconTrash } from "@tabler/icons-react"
import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { api, type Order } from "@/lib/api"
import {
  Card,
  Button,
  Input,
  Table,
  Modal,
  Select,
  Avatar,
  ListBox,
  toast,
} from "@heroui/react"

export const Route = createFileRoute("/admin/orders")({
  component: OrdersPage,
})

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>("")

  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const ords = await api.getOrders()
      setOrders(ords)
    } catch (err) {
      toast.danger("Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // const handleStatusChange = async (
  //   orderId: number,
  //   status: Order["orderStatus"]
  // ) => {
  //   try {
  //     await api.updateOrderStatus(orderId, status)
  //     showToast(`Order #${orderId} status changed to ${status}`)
  //     fetchData()
  //   } catch (err: any) {
  //     showToast(err.message || "Failed to update order status", "error")
  //   }
  // }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this order?")) return
    try {
      await api.deleteOrder(id)
      toast.success("Order deleted successfully!")
      fetchData()
    } catch (err: any) {
      toast.danger(err.message || "Failed to delete order")
    }
  }

  const openDetails = (order: Order) => {
    setSelectedOrder(order)
    setDetailModalOpen(true)
  }

  const statusOptions = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]

  return (
    <>
      <Card className="border border-border p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Input
            className="max-w-md"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Table aria-label="Orders Table">
          <Table.Header>
            <Table.Column>ORDER ID</Table.Column>
            <Table.Column>CUSTOMER</Table.Column>
            <Table.Column>DATE</Table.Column>
            <Table.Column>TOTAL PRICE</Table.Column>
            <Table.Column>STATUS</Table.Column>
            <Table.Column>ACTIONS</Table.Column>
          </Table.Header>
          <Table.Body>
            {orders.map((o) => (
              <Table.Row key={o.orderId}>
                <Table.Cell className="font-semibold text-muted">
                  #{o.orderId}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">
                      {o.user
                        ? `${o.user.firstName} ${o.user.lastName}`
                        : "Guest"}
                    </span>
                    <span className="text-xs text-muted">
                      {o.user?.email || "No email"}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell>{o.orderDate}</Table.Cell>
                <Table.Cell className="font-semibold text-foreground">
                  ${o.totalAmount}
                </Table.Cell>
                <Table.Cell>
                  <Select
                    className="w-32"
                    // selectedKeys={[o.orderStatus]}
                    // onChange={(e) => handleStatusChange(o.orderId, e.target.value as Order["orderStatus"])}
                    // color={
                    //   o.orderStatus === "DELIVERED" ? "success" :
                    //     o.orderStatus === "PENDING" ? "warning" :
                    //       o.orderStatus === "CANCELLED" ? "danger" : "default"
                    // }
                  >
                    <Select.Popover>
                      <ListBox>
                        {statusOptions.map((status, index) => (
                          <ListBox.Item
                            id={status}
                            key={index}
                            textValue={status}
                          >
                            {status}
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openDetails(o)}
                    >
                      Details
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="danger-soft"
                      onClick={() => handleDelete(o.orderId)}
                    >
                      <IconTrash className="size-4" />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>

      <Modal isOpen={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <Modal.Container>
          <Modal.Header>Order Details #{selectedOrder?.orderId}</Modal.Header>
          <Modal.Body>
            {selectedOrder && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-surface-secondary/50 p-4">
                  <Avatar className="size-10 bg-accent/20 text-accent" />
                  <div>
                    <h4 className="text-sm font-semibold">
                      {selectedOrder.user
                        ? `${selectedOrder.user.firstName} ${selectedOrder.user.lastName}`
                        : "Guest Customer"}
                    </h4>
                    <span className="block text-xs text-muted">
                      {selectedOrder.user?.email || "No email"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border/30 bg-surface-secondary/20 p-4 text-sm">
                  <div>
                    <span className="block text-xs text-muted uppercase">
                      Order Date
                    </span>
                    <span className="font-semibold">
                      {selectedOrder.orderDate}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-muted uppercase">
                      Status
                    </span>
                    <span
                      className={`mt-0.5 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        selectedOrder.orderStatus === "DELIVERED"
                          ? "bg-success/10 text-success"
                          : selectedOrder.orderStatus === "PENDING"
                            ? "bg-warning/10 text-warning"
                            : selectedOrder.orderStatus === "CANCELLED"
                              ? "bg-danger/10 text-danger"
                              : "bg-accent/10 text-accent"
                      }`}
                    >
                      {selectedOrder.orderStatus}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-xs font-bold tracking-wider text-muted uppercase">
                    Items Ordered
                  </h4>
                  <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
                    {selectedOrder.orderItems?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0"
                      >
                        <div>
                          <span className="block text-sm font-semibold">
                            {item.product?.name || "Unknown Product"}
                          </span>
                          <span className="text-xs text-muted">
                            Qty: {item.quantity} × ${item.price}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-foreground">
                          ${(item.quantity * item.price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    {(!selectedOrder.orderItems ||
                      selectedOrder.orderItems.length === 0) && (
                      <span className="block py-4 text-center text-sm text-muted">
                        No item details found.
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span className="text-sm font-bold">Total Amount Due</span>
                  <span className="text-lg font-black text-foreground">
                    ${selectedOrder.totalAmount}
                  </span>
                </div>
              </div>
            )}
          </Modal.Body>
        </Modal.Container>
      </Modal>
    </>
  )
}
