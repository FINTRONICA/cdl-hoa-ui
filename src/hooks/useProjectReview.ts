'use client'

import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { realEstateAssetService } from '@/services/api/projectService'

// Data interfaces for project review
export interface ProjectReviewData {
  projectDetails: ProjectDetails | null
  accounts: AccountData[]
  fees: FeeData[]
  beneficiaries: BeneficiaryData[]
  paymentPlans: PaymentPlanData[]
  financialData: FinancialData | null
  closureData: ClosureData[]
  documents: DocumentData[]
}

export interface ProjectDetails {
  id: string
  projectName: string
  projectLocation: string
  projectStatus: string
  projectAccountStatus: string
  projectAccountStatusDate: string
  projectRegistrationDate: string
  projectStartDate: string
  projectStartDateEst: string
  projectCompletionDate: string
  retentionPercent: string
  additionalRetentionPercent: string
  totalRetentionPercent: string
  retentionEffectiveStartDate: string
  projectManagementExpenses: string
  marketingExpenses: string
  realEstateBrokerExpense: string
  advertisingExpense: string
  landOwnerName: string
  projectCompletionPercentage: string
  currency: string
  actualConstructionCost: string
  noOfUnits: string
  remarks: string
  specialApproval: string
  managedBy: string
  backupRef: string
  relationshipManager: string
  assistantRelationshipManager: string
  teamLeaderName: string
  // Developer fields
  developerCif: string
  developerId: string
  developerName: string
  masterDeveloperName: string
  reraNumber: string
  projectType: string
  projectAccountCif: string
  paymentType: string
}

export interface AccountData {
  id: string
  accountNumber: string
  ibanNumber: string
  dateOpened: string
  accountTitle: string
  currency: string
  accountType: string
}

export interface FeeData {
  id: string
  feeType: string
  frequency: string
  debitAmount: string
  feeToBeCollected: string
  nextRecoveryDate: string
  feePercentage: string
  amount: string
  vatPercentage: string
  currency: string
}

export interface BeneficiaryData {
  id: string
  beneficiaryId: string
  beneficiaryType: string
  name: string
  bankName: string
  swiftCode: string
  routingCode: string
  accountNumber: string
  mfBeneficiaryId?: string
  mfBeneficiaryType?: string
  mfName?: string
  mfBankName?: string
  mfSwiftCode?: string
  mfRoutingCode?: string
  mfAccountNumber?: string
}

export interface PaymentPlanData {
  id: string
  installmentNumber: number
  installmentPercentage: string
  projectCompletionPercentage: string
}

export interface FinancialData {
  id: string
  projectEstimatedCost: string
  actualCost: string
  projectBudget: string
  // Add more financial fields as needed
}

export interface ClosureData {
  id: string
  totalIncomeFund: string
  totalPayment: string
  checkGuaranteeDoc: string | null
  enabled: boolean
}

export interface DocumentData {
  id: string
  fileName: string
  documentType: string
  uploadDate: string
  fileSize: number
}

