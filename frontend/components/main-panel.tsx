"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MainPanelProps {
  currentCluster: string
}

export default function MainPanel({ currentCluster }: MainPanelProps) {
  const plotContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // This would be replaced with actual Plotly.js implementation
    // For now, we'll just create a placeholder visualization
    const initPlot = async () => {
      if (typeof window !== "undefined" && plotContainerRef.current) {
        try {
          // In a real implementation, we would use Plotly here
          const container = plotContainerRef.current
          container.innerHTML = ""

          // Create a simple SVG placeholder for the cluster visualization
          const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
          svg.setAttribute("width", "100%")
          svg.setAttribute("height", "100%")
          svg.setAttribute("viewBox", "0 0 500 300")

          // Generate random circles to represent users in clusters
          const colors = {
            "Data Science": "#3B82F6",
            "Cloud Engineering": "#10B981",
            "Web Development": "#8B5CF6",
            "Mobile Development": "#F59E0B",
          }

          // Create 50 random nodes
          for (let i = 0; i < 50; i++) {
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
            const x = 50 + Math.random() * 400
            const y = 50 + Math.random() * 200
            const r = 5 + Math.random() * 5

            // Determine which cluster this node belongs to
            const clusterNames = Object.keys(colors)
            const nodeCluster =
              i % 4 === 0 ? currentCluster : clusterNames[Math.floor(Math.random() * clusterNames.length)]
            const color = colors[nodeCluster as keyof typeof colors]

            circle.setAttribute("cx", x.toString())
            circle.setAttribute("cy", y.toString())
            circle.setAttribute("r", r.toString())
            circle.setAttribute("fill", color)
            circle.setAttribute("opacity", nodeCluster === currentCluster ? "1" : "0.5")

            // Add hover effect
            circle.setAttribute("class", "transition-all duration-300 hover:r-8 cursor-pointer")

            // Add title for tooltip
            const title = document.createElementNS("http://www.w3.org/2000/svg", "title")
            title.textContent = `User in ${nodeCluster} cluster\nSkills: JavaScript, Python, AWS\nGoal: ${nodeCluster} Engineer`
            circle.appendChild(title)

            svg.appendChild(circle)
          }

          container.appendChild(svg)
        } catch (error) {
          console.error("Error initializing plot:", error)
        }
      }
    }

    initPlot()
  }, [currentCluster])

  const learningPathItems = [
    { id: 1, title: "Python Basics", completed: true, percentage: 100 },
    { id: 2, title: "Data Structures & Algorithms", completed: true, percentage: 100 },
    { id: 3, title: "Machine Learning Fundamentals", completed: false, percentage: 80 },
    { id: 4, title: "Deep Learning with TensorFlow", completed: false, percentage: 45 },
    { id: 5, title: "Data Visualization with Plotly", completed: false, percentage: 20 },
  ]

  return (
    <main className="flex-1 h-screen overflow-y-auto p-6 bg-background">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Your learning journey continues.</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
          {currentCluster} Cluster
        </Badge>
      </div>

      <Tabs defaultValue="visualization" className="mb-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="visualization" className="flex-1 sm:flex-none">Cluster Visualization</TabsTrigger>
          <TabsTrigger value="learning" className="flex-1 sm:flex-none">Learning Path</TabsTrigger>
        </TabsList>

        <TabsContent value="visualization" className="mt-4">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Skill Cluster Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={plotContainerRef} className="w-full h-[500px] bg-white dark:bg-gray-800 rounded-md" />
              <div className="mt-4 flex gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Data Science</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Cloud Engineering</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm">Web Development</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm">Mobile Development</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="mt-4">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Your Learning Path</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Based on your cluster, we recommend the following learning path.
                <span className="font-medium text-blue-600"> 80% of your cluster peers completed Python Basics.</span>
              </p>

              <div className="space-y-6">
                {learningPathItems.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id={`item-${item.id}`} checked={item.completed} />
                      <Label
                        htmlFor={`item-${item.id}`}
                        className={`${item.completed ? "line-through text-muted-foreground" : "font-medium"}`}
                      >
                        {item.title}
                      </Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={item.percentage} className="h-2" />
                      <span className="text-xs font-medium">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
