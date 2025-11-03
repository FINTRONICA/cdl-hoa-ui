'use client'

import React, { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'

import { masterBudgetService } from '@/services/api/budget/masterBudgetService'
import { type BudgetMasterFormOptions } from '@/types/budget'

interface MasterBudgetSharedData {
  options: BudgetMasterFormOptions
  isInitialLoading: boolean
  hasErrors: boolean
  refetch: () => void
}

const EMPTY_OPTIONS: BudgetMasterFormOptions = {
  chargeTypes: [],
  groupNames: [],
  categories: [],
  categorySubs: [],
  categorySubToSubs: [],
  services: [],
}

const MasterBudgetDataContext = createContext<MasterBudgetSharedData | null>(null)

interface MasterBudgetDataProviderProps {
  children: ReactNode
}

export const MasterBudgetDataProvider: React.FC<MasterBudgetDataProviderProps> = ({
  children,
}) => {
  const query = useQuery({
    queryKey: ['masterBudget', 'formOptions'],
    queryFn: () => masterBudgetService.getFormOptions(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  const value = useMemo<MasterBudgetSharedData>(
    () => ({
      options: query.data ?? EMPTY_OPTIONS,
      isInitialLoading: query.isLoading,
      hasErrors: Boolean(query.error),
      refetch: query.refetch,
    }),
    [query.data, query.error, query.isLoading, query.refetch]
  )

  return (
    <MasterBudgetDataContext.Provider value={value}>
      {children}
    </MasterBudgetDataContext.Provider>
  )
}

export const useMasterBudgetData = () => {
  const context = useContext(MasterBudgetDataContext)
  if (!context) {
    throw new Error('useMasterBudgetData must be used within MasterBudgetDataProvider')
  }
  return context
}

