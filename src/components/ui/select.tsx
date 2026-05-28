import { Input, Label, ListBox, Select as HeroSelect } from "@heroui/react"
import { useMemo, useState } from "react"

export type SelectItem = {
  id: string
  value: string
}

type CustomSelectProps = Omit<
  React.ComponentProps<typeof HeroSelect>,
  "children" | "value" | "onChange" | "items" | "variant"
> & {
  label?: string
  items: SelectItem[]
  value?: string
  onChange?: (value: string) => void
  search?: boolean
  variant?: "primary" | "secondary"
}

export default function Select({
  variant = "secondary",
  search = false,
  label,
  items,
  value,
  onChange,
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
    <HeroSelect
      value={value}
      variant={variant}
      onChange={(value) => {
        onChange?.(String(value))
      }}
      {...props}
    >
      {label && <Label className="mb-1 font-semibold">{label}</Label>}
      <HeroSelect.Trigger>
        <HeroSelect.Value />
        <HeroSelect.Indicator />
      </HeroSelect.Trigger>

      <HeroSelect.Popover>
        {search && (
          <Input
            variant={variant}
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
      </HeroSelect.Popover>
    </HeroSelect>
  )
}
