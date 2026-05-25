import { createFileRoute } from "@tanstack/react-router"
import { IconCurrencyDollar, IconShield } from "@tabler/icons-react"
import { Avatar, Button, Card, CloseButton, Link } from "@heroui/react"

export const Route = createFileRoute("/client/")({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="flex w-full flex-col items-center justify-center p-4">
      {/* Premium Header */}
      <header className="mb-4 flex w-full max-w-2xl items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-accent font-black tracking-tighter text-accent-foreground">
            A
          </div>
          <span className="text-lg font-bold tracking-tight">ACME Shop</span>
        </div>
        <Link href="/admin/dashboard">
          <IconShield className="size-4" />
          Admin Panel
        </Link>
      </header>

      <div className="grid w-full max-w-2xl grid-cols-12 gap-4">
        {/* Row 1: Large Product Card - Available Soon */}
        <Card className="col-span-12 flex h-auto min-h-38 flex-col sm:flex-row">
          <div className="relative h-35 w-full shrink-0 overflow-hidden rounded-2xl sm:h-30 sm:w-30">
            <img
              alt="Cherries"
              className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover select-none"
              loading="lazy"
              src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/cherries.jpeg"
            />
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <Card.Header className="gap-1">
              <Card.Title className="pr-8">Become an ACME Creator!</Card.Title>
              <Card.Description>
                Lorem ipsum dolor sit amet consectetur. Sed arcu donec id
                aliquam dolor sed amet faucibus etiam.
              </Card.Description>
              <CloseButton
                aria-label="Close banner"
                className="absolute top-3 right-3"
              />
            </Card.Header>
            <Card.Footer className="mt-auto flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  Only 10 spots
                </span>
                <span className="text-xs text-muted">
                  Submission ends Oct 10.
                </span>
              </div>
              <Button className="w-full sm:w-auto">Apply Now</Button>
            </Card.Footer>
          </div>
        </Card>

        {/* Row 2 */}
        <div className="col-span-12 grid grid-cols-12 gap-4">
          {/* Left Column */}
          <div className="col-span-12 grid grid-cols-12 gap-4 lg:col-span-6">
            {/* Top Card */}
            <Card className="col-span-12">
              <div className="absolute top-3 right-3 z-10">
                <CloseButton aria-label="Close notification" />
              </div>
              <Card.Header className="gap-3">
                <IconCurrencyDollar
                  className="text-primary size-8 shrink-0"
                  role="img"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted uppercase">
                    PAYMENT
                  </span>
                  <Card.Title className="pr-8 text-sm sm:text-base">
                    You can now withdraw on crypto
                  </Card.Title>
                  <Card.Description className="text-xs sm:text-sm">
                    Add your wallet in settings to withdraw
                  </Card.Description>
                </div>
              </Card.Header>
              <Card.Footer>
                <Link
                  aria-label="Go to settings"
                  href="#"
                  rel="noopener noreferrer"
                >
                  Go to settings
                  <Link.Icon aria-hidden="true" />
                </Link>
              </Card.Footer>
            </Card>
            {/* Bottom cards */}
            <div className="col-span-12 grid grid-cols-12 gap-4">
              {/* Left Card */}
              <Card className="col-span-12 gap-2 sm:col-span-6">
                <Card.Header>
                  <Avatar className="size-14 rounded-xl">
                    <Avatar.Image
                      alt="Demo 1"
                      src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/demo1.jpg"
                    />
                    <Avatar.Fallback>JK</Avatar.Fallback>
                  </Avatar>
                </Card.Header>
                <Card.Content className="mt-1">
                  <p className="text-sm leading-4 font-medium">Indie Hackers</p>
                  <p className="text-xs text-muted">148 members</p>
                </Card.Content>
                <Card.Footer className="flex items-center gap-2">
                  <Avatar className="size-4">
                    <Avatar.Image
                      alt="John"
                      src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg"
                    />
                    <Avatar.Fallback>JK</Avatar.Fallback>
                  </Avatar>
                  <p className="text-xs text-muted">By John</p>
                </Card.Footer>
              </Card>
              {/* Right Card */}
              <Card className="col-span-12 gap-2 sm:col-span-6">
                <Card.Header>
                  <Avatar className="size-14 rounded-xl">
                    <Avatar.Image
                      alt="Demo 2"
                      src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/demo2.jpg"
                    />
                    <Avatar.Fallback>AB</Avatar.Fallback>
                  </Avatar>
                </Card.Header>
                <Card.Content className="mt-1">
                  <p className="text-sm leading-4 font-medium">AI Builders</p>
                  <p className="text-xs text-muted">362 members</p>
                </Card.Content>
                <Card.Footer className="flex items-center gap-2">
                  <Avatar className="size-4">
                    <Avatar.Image
                      alt="John"
                      src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
                    />
                    <Avatar.Fallback>M</Avatar.Fallback>
                  </Avatar>
                  <p className="text-xs text-muted">By Martha</p>
                </Card.Footer>
              </Card>
            </div>
          </div>
          {/* Right Column */}
          <Card className="col-span-12 min-h-50 overflow-hidden rounded-3xl lg:col-span-6">
            {/* Background image */}
            <img
              alt="NEO Home Robot"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
              src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/neo2.jpeg"
            />

            {/* Header */}
            <Card.Header className="z-10 text-white">
              <Card.Title className="text-xs font-semibold tracking-wide text-black/70">
                NEO
              </Card.Title>
              <Card.Description className="text-sm leading-5 font-medium text-black/50">
                Home Robot
              </Card.Description>
            </Card.Header>

            {/* Footer */}
            <Card.Footer className="z-10 mt-auto flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-black">
                  Available soon
                </div>
                <div className="text-xs text-black/60">Get notified</div>
              </div>
              <Button
                className="bg-white text-black"
                size="sm"
                variant="tertiary"
              >
                Notify me
              </Button>
            </Card.Footer>
          </Card>
        </div>

        {/* Row 3 */}
        <div className="col-span-12 grid grid-cols-12 gap-4">
          {/* Left Column: Card */}
          <Card className="relative col-span-12 h-62.5 sm:h-75 md:col-span-8 md:h-87.5">
            <img
              alt="NEO Home Robot"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
              src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/neo1.jpeg"
            />

            <Card.Footer className="z-10 mt-auto flex items-end justify-between">
              <div>
                <div className="text-base font-medium text-black sm:text-lg">
                  NEO
                </div>
                <div className="text-xs font-medium text-black/50 sm:text-sm">
                  $499/m
                </div>
              </div>
              <Button
                className="bg-white text-black"
                size="sm"
                variant="tertiary"
              >
                Get now
              </Button>
            </Card.Footer>
          </Card>

          {/* Right Column: Cards Stack */}
          <div className="col-span-12 flex flex-col gap-2 md:col-span-4 md:justify-between md:gap-0 md:py-2">
            {/* 1 */}
            <Card className="flex flex-row gap-3 p-1" variant="transparent">
              <img
                alt="Futuristic Robot"
                className="aspect-square h-16 w-16 shrink-0 rounded-xl object-cover select-none sm:h-20 sm:w-20"
                loading="lazy"
                src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/robot1.jpeg"
              />
              <div className="flex flex-1 flex-col justify-center gap-1">
                <Card.Title className="text-sm">Bridging the Future</Card.Title>
                <Card.Description className="text-xs">
                  Today, 6:30 PM
                </Card.Description>
              </div>
            </Card>
            {/* 2 */}
            <Card className="flex flex-row gap-3 p-1" variant="transparent">
              <img
                alt="Avocado"
                className="aspect-square h-16 w-16 shrink-0 rounded-xl object-cover select-none sm:h-20 sm:w-20"
                loading="lazy"
                src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/avocado.jpeg"
              />
              <div className="flex flex-1 flex-col justify-center gap-1">
                <Card.Title className="text-sm">Avocado Hackathon</Card.Title>
                <Card.Description className="text-xs">
                  Wed, 4:30 PM
                </Card.Description>
              </div>
            </Card>
            {/* 3 */}
            <Card className="flex flex-row gap-3 p-1" variant="transparent">
              <img
                alt="Sound Electro event"
                className="aspect-square h-16 w-16 shrink-0 rounded-xl object-cover select-none sm:h-20 sm:w-20"
                loading="lazy"
                src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/oranges.jpeg"
              />
              <div className="flex flex-1 flex-col justify-center gap-1">
                <Card.Title className="text-sm">
                  Sound Electro | Beyond art
                </Card.Title>
                <Card.Description className="text-xs">
                  Fri, 8:00 PM
                </Card.Description>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
