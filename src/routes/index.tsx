import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: PortfolioPage,
})

function PortfolioPage() {
  return (
    <div className="relative flex min-h-screen gap-5">

    </div>
  )
}
