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

  const sections = useMemo(() => {
    if (isLoading) {
      return []
    }
    
    if (labels && Object.keys(labels).length > 0) {
      const getLabel = (sidebarId: string, fallback: string) => {
        const x = SidebarLabelsService.getLabelBySidebarId(labels, sidebarId, currentLanguage, fallback)
        return x
      }
      const dynamicConfig = createSidebarConfig(getLabel)
      return dynamicConfig
    }
    
    return []
  }, [labels, currentLanguage, isLoading])

  const getLabelResolver = useMemo(() => {
    if (labels && Object.keys(labels).length > 0) {
      return (sidebarId: string, fallback: string) => 
        SidebarLabelsService.getLabelBySidebarId(labels, sidebarId, currentLanguage, fallback)
    }
    return undefined
  }, [labels, currentLanguage])

  return {
    sections,
    ...(getLabelResolver && { getLabelResolver })
  }
}

export const useSidebarConfigWithLoading = (): {
  sections: SidebarSection[]
  isLoading: boolean
  error: Error | null
} => {
  const { data: labels, isLoading, error } = useSidebarLabels()
  const { currentLanguage } = useSidebarLabelsStore()
  
  const sections = useMemo(() => {
    // If we're loading, return empty sections to show loading state
    if (isLoading) {
      return []
    }
    
    // If we have labels, use them to create the dynamic config
    if (labels && Object.keys(labels).length > 0) {
      const getLabel = (sidebarId: string, fallback: string) => 
        SidebarLabelsService.getLabelBySidebarId(labels, sidebarId, currentLanguage, fallback)

      const dynamicConfig = createSidebarConfig(getLabel)
      return dynamicConfig
    }
    
    // If no labels are available (API not accessible), use fallback labels
    const getLabel = (sidebarId: string, fallback: string) => fallback
    const fallbackConfig = createSidebarConfig(getLabel)
    return fallbackConfig
  }, [labels, currentLanguage, isLoading, error])
  
  return {
    sections,
    isLoading: isLoading,
    error
  }
}

