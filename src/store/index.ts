// Zustand store configuration
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useMemo } from 'react'
import { userSlice, type UserSlice } from './slices/userSlice'
import { projectSlice, type ProjectSlice } from './slices/projectSlice'
import {
  transactionSlice,
  type TransactionSlice,
} from './slices/transactionSlice'
import { uiSlice, type UISlice } from './slices/uiSlice'
import { labelsSlice, type LabelsSlice } from './slices/labelsSlice'

// Combined store type
export type AppStore = UserSlice &
  ProjectSlice &
  TransactionSlice &
  UISlice &
  LabelsSlice

// Create the main store
export const useAppStore = create<AppStore>()(
  persist(
    (...a) => {
      const user = userSlice(...a)
      const project = projectSlice(...a)
      const transaction = transactionSlice(...a)
      const ui = uiSlice(...a)
      const labels = labelsSlice(...a)

      return {
        ...user,
        ...project,
        ...transaction,
        ...ui,
        ...labels,
      }
    },
    {
      name: 'escrow-store',
      storage: createJSONStorage(() => {
        // Handle SSR - return null for localStorage on server
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => { },
            removeItem: () => { },
          }
        }
        return localStorage
      }),
      partialize: (state) => ({
        user: state.user,
        theme: state.theme,
        language: state.language,
        // 🔥 CRITICAL: Do NOT persist labels for banking compliance
        // Labels are session-only and always fetched fresh on app load
        // labels: state.labels, // ❌ Excluded for banking compliance
      }),
    }
  )
)

// Store selectors for better performance - memoized to prevent infinite loops
export const useUser = () => useAppStore((state) => state.user)
export const useProjects = () => useAppStore((state) => state.projects)
export const useTransactions = () => useAppStore((state) => state.transactions)

export const useUI = () => {
  const theme = useAppStore((state) => state.theme)
  const language = useAppStore((state) => state.language)
  const sidebarOpen = useAppStore((state) => state.sidebarOpen)
  const modalOpen = useAppStore((state) => state.modalOpen)
  const modalType = useAppStore((state) => state.modalType)
  const notifications = useAppStore((state) => state.notifications)

  return useMemo(
    () => ({
      theme,
      language,
      sidebarOpen,
      modalOpen,
      modalType,
      notifications,
    }),
    [theme, language, sidebarOpen, modalOpen, modalType, notifications]
  )
}

// Store actions - memoized to prevent infinite loops
export const useUserActions = () => {
  const setUser = useAppStore((state) => state.setUser)
  const updateUser = useAppStore((state) => state.updateUser)
  const logout = useAppStore((state) => state.logout)

  return useMemo(
    () => ({
      setUser,
      updateUser,
      logout,
    }),
    [setUser, updateUser, logout]
  )
}

export const useProjectActions = () => {
  const setProjects = useAppStore((state) => state.setProjects)
  const addProject = useAppStore((state) => state.addProject)
  const updateProject = useAppStore((state) => state.updateProject)
  const deleteProject = useAppStore((state) => state.deleteProject)

  return useMemo(
    () => ({
      setProjects,
      addProject,
      updateProject,
      deleteProject,
    }),
    [setProjects, addProject, updateProject, deleteProject]
  )
}

export const useTransactionActions = () => {
  const setTransactions = useAppStore((state) => state.setTransactions)
  const addTransaction = useAppStore((state) => state.addTransaction)
  const updateTransaction = useAppStore((state) => state.updateTransaction)
  const deleteTransaction = useAppStore((state) => state.deleteTransaction)

  return useMemo(
    () => ({
      setTransactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
    }),
    [setTransactions, addTransaction, updateTransaction, deleteTransaction]
  )
}

export const useUIActions = () => {
  const setTheme = useAppStore((state) => state.setTheme)
  const setLanguage = useAppStore((state) => state.setLanguage)
  const toggleSidebar = useAppStore((state) => state.toggleSidebar)
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen)
  const setModalOpen = useAppStore((state) => state.setModalOpen)
  const addNotification = useAppStore((state) => state.addNotification)
  const removeNotification = useAppStore((state) => state.removeNotification)

  return useMemo(
    () => ({
      setTheme,
      setLanguage,
      toggleSidebar,
      setSidebarOpen,
      setModalOpen,
      addNotification,
      removeNotification,
    }),
    [
      setTheme,
      setLanguage,
      toggleSidebar,
      setSidebarOpen,
      setModalOpen,
      addNotification,
      removeNotification,
    ]
  )
}

