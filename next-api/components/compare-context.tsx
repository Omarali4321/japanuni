'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface CompareContextType {
  selectedIds: number[]
  toggleSelection: (id: number) => void
  clearSelection: () => void
  isSelected: (id: number) => boolean
  selectionCount: number
  canCompare: boolean
}

const CompareContext = createContext<CompareContextType | null>(null)

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const toggleSelection = useCallback((id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(0, 4)
    )
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedIds([])
  }, [])

  const isSelected = useCallback((id: number) => selectedIds.includes(id), [selectedIds])

  return (
    <CompareContext.Provider
      value={{
        selectedIds,
        toggleSelection,
        clearSelection,
        isSelected,
        selectionCount: selectedIds.length,
        canCompare: selectedIds.length >= 2,
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