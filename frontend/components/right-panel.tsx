"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUpIcon as TrendUp, MessageCircle } from "lucide-react"

interface RightPanelProps {
  currentCluster: string
}

export default function RightPanel({ currentCluster }: RightPanelProps) {
  const [currentTrendIndex, setCurrentTrendIndex] = useState(0)

  const trendingSkills = [
    { skill: "Python + AWS", percentage: 25, cluster: "Data Science" },
    { skill: "React + TypeScript", percentage: 18, cluster: "Web Development" },
    { skill: "TensorFlow + PyTorch", percentage: 22, cluster: "Data Science" },
    { skill: "Kubernetes + Docker", percentage: 30, cluster: "Cloud Engineering" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTrendIndex((prevIndex) => (prevIndex + 1) % trendingSkills.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [trendingSkills.length])

  const currentTrend = trendingSkills[currentTrendIndex]

  const peers = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Data Scientist",
      skills: ["Python", "TensorFlow", "SQL"],
      online: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "ML Engineer",
      skills: ["Python", "PyTorch", "AWS"],
      online: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Michael Brown",
      role: "Data Analyst",
      skills: ["SQL", "Tableau", "R"],
      online: false,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Emma Wilson",
      role: "AI Researcher",
      skills: ["Python", "Deep Learning", "NLP"],
      online: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <div className="w-80 border-l bg-white dark:bg-gray-800 p-4 overflow-y-auto hidden lg:block">
      <div className="space-y-6">
        {/* Trending Skills Alert */}
        <Card className="border-blue-100 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendUp className="h-4 w-4 text-blue-600" />
              Trending Skills Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-blue-700 dark:text-blue-400">{currentTrend.skill}</p>
                <p className="text-xs text-muted-foreground">Popular in {currentTrend.cluster}</p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200">
                ↑ {currentTrend.percentage}%
              </Badge>
            </div>
            <div className="mt-2 flex gap-1">
              {trendingSkills.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full ${index === currentTrendIndex ? "bg-blue-500" : "bg-blue-200 dark:bg-blue-700"}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Peer Matching */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Peers in Your Cluster</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {peers.map((peer) => (
              <div key={peer.id} className="flex items-start gap-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={peer.avatar} alt={peer.name} />
                    <AvatarFallback>{peer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white ${peer.online ? "bg-green-500" : "bg-gray-300"}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{peer.name}</p>
                  <p className="text-xs text-muted-foreground">{peer.role}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {peer.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs py-0 px-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <MessageCircle className="h-4 w-4" />
                  <span className="sr-only">Message</span>
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full text-sm" size="sm">
              View All Peers
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border rounded-md p-3">
                <p className="font-medium text-sm">Data Science Meetup</p>
                <p className="text-xs text-muted-foreground">Tomorrow, 6:00 PM</p>
                <div className="flex justify-between mt-2">
                  <Badge variant="outline" className="text-xs">
                    Virtual
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    Join
                  </Button>
                </div>
              </div>
              <div className="border rounded-md p-3">
                <p className="font-medium text-sm">Python Workshop</p>
                <p className="text-xs text-muted-foreground">Friday, 5:00 PM</p>
                <div className="flex justify-between mt-2">
                  <Badge variant="outline" className="text-xs">
                    In-person
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    RSVP
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