export function useProjectReview(projectId: string) {
  const [projectData, setProjectData] = useState<ProjectReviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllProjectData = async () => {
      if (!projectId) {
        setError('Project ID is required')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const [projectDetails, accounts, fees, beneficiaries, paymentPlans, financialData, closureData, documents] =
          await Promise.allSettled([
            realEstateAssetService.getProjectDetails(projectId),
            realEstateAssetService.getProjectAccounts(projectId),
            realEstateAssetService.getProjectFees(projectId),
            realEstateAssetService.getProjectBeneficiaries(projectId),
            realEstateAssetService.getProjectPaymentPlans(projectId),
            realEstateAssetService.getProjectFinancialSummary(projectId),
            realEstateAssetService.getProjectClosure(projectId),
            realEstateAssetService.getProjectDocuments(projectId),
          ])

       

 
        const projectDetailsResult = projectDetails.status === 'fulfilled' ? projectDetails.value : null
        const accountsResult = accounts.status === 'fulfilled' ? accounts.value : []
        const feesResult = fees.status === 'fulfilled' ? fees.value : []
        const beneficiariesResult = beneficiaries.status === 'fulfilled' ? beneficiaries.value : []
        const paymentPlansResult = paymentPlans.status === 'fulfilled' ? paymentPlans.value : []
        const financialDataResult = financialData.status === 'fulfilled' ? financialData.value : null
      
        const extractedFinancialData = financialDataResult?.content?.[0] || null
        const closureDataResult = closureData.status === 'fulfilled' ? closureData.value : null
       
        const extractedClosureData = closureDataResult?.content || []
        const documentsResult = documents.status === 'fulfilled' ? documents.value : []

      

        const mappedProjectDetails: ProjectDetails | null = projectDetailsResult ? {
          id: projectDetailsResult.id?.toString() || '',
          projectName: projectDetailsResult.mfName || '',
          projectLocation: projectDetailsResult.mfLocation || '',
          projectStatus: projectDetailsResult.mfStatusDTO?.languageTranslationId?.configValue || '',
          projectAccountStatus: projectDetailsResult.mfAccountStatusDTO?.languageTranslationId?.configValue || '',
          projectAccountStatusDate: projectDetailsResult.mfAccStatusDate || '',
          projectRegistrationDate: projectDetailsResult.mfRegistrationDate || '',
          projectStartDate: projectDetailsResult.mfStartDate || '',
          projectStartDateEst: projectDetailsResult.mfCompletionDate || '',
          projectCompletionDate: projectDetailsResult.mfCompletionDate || '',
          retentionPercent: projectDetailsResult.mfRetentionPercent || '',
          additionalRetentionPercent: projectDetailsResult.mfAdditionalRetentionPercent || '',
          totalRetentionPercent: projectDetailsResult.mfTotalRetentionPercent || '',
          retentionEffectiveStartDate: projectDetailsResult.mfRetentionEffectiveDate || '',
          projectManagementExpenses: projectDetailsResult.mfManagementExpenses || '',
          marketingExpenses: projectDetailsResult.mfMarketingExpenses || '',
          realEstateBrokerExpense: projectDetailsResult.mfRealEstateBrokerExp?.toString() || '',
          advertisingExpense: projectDetailsResult.mfAdvertisementExp?.toString() || '',
          landOwnerName: projectDetailsResult.mfLandOwnerName || '',
          projectCompletionPercentage: projectDetailsResult.mfPercentComplete || '',
          currency: projectDetailsResult.mfConstructionCostCurrencyDTO?.languageTranslationId?.configValue || '',
          actualConstructionCost: projectDetailsResult.mfConstructionCost?.toString() || '',
          noOfUnits: projectDetailsResult.mfNoOfUnits?.toString() || '',
          remarks: projectDetailsResult.mfRemarks || '',
          specialApproval: projectDetailsResult.mfSpecialApproval || '',
          managedBy: projectDetailsResult.mfManagedBy || '',
          backupRef: projectDetailsResult.mfBackupUser || '',
          relationshipManager: projectDetailsResult.mfRelationshipManagerName || '',
          assistantRelationshipManager: projectDetailsResult.mfAssestRelshipManagerName || '',
          teamLeaderName: projectDetailsResult.mfTeamLeadName || '',
          // Developer fields
          developerCif: projectDetailsResult.assetRegisterDTO?.arCifrera || '',
          developerId: projectDetailsResult.assetRegisterDTO?.arDeveloperId || '',
          developerName: projectDetailsResult.assetRegisterDTO?.arName || '',
          masterDeveloperName: projectDetailsResult.assetRegisterDTO?.arMasterName || '',
          reraNumber: projectDetailsResult.mfReraNumber || '',
          projectType: projectDetailsResult.mfTypeDTO?.languageTranslationId?.configValue || '',
          projectAccountCif: projectDetailsResult.mfId || '',
          paymentType: projectDetailsResult.mfBlockPaymentTypeDTO?.languageTranslationId?.configValue || '',
        } : null

        const mappedAccounts: AccountData[] = Array.isArray(accountsResult) ? accountsResult.map((acc: any) => ({
          id: acc.id?.toString() || '',
          accountNumber: acc.accountNumber || '',
          ibanNumber: acc.ibanNumber || '',
          dateOpened: acc.dateOpened || '',
          accountTitle: acc.accountTitle || '',
          currency: acc.currencyCode || '',
          accountType: acc.accountType || '',
        })) : []

        const formatDateField = (value: string | null | undefined) => {
          if (!value) return ''
          const parsed = dayjs(value)
          return parsed.isValid() ? parsed.format('DD/MM/YYYY') : value
        }

        const mappedFees: FeeData[] = Array.isArray(feesResult)
          ? feesResult.map((fee: any) => {
              const feeTypeLabel =
                fee.mffCategoryDTO?.languageTranslationId?.configValue ||
                fee.mffCategoryDTO?.settingValue ||
                ''
              const frequencyLabel =
                fee.mffFrequencyDTO?.languageTranslationId?.configValue ||
                fee.mffFrequencyDTO?.settingValue ||
                fee.mffFrequency ||
                fee.mffCalender ||
                ''
              const debitAccountLabel =
                fee.mffAccountTypeDTO?.languageTranslationId?.configValue ||
                fee.mffAccountTypeDTO?.settingValue ||
                ''
              const currencyLabel =
                fee.mffCurrencyDTO?.languageTranslationId?.configValue ||
                fee.mffCurrencyDTO?.settingValue ||
                ''

              return {
          id: fee.id?.toString() || '',
                feeType: feeTypeLabel,
                frequency: frequencyLabel,
                debitAmount: fee.mffDebitAmount?.toString() || '',
                feeToBeCollected: formatDateField(fee.mffCollectionDate),
                nextRecoveryDate: formatDateField(fee.mffNextRecoveryDate),
                feePercentage: fee.mffFeePercentage?.toString() || '',
                amount: fee.mffTotalAmount?.toString() || '',
                vatPercentage: fee.mffVatPercentage?.toString() || '',
                currency: currencyLabel,
                debitAccount: debitAccountLabel,
                enabled:
                  fee.enabled === undefined || fee.enabled === null
                    ? true
                    : Boolean(fee.enabled),
                deleted: Boolean(fee.deleted),
                display: {
                  feeType: feeTypeLabel,
                  frequency: frequencyLabel,
                  currency: currencyLabel,
                  debitAccount: debitAccountLabel,
                },
              }
            })
          : []

        const mappedBeneficiaries: BeneficiaryData[] = Array.isArray(beneficiariesResult)
          ? beneficiariesResult.map((ben: any) => {
              const transferTypeDto =
                ben.mfTransferTypeDTO ||
                ben.mfbTransferTypeDTO ||
                ben.reabTranferTypeDTO ||
                ben.reabTransferTypeDTO

              const beneficiaryType =
                ben.mfBeneficiaryType ||
                transferTypeDto?.languageTranslationId?.configValue ||
                transferTypeDto?.settingValue ||
                ben.mfbType ||
                ben.transferType ||
                ben.beneficiaryType ||
                ''

              const beneficiaryId =
                ben.mfBeneficiaryId || ben.mfbBeneficiaryId || ben.beneficiaryId || ''

              const name = ben.mfName || ben.mfbName || ben.name || ''
              const bankName = ben.mfBank || ben.mfbBank || ben.bankName || ''
              const swiftCode = ben.mfSwift || ben.mfbSwift || ben.swiftCode || ''
              const routingCode =
                ben.mfRoutingCode || ben.mfbRoutingCode || ben.routingCode || ''
              const accountNumber =
                ben.mfBeneAccount || ben.mfbBeneAccount || ben.accountNumber || ''

              return {
          id: ben.id?.toString() || '',
                beneficiaryId,
                beneficiaryType,
                name,
                bankName,
                swiftCode,
                routingCode,
                accountNumber,
                mfBeneficiaryId: beneficiaryId,
                mfBeneficiaryType: beneficiaryType,
                mfName: name,
                mfBankName: bankName,
                mfSwiftCode: swiftCode,
                mfRoutingCode: routingCode,
                mfAccountNumber: accountNumber,
              }
            })
          : []

        const mappedPaymentPlans: PaymentPlanData[] = Array.isArray(paymentPlansResult) ? paymentPlansResult.map((plan: any) => ({
          id: plan.id?.toString() || '',
          installmentNumber: plan.mfppInstallmentNumber || 0,
          installmentPercentage: plan.mfppInstallmentPercentage?.toString() || '0',
          projectCompletionPercentage: plan.mfppProjectCompletionPercentage?.toString() || '0',
        })) : []

        const mappedDocuments: DocumentData[] = Array.isArray(documentsResult)
          ? documentsResult.map((doc: any) => {
              const fileName =
                doc.documentName ||
                doc.fileName ||
                doc.name ||
                `Document_${doc.id ?? Date.now()}`

              const documentType =
                doc.documentTypeDTO?.languageTranslationId?.configValue ||
                doc.documentTypeDTO?.settingValue ||
                doc.documentType?.languageTranslationId?.configValue ||
                doc.documentType?.settingValue ||
                doc.documentClassification ||
                'N/A'

              const rawUploadDate =
                doc.uploadDate ||
                doc.createdDate ||
                doc.createdOn ||
                doc.createdAt ||
                doc.updatedAt ||
                null

              const formattedUploadDate = rawUploadDate
                ? dayjs(rawUploadDate).isValid()
                  ? dayjs(rawUploadDate).format('DD/MM/YYYY')
                  : rawUploadDate
                : ''

              const rawSize = doc.documentSize ?? doc.size ?? doc.fileSize ?? 0
              const numericSize =
                typeof rawSize === 'string'
                  ? parseInt(rawSize.replace(/[^\d]/g, ''), 10) || 0
                  : Number(rawSize) || 0

              return {
                id: doc.id?.toString() || '',
                fileName,
                documentType,
                uploadDate: formattedUploadDate,
                fileSize: numericSize,
              }
            })
          : []

        const mappedClosureData: ClosureData[] = extractedClosureData.map((closure: any) => ({
          id: closure.id?.toString() || '',
          totalIncomeFund: closure.mfAccountStatusDTO?.totalIncomeFund?.toString() || '0',
          totalPayment: closure.mfAccountStatusDTO?.totalPayment?.toString() || '0',
          checkGuaranteeDoc: closure.mfAccountStatusDTO?.checkGuranteeDoc || null,
          enabled: closure.enabled || false,
        }))

        // Set the combined data with mapped values
        setProjectData({
          projectDetails: mappedProjectDetails,
          accounts: mappedAccounts,
          fees: mappedFees,
          beneficiaries: mappedBeneficiaries,
          paymentPlans: mappedPaymentPlans,
          financialData: extractedFinancialData, // Use extracted financial data from content array
          closureData: mappedClosureData,
          documents: mappedDocuments,
        })

      } catch (err) {
        
        setError(err instanceof Error ? err.message : 'Failed to fetch project data')
      } finally {
        setLoading(false)
      }
    }

    fetchAllProjectData()
  }, [projectId])

  // Helper function to fetch individual step data
  const fetchStepData = async (stepNumber: number) => {
    if (!projectId) return null
    
    try {
      switch (stepNumber) {
        case 1: // Project Details
          return await realEstateAssetService.getProjectDetails(projectId)
        case 3: // Accounts
          return await realEstateAssetService.getProjectAccounts(projectId)
        case 4: // Fees
          return await realEstateAssetService.getProjectFees(projectId)
        case 5: // Beneficiaries
          return await realEstateAssetService.getProjectBeneficiaries(projectId)
        case 6: // Payment Plans
          return await realEstateAssetService.getProjectPaymentPlans(projectId)
        case 7: // Financial Data
          return await realEstateAssetService.getProjectFinancialSummary(projectId)
        case 8: // Project Closure
          return await realEstateAssetService.getProjectClosure(projectId)
        default:
          return null
      }
    } catch (error) {
     
      return null
    }
  }

  return {
    projectData,
    loading,
    error,
    refetch: () => {
      setLoading(true)
      setError(null)
      // Trigger re-fetch by updating a dependency
    },
    fetchStepData
  }
}
