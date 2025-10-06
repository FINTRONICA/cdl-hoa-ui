// import React from 'react'
// import { useRouter } from 'next/navigation'

// export type EntityType = 'propertyManagementCompany' | 'owner' | 'propertys' | 'voucherPayment' | 'feeRepush' | 'userManagement' | 'roleManagement' | 'masterBudget' | 'propertyBudget'

// interface PageActionButtonsProps {
//   entityType: EntityType
//   onDownloadTemplate?: () => void
//   onUploadDetails?: () => void
//   onAddNew?: () => void
//   className?: string
//   showButtons?: {
//     downloadTemplate?: boolean
//     uploadDetails?: boolean
//     addNew?: boolean
//   }
// }

// /**
//  * PageActionButtons - Reusable component for entity page action buttons
//  * 
//  * This component provides consistent action buttons (Download Template, Upload Details, Add New)
//  * across different entity pages (Projects, Investors, Developers).
//  * 
//  * Features:
//  * - Automatic navigation to entity-specific form pages
//  * - Customizable download and upload handlers
//  * - Consistent styling across all pages
//  * - Type-safe entity type configuration
//  * - Configurable button visibility
//  * 
//  * @example
//  * // Basic usage with default handlers
//  * <PageActionButtons entityType="investor" />
//  * 
//  * @example
//  * // With custom handlers
//  * <PageActionButtons 
//  *   entityType="project"
//  *   onDownloadTemplate={() => downloadProjectTemplate()}
//  *   onUploadDetails={() => uploadProjectDetails()}
//  * />
//  * 
//  * @example
//  * // Show only Add New button
//  * <PageActionButtons 
//  *   entityType="manualPayment"
//  *   showButtons={{ addNew: true }}
//  * />
//  */
// export const PageActionButtons: React.FC<PageActionButtonsProps> = ({
//   entityType,
//   onDownloadTemplate,
//   onUploadDetails,
//   onAddNew,
//   className = '',
//   showButtons = {
//     downloadTemplate: true,
//     uploadDetails: true,
//     addNew: true,
//   },
// }) => {
//   const router = useRouter()

//   // Entity-specific configurations
//   const entityConfig = {
//     propertyManagementCompany: {
//       label: 'Add New Property Management',
//       route: '/property-management-company/new',
//     },
//     owner: {
//       label: 'Add New Owner',
//       route: '/owners/new',
//     },
//     propertys: {
//       label: 'Add New Property',
//       route: '/propertys/new',
//     },
//     voucherPayment: {
//       label: 'Add New',
//       route: '/payments/voucher/new',
//     },
//     feeRepush: {
//       label: 'Add New',
//       route: '/fee-repush/new',
//     },
//     userManagement: {
//       label: 'Add New User',
//       route: '/admin/user-management/new',
//     },
//     roleManagement: {
//       label: 'Add New Role',
//       route: '/admin/role-management/new',
//     },
//     masterBudget:{
//       label: 'Add New',
//       route: '/budgets/master-budget/new',
//     },
//     propertyBudget:{
//       label: 'Add New',
//       route: '/budgets/property-budget/new',
//     }
//   }

//   const config = entityConfig[entityType]

//   const handleAddNew = () => {
//     if (onAddNew) {
//       onAddNew()
//     } else {
//       router.push(config.route)
//     }
//   }

//   const handleDownloadTemplate = () => {
//     if (onDownloadTemplate) {
//       onDownloadTemplate()
//     } else {
//       // Default behavior - you can customize this
//       console.log(`Download ${entityType} template`)
//     }
//   }

//   const handleUploadDetails = () => {
//     if (onUploadDetails) {
//       onUploadDetails()
//     } else {
//       // Default behavior - you can customize this
//       console.log(`Upload ${entityType} details`)
//     }
//   }

//   return (
//     <div className={`flex justify-end gap-2 py-3.5 px-4 ${className}`}>
//       {showButtons.downloadTemplate && (
//         <button
//           onClick={handleDownloadTemplate}
//           className="flex items-center h-8 py-1.5 px-2.5 gap-1.5 text-[#155DFC] font-sans font-medium text-sm hover:bg-blue-50 rounded-md transition-colors"
//         >
//           <img src="/download icon.svg" alt="download icon" />
//           Download Template
//         </button>
//       )}
//       {showButtons.uploadDetails && (
//         <button
//           onClick={handleUploadDetails}
//           className="flex items-center h-8 py-1.5 bg-[#DBEAFE] rounded-md px-2.5 gap-1.5 text-[#155DFC] font-sans font-medium text-sm hover:bg-blue-100 transition-colors"
//         >
//           <img src="/upload.svg" alt="upload icon" />
//           Upload Details
//         </button>
//       )}
//       {showButtons.addNew && (
//         <button
//           onClick={handleAddNew}
//           className="flex items-center h-8 py-1.5 bg-[#155DFC] rounded-md px-2.5 gap-1.5 text-[#FAFAF9] font-sans font-medium text-sm hover:bg-blue-700 transition-colors"
//         >
//           <img src="/circle-plus.svg" alt="plus icon" />
//           {config.label}
//         </button>
//       )}
//     </div>
//   )
// } 





