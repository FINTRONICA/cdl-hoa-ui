'use client'

import { useEffect } from 'react'
import { preloadData } from '@/hooks/useDataLoader'
import { projectsDataLoader } from '@/data/projectsData'
import { activitiesDataLoader } from '@/data/activitiesData'

// Define the data loader type more specifically
type DataLoader<T = unknown> = () => Promise<T[]> | T[]

// Preload data for different pages
const preloadConfig: Record<string, { loader: DataLoader; cacheKey: string }> = {
  '/projects': {
    loader: projectsDataLoader as DataLoader,
    cacheKey: 'projects-data',
  },
  '/activities/pending': {
    loader: activitiesDataLoader as DataLoader,
    cacheKey: 'activities-data',
  },
  '/activities/involved': {
    loader: activitiesDataLoader as DataLoader,
    cacheKey: 'activities-data',
  },
}

export function NavigationPreloader() {
  useEffect(() => {
    
    Object.entries(preloadConfig).forEach(([path, config]) => {
      
      preloadData(config.loader, config.cacheKey)
    })
  }, [])

  return null
} 