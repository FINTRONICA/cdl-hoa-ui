import { useMemo } from 'react'
import { convertDatePickerToZonedDateTime } from '@/utils'
import { ProjectData } from './developerTypes'
import { safeParseInt } from './utils'


export const useStepDataTransformers = () => {
  return useMemo(() => ({
    1: (formData: ProjectData) => ({
      arID: formData.arID,
      arCifrera: formData.arCifrera,
      arDeveloperRegNo: formData.arDeveloperRegNo,
      arName: formData.arName,
      arNameLocal: formData.arNameLocal,
      arCompanyName: formData.arCompanyName,
      arProjectName: formData.arProjectName,
      arMasterDeveloper: formData.arMasterDeveloper,
      arMasterCommunity: formData.arMasterCommunity,
      arOnboardingDate: formData.arOnboardingDate
        ? typeof formData.arOnboardingDate === 'string'
          ? formData.arOnboardingDate
          : convertDatePickerToZonedDateTime(formData.arOnboardingDate.format('YYYY-MM-DD'))
        : null,
      arTradeLicenseNo: formData.arTradeLicenseNo,
      arTradeLicenseExpDate: formData.arTradeLicenseExpDate
        ? typeof formData.arTradeLicenseExpDate === 'string'
          ? formData.arTradeLicenseExpDate
          : convertDatePickerToZonedDateTime(formData.arTradeLicenseExpDate.format('YYYY-MM-DD'))
        : null,
      arWorldCheckFlag: formData.arWorldCheckFlag,
      arWorldCheckRemarks: formData.arWorldCheckRemarks,
      arMigratedData: formData.arMigratedData,
      arRemark: formData.arRemark,
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
        bpcFirstName: contact.name?.split(' ')[0] || '',
        bpcLastName: contact.name?.split(' ').slice(1).join(' ') || '',
        bpcContactEmail: contact.email || '',
        bpcContactAddressLine1: contact.address || '',
        bpcContactAddressLine2: '', 
        bpcContactPoBox: contact.pobox || '',
        bpcCountryMobCode: contact.countrycode || '',
        bpcContactTelNo: contact.telephoneno || '',
        bpcContactMobNo: contact.mobileno || '',
        bpcContactFaxNo: contact.fax || '',
        buildPartnerDTO: {
          id: formData.bpDeveloperId ? parseInt(formData.bpDeveloperId) : undefined
        }
      }
    },
    3: (formData: ProjectData) => ({
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
