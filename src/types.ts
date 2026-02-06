import type { LucideIcon } from 'lucide-react'

export interface Category {
  id: string
  label: string
  icon: LucideIcon
  color: string
}

export interface Question {
  id: string
  type: 'text' | 'choice'
  title: string
  subtitle: string
  placeholder?: string
  choices?: string[]
}

export interface LogEntry {
  id: string
  categoryId: string
  answers: Record<string, string>
  createdAt: string
}
