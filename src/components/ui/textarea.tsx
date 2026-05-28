import {
  TextArea as HeroTextArea,
  Label,
  type TextAreaRootProps,
} from "@heroui/react"
import type { IconProps } from "@tabler/icons-react"
import clsx from "clsx"

type TextAreaProps = Omit<
  TextAreaRootProps,
  "className" | "required" | "variant"
> & {
  variant?: "primary" | "secondary"
  label?: string
  className?: string
  isRequired?: boolean
  icon?: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >
}

export default function TextArea({
  variant = "secondary",
  label,
  className,
  isRequired,
  icon,
  ...props
}: TextAreaProps) {
  const Icon = icon

  return (
    <div className={clsx("p-px", className)}>
      {label && (
        <Label isRequired={isRequired} className="mb-1 font-semibold">
          {label}
        </Label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <Icon size="18" className="absolute top-2 left-2 -translate-y-1/2" />
        )}
        <HeroTextArea
          variant={variant}
          required={isRequired}
          className={clsx(Icon && "pl-8", className)}
          {...props}
        />
      </div>
    </div>
  )
}
