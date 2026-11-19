'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface CompareContextType {
  selectedIds: number[]
  toggleSelection: (id: number) => void
  clearSelection: () => void
  isSelected: (id: number) => boolean
  selectionCount: number
  canCompare: boolean
  error: string | null
  dismissError: () => void
}

const CompareContext = createContext<CompareContextType | null>(null)

const MAX_COMPARE = 4

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)

  const toggleSelection = useCallback((id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id)
      }
      if (prev.length >= MAX_COMPARE) {
        setError(`You can compare up to ${MAX_COMPARE} universities. Remove one to add another.`)
        return prev
      }
      return [...prev, id]
    })
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedIds([])
  }, [])

  const isSelected = useCallback((id: number) => selectedIds.includes(id), [selectedIds])

  const dismissError = useCallback(() => {
    setError(null)
  }, [])

  return (
    <CompareContext.Provider
      value={{
        selectedIds,
        toggleSelection,
        clearSelection,
        isSelected,
        selectionCount: selectedIds.length,
        canCompare: selectedIds.length >= 2,
        error,
        dismissError,
      }}
    >
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const context = useContext(CompareContext)
  if (!context) throw new Error('useCompare must be used within CompareProvider')
  return context
}