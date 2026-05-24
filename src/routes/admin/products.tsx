import { IconSearch, IconPlus, IconEdit, IconTrash } from "@tabler/icons-react"
import { api, type Product, type Category } from "@/lib/api"
import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import {
  Card,
  Button,
  Input,
  Table,
  Modal,
  Select,
  ListBox,
  TextArea,
  toast,
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

  const [prodName, setProdName] = useState<string>("")
  const [prodBrand, setProdBrand] = useState<string>("")
  const [prodPrice, setProdPrice] = useState<string>("")
  const [prodInventory, setProdInventory] = useState<string>("")
  const [prodDesc, setProdDesc] = useState<string>("")
  const [prodCategory, setProdCategory] = useState<string>("")
  const [prodImages, setProdImages] = useState<string>("")
  const [existingImages, setExistingImages] = useState<any[]>([])

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
      setProdName(item.name)
      setProdBrand(item.brand)
      setProdPrice(item.price.toString())
      setProdInventory(item.inventory.toString())
      setProdDesc(item.description)
      setProdCategory(item.category?.id?.toString() || "")
      setProdImages(item.images?.map((img) => img.downloadUrl).join(", ") || "")
      setExistingImages(item.images || [])
    } else {
      setEditingId(null)
      setProdName("")
      setProdBrand("")
      setProdPrice("")
      setProdInventory("")
      setProdDesc("")
      setProdCategory("")
      setProdImages("")
      setExistingImages([])
    }
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    if (!prodName || !prodBrand || !prodPrice || !prodInventory || !prodDesc) {
      toast.danger("Please fill in all required fields")
      return
    }

    try {
      const priceNum = parseFloat(prodPrice)
      const invNum = parseInt(prodInventory)
      const catId = prodCategory ? parseInt(prodCategory) : undefined
      const imageUrls = prodImages
        ? prodImages
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
        : []

      if (modalMode === "create") {
        await api.createProduct(
          {
            name: prodName,
            brand: prodBrand,
            price: priceNum,
            inventory: invNum,
            description: prodDesc,
          },
          catId,
          imageUrls
        )
        toast.success("Product created successfully!")
      } else if (modalMode === "edit" && editingId) {
        await api.updateProduct(
          editingId,
          {
            name: prodName,
            brand: prodBrand,
            price: priceNum,
            inventory: invNum,
            description: prodDesc,
          },
          catId,
          imageUrls,
          existingImages
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
      <Card className="border border-border p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Input
            className="max-w-md"
            placeholder="Search products..."
            // startContent={<IconSearch className="size-4 text-muted" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            className="bg-accent font-semibold text-accent-foreground"
            // startContent={<IconPlus className="size-4" />}
            onClick={() => openModal("create")}
          >
            Add Product
          </Button>
        </div>

        <Table aria-label="Products Table">
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
        </Table>
      </Card>

      <Modal isOpen={modalOpen} onOpenChange={setModalOpen}>
        <Modal.Container>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              <Modal.Header>
                {modalMode === "create" ? "Add New Product" : "Edit Product"}
              </Modal.Header>
              <Modal.Body>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    // label="Product Name"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                  />
                  <Input
                    // label="Brand"
                    required
                    value={prodBrand}
                    onChange={(e) => setProdBrand(e.target.value)}
                  />
                  <Input
                    // label="Price ($)"
                    type="number"
                    step="0.01"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                  />
                  <Input
                    // label="Stock Inventory"
                    type="number"
                    required
                    value={prodInventory}
                    onChange={(e) => setProdInventory(e.target.value)}
                  />

                  <Select
                    className="col-span-2"
                    // label="Category"
                    // selectedKeys={prodCategory ? [prodCategory] : []}
                    // onChange={(e) => setProdCategory(e.target.value)}
                  >
                    <ListBox>
                      {categories.map((c) => (
                        <ListBox.Item
                          key={c.id.toString()}
                          textValue={c.id.toString()}
                        >
                          {c.name}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select>

                  <TextArea
                    // label="Image URLs (comma separated)"
                    className="col-span-2"
                    value={prodImages}
                    onChange={(e) => setProdImages(e.target.value)}
                  />
                  <TextArea
                    // label="Description"
                    className="col-span-2"
                    required
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  type="submit"
                  className="bg-accent text-accent-foreground"
                >
                  {modalMode === "create" ? "Create Product" : "Save Changes"}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Body>
        </Modal.Container>
      </Modal>
    </>
  )
}
