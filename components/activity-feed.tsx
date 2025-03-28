import { AlertCircle, Calendar, Check, Clock, Edit, MessageSquare, Paperclip, Plus } from "lucide-react"

export function ActivityFeed({ activities }) {
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return ""
    const options = { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateTimeString).toLocaleString(undefined, options)
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case "created":
        return <Plus className="h-4 w-4" />
      case "updated":
        return <Edit className="h-4 w-4" />
      case "status_changed":
        return <Check className="h-4 w-4" />
      case "comment_added":
        return <MessageSquare className="h-4 w-4" />
      case "attachment_added":
        return <Paperclip className="h-4 w-4" />
      case "due_date_changed":
        return <Calendar className="h-4 w-4" />
      case "priority_changed":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getActivityText = (activity) => {
    switch (activity.type) {
      case "created":
        return "created this task"
      case "updated":
        return "updated this task"
      case "status_changed":
        return activity.details || "changed the status"
      case "comment_added":
        return "added a comment"
      case "attachment_added":
        return activity.details || "added an attachment"
      case "due_date_changed":
        return "changed the due date"
      case "priority_changed":
        return "changed the priority"
      default:
        return "performed an action"
    }
  }

  return (
    <div className="space-y-4">
      {activities && activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{activity.user}</span>
                  <span className="text-sm text-muted-foreground">{getActivityText(activity)}</span>
                </div>
                <span className="text-xs text-muted-foreground">{formatDateTime(activity.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">No activity recorded yet.</div>
      )}
    </div>
  )
}

