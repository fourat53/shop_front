import { IconMoon, IconSun, IconDeviceDesktop } from "@tabler/icons-react"
import { useTheme } from "tanstack-theme-kit"
import type { JSX } from "react/jsx-runtime"
import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

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
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(id)
  }, [])

  return (
    <Button
      variant="outline"
      icon={t.icon}
      className={cn(
        "size-8 rounded-full p-1",
        mounted &&
          theme === t.mode &&
          "bg-primary text-white hover:bg-primary hover:text-white dark:bg-primary dark:hover:bg-primary"
      )}
      onClick={() => setTheme(t.mode)}
    />
  )
}
