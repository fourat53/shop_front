import { Input, Label, type InputRootProps } from "@heroui/react"

type InputProps = InputRootProps & {
  label?: string
  icon?: React.ReactNode
}

export default function TextInput({ label, icon, ...props }: InputProps) {
  const Icon = icon

  return (
    <div className="relative">
      {label && <Label className="mb-1 font-semibold">{label}</Label>}
      {Icon && icon}
      <Input className="pl-10" {...props} />
    </div>
  )
}
