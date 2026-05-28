import { IconMoon, IconSun, IconDeviceDesktop } from "@tabler/icons-react"
import { useTheme } from "tanstack-theme-kit"
import type { JSX } from "react/jsx-runtime"
import { Button } from "@heroui/react"
import { cn } from "@/lib/utils"
import clsx from "clsx"

export type ThemesType = {
  mode: string
  icon: JSX.Element
}

export const themes: ThemesType[] = [
  { mode: "light", icon: <IconSun /> },
  { mode: "dark", icon: <IconMoon /> },
  { mode: "system", icon: <IconDeviceDesktop /> },
]

export default function ThemeSwitch({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "z-50 flex w-fit items-center gap-0.5 rounded-full border p-1",
        className
      )}
    >
      {themes.map((t: ThemesType) => (
        <ThemeButton key={t.mode} t={t} />
      ))}
    </div>
  )
}

function ThemeButton({ t }: { t: ThemesType }) {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      className={clsx(
        "size-6.5 rounded-full p-0",
        t.mode === theme
          ? "bg-accent"
          : "bg-surface text-accent-foreground hover:bg-accent/50 dark:text-white"
      )}
      isIconOnly
      onClick={() => setTheme(t.mode)}
    >
      {t.icon}
    </Button>
  )
}
