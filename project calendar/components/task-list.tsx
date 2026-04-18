"use client"

import { TaskItem } from "./task-item"
import { ClipboardList } from "lucide-react"
import type { Assignment, Class } from "@/lib/types"

interface TaskListProps {
  assignments: Assignment[]
  classes: Class[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskList({ assignments, classes, onToggle, onDelete }: TaskListProps) {
  const getClassById = (classId: string) => {
    return classes.find((c) => c.id === classId)
  }

  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <ClipboardList className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-foreground mb-1">No assignments yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Add your first assignment to start tracking your study tasks.
        </p>
      </div>
    )
  }

  const pendingAssignments = assignments.filter((a) => !a.completed)
  const completedAssignments = assignments.filter((a) => a.completed)

  return (
    <div className="space-y-6">
      {pendingAssignments.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            To Do ({pendingAssignments.length})
          </h3>
          <div className="space-y-2">
            {pendingAssignments.map((assignment) => (
              <TaskItem
                key={assignment.id}
                assignment={assignment}
                classInfo={getClassById(assignment.classId)}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {completedAssignments.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Completed ({completedAssignments.length})
          </h3>
          <div className="space-y-2">
            {completedAssignments.map((assignment) => (
              <TaskItem
                key={assignment.id}
                assignment={assignment}
                classInfo={getClassById(assignment.classId)}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
