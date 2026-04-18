"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Assignment, Class } from "@/lib/types"

interface CalendarViewProps {
  assignments: Assignment[]
  classes: Class[]
  onToggleAssignment: (id: string) => void
}

export function CalendarView({ assignments, classes, onToggleAssignment }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const startingDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getAssignmentsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return assignments.filter((a) => a.dueDate === dateStr)
  }

  const getClassById = (classId: string) => {
    return classes.find((c) => c.id === classId)
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    )
  }

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">{monthName}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous month</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next month</span>
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-7 border-b border-border">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-2 text-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayAssignments = day ? getAssignmentsForDate(day) : []
            return (
              <div
                key={index}
                className={cn(
                  "min-h-24 p-1 border-b border-r border-border",
                  day === null && "bg-muted/30",
                  index % 7 === 6 && "border-r-0"
                )}
              >
                {day !== null && (
                  <>
                    <div
                      className={cn(
                        "text-sm font-medium mb-1 h-6 w-6 flex items-center justify-center rounded-full",
                        isToday(day) && "bg-primary text-primary-foreground"
                      )}
                    >
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayAssignments.slice(0, 3).map((assignment) => {
                        const cls = getClassById(assignment.classId)
                        return (
                          <button
                            key={assignment.id}
                            onClick={() => onToggleAssignment(assignment.id)}
                            className={cn(
                              "w-full text-left text-xs p-1 rounded truncate",
                              assignment.completed
                                ? "bg-muted text-muted-foreground line-through"
                                : cls?.color
                                ? `${cls.color} text-white`
                                : "bg-muted text-foreground"
                            )}
                            title={assignment.title}
                          >
                            {assignment.title}
                          </button>
                        )
                      })}
                      {dayAssignments.length > 3 && (
                        <div className="text-xs text-muted-foreground px-1">
                          +{dayAssignments.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
