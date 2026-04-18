export interface User {
  id: string
  username: string
  password: string
}

export interface Class {
  id: string
  name: string
  color: string
}

export interface Assignment {
  id: string
  title: string
  classId: string
  dueDate: string
  completed: boolean
  createdAt: number
}

export const CLASS_COLORS = [
  { name: "Red", value: "bg-red-500" },
  { name: "Orange", value: "bg-orange-500" },
  { name: "Amber", value: "bg-amber-500" },
  { name: "Green", value: "bg-green-500" },
  { name: "Teal", value: "bg-teal-500" },
  { name: "Blue", value: "bg-blue-500" },
  { name: "Indigo", value: "bg-indigo-500" },
  { name: "Pink", value: "bg-pink-500" },
]
