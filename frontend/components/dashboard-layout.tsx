import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">{children}</div>
    </SidebarProvider>
  )
}

