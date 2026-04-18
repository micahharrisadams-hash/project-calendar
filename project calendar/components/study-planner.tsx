"use client"

import { useState, useEffect } from "react"
import { AddTaskForm } from "./add-task-form"
import { TaskList } from "./task-list"
import { ClassManager } from "./class-manager"
import { CalendarView } from "./calendar-view"
import { AuthForm } from "./auth-form"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, CheckCircle2, Clock, LogOut, List, CalendarDays, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { User, Class, Assignment } from "@/lib/types"

const CURRENT_USER_KEY = "study-planner-current-user"
const ASSIGNMENTS_KEY = "study-planner-assignments"
const CLASSES_KEY = "study-planner-classes"

export function StudyPlanner() {
  const [user, setUser] = useState<User | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY)
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        console.error("Failed to parse stored user")
      }
    }
    setIsLoaded(true)
  }, [])

  // Load user-specific data when user changes
  useEffect(() => {
    if (user) {
      const assignmentsKey = `${ASSIGNMENTS_KEY}-${user.id}`
      const classesKey = `${CLASSES_KEY}-${user.id}`

      const storedAssignments = localStorage.getItem(assignmentsKey)
      const storedClasses = localStorage.getItem(classesKey)

      if (storedAssignments) {
        try {
          setAssignments(JSON.parse(storedAssignments))
        } catch {
          console.error("Failed to parse assignments")
        }
      }

      if (storedClasses) {
        try {
          setClasses(JSON.parse(storedClasses))
        } catch {
          console.error("Failed to parse classes")
        }
      }
    }
  }, [user])

  // Save assignments to localStorage
  useEffect(() => {
    if (user && isLoaded) {
      localStorage.setItem(`${ASSIGNMENTS_KEY}-${user.id}`, JSON.stringify(assignments))
    }
  }, [assignments, user, isLoaded])

  // Save classes to localStorage
  useEffect(() => {
    if (user && isLoaded) {
      localStorage.setItem(`${CLASSES_KEY}-${user.id}`, JSON.stringify(classes))
    }
  }, [classes, user, isLoaded])

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loggedInUser))
  }

  const handleLogout = () => {
    setUser(null)
    setAssignments([])
    setClasses([])
    localStorage.removeItem(CURRENT_USER_KEY)
  }

  const addAssignment = (title: string, classId: string, dueDate: string) => {
    const newAssignment: Assignment = {
      id: crypto.randomUUID(),
      title,
      classId,
      dueDate,
      completed: false,
      createdAt: Date.now(),
    }
    setAssignments((prev) => [newAssignment, ...prev])
  }

  const toggleAssignment = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    )
  }

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id))
  }

  const addClass = (name: string, color: string) => {
    const newClass: Class = {
      id: crypto.randomUUID(),
      name,
      color,
    }
    setClasses((prev) => [...prev, newClass])
  }

  const deleteClass = (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id))
    // Also delete assignments linked to this class
    setAssignments((prev) => prev.filter((a) => a.classId !== id))
  }

  const completedCount = assignments.filter((a) => a.completed).length
  const pendingCount = assignments.filter((a) => !a.completed).length

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="rounded-lg bg-primary p-2">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Study Planner</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Welcome back, {user.username}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "w-72 border-r border-border bg-card p-4 fixed inset-y-0 left-0 z-20 mt-[65px] transform transition-transform lg:relative lg:mt-0 lg:transform-none",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <ClassManager
            classes={classes}
            onAddClass={addClass}
            onDeleteClass={deleteClass}
          />
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-background/80 z-10 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 max-w-4xl mx-auto w-full">
          {/* Stats */}
          {assignments.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-semibold text-foreground">{pendingCount}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-semibold text-foreground">{completedCount}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </div>
          )}

          {/* Add Assignment Form */}
          <div className="rounded-lg border border-border bg-card p-4 mb-6">
            <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              Add Assignment
            </h2>
            <AddTaskForm classes={classes} onAddTask={addAssignment} />
          </div>

          {/* Tabs for List/Calendar view */}
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="list" className="gap-2">
                <List className="h-4 w-4" />
                List
              </TabsTrigger>
              <TabsTrigger value="calendar" className="gap-2">
                <CalendarDays className="h-4 w-4" />
                Calendar
              </TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <TaskList
                assignments={assignments}
                classes={classes}
                onToggle={toggleAssignment}
                onDelete={deleteAssignment}
              />
            </TabsContent>
            <TabsContent value="calendar">
              <CalendarView
                assignments={assignments}
                classes={classes}
                onToggleAssignment={toggleAssignment}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