// 🏦 BANKING COMPLIANCE: Labels selectors - session-only, no persistence
export const useLabels = () => {
  const sidebarLabels = useAppStore((state) => state.sidebarLabels)
  const buildPartnerLabels = useAppStore((state) => state.buildPartnerLabels)
  const capitalPartnerLabels = useAppStore(
    (state) => state.capitalPartnerLabels
  )
  const buildPartnerAssetLabels = useAppStore(
    (state) => state.buildPartnerAssetLabels
  )
  const workflowActionLabels = useAppStore((state) => state.workflowActionLabels)
  const workflowDefinitionLabels = useAppStore((state) => state.workflowDefinitionLabels)
  const workflowStageTemplateLabels = useAppStore((state) => state.workflowStageTemplateLabels)
  const workflowAmountRuleLabels = useAppStore((state) => state.workflowAmountRuleLabels)
  const workflowAmountStageOverrideLabels = useAppStore((state) => state.workflowAmountStageOverrideLabels)
  const workflowRequestedLabels = useAppStore((state) => state.workflowRequestedLabels)
  const allLabelsLoading = useAppStore((state) => state.allLabelsLoading)
  const allLabelsError = useAppStore((state) => state.allLabelsError)

  return useMemo(
    () => ({
      sidebarLabels,
      buildPartnerLabels,
      capitalPartnerLabels,
      buildPartnerAssetLabels,
      workflowActionLabels,
      workflowDefinitionLabels,
      workflowStageTemplateLabels,
      workflowAmountRuleLabels,
      workflowAmountStageOverrideLabels,
      workflowRequestedLabels,
      allLabelsLoading,
      allLabelsError,
    }),
    [sidebarLabels, buildPartnerLabels, capitalPartnerLabels, buildPartnerAssetLabels, workflowActionLabels, allLabelsLoading, allLabelsError, workflowDefinitionLabels, workflowStageTemplateLabels, workflowAmountRuleLabels, workflowAmountStageOverrideLabels, workflowRequestedLabels]

  )
}

export const useLabelsLoadingState = () => {
  const sidebarLabelsLoading = useAppStore((state) => state.sidebarLabelsLoading)
  const buildPartnerLabelsLoading = useAppStore((state) => state.buildPartnerLabelsLoading)
  const capitalPartnerLabelsLoading = useAppStore((state) => state.capitalPartnerLabelsLoading)
  const buildPartnerAssetLabelsLoading = useAppStore((state) => state.buildPartnerAssetLabelsLoading)
  const workflowActionLabelsLoading = useAppStore((state) => state.workflowActionLabelsLoading)
  const workflowDefinitionLabelsLoading = useAppStore((state) => state.workflowDefinitionLabelsLoading)
  const workflowStageTemplateLabelsLoading = useAppStore((state) => state.workflowStageTemplateLabelsLoading)
  const workflowAmountRuleLabelsLoading = useAppStore((state) => state.workflowAmountRuleLabelsLoading)
  const workflowAmountStageOverrideLabelsLoading = useAppStore((state) => state.workflowAmountStageOverrideLabelsLoading)
  const workflowRequestedLabelsLoading = useAppStore((state) => state.workflowRequestedLabelsLoading)

  const getLoadingStatus = useAppStore((state) => state.getLoadingStatus)

  return useMemo(
    () => ({
      sidebarLabelsLoading,
      buildPartnerLabelsLoading,
      capitalPartnerLabelsLoading,
      buildPartnerAssetLabelsLoading,
      workflowActionLabelsLoading,
      workflowDefinitionLabelsLoading,
      workflowStageTemplateLabelsLoading,
      workflowAmountRuleLabelsLoading,
      workflowAmountStageOverrideLabelsLoading,
      workflowRequestedLabelsLoading,

      getLoadingStatus,
    }),
    [sidebarLabelsLoading, buildPartnerLabelsLoading, capitalPartnerLabelsLoading, buildPartnerAssetLabelsLoading, workflowActionLabelsLoading, workflowDefinitionLabelsLoading, workflowStageTemplateLabelsLoading, workflowAmountRuleLabelsLoading, workflowAmountStageOverrideLabelsLoading, workflowRequestedLabelsLoading, getLoadingStatus]

  )
}

