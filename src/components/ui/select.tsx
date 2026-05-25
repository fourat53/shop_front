import { Input, Label, ListBox, Select } from "@heroui/react"
import { useMemo, useState } from "react"

export type SelectItem = {
  id: string
  value: string
}

type CustomSelectProps = Omit<
  React.ComponentProps<typeof Select>,
  "children" | "value" | "onChange" | "items"
> & {
  label?: string
  items: SelectItem[]
  value?: string
  onChange?: (value: string) => void
  search?: boolean
}

export default function CustomSelect({
  label,
  items,
  value,
  onChange,
  search = false,
  ...props
}: CustomSelectProps) {
  const [searchValue, setSearchValue] = useState<string>("")

  const filteredItems = useMemo(() => {
    if (!searchValue) return items

    return items.filter((item) =>
      item.value.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [items, searchValue])

  return (
    <Select
      value={value}
      onChange={(value) => {
        onChange?.(String(value))
      }}
      {...props}
    >
      {label && <Label>{label}</Label>}
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>

      <Select.Popover>
        {search && (
          <Input
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="mb-1"
          />
        )}

        <ListBox>
          {filteredItems.map((item) => (
            <ListBox.Item key={item.id} id={item.id} textValue={item.value}>
              {item.value}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  )
}
