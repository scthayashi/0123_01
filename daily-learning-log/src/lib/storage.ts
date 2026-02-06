import type { LogEntry } from '../types'

const STORAGE_KEY = 'learning-log-entries'

export function loadEntries(): LogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveEntry(entry: LogEntry): void {
  const entries = loadEntries()
  entries.unshift(entry)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function getTodayCount(): number {
  const today = new Date().toISOString().slice(0, 10)
  return loadEntries().filter((e) => e.createdAt.slice(0, 10) === today).length
}