import React from 'react'
import { useRouter } from 'next/navigation'
import FilterListIcon from "@mui/icons-material/FilterList";

export type EntityType =
  | 'propertyManagementCompany'
  | 'owner'
  | 'propertys'
  | 'voucherPayment'
  | 'feeRepush'
  | 'userManagement'
  | 'roleManagement'
  | 'masterBudget'
  | 'propertyBudget'

interface PageActionButtonsProps {
  entityType: EntityType
  onDownloadTemplate?: () => void
  onUploadDetails?: () => void
  onAddNew?: () => void
  className?: string
  showButtons?: {
    downloadTemplate?: boolean
    uploadDetails?: boolean
    addNew?: boolean
    showAllSearch?: boolean
  }
  /** NEW PROPS **/
  showAllSearch?: boolean
  onToggleAllSearch?: () => void
}

export const PageActionButtons: React.FC<PageActionButtonsProps> = ({
  entityType,
  onDownloadTemplate,
  onUploadDetails,
  onAddNew,
  className = '',
  showButtons = {
    downloadTemplate: true,
    uploadDetails: true,
    addNew: true,
    showAllSearch: false
  },
  showAllSearch = false,
  onToggleAllSearch
}) => {
  const router = useRouter()

  const entityConfig = {
    propertyManagementCompany: {
      label: 'Add New Property Management',
      route: '/property-management-company/new',
    },
    owner: {
      label: 'Add New Owner',
      route: '/owners/new',
    },
    propertys: {
      label: 'Add New Property',
      route: '/propertys/new',
    },
    voucherPayment: {
      label: 'Add New',
      route: '/payments/voucher/new',
    },
    feeRepush: {
      label: 'Add New',
      route: '/fee-repush/new',
    },
    userManagement: {
      label: 'Add New User',
      route: '/admin/user-management/new',
    },
    roleManagement: {
      label: 'Add New Role',
      route: '/admin/role-management/new',
    },
    masterBudget: {
      label: 'Add New',
      route: '/budgets/master-budget/new',
    },
    propertyBudget: {
      label: 'Add New',
      route: '/budgets/property-budget/new',
    }
  }

  const config = entityConfig[entityType]

  const handleAddNew = () => {
    if (onAddNew) {
      onAddNew()
    } else {
      router.push(config.route)
    }
  }

  return (
    <div className={`flex justify-end gap-2 py-3.5 px-4 ${className}`}>
      {showButtons?.showAllSearch && (
        <button
          onClick={onToggleAllSearch}
          className="flex items-center h-8 py-1.5 px-2.5 gap-1.5 bg-[#155DFC] text-[#FAFAF9] font-sans font-medium text-sm hover:bg-blue-700 rounded-md transition-colors"
        >
          <FilterListIcon fontSize="small" className="text-[#FAFAF9]" />
          {showAllSearch ? "Hide All Search" : "Show All Search"}
        </button>
      )}

      {showButtons.downloadTemplate && (
        <button
          onClick={onDownloadTemplate}
          className="flex items-center h-8 py-1.5 px-2.5 gap-1.5 text-[#155DFC] font-sans font-medium text-sm hover:bg-blue-50 rounded-md transition-colors"
        >
          <img src="/download icon.svg" alt="download icon" />
          Download Template
        </button>
      )}

      {showButtons.uploadDetails && (
        <button
          onClick={onUploadDetails}
          className="flex items-center h-8 py-1.5 bg-[#DBEAFE] rounded-md px-2.5 gap-1.5 text-[#155DFC] font-sans font-medium text-sm hover:bg-blue-100 transition-colors"
        >
          <img src="/upload.svg" alt="upload icon" />
          Upload Details
        </button>
      )}

      {showButtons.addNew && (
        <button
          onClick={handleAddNew}
          className="flex items-center h-8 py-1.5 bg-[#155DFC] rounded-md px-2.5 gap-1.5 text-[#FAFAF9] font-sans font-medium text-sm hover:bg-blue-700 transition-colors"
        >
          <img src="/circle-plus.svg" alt="plus icon" />
          {config.label}
        </button>
      )}
    </div>
  )
}
