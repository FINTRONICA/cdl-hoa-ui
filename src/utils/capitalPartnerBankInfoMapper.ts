// Interface for Step4 form data
export interface Step4FormData {
  payMode: string
  accountNumber: string
  payeeName: string
  payeeAddress: string
  bankName: string
  bankAddress: string
  beneficiaryRoutingCode: string
  bic: string
}

// Interface for dropdown option data
export interface DropdownOption {
  id: number
  displayName: string
  settingValue: string
  settingKey?: string
  languageTranslationId?: any
  remarks?: string
  status?: string
  enabled?: boolean
  deleted?: boolean
}

/**
 * Maps Step4 form data to Capital Partner Bank Info API payload
 */
export function mapStep4ToCapitalPartnerBankInfoPayload(
  formData: Step4FormData,
  ownerRegistryId: number, // ID from Step1 response
  paymentModes: DropdownOption[] = []
): any {
  // Find the selected payment mode
  const selectedPaymentMode = paymentModes.find(
    (mode) => mode.settingValue === formData.payMode
  )

  // Build the payload with correct API field mappings
  const payload: any = {}

  // Map form fields to API fields
  if (formData.payeeName) {
    payload.ownbiPayeeName = formData.payeeName // Payee name -> ownbiPayeeName
  }

  if (formData.payeeAddress) {
    payload.ownbiPayeeAddress = formData.payeeAddress // Payee address -> ownbiPayeeAddress
  }

  if (formData.bankName) {
    payload.ownbiBankName = formData.bankName // Bank name -> ownbiBankName
  }

  if (formData.bankAddress) {
    payload.ownbiBankAddress = formData.bankAddress // Bank address -> ownbiBankAddress
  }

  if (formData.bic) {
    payload.ownbiBicCode = formData.bic // BIC -> ownbiBicCode
  }

  if (formData.beneficiaryRoutingCode) {
    payload.ownbiBeneRoutingCode = formData.beneficiaryRoutingCode // Beneficiary routing code -> ownbiBeneRoutingCode
  }

  if (formData.accountNumber) {
    payload.ownbiAccountNumber = formData.accountNumber // Account number -> ownbiAccountNumber
  }

  // Add payment mode DTO if selected
  if (selectedPaymentMode) {
    payload.payModeDTO = {
      id: selectedPaymentMode.id, // Pay Mode -> payModeDTO.id
    }
  }

  // Add capital partner ID from Step1 response
  payload.ownerRegistryDTO = {
    id: ownerRegistryId.toString(),
  }

  // Add required defaults
  payload.deleted = false

  return payload
}

/**
 * Validates Step4 form data before mapping
 */
export function validateStep4Data(formData: Step4FormData): string[] {
  // Keep lightweight validation to mirror Zod constraints where useful.
  const errors: string[] = []

  const validators: { key: keyof Step4FormData; max?: number }[] = [
    { key: 'accountNumber', max: 16 },
    { key: 'payeeName', max: 50 },
    { key: 'payeeAddress', max: 35 },
    { key: 'bankName', max: 35 },
    { key: 'bankAddress', max: 35 },
    { key: 'beneficiaryRoutingCode', max: 35 },
    { key: 'bic', max: 15 },
  ]

  for (const { key, max } of validators) {
    const value = formData[key]
    if (typeof value === 'string' && max && value.length > max) {
      errors.push(`${key} exceeds maximum length of ${max}`)
    }
  }

  return errors
}
