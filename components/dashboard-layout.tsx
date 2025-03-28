"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BarChart3,
  Calendar,
  Clock,
  Frame,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Users,
  Bell,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { useMobile } from "@/hooks/use-mobile"

export function DashboardLayout({ children }) {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, current: pathname === "/dashboard" },
    { name: "Tasks", href: "/dashboard/tasks", icon: Calendar, current: pathname === "/dashboard/tasks" },
    { name: "Team", href: "/dashboard/team", icon: Users, current: pathname === "/dashboard/team" },
    { name: "Reports", href: "/dashboard/reports", icon: BarChart3, current: pathname === "/dashboard/reports" },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare, current: pathname === "/dashboard/messages" },
    { name: "Settings", href: "/dashboard/settings", icon: Settings, current: pathname === "/dashboard/settings" },
  ]

  const NavLinks = () => (
    <>
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
            item.current
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <item.icon className="h-4 w-4" />
          {item.name}
        </Link>
      ))}
    </>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setIsSheetOpen(false)}>
              <Frame className="h-6 w-6" />
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                Zidio
              </span>
            </Link>
            <div className="mt-8 flex flex-col gap-2">
              <NavLinks />
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Frame className="h-6 w-6" />
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text hidden md:inline">
            Zidio
          </span>
        </Link>
        <div className="flex-1"></div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="outline" size="icon">
            <Clock className="h-5 w-5" />
            <span className="sr-only">Timer</span>
          </Button>
          <Button variant="outline" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <div className="relative">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 shrink-0 border-r md:block">
          <div className="flex h-full max-h-screen flex-col gap-2 p-4">
            <nav className="grid gap-1 px-2 text-sm font-medium">
              <NavLinks />
            </nav>
            <div className="mt-auto">
              <Button variant="outline" className="w-full justify-start gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

