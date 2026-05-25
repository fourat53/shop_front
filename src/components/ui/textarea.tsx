import { TextArea, Label, type TextAreaRootProps } from "@heroui/react"

type TextAreaProps = TextAreaRootProps & {
  label?: string
  icon?: React.ReactNode
}

export default function TextTextArea({ label, icon, ...props }: TextAreaProps) {
  const Icon = icon

  return (
    <div className="relative">
      {label && <Label className="mb-1 font-semibold">{label}</Label>}
      {Icon && icon}
      <TextArea className="pl-10" {...props} />
    </div>
  )
}
