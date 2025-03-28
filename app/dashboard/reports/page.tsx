"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { ArrowDown, ArrowUp, Download, Filter } from "lucide-react"

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("month")

  // Sample data for charts
  const taskCompletionData = [
    { name: "Mon", completed: 5, total: 8 },
    { name: "Tue", completed: 7, total: 10 },
    { name: "Wed", completed: 4, total: 6 },
    { name: "Thu", completed: 8, total: 12 },
    { name: "Fri", completed: 6, total: 9 },
    { name: "Sat", completed: 3, total: 5 },
    { name: "Sun", completed: 2, total: 4 },
  ]

  const taskDistributionData = [
    { name: "To Do", value: 12 },
    { name: "In Progress", value: 8 },
    { name: "Completed", value: 15 },
  ]

  const teamPerformanceData = [
    { name: "Alex", tasks: 8, completed: 5 },
    { name: "Michael", tasks: 12, completed: 9 },
    { name: "Emily", tasks: 15, completed: 10 },
    { name: "Sarah", tasks: 6, completed: 3 },
  ]

  const productivityTrendData = [
    { name: "Week 1", tasks: 18, completed: 12 },
    { name: "Week 2", tasks: 22, completed: 15 },
    { name: "Week 3", tasks: 25, completed: 20 },
    { name: "Week 4", tasks: 30, completed: 24 },
  ]

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <span>Time Range</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">35</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
              <div className="mt-4 flex items-center gap-1 text-xs text-green-600">
                <ArrowUp className="h-3 w-3" />
                <span>12%</span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">68.5% completion rate</p>
              <div className="mt-4 flex items-center gap-1 text-xs text-green-600">
                <ArrowUp className="h-3 w-3" />
                <span>8%</span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">8.5% of total tasks</p>
              <div className="mt-4 flex items-center gap-1 text-xs text-red-600">
                <ArrowDown className="h-3 w-3" />
                <span>5%</span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Active contributors</p>
              <div className="mt-4 flex items-center gap-1 text-xs text-green-600">
                <ArrowUp className="h-3 w-3" />
                <span>1</span>
                <span className="text-muted-foreground">new this month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Task Completion</CardTitle>
                  <CardDescription>Daily task completion rate for the past week</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <BarChart
                    data={taskCompletionData}
                    index="name"
                    categories={["completed", "total"]}
                    colors={["#4f46e5", "#e5e7eb"]}
                    valueFormatter={(value) => `${value} tasks`}
                    className="h-[300px]"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Task Distribution</CardTitle>
                  <CardDescription>Current distribution of tasks by status</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <PieChart
                    data={taskDistributionData}
                    index="name"
                    category="value"
                    valueFormatter={(value) => `${value} tasks`}
                    colors={["#94a3b8", "#4f46e5", "#22c55e"]}
                    className="h-[300px]"
                  />
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Productivity Trend</CardTitle>
                <CardDescription>Task creation and completion trend over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <LineChart
                  data={productivityTrendData}
                  index="name"
                  categories={["tasks", "completed"]}
                  colors={["#94a3b8", "#4f46e5"]}
                  valueFormatter={(value) => `${value} tasks`}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Task Completion by Priority</CardTitle>
                <CardDescription>Completion rate grouped by task priority</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <BarChart
                  data={[
                    { name: "High", completed: 8, total: 10 },
                    { name: "Medium", completed: 12, total: 18 },
                    { name: "Low", completed: 4, total: 7 },
                  ]}
                  index="name"
                  categories={["completed", "total"]}
                  colors={["#4f46e5", "#e5e7eb"]}
                  valueFormatter={(value) => `${value} tasks`}
                  className="h-[400px]"
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Task completion by team member</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <BarChart
                  data={teamPerformanceData}
                  index="name"
                  categories={["completed", "tasks"]}
                  colors={["#4f46e5", "#e5e7eb"]}
                  valueFormatter={(value) => `${value} tasks`}
                  className="h-[400px]"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

