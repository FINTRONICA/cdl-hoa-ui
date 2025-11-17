export interface LanguageTranslation {
  id: number
  configId: string
  configValue: string
  content: string | null
  status: string | null
  enabled: boolean
  deleted: boolean | null
}

export interface DocumentTypeDTO {
  id: number
  settingKey: string
  settingValue: string
  languageTranslationId: LanguageTranslation
  remarks: string | null
  status: string | null
  enabled: boolean
  deleted: boolean | null
}

export interface CountryOptionDTO {
  id: number
  settingKey: string
  settingValue: string
  languageTranslationId: LanguageTranslation
  remarks: string | null
  status: string | null
  enabled: boolean
  deleted: boolean
}

export interface InvestorTypeDTO {
  id: number
  settingKey: string
  settingValue: string
  languageTranslationId: LanguageTranslation
  remarks: string | null
  status: string | null
  enabled: boolean
  deleted: boolean | null
}

export interface CapitalPartnerResponse {
  id: number
  ownerRegistryId: string
  ownerRegistryName: string
  ownerRegistryMiddleName: string
  ownerRegistryLastName: string
  ownerRegistryOwnershipPercentage: number | null
  ownerRegistryIdNo: string
  ownerRegistryTelephoneNo: string
  ownerRegistryMobileNo: string
  ownerRegistryEmail: string
  ownerRegistryOwnerNumber: number
  isCurrent: boolean
  idExpiaryDate: string
  ownerRegistryLocaleName: string
  documentTypeDTO: DocumentTypeDTO
  countryOptionDTO: CountryOptionDTO
  investorTypeDTO: InvestorTypeDTO
  ownerRegistryBankInfoDTOS: any | null
  ownerRegistryUnitDTO: any | null
  deleted: boolean
  enabled: boolean
  taskStatusDTO: any | null
}

export interface PaymentPlanResponse {
  id?: number
  ownppInstallmentNumber: number
  ownppInstallmentDate: string
  ownppBookingAmount: number
  ownerRegistryDTO: {
    id: number
  }
  deleted: boolean
  enabled: boolean
}

export interface PayModeDTO {
  id: number
  settingKey: string
  settingValue: string
  languageTranslationDTO: LanguageTranslation | null
  remarks: string | null
  status: string | null
  enabled: boolean
  deleted: boolean | null
}
// export interface OwnerRegistryContactResponse {
//   id: number
//   jointownDetailsContactName: string | null
//   jointownDetailsFirstName: string
//   jointownDetailsLastName: string
//   jointownDetailsContactTelCode: string | null
//   jointownDetailsContactTelNo: string
//   jointownDetailsCountryMobCode: string
//   jointownDetailsContactMobNo: string
//   jointownDetailsContactEmail: string
//   jointownDetailsContactAddress: string | null
//   jointownDetailsContactAddressLine1: string
//   jointownDetailsContactAddressLine2: string
//   jointownDetailsContactPoBox: string
//   jointownDetailsContactFaxNo: string
//   enabled: boolean
//   workflowStatus: string | null
//   deleted: boolean | null
//   ownerRegistryDTO?: {
//     id: number
//     [key: string]: any
//   }
// }
export interface BankDetailsResponse {
  id: number
  ownbiPayeeName: string
  ownbiPayeeAddress: string
  ownbiBankName: string
  ownbiBankAddress: string
  ownbiBicCode: string
  ownbiBeneRoutingCode: string
  ownbiAccountNumber: string
  ownerRegistryDTO: CapitalPartnerResponse
  payModeDTO: PayModeDTO
  deleted: boolean
}

export interface UnitStatusDTO {
  id: number
  settingKey: string
  settingValue: string
  languageTranslationDTO: LanguageTranslation | null
  remarks: string | null
  status: string | null
  enabled: boolean
  deleted: boolean | null
}

export interface PropertyIdDTO {
  id: number
  settingKey: string
  settingValue: string
  languageTranslationId: LanguageTranslation | null
  remarks: string | null
  status: string | null
  enabled: boolean
  deleted: boolean
}

