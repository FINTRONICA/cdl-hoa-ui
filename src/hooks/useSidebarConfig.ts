import { useMemo } from 'react'
import { useSidebarLabels } from './useSidebarLabels'
import { useSidebarLabelsStore } from '@/store/sidebarLabelsStore'
import { SidebarLabelsService } from '@/services/api/sidebarLabelsService'
import { createSidebarConfig, type SidebarSection } from '@/constants/sidebarConfig'

export const useSidebarConfig = (): {
  sections: SidebarSection[]
  getLabelResolver?: (sidebarId: string, fallback: string) => string
} => {
  const { data: labels, isLoading } = useSidebarLabels()
  const { currentLanguage } = useSidebarLabelsStore()

  const hasLabels = !!(labels && Object.keys(labels).length > 0)
  const resolvedLabels = hasLabels ? labels! : undefined

  const labelResolver = useMemo(() => {
    if (resolvedLabels) {
      return (sidebarId: string, fallback: string) =>
        SidebarLabelsService.getLabelBySidebarId(
          resolvedLabels,
          sidebarId,
          currentLanguage,
          fallback
        )
    }

    return (_sidebarId: string, fallback: string) => fallback
  }, [currentLanguage, resolvedLabels])

  const sections = useMemo(() => {
    if (isLoading && !hasLabels) {
      return []
    }

    return createSidebarConfig(labelResolver)
  }, [hasLabels, isLoading, labelResolver])

  return {
    sections,
    getLabelResolver: labelResolver,
  }
}

export const useSidebarConfigWithLoading = (): {
  sections: SidebarSection[]
  isLoading: boolean
  error: Error | null
} => {
  const { data: labels, isLoading, error } = useSidebarLabels()
  const { currentLanguage } = useSidebarLabelsStore()

  const hasLabels = !!(labels && Object.keys(labels).length > 0)
  const resolvedLabels = hasLabels ? labels! : undefined

  const labelResolver = useMemo(() => {
    if (resolvedLabels) {
      return (sidebarId: string, fallback: string) =>
        SidebarLabelsService.getLabelBySidebarId(
          resolvedLabels,
          sidebarId,
          currentLanguage,
          fallback
        )
    }

    return (_sidebarId: string, fallback: string) => fallback
  }, [currentLanguage, resolvedLabels])

  const sections = useMemo(() => {
    if (isLoading && !hasLabels) {
      return []
    }

    return createSidebarConfig(labelResolver)
  }, [hasLabels, isLoading, labelResolver])

  return {
    sections,
    isLoading: isLoading && !hasLabels,
    error,
  }
}

