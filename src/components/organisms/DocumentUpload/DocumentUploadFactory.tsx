import React from 'react'
import { useFormContext } from 'react-hook-form'
import DocumentUpload from './DocumentUpload'
import { createBuildPartnerDocumentConfig } from './configs/buildPartnerConfig'
import { createProjectDocumentConfig } from './configs/projectConfig'
import { createInvestorDocumentConfig } from './configs/investorConfig'
import { createPaymentDocumentConfig } from './configs/paymentConfig'
import { createSuretyBondDocumentConfig } from './configs/suretyBondConfig'
import { createBudgetDocumentConfig } from './configs/budgetConfig'
import { DocumentItem } from '../DeveloperStepper/developerTypes'
import { createBudgetCategoryDocumentConfig } from './configs/budgerCategoryConfig'

export type DocumentUploadType =
  | 'ASSET_REGISTER'
  | 'MANAGEMENT_FIRMS'
  | 'OWNER_REGISTRY'
  | 'INVESTOR'
  | 'PROJECT'
  | 'NAV_MENU'
  | 'PAYMENTS'
  | 'TRANSACTIONS'
  | 'FEE_REPUSH'
  | 'DISCARDED_TRANSACTION'
  | 'PROCESSED_TRANSACTION'
  | 'PENDING_TRANSACTION'
  | 'STAKEHOLDER'
  | 'ROLES'
  | 'PERMISSIONS'
  | 'SURETY_BOND'
  | 'BUILD_PARTNER_ASSET'
  | 'BUDGET'
  | 'BUDGET_CATEGORY'

interface DocumentUploadFactoryProps {
  type: DocumentUploadType
  entityId: string
  isOptional?: boolean
  isReadOnly?: boolean
  onDocumentsChange?: (documents: DocumentItem[]) => void
  formFieldName?: string
}

const DocumentUploadFactory: React.FC<DocumentUploadFactoryProps> = ({
  type,
  entityId,
  isOptional = true,
  isReadOnly = false,
  onDocumentsChange,
  formFieldName = 'documents',
}) => {
  const { setValue, watch } = useFormContext()

  const handleDelete = (document: DocumentItem) => {
    const currentDocuments = watch(formFieldName) || []
    const updatedDocuments = currentDocuments.filter(
      (doc: DocumentItem) => doc.id !== document.id
    )
    setValue(formFieldName, updatedDocuments)
    if (onDocumentsChange) {
      onDocumentsChange(updatedDocuments)
    }
  }

  const createConfig = () => {
    const baseOptions = {
      isOptional,
      isReadOnly,
      onDelete: handleDelete,
      ...(onDocumentsChange && { onDocumentsChange }),
    }

    switch (type) {
      case 'ASSET_REGISTER':
        return createBuildPartnerDocumentConfig(entityId, baseOptions)

      case 'MANAGEMENT_FIRMS':
        return createProjectDocumentConfig(entityId, {
          ...baseOptions,
          title: 'Management Firm Documents',
          description: 'Upload management firm-related documents.',
        })

      case 'OWNER_REGISTRY':
        return createInvestorDocumentConfig(entityId, {
          ...baseOptions,
          title: 'Owner Registry Documents',
          description: 'Upload owner registry-related documents.',
        })

      case 'INVESTOR':
        return createInvestorDocumentConfig(entityId, {
          ...baseOptions,
          title: 'Investor Documents',
          description:
            'This step is optional. You can upload investor-related documents or skip to continue.',
        })

      case 'NAV_MENU':
        return createBuildPartnerDocumentConfig(entityId, {
          ...baseOptions,
          title: 'Navigation Menu Documents',
          description: 'Upload navigation menu-related documents.',
        })

      case 'PAYMENTS':
        return createPaymentDocumentConfig(entityId, {
          ...baseOptions,
          title: 'Payment Documents',
          description:
            'This step is optional. You can upload payment-related documents or skip to continue.',
        })

      case 'SURETY_BOND':
        return createSuretyBondDocumentConfig(entityId, {
          ...baseOptions,
          title: 'Surety Bond Documents',
          description: 'Upload surety bond-related documents.',
        })

      case 'TRANSACTIONS':
        return createBuildPartnerDocumentConfig(entityId, {
          ...baseOptions,
          title: 'Transaction Documents',
          description: 'Upload transaction-related documents.',
        })

      case 'FEE_REPUSH':
        return createBuildPartnerDocumentConfig(entityId, {
          ...baseOptions,
          title: 'Fee Repush Documents',
          description: 'Upload fee repush-related documents.',
        })

      case 'DISCARDED_TRANSACTION':
        return createBuildPartnerDocumentConfig(entityId, {
          ...baseOptions,
          title: 'Discarded Transaction Documents',
          description: 'Upload discarded transaction-related documents.',
        })

      case 'PROCESSED_TRANSACTION':
        return createBuildPartnerDocumentConfig(entityId, {
          ...baseOptions,
          title: 'Processed Transaction Documents',
          description: 'Upload processed transaction-related documents.',
        })

      case 'PENDING_TRANSACTION':
        return createBuildPartnerDocumentConfig(entityId, {
          ...baseOptions,
          title: 'Pending Transaction Documents',
          description: 'Upload pending transaction-related documents.',
        })

      case 'STAKEHOLDER':
        return createBuildPartnerDocumentConfig(entityId, {
          ...baseOptions,
          title: 'Stakeholder Documents',
          description: 'Upload stakeholder-related documents.',
        })

      case 'ROLES':
        return createBuildPartnerDocumentConfig(entityId, {
          ...baseOptions,
          title: 'Role Documents',
          description: 'Upload role-related documents.',
        })

      case 'PERMISSIONS':
        return createBuildPartnerDocumentConfig(entityId, {
          ...baseOptions,
          title: 'Permission Documents',
          description: 'Upload permission-related documents.',
        })

      case 'PROJECT':
        return createProjectDocumentConfig(entityId, {
          ...baseOptions,
          title: 'Build Partner Assest Documents',
          description:
            'This step is optional. You can upload project-related documents or skip to continue.',
        })

      case 'BUILD_PARTNER_ASSET':
        return createBuildPartnerDocumentConfig(entityId, {
          ...baseOptions,
          title: 'Build Partner Asset Documents',
          description: 'Upload build partner asset-related documents.',
        })

      case 'BUDGET':
        return createBudgetDocumentConfig(entityId, {
          ...baseOptions,
          title: 'Budget Documents',
          description: 'Upload budget-related documents.',
        })

      case 'BUDGET_CATEGORY':
        return createBudgetCategoryDocumentConfig(entityId, {
          ...baseOptions,
          title: 'Budget Category Documents',
          description: 'Upload budget category-related documents.',
        })

      default:
        throw new Error(`Unsupported document upload type: ${type}`)
    }
  }

  const config = createConfig()

  return <DocumentUpload config={config} formFieldName={formFieldName} />
}

export default DocumentUploadFactory
