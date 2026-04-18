"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Class } from "@/lib/types"
import { CLASS_COLORS } from "@/lib/types"

interface ClassManagerProps {
  classes: Class[]
  onAddClass: (name: string, color: string) => void
  onDeleteClass: (id: string) => void
}

export function ClassManager({ classes, onAddClass, onDeleteClass }: ClassManagerProps) {
  const [newClassName, setNewClassName] = useState("")
  const [selectedColor, setSelectedColor] = useState(CLASS_COLORS[0].value)
  const [isAdding, setIsAdding] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newClassName.trim()) {
      onAddClass(newClassName.trim(), selectedColor)
      setNewClassName("")
      setSelectedColor(CLASS_COLORS[0].value)
      setIsAdding(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Classes
        </h3>
        {!isAdding && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="text-muted-foreground"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Class
          </Button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-4 space-y-3">
          <Input
            type="text"
            placeholder="Class name"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            className="bg-background"
            autoFocus
          />
          <div className="flex flex-wrap gap-2">
            {CLASS_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setSelectedColor(color.value)}
                className={cn(
                  "h-6 w-6 rounded-full transition-all",
                  color.value,
                  selectedColor === color.value && "ring-2 ring-offset-2 ring-foreground"
                )}
                title={color.name}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm">
              Add
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {classes.length === 0 && !isAdding ? (
        <div className="text-center py-8">
          <div className="rounded-full bg-muted p-3 inline-block mb-3">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No classes added yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3"
            >
              <div className={cn("h-3 w-3 rounded-full", cls.color)} />
              <span className="flex-1 text-sm font-medium text-card-foreground">
                {cls.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteClass(cls.id)}
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete class</span>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
