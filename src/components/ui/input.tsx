import { Input as HeroInput, Label, type InputRootProps } from "@heroui/react"
import type { IconProps } from "@tabler/icons-react"
import clsx from "clsx"

type InputProps = Omit<InputRootProps, "className" | "required"> & {
  variant?: "primary" | "secondary"
  label?: string
  className?: string
  isRequired?: boolean
  icon?: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >
}

export default function Input({
  variant = "secondary",
  label,
  className,
  isRequired,
  icon,
  ...props
}: InputProps) {
  const Icon = icon
  return (
    <div className={className}>
      {label && (
        <Label isRequired={isRequired} className="font-semibold">
          {label}
        </Label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <Icon
            size="18"
            className="absolute top-1/2 left-2 -translate-y-1/2"
          />
        )}
        <HeroInput
          variant={variant}
          required={isRequired}
          className={clsx(Icon && "pl-8", className)}
          {...props}
        />
      </div>
    </div>
  )
}
