import { IconPlus, IconEdit, IconTrash, IconLoader2 } from "@tabler/icons-react"
import { api, type Product, type Category, type Image } from "@/lib/api"
import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import Input from "@/components/ui/input"
import TextArea from "@/components/ui/textarea"
import {
  Card,
  Button,
  Table,
  Modal,
  Select,
  ListBox,
  toast,
  IconSearch,
} from "@heroui/react"

export const Route = createFileRoute("/admin/products")({
  component: ProductsPage,
})

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>("")

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [editingId, setEditingId] = useState<number | null>(null)

  const [name, setName] = useState<string>("")
  const [brand, setBrand] = useState<string>("")
  const [price, setPrice] = useState<string>("")
  const [inventory, setInventory] = useState<string>("")
  const [desc, setDesc] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [images, setImages] = useState<Image[]>([])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [prods, cats] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ])
      setProducts(prods)
      setCategories(cats)
    } catch (err) {
      toast.danger("Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openModal = (mode: "create" | "edit", item?: Product) => {
    setModalMode(mode)
    if (mode === "edit" && item) {
      setEditingId(item.id)
      setName(item.name)
      setBrand(item.brand)
      setPrice(item.price.toString())
      setInventory(item.inventory.toString())
      setDesc(item.description)
      setCategory(item.category?.id?.toString() || "")
      setImages(item.images || [])
    } else {
      setEditingId(null)
      setName("")
      setBrand("")
      setPrice("")
      setInventory("")
      setDesc("")
      setCategory("")
      setImages([])
    }
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    if (!name || !brand || !price || !inventory || !desc) {
      toast.danger("Please fill in all required fields")
      return
    }

    try {
      const priceNum = parseFloat(price)
      const invNum = parseInt(inventory)
      const catId = category ? parseInt(category) : undefined
      const imageUrls = images.map((img) => img.downloadUrl)
      if (modalMode === "create") {
        await api.createProduct(
          {
            name: name,
            brand: brand,
            price: priceNum,
            inventory: invNum,
            description: desc,
          },
          catId,
          imageUrls
        )
        toast.success("Product created successfully!")
      } else if (modalMode === "edit" && editingId) {
        await api.updateProduct(
          editingId,
          {
            name: name,
            brand: brand,
            price: priceNum,
            inventory: invNum,
            description: desc,
          },
          catId,
          imageUrls,
          images
        )
        toast.success("Product updated successfully!")
      }
      setModalOpen(false)
      fetchData()
    } catch (err: any) {
      toast.danger(err.message || "Failed to save product")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    try {
      await api.deleteProduct(id)
      toast.success("Product deleted successfully!")
      fetchData()
    } catch (err: any) {
      toast.danger(err.message || "Failed to delete product")
    }
  }

  return (
    <>
      <Card className="h-full border border-border p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Input
            className="max-w-md"
            placeholder="Search products..."
            icon={<IconSearch />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            className="bg-accent font-semibold text-accent-foreground"
            onClick={() => openModal("create")}
          >
            <IconPlus />
            Add Product
          </Button>
        </div>

        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Products Table">
              <Table.Header>
                <Table.Column>PRODUCT</Table.Column>
                <Table.Column>BRAND</Table.Column>
                <Table.Column>CATEGORY</Table.Column>
                <Table.Column>PRICE</Table.Column>
                <Table.Column>STOCK</Table.Column>
                <Table.Column>ACTIONS</Table.Column>
              </Table.Header>
              <Table.Body>
                {products.map((p) => (
                  <Table.Row key={p.id}>
                    <Table.Cell>
                      <div className="flex items-center gap-3">
                        {p.images && p.images.length > 0 ? (
                          <img
                            src={p.images[0].downloadUrl}
                            alt={p.name}
                            className="size-10 rounded-lg bg-surface object-cover"
                          />
                        ) : (
                          <div className="flex size-10 items-center justify-center rounded-lg bg-surface font-bold text-muted">
                            N/A
                          </div>
                        )}
                        <div>
                          <span className="block font-semibold text-foreground">
                            {p.name}
                          </span>
                          <span className="block max-w-50 truncate text-xs text-muted">
                            {p.description}
                          </span>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>{p.brand}</Table.Cell>
                    <Table.Cell>
                      <span className="inline-flex rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium">
                        {p.category?.name || "Uncategorized"}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="font-semibold text-foreground">
                      ${p.price}
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${p.inventory < 10 ? "bg-danger/10 text-danger" : "bg-success/10 text-success"}`}
                      >
                        {p.inventory} units
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="secondary"
                          onClick={() => openModal("edit", p)}
                        >
                          <IconEdit className="size-4 text-muted hover:text-foreground" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="danger-soft"
                          onClick={() => handleDelete(p.id)}
                        >
                          <IconTrash className="size-4" />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
        {loading && (
          <IconLoader2 className="mx-auto mt-4 size-8 animate-spin text-accent" />
        )}
      </Card>

      <Modal isOpen={modalOpen} onOpenChange={setModalOpen}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog>
              <Modal.Body>
                <form onSubmit={handleSubmit}>
                  <Modal.Header>
                    {modalMode === "create"
                      ? "Add New Product"
                      : "Edit Product"}
                  </Modal.Header>
                  <Modal.Body>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Product name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <Input
                        label="brand"
                        required
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                      />
                      <Input
                        label="price (TND)"
                        type="number"
                        step="0.01"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                      <Input
                        label="Stock inventory"
                        type="number"
                        required
                        value={inventory}
                        onChange={(e) => setInventory(e.target.value)}
                      />

                      <Select
                        value={category}
                        onChange={(value) => {
                          if (!value) return
                          setCategory(String(value))
                        }}
                      >
                        <Select.Trigger>
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>

                        <Select.Popover>
                          <ListBox>
                            {categories.map((c) => (
                              <ListBox.Item
                                key={c.id}
                                id={c.id.toString()}
                                textValue={c.name}
                              >
                                {c.name}
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>

                      {images && (
                        <div className="flex flex-wrap items-center gap-1">
                          {images.map((img, i) => (
                            <img
                              key={i}
                              src={img.downloadUrl}
                              alt={img.fileName}
                              className="size-10 rounded-lg bg-surface object-cover"
                            />
                          ))}
                          <Button
                            className="size-10 border"
                            type="button"
                            variant="secondary"
                            onClick={() => {}}
                          >
                            <IconPlus className="size-6" />
                          </Button>
                        </div>
                      )}

                      <TextArea
                        label="Description"
                        className="col-span-2"
                        required
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                      />
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      type="submit"
                      className="bg-accent text-accent-foreground"
                    >
                      {modalMode === "create"
                        ? "Create Product"
                        : "Save Changes"}
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  )
}
