import { IconSearch, IconPlus, IconEdit, IconTrash } from "@tabler/icons-react"
import { createFileRoute } from "@tanstack/react-router"
import { api, type Category } from "@/lib/api"
import { useState, useEffect } from "react"
import {
  Card,
  Button,
  Input,
  Table,
  Modal,
  Select,
  ListBox,
  toast,
} from "@heroui/react"

export const Route = createFileRoute("/admin/categories")({
  component: CategoriesPage,
})

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>("")

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [editingId, setEditingId] = useState<number | null>(null)

  const [catName, setCatName] = useState<string>("")
  const [catGender, setCatGender] = useState<Category["gender"]>("MALE")

  const fetchData = async () => {
    setLoading(true)
    try {
      const cats = await api.getCategories()
      setCategories(cats)
    } catch (err) {
      toast.danger("Failed to fetch categories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openModal = (mode: "create" | "edit", item?: Category) => {
    setModalMode(mode)
    if (mode === "edit" && item) {
      setEditingId(item.id)
      setCatName(item.name)
      setCatGender(item.gender)
    } else {
      setEditingId(null)
      setCatName("")
      setCatGender("MALE")
    }
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    if (!catName) {
      toast.danger("Please enter a category name")
      return
    }

    try {
      if (modalMode === "create") {
        await api.createCategory({ name: catName, gender: catGender })
        toast.success("Category created successfully!")
      } else if (modalMode === "edit" && editingId) {
        await api.updateCategory(editingId, {
          name: catName,
          gender: catGender,
        })
        toast.success("Category updated successfully!")
      }
      setModalOpen(false)
      fetchData()
    } catch (err: any) {
      toast.danger(err.message || "Failed to save category")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return
    try {
      await api.deleteCategory(id)
      toast.success("Category deleted successfully!")
      fetchData()
    } catch (err: any) {
      toast.danger(err.message || "Failed to delete category")
    }
  }

  return (
    <>
      <Card className="border border-border p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Input
            className="max-w-md"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            className="bg-accent font-semibold text-accent-foreground"
            onClick={() => openModal("create")}
          >
            Add Category
          </Button>
        </div>

        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Categories Table">
              <Table.Header>
                <Table.Column>ID</Table.Column>
                <Table.Column>CATEGORY NAME</Table.Column>
                <Table.Column>TARGET GENDER</Table.Column>
                <Table.Column>ACTIONS</Table.Column>
              </Table.Header>
              <Table.Body>
                {categories.map((c) => (
                  <Table.Row key={c.id}>
                    <Table.Cell className="font-semibold text-muted">
                      #{c.id}
                    </Table.Cell>
                    <Table.Cell className="font-semibold text-foreground">
                      {c.name}
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.gender === "FEMALE" ? "bg-danger/10 text-danger" : "bg-accent/10 text-accent"}`}
                      >
                        {c.gender}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="secondary"
                          onClick={() => openModal("edit", c)}
                        >
                          <IconEdit className="size-4 text-muted hover:text-foreground" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="danger-soft"
                          onClick={() => handleDelete(c.id)}
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
      </Card>

      <Modal isOpen={modalOpen} onOpenChange={setModalOpen}>
        <Modal.Backdrop>
          <Modal.Container>
            <form onSubmit={handleSubmit}>
              <Modal.Header>
                {modalMode === "create" ? "Add Category" : "Edit Category"}
              </Modal.Header>
              <Modal.Body>
                <div className="space-y-4">
                  <Input
                    // label="Category Name"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                  />
                  <Select
                    isRequired
                    // selectedKeys={[catGender]}
                    // label="Target Gender"
                    // onChange={(e) =>
                    //   setCatGender(e.target.value as Category["gender"])
                    // }
                  >
                    <Select.Popover>
                      <ListBox>
                        <ListBox.Item key="MALE" textValue="MALE">
                          Male
                        </ListBox.Item>
                        <ListBox.Item key="FEMALE" textValue="FEMALE">
                          Female
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  type="submit"
                  className="bg-accent text-accent-foreground"
                >
                  {modalMode === "create" ? "Create Category" : "Save Changes"}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  )
}
