"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Calendar, Edit, Filter, MoreHorizontal, Plus, Search, Trash, User, X } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import { initialTasks, initialTeamMembers } from "@/lib/data"
import { cn } from "@/lib/utils"
import { TaskPriorityBadge } from "@/components/task-priority-badge"
import { TaskStatusBadge } from "@/components/task-status-badge"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ActivityFeed } from "@/components/activity-feed"
import { TaskAttachments } from "@/components/task-attachments"
import { SimpleTaskBoard } from "@/components/simple-task-board"

export default function DashboardPage() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState(initialTasks)
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    assignee: "",
    dueDate: "",
    tags: [],
  })
  const [newComment, setNewComment] = useState("")
  const [selectedTask, setSelectedTask] = useState(null)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterAssignee, setFilterAssignee] = useState("all")
  const [filterTags, setFilterTags] = useState([])
  const [date, setDate] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedTask, setEditedTask] = useState(null)
  const [newTag, setNewTag] = useState("")
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [taskView, setTaskView] = useState("kanban")
  const [sortBy, setSortBy] = useState("dueDate")
  const [sortDirection, setSortDirection] = useState("asc")
  const [attachments, setAttachments] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dashboardStats, setDashboardStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    upcomingDeadlines: 0,
  })

  // Calculate dashboard stats
  useEffect(() => {
    const today = new Date()
    const stats = {
      totalTasks: tasks.length,
      completedTasks: tasks.filter((task) => task.status === "completed").length,
      overdueTasks: tasks.filter((task) => {
        const dueDate = new Date(task.dueDate)
        return task.status !== "completed" && dueDate < today
      }).length,
      upcomingDeadlines: tasks.filter((task) => {
        const dueDate = new Date(task.dueDate)
        const oneWeekFromNow = new Date()
        oneWeekFromNow.setDate(today.getDate() + 7)
        return task.status !== "completed" && dueDate >= today && dueDate <= oneWeekFromNow
      }).length,
    }
    setDashboardStats(stats)
  }, [tasks])

  // Filter tasks based on search, priority, assignee, and tags
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority
    const matchesAssignee = filterAssignee === "all" || task.assignee === filterAssignee
    const matchesTags = filterTags.length === 0 || filterTags.every((tag) => task.tags && task.tags.includes(tag))
    return matchesSearch && matchesPriority && matchesAssignee && matchesTags
  })

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      const dateA = new Date(a.dueDate)
      const dateB = new Date(b.dueDate)
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA
    } else if (sortBy === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return sortDirection === "asc"
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority]
    } else if (sortBy === "title") {
      return sortDirection === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    }
    return 0
  })

  const handleCreateTask = () => {
    if (newTask.title.trim() === "") {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      })
      return
    }

    const task = {
      id: tasks.length + 1,
      ...newTask,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      attachments: [],
      activity: [
        {
          id: 1,
          type: "created",
          user: "You",
          timestamp: new Date().toISOString(),
        },
      ],
    }

    setTasks([...tasks, task])
    setNewTask({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      assignee: "",
      dueDate: "",
      tags: [],
    })
    setIsTaskDialogOpen(false)

    toast({
      title: "Success",
      description: "Task created successfully",
    })
  }

  const handleUpdateTask = () => {
    if (!editedTask || editedTask.title.trim() === "") {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      })
      return
    }

    const updatedTasks = tasks.map((task) =>
      task.id === editedTask.id
        ? {
            ...editedTask,
            updatedAt: new Date().toISOString(),
            activity: [
              ...task.activity,
              {
                id: task.activity.length + 1,
                type: "updated",
                user: "You",
                timestamp: new Date().toISOString(),
              },
            ],
          }
        : task,
    )

    setTasks(updatedTasks)
    setIsEditMode(false)
    setIsTaskDetailOpen(false)

    toast({
      title: "Success",
      description: "Task updated successfully",
    })
  }

  const handleDeleteTask = () => {
    if (!selectedTask) return

    setTasks(tasks.filter((task) => task.id !== selectedTask.id))
    setIsDeleteDialogOpen(false)
    setIsTaskDetailOpen(false)

    toast({
      title: "Success",
      description: "Task deleted successfully",
    })
  }

  const handleUpdateTaskStatus = (taskId, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
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
      ),
    )
  }

  const handleAddComment = () => {
    if (newComment.trim() === "" || !selectedTask) return

    const comment = {
      id: selectedTask.comments.length + 1,
      user: "You",
      text: newComment,
      timestamp: new Date().toISOString(),
    }

    const updatedTasks = tasks.map((task) =>
      task.id === selectedTask.id
        ? {
            ...task,
            comments: [...task.comments, comment],
            activity: [
              ...task.activity,
              {
                id: task.activity.length + 1,
                type: "comment_added",
                user: "You",
                timestamp: new Date().toISOString(),
              },
            ],
          }
        : task,
    )

    setTasks(updatedTasks)
    setNewComment("")

    // Update the selected task to show the new comment
    setSelectedTask(updatedTasks.find((task) => task.id === selectedTask.id))
  }

  const handleAddTag = () => {
    if (newTag.trim() === "" || !editedTask) return

    if (!editedTask.tags.includes(newTag)) {
      setEditedTask({
        ...editedTask,
        tags: [...editedTask.tags, newTag],
      })
    }

    setNewTag("")
  }

  const handleRemoveTag = (tag) => {
    if (!editedTask) return

    setEditedTask({
      ...editedTask,
      tags: editedTask.tags.filter((t) => t !== tag),
    })
  }

  const handleUploadAttachment = () => {
    // Simulate file upload
    setIsUploading(true)

    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval)
          setIsUploading(false)

          // Add mock attachment
          const newAttachment = {
            id: Date.now(),
            name: "Document.pdf",
            size: "2.4 MB",
            type: "application/pdf",
            uploadedBy: "You",
            uploadedAt: new Date().toISOString(),
            url: "#",
          }

          const updatedTasks = tasks.map((task) =>
            task.id === selectedTask.id
              ? {
                  ...task,
                  attachments: [...task.attachments, newAttachment],
                  activity: [
                    ...task.activity,
                    {
                      id: task.activity.length + 1,
                      type: "attachment_added",
                      user: "You",
                      details: `Added ${newAttachment.name}`,
                      timestamp: new Date().toISOString(),
                    },
                  ],
                }
              : task,
          )

          setTasks(updatedTasks)
          setSelectedTask(updatedTasks.find((task) => task.id === selectedTask.id))

          toast({
            title: "Success",
            description: "File uploaded successfully",
          })

          return 0
        }
        return prev + 10
      })
    }, 300)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return ""
    const options = { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateTimeString).toLocaleString(undefined, options)
  }

  const isOverdue = (dueDate) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  const handleTaskSelect = (task) => {
    setSelectedTask(task)
    setEditedTask(task)
    setIsTaskDetailOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalTasks}</div>
              <p className="text-xs text-muted-foreground">
                {tasks.length > 0 ? `+${Math.round((tasks.length / initialTasks.length - 1) * 100)}%` : "0%"} from start
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.completedTasks}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardStats.totalTasks > 0
                  ? `${Math.round((dashboardStats.completedTasks / dashboardStats.totalTasks) * 100)}% completion rate`
                  : "0% completion rate"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.overdueTasks}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardStats.totalTasks > 0
                  ? `${Math.round((dashboardStats.overdueTasks / dashboardStats.totalTasks) * 100)}% of total tasks`
                  : "0% of total tasks"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.upcomingDeadlines}</div>
              <p className="text-xs text-muted-foreground">Due in the next 7 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Task Board</h1>
          <div className="flex items-center gap-2">
            <Tabs value={taskView} onValueChange={setTaskView} className="w-[200px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="kanban">Kanban</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="w-[200px] pl-8 md:w-[260px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[130px]">
                <Filter className="mr-2 h-4 w-4" />
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
                <User className="mr-2 h-4 w-4" />
                <span>Assignee</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Members</SelectItem>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.name}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>Add details for the new task. Click save when you're done.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Task description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={newTask.status}
                        onValueChange={(value) => setNewTask({ ...newTask, status: value })}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="review">In Review</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                      >
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="assignee">Assignee</Label>
                      <Select
                        value={newTask.assignee}
                        onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}
                      >
                        <SelectTrigger id="assignee">
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamMembers.map((member) => (
                            <SelectItem key={member.id} value={member.name}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !newTask.dueDate && "text-muted-foreground",
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {newTask.dueDate ? format(new Date(newTask.dueDate), "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={newTask.dueDate ? new Date(newTask.dueDate) : undefined}
                            onSelect={(date) => setNewTask({ ...newTask, dueDate: date ? date.toISOString() : "" })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {newTask.tags &&
                        newTask.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="gap-1">
                            {tag}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 rounded-full p-0"
                              onClick={() => setNewTask({ ...newTask, tags: newTask.tags.filter((t) => t !== tag) })}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add tag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          className="h-8 w-[150px]"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              if (newTag.trim() && !newTask.tags.includes(newTag)) {
                                setNewTask({ ...newTask, tags: [...(newTask.tags || []), newTag] })
                                setNewTag("")
                              }
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (newTag.trim() && !newTask.tags.includes(newTag)) {
                              setNewTask({ ...newTask, tags: [...(newTask.tags || []), newTag] })
                              setNewTag("")
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTask}>Create Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {taskView === "kanban" ? (
          <SimpleTaskBoard tasks={sortedTasks} onTaskUpdate={handleUpdateTaskStatus} onTaskSelect={handleTaskSelect} />
        ) : (
          <div className="bg-background rounded-lg border shadow-sm">
            <div className="flex items-center p-4 border-b">
              <div className="flex-1 font-medium">Task</div>
              <div className="w-[100px] text-center font-medium">Status</div>
              <div className="w-[100px] text-center font-medium">Priority</div>
              <div className="w-[150px] text-center font-medium">Assignee</div>
              <div className="w-[120px] text-center font-medium">Due Date</div>
              <div className="w-[80px] text-center font-medium">Actions</div>
            </div>
            <div className="divide-y">
              {sortedTasks.length > 0 ? (
                sortedTasks.map((task) => (
                  <div key={task.id} className="flex items-center p-4 hover:bg-muted/50">
                    <div className="flex-1 font-medium">{task.title}</div>
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
                        {formatDate(task.dueDate) || "No date"}
                      </span>
                    </div>
                    <div className="w-[80px] text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedTask(task)
                          setEditedTask(task)
                          setIsTaskDetailOpen(true)
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
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
        )}

        {/* Task Detail Dialog */}
        <Dialog open={isTaskDetailOpen} onOpenChange={setIsTaskDetailOpen}>
          {selectedTask && (
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  {isEditMode ? (
                    <Input
                      value={editedTask.title}
                      onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                      className="text-xl font-bold"
                    />
                  ) : (
                    <DialogTitle className="text-xl">{selectedTask.title}</DialogTitle>
                  )}
                  <div className="flex items-center gap-2">
                    {isEditMode ? (
                      <>
                        <Button variant="outline" size="sm" onClick={() => setIsEditMode(false)}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleUpdateTask}>
                          Save
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" onClick={() => setIsEditMode(true)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <DialogDescription>
                  Created {formatDateTime(selectedTask.createdAt)} • Last updated{" "}
                  {formatDateTime(selectedTask.updatedAt)}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Tabs defaultValue="details">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="attachments">Attachments</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="space-y-4 pt-4">
                    <div className="grid gap-2">
                      <Label>Description</Label>
                      {isEditMode ? (
                        <Textarea
                          value={editedTask.description}
                          onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                          className="min-h-[100px]"
                        />
                      ) : (
                        <div className="rounded-md bg-muted p-3 text-sm">
                          {selectedTask.description || "No description provided."}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Status</Label>
                        <div className="flex items-center gap-2 mt-1">
                          {isEditMode ? (
                            <Select
                              value={editedTask.status}
                              onValueChange={(value) => setEditedTask({ ...editedTask, status: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="todo">To Do</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="review">In Review</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <TaskStatusBadge status={selectedTask.status} />
                          )}
                        </div>
                      </div>
                      <div>
                        <Label>Priority</Label>
                        <div className="flex items-center gap-2 mt-1">
                          {isEditMode ? (
                            <Select
                              value={editedTask.priority}
                              onValueChange={(value) => setEditedTask({ ...editedTask, priority: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <TaskPriorityBadge priority={selectedTask.priority} />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Assignee</Label>
                        <div className="flex items-center gap-2 mt-1">
                          {isEditMode ? (
                            <Select
                              value={editedTask.assignee}
                              onValueChange={(value) => setEditedTask({ ...editedTask, assignee: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Unassigned" />
                              </SelectTrigger>
                              <SelectContent>
                                {teamMembers.map((member) => (
                                  <SelectItem key={member.id} value={member.name}>
                                    {member.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <>
                              <Avatar className="h-6 w-6">
                                <AvatarImage src="/placeholder.svg?height=30&width=30" alt={selectedTask.assignee} />
                                <AvatarFallback>
                                  {selectedTask.assignee ? selectedTask.assignee.charAt(0) : "U"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{selectedTask.assignee || "Unassigned"}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label>Due Date</Label>
                        <div className="flex items-center gap-2 mt-1">
                          {isEditMode ? (
                            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !editedTask.dueDate && "text-muted-foreground",
                                  )}
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {editedTask.dueDate ? format(new Date(editedTask.dueDate), "PPP") : "No date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <CalendarComponent
                                  mode="single"
                                  selected={editedTask.dueDate ? new Date(editedTask.dueDate) : undefined}
                                  onSelect={(date) => {
                                    setEditedTask({ ...editedTask, dueDate: date ? date.toISOString() : "" })
                                    setIsCalendarOpen(false)
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <>
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span
                                className={`text-sm ${isOverdue(selectedTask.dueDate) ? "text-red-500 font-medium" : ""}`}
                              >
                                {formatDate(selectedTask.dueDate) || "No date"}
                                {isOverdue(selectedTask.dueDate) && selectedTask.status !== "completed" && (
                                  <span className="ml-2 text-xs text-red-500 font-medium">Overdue</span>
                                )}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Tags</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {isEditMode ? (
                          <>
                            {editedTask.tags &&
                              editedTask.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="gap-1">
                                  {tag}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 rounded-full p-0"
                                    onClick={() => handleRemoveTag(tag)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </Badge>
                              ))}
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add tag"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                className="h-8 w-[150px]"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault()
                                    handleAddTag()
                                  }
                                }}
                              />
                              <Button variant="outline" size="sm" onClick={handleAddTag}>
                                Add
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            {selectedTask.tags && selectedTask.tags.length > 0 ? (
                              selectedTask.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary">
                                  {tag}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-muted-foreground">No tags</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Comments</Label>
                      <div className="mt-2 space-y-3 max-h-[200px] overflow-y-auto">
                        {selectedTask.comments && selectedTask.comments.length > 0 ? (
                          selectedTask.comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3 p-3 bg-muted rounded-lg">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium">{comment.user}</p>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDateTime(comment.timestamp)}
                                  </span>
                                </div>
                                <p className="text-sm mt-1">{comment.text}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No comments yet</p>
                        )}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Textarea
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="min-h-[80px]"
                        />
                      </div>
                      <Button className="mt-2" onClick={handleAddComment}>
                        Add Comment
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="activity" className="space-y-4 pt-4">
                    <ActivityFeed activities={selectedTask.activity} />
                  </TabsContent>
                  <TabsContent value="attachments" className="space-y-4 pt-4">
                    <TaskAttachments
                      attachments={selectedTask.attachments}
                      onUpload={handleUploadAttachment}
                      isUploading={isUploading}
                      uploadProgress={uploadProgress}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </DialogContent>
          )}
        </Dialog>

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Task"
          description="Are you sure you want to delete this task? This action cannot be undone."
          onConfirm={handleDeleteTask}
        />
      </div>
    </DashboardLayout>
  )
}