export const useLabelsActions = () => {
  // Sidebar actions
  const setSidebarLabels = useAppStore((state) => state.setSidebarLabels)
  const setSidebarLabelsLoading = useAppStore(
    (state) => state.setSidebarLabelsLoading
  )
  const setSidebarLabelsError = useAppStore(
    (state) => state.setSidebarLabelsError
  )

  // Build partner actions
  const setBuildPartnerLabels = useAppStore(
    (state) => state.setBuildPartnerLabels
  )
  const setBuildPartnerLabelsLoading = useAppStore(
    (state) => state.setBuildPartnerLabelsLoading
  )
  const setBuildPartnerLabelsError = useAppStore(
    (state) => state.setBuildPartnerLabelsError
  )

  // Capital partner actions
  const setCapitalPartnerLabels = useAppStore(
    (state) => state.setCapitalPartnerLabels
  )
  const setCapitalPartnerLabelsLoading = useAppStore(
    (state) => state.setCapitalPartnerLabelsLoading
  )
  const setCapitalPartnerLabelsError = useAppStore(
    (state) => state.setCapitalPartnerLabelsError
  )

  // Build partner asset actions
  const setBuildPartnerAssetLabels = useAppStore(
    (state) => state.setBuildPartnerAssetLabels
  )
  const setBuildPartnerAssetLabelsLoading = useAppStore(
    (state) => state.setBuildPartnerAssetLabelsLoading
  )
  const setBuildPartnerAssetLabelsError = useAppStore(
    (state) => state.setBuildPartnerAssetLabelsError
  )

  // Workflow action actions
  const setWorkflowActionLabels = useAppStore((state) => state.setWorkflowActionLabels)
  const setWorkflowActionLabelsLoading = useAppStore((state) => state.setWorkflowActionLabelsLoading)
  const setWorkflowActionLabelsError = useAppStore((state) => state.setWorkflowActionLabelsError)


  //Workflow definition actions
  const setWorkflowDefinitionLabels = useAppStore((state) => state.setWorkflowDefinitionLabels)
  const setWorkflowDefinitionLabelsLoading = useAppStore((state) => state.setWorkflowDefinitionLabelsLoading)
  const setWorkflowDefinitionLabelsError = useAppStore((state) => state.setWorkflowDefinitionLabelsError)


  //Workflow Stage Template actions
  const setWorkflowStageTemplateLabels = useAppStore((state) => state.setWorkflowStageTemplateLabels)
  const setWorkflowStageTemplateLabelsLoading = useAppStore((state) => state.setWorkflowStageTemplateLabelsLoading)
  const setWorkflowStageTemplateLabelsError = useAppStore((state) => state.setWorkflowStageTemplateLabelsError)

  //Workflow Amount Rule actions
  const setWorkflowAmountRuleLabels = useAppStore((state) => state.setWorkflowAmountRuleLabels)
  const setWorkflowAmountRuleLabelsLoading = useAppStore((state) => state.setWorkflowAmountRuleLabelsLoading)
  const setWorkflowAmountRuleLabelsError = useAppStore((state) => state.setWorkflowAmountRuleLabelsError)

  //Workflow Amount Stage Override actions
  const setWorkflowAmountStageOverrideLabels = useAppStore((state) => state.setWorkflowAmountStageOverrideLabels)
  const setWorkflowAmountStageOverrideLabelsLoading = useAppStore((state) => state.setWorkflowAmountStageOverrideLabelsLoading)
  const setWorkflowAmountStageOverrideLabelsError = useAppStore((state) => state.setWorkflowAmountStageOverrideLabelsError)

  //Workflow Requested actions
  const setWorkflowRequestedLabels = useAppStore((state) => state.setWorkflowRequestedLabels)
  const setWorkflowRequestedLabelsLoading = useAppStore((state) => state.setWorkflowRequestedLabelsLoading)
  const setWorkflowRequestedLabelsError = useAppStore((state) => state.setWorkflowRequestedLabelsError)

  // Global actions
  const setAllLabelsLoading = useAppStore((state) => state.setAllLabelsLoading)
  const setAllLabelsError = useAppStore((state) => state.setAllLabelsError)

  // Utility actions
  const clearAllLabels = useAppStore((state) => state.clearAllLabels)
  const getLabel = useAppStore((state) => state.getLabel)
  const hasLabels = useAppStore((state) => state.hasLabels)
  const getAvailableLanguages = useAppStore(
    (state) => state.getAvailableLanguages
  )

  return useMemo(
    () => ({
      // Sidebar
      setSidebarLabels,
      setSidebarLabelsLoading,
      setSidebarLabelsError,

      // Build partner
      setBuildPartnerLabels,
      setBuildPartnerLabelsLoading,
      setBuildPartnerLabelsError,

      // Capital partner
      setCapitalPartnerLabels,
      setCapitalPartnerLabelsLoading,
      setCapitalPartnerLabelsError,

      // Build partner asset
      setBuildPartnerAssetLabels,
      setBuildPartnerAssetLabelsLoading,
      setBuildPartnerAssetLabelsError,


      // Workflow action
      setWorkflowActionLabels,
      setWorkflowActionLabelsLoading,
      setWorkflowActionLabelsError,


      // Workflow definition
      setWorkflowDefinitionLabels,
      setWorkflowDefinitionLabelsLoading,
      setWorkflowDefinitionLabelsError,


      // Workflow Stage Template
      setWorkflowStageTemplateLabels,
      setWorkflowStageTemplateLabelsLoading,
      setWorkflowStageTemplateLabelsError,

      // Workflow Amount Rule
      setWorkflowAmountRuleLabels,
      setWorkflowAmountRuleLabelsLoading,
      setWorkflowAmountRuleLabelsError,

      // Workflow Amount Stage Override
      setWorkflowAmountStageOverrideLabels,
      setWorkflowAmountStageOverrideLabelsLoading,
      setWorkflowAmountStageOverrideLabelsError,

      // Workflow Requested
      setWorkflowRequestedLabels,
      setWorkflowRequestedLabelsLoading,
      setWorkflowRequestedLabelsError,

      // Global
      setAllLabelsLoading,
      setAllLabelsError,

      // Utilities
      clearAllLabels,
      getLabel,
      hasLabels,
      getAvailableLanguages,
    }),

    [
      // Sidebar
      setSidebarLabels, setSidebarLabelsLoading, setSidebarLabelsError,
      // Build partner
      setBuildPartnerLabels, setBuildPartnerLabelsLoading, setBuildPartnerLabelsError,
      // Capital partner
      setCapitalPartnerLabels, setCapitalPartnerLabelsLoading, setCapitalPartnerLabelsError,
      // Build partner asset
      setBuildPartnerAssetLabels, setBuildPartnerAssetLabelsLoading, setBuildPartnerAssetLabelsError,
      // Workflow action   (previously missing)
      setWorkflowActionLabels, setWorkflowActionLabelsLoading, setWorkflowActionLabelsError,
      // Workflow definition
      setWorkflowDefinitionLabels, setWorkflowDefinitionLabelsLoading, setWorkflowDefinitionLabelsError,
      // Workflow Stage Template
      setWorkflowStageTemplateLabels, setWorkflowStageTemplateLabelsLoading, setWorkflowStageTemplateLabelsError,
      // Workflow Amount Rule
      setWorkflowAmountRuleLabels, setWorkflowAmountRuleLabelsLoading, setWorkflowAmountRuleLabelsError,
      // Workflow Amount Stage Override
      setWorkflowAmountStageOverrideLabels, setWorkflowAmountStageOverrideLabelsLoading, setWorkflowAmountStageOverrideLabelsError,
      // Workflow Requested
      setWorkflowRequestedLabels, setWorkflowRequestedLabelsLoading, setWorkflowRequestedLabelsError,
      // Global & utilities
      setAllLabelsLoading, setAllLabelsError,
      clearAllLabels, getLabel, hasLabels, getAvailableLanguages,
    ]
  )
}
