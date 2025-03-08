"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import LeftSidebar from "@/components/left-sidebar"
import MainPanel from "@/components/main-panel"
import RightPanel from "@/components/right-panel"

export default function Dashboard() {
  const [currentCluster, setCurrentCluster] = useState("Data Science")

  return (
    <DashboardLayout>
      <LeftSidebar currentCluster={currentCluster} />
      <MainPanel currentCluster={currentCluster} />
      <RightPanel currentCluster={currentCluster} />
    </DashboardLayout>
  )
}

