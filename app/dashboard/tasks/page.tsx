"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronDown, Plus, Search, SlidersHorizontal } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { initialTasks, initialTeamMembers } from "@/lib/data"
import { TaskPriorityBadge } from "@/components/task-priority-badge"
import { TaskStatusBadge } from "@/components/task-status-badge"
import { useToast } from "@/hooks/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

export default function TasksPage() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState(initialTasks)
  const [teamMembers] = useState(initialTeamMembers)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterAssignee, setFilterAssignee] = useState("all")
  const [filterDueDate, setFilterDueDate] = useState("all")
  const [selectedDate, setSelectedDate] = useState(null)
  const [sortBy, setSortBy] = useState("dueDate")
  const [sortDirection, setSortDirection] = useState("asc")
  const [selectedTasks, setSelectedTasks] = useState([])
  const [isAllSelected, setIsAllSelected] = useState(false)

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority
    const matchesStatus = filterStatus === "all" || task.status === filterStatus
    const matchesAssignee = filterAssignee === "all" || task.assignee === filterAssignee

    let matchesDueDate = true
    if (filterDueDate !== "all") {
      const today = new Date()
      const dueDate = new Date(task.dueDate)
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)
      const nextWeek = new Date(today)
      nextWeek.setDate(today.getDate() + 7)

      if (filterDueDate === "today") {
        matchesDueDate = dueDate.toDateString() === today.toDateString()
      } else if (filterDueDate === "tomorrow") {
        matchesDueDate = dueDate.toDateString() === tomorrow.toDateString()
      } else if (filterDueDate === "week") {
        matchesDueDate = dueDate >= today && dueDate <= nextWeek
      } else if (filterDueDate === "overdue") {
        matchesDueDate = dueDate < today && task.status !== "completed"
      } else if (filterDueDate === "custom" && selectedDate) {
        matchesDueDate = dueDate.toDateString() === selectedDate.toDateString()
      }
    }

    return matchesSearch && matchesPriority && matchesStatus && matchesAssignee && matchesDueDate
  })

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      const dateA = new Date(a.dueDate || "9999-12-31")
      const dateB = new Date(b.dueDate || "9999-12-31")
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA
    } else if (sortBy === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return sortDirection === "asc"
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority]
    } else if (sortBy === "title") {
      return sortDirection === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    } else if (sortBy === "status") {
      const statusOrder = { todo: 1, "in-progress": 2, review: 3, completed: 4 }
      return sortDirection === "asc"
        ? statusOrder[a.status] - statusOrder[b.status]
        : statusOrder[b.status] - statusOrder[a.status]
    }
    return 0
  })

  // Check if all tasks are selected
  useEffect(() => {
    setIsAllSelected(selectedTasks.length > 0 && selectedTasks.length === filteredTasks.length)
  }, [selectedTasks, filteredTasks])

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedTasks([])
    } else {
      setSelectedTasks(filteredTasks.map((task) => task.id))
    }
  }

  const handleSelectTask = (taskId) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId))
    } else {
      setSelectedTasks([...selectedTasks, taskId])
    }
  }

  const handleBulkStatusChange = (newStatus) => {
    if (selectedTasks.length === 0) return

    const updatedTasks = tasks.map((task) =>
      selectedTasks.includes(task.id)
        ? {
            ...task,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            activity: [
              ...task.activity,
              {
                id: task.activity.length + 1,
                type: "status_changed",
                user: "You",
                details: `Status changed to ${newStatus}`,
                timestamp: new Date().toISOString(),
              },
            ],
          }
        : task,
    )

    setTasks(updatedTasks)
    setSelectedTasks([])

    toast({
      title: "Tasks Updated",
      description: `${selectedTasks.length} tasks moved to ${newStatus.replace("-", " ")}`,
    })
  }

  const handleBulkDelete = () => {
    if (selectedTasks.length === 0) return

    setTasks(tasks.filter((task) => !selectedTasks.includes(task.id)))
    setSelectedTasks([])

    toast({
      title: "Tasks Deleted",
      description: `${selectedTasks.length} tasks have been deleted`,
    })
  }

  const formatDate = (dateString) => {
    if (!dateString) return "No date"
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const isOverdue = (dueDate) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search tasks..."
                  className="w-full md:w-[260px] pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[130px]">
                    <span>Status</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">In Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-[130px]">
                    <span>Priority</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                  <SelectTrigger className="w-[130px]">
                    <span>Assignee</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Members</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.name}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterDueDate} onValueChange={setFilterDueDate}>
                  <SelectTrigger className="w-[130px]">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Due Date</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="week">Next 7 Days</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="custom">Custom Date</SelectItem>
                  </SelectContent>
                </Select>
                {filterDueDate === "custom" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[180px] justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground",
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[130px]">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  <span>Sort By</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`}
                />
              </Button>
            </div>
          </div>

          {selectedTasks.length > 0 && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <span className="text-sm font-medium">{selectedTasks.length} tasks selected</span>
              <div className="ml-auto flex gap-2">
                <Select onValueChange={handleBulkStatusChange}>
                  <SelectTrigger className="h-8 w-[150px]">
                    <span>Change Status</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">In Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                  Delete
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedTasks([])}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="bg-background rounded-lg border shadow-sm">
            <div className="flex items-center p-4 border-b">
              <div className="w-[40px] flex justify-center">
                <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} aria-label="Select all tasks" />
              </div>
              <div className="flex-1 font-medium">Task</div>
              <div className="w-[100px] text-center font-medium">Status</div>
              <div className="w-[100px] text-center font-medium">Priority</div>
              <div className="w-[150px] text-center font-medium">Assignee</div>
              <div className="w-[120px] text-center font-medium">Due Date</div>
            </div>
            <div className="divide-y">
              {sortedTasks.length > 0 ? (
                sortedTasks.map((task) => (
                  <div key={task.id} className="flex items-center p-4 hover:bg-muted/50">
                    <div className="w-[40px] flex justify-center">
                      <Checkbox
                        checked={selectedTasks.includes(task.id)}
                        onCheckedChange={() => handleSelectTask(task.id)}
                        aria-label={`Select task ${task.title}`}
                      />
                    </div>
                    <div className="flex-1 font-medium">
                      <div>{task.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">{task.description}</div>
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {task.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="w-[100px] text-center">
                      <TaskStatusBadge status={task.status} />
                    </div>
                    <div className="w-[100px] text-center">
                      <TaskPriorityBadge priority={task.priority} />
                    </div>
                    <div className="w-[150px] flex justify-center items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg?height=30&width=30" alt={task.assignee} />
                        <AvatarFallback>{task.assignee ? task.assignee.charAt(0) : "U"}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assignee || "Unassigned"}</span>
                    </div>
                    <div className="w-[120px] text-center">
                      <span className={`text-sm ${isOverdue(task.dueDate) ? "text-red-500 font-medium" : ""}`}>
                        {formatDate(task.dueDate)}
                        {isOverdue(task.dueDate) && task.status !== "completed" && (
                          <div className="text-xs text-red-500 font-medium">Overdue</div>
                        )}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No tasks found. Try adjusting your filters or create a new task.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

