"use client"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, MoreHorizontal } from "lucide-react"
import { TaskPriorityBadge } from "@/components/task-priority-badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function SimpleTaskBoard({ tasks, onTaskUpdate, onTaskSelect }) {
  const { toast } = useToast()

  // Group tasks by status
  const todoTasks = tasks.filter((task) => task.status === "todo")
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress")
  const reviewTasks = tasks.filter((task) => task.status === "review")
  const completedTasks = tasks.filter((task) => task.status === "completed")

  const handleStatusChange = (taskId, newStatus) => {
    onTaskUpdate(taskId, newStatus)
    toast({
      title: "Status Updated",
      description: `Task moved to ${newStatus.replace("-", " ")}`,
    })
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const isOverdue = (dueDate) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  const getTaskCardClasses = (task) => {
    let classes = "cursor-pointer hover:shadow-md transition-shadow"

    if (isOverdue(task.dueDate) && task.status !== "completed") {
      classes += " border-l-2 border-red-500"
    }

    if (task.status === "completed") {
      classes += " opacity-80"
    }

    return classes
  }

  const TaskCard = ({ task }) => (
    <Card className={getTaskCardClasses(task)} onClick={() => onTaskSelect(task)}>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{task.title}</CardTitle>
          <TaskPriorityBadge priority={task.priority} />
        </div>
        <CardDescription className="line-clamp-2 mt-1">{task.description}</CardDescription>
      </CardHeader>
      <CardFooter className="p-4 pt-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src="/placeholder.svg?height=30&width=30" alt={task.assignee} />
            <AvatarFallback>{task.assignee ? task.assignee.charAt(0) : "U"}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-500">{task.assignee || "Unassigned"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-gray-500" />
          <span className={`text-xs ${isOverdue(task.dueDate) ? "text-red-500 font-medium" : "text-gray-500"}`}>
            {formatDate(task.dueDate) || "No date"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Select
            defaultValue={task.status}
            onValueChange={(value) => handleStatusChange(task.id, value)}
            onClick={(e) => e.stopPropagation()}
          >
            <SelectTrigger className="h-7 w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="review">In Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation()
              onTaskSelect(task)
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      {/* To Do Column */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">To Do</h2>
          <Badge variant="outline" className="rounded-full px-3">
            {todoTasks.length}
          </Badge>
        </div>
        <div className="flex flex-col gap-3 min-h-[200px]">
          {todoTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>

      {/* In Progress Column */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">In Progress</h2>
          <Badge variant="outline" className="rounded-full px-3">
            {inProgressTasks.length}
          </Badge>
        </div>
        <div className="flex flex-col gap-3 min-h-[200px]">
          {inProgressTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>

      {/* In Review Column */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">In Review</h2>
          <Badge variant="outline" className="rounded-full px-3">
            {reviewTasks.length}
          </Badge>
        </div>
        <div className="flex flex-col gap-3 min-h-[200px]">
          {reviewTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>

      {/* Completed Column */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Completed</h2>
          <Badge variant="outline" className="rounded-full px-3">
            {completedTasks.length}
          </Badge>
        </div>
        <div className="flex flex-col gap-3 min-h-[200px]">
          {completedTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  )
}