export interface RealEstateAssetDTO {
  id: number
  mfId: string
  mfId: string
  mfName: string
  mfNameLocal: string
  mfLocation: string
  mfReraNumber: string
  mfStartDate: string
  mfCompletionDate: string
  mfPercentComplete: string
  mfConstructionCost: number
  mfAccStatusDate: string
  mfRegistrationDate: string
  mfNoOfUnits: number
  mfRemarks: string
  mfSpecialApproval: string
  mfManagedBy: string
  mfBackupUser: string
  mfRetentionPercent: string
  mfAdditionalRetentionPercent: string
  mfTotalRetentionPercent: string
  mfRetentionEffectiveDate: string
  mfManagementExpenses: string
  mfMarketingExpenses: string
  mfAccoutStatusDate: string
  mfTeamLeadName: string
  mfRelationshipManagerName: string
  mfAssestRelshipManagerName: string
  mfRealEstateBrokerExp: number
  mfAdvertisementExp: number
  mfLandOwnerName: string
  assetRegisterDTO: any | null
  mfStatusDTO: any | null
  mfTypeDTO: any | null
  mfAccountStatusDTO: any | null
  mfConstructionCostCurrencyDTO: any | null
  status: any | null
  mfBlockPaymentTypeDTO: any | null
  deleted: boolean
  taskStatusDTO: any | null
}

export interface CapitalPartnerUnitResponse {
  id: number
  unitRefId: string
  altUnitRefId: string | null
  name: string | null
  isResale: boolean
  resaleDate: string | null
  unitSysId: string | null
  otherFormatUnitNo: string | null
  virtualAccNo: string
  towerName: string
  unitPlotSize: string
  floor: string
  noofBedroom: string
  isModified: boolean
  partnerUnitDTO: any | null
  ownerRegistryUnitTypeDTO: any | null
  managementFirmDTO: RealEstateAssetDTO
  unitStatusDTO: UnitStatusDTO
  propertyIdDTO: PropertyIdDTO
  paymentPlanTypeDTO: any | null
  ownerRegistryUnitBookingDTO: any | null
  childownerRegistryUnitDTO: any | null
  ownerRegistryDTOS: any | null
  deleted: boolean
}

export interface CapitalPartnerUnitBookingResponse {
  id: number
  ownubAmountPaid: number | null
  ownubAreaSize: number
  ownubForFeitAmount: number
  ownubDldAmount: number
  ownubRefundAmount: number
  ownubTransferredAmount: number
  ownubRemarks: string
  ownerRegistryUnitDTOS: CapitalPartnerUnitResponse | null
  deleted: boolean
}

export interface CapitalPartnerUnitPurchaseResponse {
  id: number
  ownuPurchaseDate: string | null
  ownupSaleRate: number | null
  ownuPurchasePrice: number | null
  ownupUnitRegistrationFee: number | null
  ownupAgentName: string
  ownupAgentId: string
  ownupGrossSaleprice: number
  ownupVatApplicable: boolean
  ownupDeedNo: string
  ownupAgreementNo: string
  ownupAgreementDate: string
  ownupSalePurchaseAgreement: boolean
  ownupWorldCheck: boolean
  ownupAmtPaidToDevInEscorw: number
  ownupAmtPaidToDevOutEscorw: number
  ownupTotalAmountPaid: number
  ownupUnitIban: string
  ownupOqood: string | null
  ownupOqoodPaid: boolean
  ownupOqoodAmountPaid: string
  ownupUnitAreaSize: string
  ownupForfeitAmount: string
  ownupDldAmount: string
  ownupRefundAmount: string
  ownupRemarks: string
  ownupTransferredAmount: string
  ownupUnitNoOtherFormat: string
  ownupSalePrice: number
  ownupProjectPaymentPlan: boolean
  ownupReservationBookingForm: boolean
  ownupModificationFeeNeeded: boolean
  ownupCreditCurrencyDTO: any | null
  ownuPurchasePriceCurrencyDTO: any | null
  ownerRegistryUnitDTO: CapitalPartnerUnitResponse
  deleted: boolean
}
