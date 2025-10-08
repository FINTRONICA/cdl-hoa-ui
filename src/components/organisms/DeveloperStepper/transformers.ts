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
      arremark: formData.arremark,
      arRegulatorDTO: {
        id: safeParseInt(formData.arRegulatorDTO?.id),
      },
    }),
    2: (formData: ProjectData) => {
      const contact = formData.contactData?.[0]
      if (!contact) {
        throw new Error('Contact data is required for step 2')
      }
      
      return {
        arcFirstName: contact.name?.split(' ')[0] || '',
        arcLastName: contact.name?.split(' ').slice(1).join(' ') || '',
        arcContactEmail: contact.email || '',
        arcContactAddressLine1: contact.address || '',
        arcContactAddressLine2: '', 
        arcContactPoBox: contact.pobox || '',
        arcCountryMobCode: contact.countrycode || '',
        arcContactTelNo: contact.telephoneno || '',
        arcContactMobNo: contact.mobileno || '',
        arcContactFaxNo: contact.fax || '',
        assetRegisterDTO: {
          id: formData.arDeveloperId ? parseInt(formData.arDeveloperId) : undefined
        }
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
      arbBeneficiaryId: formData.beneficiaries?.[0]?.id || '',
      arbBeneficiaryType: formData.beneficiaries?.[0]?.transferType || 'RTGS',
      arbName: formData.beneficiaries?.[0]?.name || '',
      arbBankName: formData.beneficiaries?.[0]?.bankName || '',
      arbSwiftCode: formData.beneficiaries?.[0]?.swiftCode || '',
      arbRoutingCode: formData.beneficiaries?.[0]?.routingCode || '',
      arbAccountNumber: formData.beneficiaries?.[0]?.account || '',
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
