import {
  IconEdit,
  IconLoader2,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react"
import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { api, type User } from "@/lib/api"
import Input from "@/components/ui/input"
import {
  Card,
  Button,
  Modal,
  ListBox,
  Select,
  Avatar,
  toast,
  Table,
} from "@heroui/react"
import { accessRoles } from "../../../public/static"

export const Route = createFileRoute("/admin/users")({
  component: UsersPage,
})

function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>("")

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [editingId, setEditingId] = useState<number | null>(null)

  const [userFirst, setUserFirst] = useState<string>("")
  const [userLast, setUserLast] = useState<string>("")
  const [userEmail, setUserEmail] = useState<string>("")
  const [userPassword, setUserPassword] = useState<string>("")
  const [userRole, setUserRole] = useState<User["role"]>("USER")

  const fetchData = async () => {
    setLoading(true)
    try {
      const usrList = await api.getUsers()
      setUsers(usrList)
    } catch (err) {
      toast.danger("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openModal = (mode: "create" | "edit", item?: User) => {
    setModalMode(mode)
    if (mode === "edit" && item) {
      setEditingId(item.id)
      setUserFirst(item.firstName)
      setUserLast(item.lastName)
      setUserEmail(item.email)
      setUserPassword("")
      setUserRole(item.role)
    } else {
      setEditingId(null)
      setUserFirst("")
      setUserLast("")
      setUserEmail("")
      setUserPassword("")
      setUserRole("USER")
    }
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    if (
      !userFirst ||
      !userLast ||
      !userEmail ||
      (modalMode === "create" && !userPassword)
    ) {
      toast.danger("Please fill in all required fields")
      return
    }

    try {
      if (modalMode === "create") {
        await api.createUser({
          firstName: userFirst,
          lastName: userLast,
          email: userEmail,
          password: userPassword,
          role: userRole,
        })
        toast.success("User registered successfully!")
      } else if (modalMode === "edit" && editingId) {
        const payload: Partial<User> = {
          firstName: userFirst,
          lastName: userLast,
          email: userEmail,
          role: userRole,
        }
        if (userPassword) {
          payload.password = userPassword
        }
        await api.updateUser(editingId, payload)
        toast.success("User updated successfully!")
      }
      setModalOpen(false)
      fetchData()
    } catch (err: any) {
      toast.danger(err.message || "Failed to save user")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    try {
      await api.deleteUser(id)
      toast.success("User deleted successfully!")
      fetchData()
    } catch (err: any) {
      toast.danger(err.message || "Failed to delete user")
    }
  }

  return (
    <>
      <Card className="border border-border p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Input
            className="max-w-md"
            placeholder="Search users..."
            value={search}
            icon={<IconSearch />}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={() => openModal("create")}>
            <IconPlus />
            Add User
          </Button>
        </div>
        <Table>
          <Table.ScrollContainer>
            <Table.Content>
              <Table.Header>
                <Table.Column>USER</Table.Column>
                <Table.Column>EMAIL ADDRESS</Table.Column>
                <Table.Column>ROLE</Table.Column>
                <Table.Column>ACTIONS</Table.Column>
              </Table.Header>
              <Table.Body>
                {loading && <IconLoader2 className="mx-auto animate-spin" />}
                {users.map((u) => (
                  <Table.Row key={u.id}>
                    <Table.Cell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9 bg-accent/20 text-accent" />
                        <span className="font-semibold text-foreground">
                          {u.firstName} {u.lastName}
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>{u.email}</Table.Cell>
                    <Table.Cell>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${u.role === "ADMIN" ? "bg-danger/10 text-danger" : u.role === "GUEST" ? "border border-border bg-surface text-muted" : "bg-success/10 text-success"}`}
                      >
                        {u.role}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="secondary"
                          onClick={() => openModal("edit", u)}
                        >
                          <IconEdit className="size-4 text-muted hover:text-foreground" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="danger-soft"
                          onClick={() => handleDelete(u.id)}
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
            <Modal.Dialog>
              <form onSubmit={handleSubmit}>
                <Modal.Header>
                  {modalMode === "create"
                    ? "Register New User"
                    : "Edit User Account"}
                </Modal.Header>
                <Modal.Body>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      required
                      value={userFirst}
                      onChange={(e) => setUserFirst(e.target.value)}
                    />
                    <Input
                      label="Last Name"
                      required
                      value={userLast}
                      onChange={(e) => setUserLast(e.target.value)}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      required
                      className="col-span-2"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                    <Input
                      label="Password"
                      type="password"
                      required={modalMode === "create"}
                      className="col-span-2"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      placeholder={
                        modalMode === "edit"
                          ? "Leave blank to keep current password"
                          : ""
                      }
                    />
                    <Select
                      isRequired
                      area-label="Access Role"
                      value={userRole}
                      onChange={(value) => {
                        if (!value) return
                        setUserRole(value as User["role"])
                      }}
                    >
                      <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>

                      <Select.Popover>
                        <ListBox>
                          {accessRoles.map((role) => (
                            <ListBox.Item
                              key={role.id}
                              id={role.id}
                              textValue={role.name}
                            >
                              {role.name}
                            </ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button className="bg-accent text-accent-foreground">
                    {modalMode === "create" ? "Create Account" : "Save Changes"}
                  </Button>
                </Modal.Footer>
              </form>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  )
}
