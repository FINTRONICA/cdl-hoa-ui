import { useMemo } from 'react'
import { convertDatePickerToZonedDateTime } from '@/utils'
import { ProjectData } from './developerTypes'
import { safeParseInt } from './utils'


export const useStepDataTransformers = () => {
  return useMemo(() => ({
    1: (formData: ProjectData) => ({
      arDeveloperId: formData.arDeveloperId,
      arCifrera: formData.arCifrera,
      arDeveloperRegNo: formData.arDeveloperRegNo,
      arName: formData.arName,
      arMasterName: formData.arMasterName,
      arNameLocal: formData.arNameLocal,
      arOnboardingDate: formData.arOnboardingDate
        ? typeof formData.arOnboardingDate === 'string'
          ? formData.arOnboardingDate
          : convertDatePickerToZonedDateTime(formData.arOnboardingDate.format('YYYY-MM-DD'))
        : null,
      arContactAddress: formData.arContactAddress,
      arContactTel: formData.arContactTel,
      arPoBox: formData.arPoBox,
      arMobile: formData.arMobile,
      arFax: formData.arFax,
      arEmail: formData.arEmail,
      arLicenseNo: formData.arLicenseNo,
      arLicenseExpDate: formData.arLicenseExpDate
        ? typeof formData.arLicenseExpDate === 'string'
          ? formData.arLicenseExpDate
          : convertDatePickerToZonedDateTime(formData.arLicenseExpDate.format('YYYY-MM-DD'))
        : null,
      arWorldCheckFlag: formData.arWorldCheckFlag,
      arWorldCheckRemarks: formData.arWorldCheckRemarks,
      arMigratedData: formData.arMigratedData,
      arRemark: formData.arRemark,
      arRegulatorId: formData.arRegulatorDTO?.id || formData.arRegulatorId,
      arRegulatorDTO: {
        id: safeParseInt(formData.arRegulatorDTO?.id),
      },
      arProjectName: formData.arProjectName,
      arCompanyNumber: formData.arCompanyNumber,
      arMasterCommunity: formData.arMasterCommunity,
      arMasterDeveloper: formData.arMasterDeveloper,
    }),
    2: (formData: ProjectData) => {
      const contact = formData.contactData?.[0]
      if (!contact) {
        throw new Error('Contact data is required for step 2')
      }

      const arcContactName =
        contact.arcContactName ??
        `${contact.arcFirstName ?? ''} ${contact.arcLastName ?? ''}`.trim()

      return {
        arcContactName,
        arcFirstName: contact.arcFirstName ?? '',
        arcLastName: contact.arcLastName ?? '',
        arcContactEmail: contact.arcContactEmail ?? '',
        arcContactAddress: contact.arcContactAddress ?? '',
        arcContactAddressLine1: contact.arcContactAddressLine1 ?? '',
        arcContactAddressLine2: contact.arcContactAddressLine2 ?? '',
        arcContactPoBox: contact.arcContactPoBox ?? '',
        arcContactTelCode: contact.arcContactTelCode ?? '',
        arcCountryMobCode: contact.arcCountryMobCode ?? '',
        arcContactMobNo: contact.arcContactMobNo ?? '',
        arcContactTelNo: contact.arcContactTelNo ?? '',
        arcContactFaxNo: contact.arcContactFaxNo ?? '',
        enabled: contact.enabled ?? true,
        deleted: contact.deleted ?? false,
        assetRegisterDTO:
          contact.assetRegisterDTO ??
          (formData.arDeveloperId
            ? {
                id: parseInt(formData.arDeveloperId, 10),
                enabled: true,
                deleted: false,
              }
            : undefined),
      }
    },
    3: (formData: ProjectData) => ({
      feeStructure: {
        setupFee: parseFloat(formData.fees?.[0]?.amount || '0'),
        transactionFee: parseFloat(formData.fees?.[0]?.feePercentage || '0'),
        monthlyFee: parseFloat(formData.fees?.[0]?.debitAmount || '0'),
      },
      collectionMethod: formData.paymentType || 'manual',
      paymentTerms: formData.fees?.[0]?.frequency || '',
    }),
    4: (formData: ProjectData) => ({
      bpbBeneficiaryId: formData.beneficiaries?.[0]?.id || '',
      bpbBeneficiaryType: formData.beneficiaries?.[0]?.transferType || 'RTGS',
      bpbName: formData.beneficiaries?.[0]?.name || '',
      bpbBankName: formData.beneficiaries?.[0]?.bankName || '',
      bpbSwiftCode: formData.beneficiaries?.[0]?.swiftCode || '',
      bpbRoutingCode: formData.beneficiaries?.[0]?.routingCode || '',
      bpbAccountNumber: formData.beneficiaries?.[0]?.account || '',
      enabled: true,
    }),
    5: (formData: ProjectData) => ({
      reviewData: formData,
      termsAccepted: true,
    }),
  }), [])
}


export const transformStepData = (
  step: number, 
  formData: ProjectData, 
  transformers: ReturnType<typeof useStepDataTransformers>
) => {
  const transformer = transformers[step as keyof typeof transformers]
  if (!transformer) {
    throw new Error(`Invalid step: ${step}`)
  }
  return transformer(formData)
}
