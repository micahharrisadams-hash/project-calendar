"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Assignment, Class } from "@/lib/types"

interface TaskItemProps {
  assignment: Assignment
  classInfo?: Class
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskItem({ assignment, classInfo, onToggle, onDelete }: TaskItemProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const isOverdue = () => {
    if (!assignment.dueDate || assignment.completed) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(assignment.dueDate)
    return due < today
  }

  return (
    <div
      className={cn(
        "group flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:shadow-sm",
        assignment.completed && "opacity-60"
      )}
    >
      <Checkbox
        checked={assignment.completed}
        onCheckedChange={() => onToggle(assignment.id)}
        className="h-5 w-5"
      />
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "font-medium text-card-foreground truncate",
            assignment.completed && "line-through text-muted-foreground"
          )}
        >
          {assignment.title}
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-1">
          {classInfo && (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={cn("h-2 w-2 rounded-full", classInfo.color)} />
              {classInfo.name}
            </span>
          )}
          {assignment.dueDate && (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs",
                isOverdue() ? "text-destructive" : "text-muted-foreground"
              )}
            >
              <Calendar className="h-3 w-3" />
              {formatDate(assignment.dueDate)}
              {isOverdue() && " (overdue)"}
            </span>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(assignment.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete assignment</span>
      </Button>
    </div>
  )
}
