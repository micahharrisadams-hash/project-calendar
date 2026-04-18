"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import type { Class } from "@/lib/types"

interface AddTaskFormProps {
  classes: Class[]
  onAddTask: (title: string, classId: string, dueDate: string) => void
}

export function AddTaskForm({ classes, onAddTask }: AddTaskFormProps) {
  const [title, setTitle] = useState("")
  const [classId, setClassId] = useState("")
  const [dueDate, setDueDate] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && classId) {
      onAddTask(title.trim(), classId, dueDate)
      setTitle("")
      setClassId("")
      setDueDate("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="text"
          placeholder="Assignment title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 bg-background border-border"
        />
        <Select value={classId} onValueChange={setClassId}>
          <SelectTrigger className="sm:w-40 bg-background border-border">
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent>
            {classes.length === 0 ? (
              <SelectItem value="none" disabled>
                Add a class first
              </SelectItem>
            ) : (
              classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="sm:w-40 bg-background border-border"
        />
        <Button type="submit" className="gap-2" disabled={classes.length === 0}>
          <Plus className="h-4 w-4" />
          <span className="sm:inline">Add</span>
        </Button>
      </div>
      {classes.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Add a class in the sidebar to create assignments.
        </p>
      )}
    </form>
  )
}
