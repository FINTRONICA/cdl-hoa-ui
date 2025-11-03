'use client'

import React, { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'

import { managementFirmBudgetService } from '@/services/api/budget/managementFirmBudgetService'
import { type BudgetFormOptions } from '@/types/budget'

interface BudgetSharedData {
  options: BudgetFormOptions
  isInitialLoading: boolean
  hasErrors: boolean
  refetch: () => void
}

const EMPTY_OPTIONS: BudgetFormOptions = {
  managementFirmGroups: [],
  serviceChargeGroups: [],
  categories: [],
  subCategories: [],
  services: [],
  budgetPeriods: [],
}

const BudgetDataContext = createContext<BudgetSharedData | null>(null)

interface BudgetDataProviderProps {
  children: ReactNode
}

export const BudgetDataProvider: React.FC<BudgetDataProviderProps> = ({
  children,
}) => {
  const query = useQuery({
    queryKey: ['managementFirmBudget', 'formOptions'],
    queryFn: () => managementFirmBudgetService.getFormOptions(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  const value = useMemo<BudgetSharedData>(
    () => ({
      options: query.data ?? EMPTY_OPTIONS,
      isInitialLoading: query.isLoading,
      hasErrors: Boolean(query.error),
      refetch: query.refetch,
    }),
    [query.data, query.error, query.isLoading, query.refetch]
  )

  return (
    <BudgetDataContext.Provider value={value}>
      {children}
    </BudgetDataContext.Provider>
  )
}

export const useBudgetData = () => {
  const context = useContext(BudgetDataContext)
  if (!context) {
    throw new Error('useBudgetData must be used within BudgetDataProvider')
  }
  return context
}
