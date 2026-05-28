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
import { Card, Button, Modal, Avatar, toast, Table } from "@heroui/react"
import { ACCESS_ROLES } from "../../../data/static"
import Select from "@/components/ui/select"

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

  const [firstname, setFirstname] = useState<string>("")
  const [lastname, setLastname] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [role, setRole] = useState<User["role"]>("USER")

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
      setFirstname(item.firstName)
      setLastname(item.lastName)
      setEmail(item.email)
      setPassword("")
      setRole(item.role)
    } else {
      setEditingId(null)
      setFirstname("")
      setLastname("")
      setEmail("")
      setPassword("")
      setRole("USER")
    }
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    if (
      !firstname ||
      !lastname ||
      !email ||
      (modalMode === "create" && !password)
    ) {
      toast.danger("Please fill in all isRequired fields")
      return
    }

    try {
      if (modalMode === "create") {
        await api.createUser({
          firstName: firstname,
          lastName: lastname,
          email: email,
          password: password,
          role: role,
        })
        toast.success("User registered successfully!")
      } else if (modalMode === "edit" && editingId) {
        const payload: Partial<User> = {
          firstName: firstname,
          lastName: lastname,
          email: email,
          role: role,
        }
        if (password) {
          payload.password = password
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
      <Card className="h-full border border-border p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Input
            icon={IconSearch}
            className="w-full max-w-sm"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button className="font-semibold" onClick={() => openModal("create")}>
            <IconPlus />
            Add User
          </Button>
        </div>
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Users Table">
              <Table.Header>
                <Table.Column>USER</Table.Column>
                <Table.Column>EMAIL ADDRESS</Table.Column>
                <Table.Column>ROLE</Table.Column>
                <Table.Column className="pr-7 text-right">ACTIONS</Table.Column>
              </Table.Header>
              <Table.Body>
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
                          variant="secondary"
                          isIconOnly
                          size="sm"
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
        {loading && (
          <IconLoader2 className="mx-auto mt-4 size-8 animate-spin text-accent" />
        )}
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
                      isRequired
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                    />
                    <Input
                      label="Last Name"
                      isRequired
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      isRequired
                      className="col-span-2"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                      label="Password"
                      type="password"
                      isRequired={modalMode === "create"}
                      className="col-span-2"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={
                        modalMode === "edit"
                          ? "Leave blank to keep current password"
                          : ""
                      }
                    />
                    <Select
                      label="Access Role"
                      isRequired
                      value={role}
                      items={ACCESS_ROLES.map((r) => ({
                        id: r.id,
                        value: r.name,
                      }))}
                      onChange={(value) => {
                        if (!value) return
                        setRole(value as User["role"])
                      }}
                    />
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
