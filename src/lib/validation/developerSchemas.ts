import { z } from 'zod'
import dayjs, { Dayjs } from 'dayjs'

// Custom Dayjs schema validator with auto-conversion
const dayjsSchema = z.preprocess(
  (val) => {
    // If already a Dayjs object, return as-is
    if (dayjs.isDayjs(val)) return val

    // If null or undefined, return null
    if (val === null || val === undefined) return null

    // If it's a Date object or string, convert to Dayjs
    if (val instanceof Date || typeof val === 'string') {
      const parsed = dayjs(val)
      return parsed.isValid() ? parsed : null
    }

    return null
  },
  z
    .custom<Dayjs | null>((val) => {
      if (val === null || val === undefined) return true
      return dayjs.isDayjs(val)
    }, 'Must be a valid Dayjs object or null')
    .nullable()
)

// Developer Step 1: Basic Details Schema
export const DeveloperStep1Schema = z.object({
  // Asset Register CIF - mandatory field
  arCifrera: z
    .string()
    .min(1, 'Asset Register CIF is required')
    .max(8, 'CIF must be 8 digits or less')
    .regex(/^\d+$/, 'CIF must be numerical'),

  // Asset Register ID - mandatory
  arDeveloperId: z
    .string()
    .min(1, 'Asset Register ID is required')
    .max(30, 'Asset Register ID must be 30 characters or less'),

  // Registration number - mandatory
  arDeveloperRegNo: z
    .string()
    .min(1, 'Asset Register registration number is required')
    .max(14, 'Asset Register registration number must be 14 characters or less'),

  // Asset Register Name (English) - mandatory
  arName: z
    .string()
    .min(1, 'Asset Register Name (English) is required')
    .max(100, 'Asset Register Name (English) must be 100 characters or less'),

  // Asset Register Name (Local) - mandatory
  arNameLocal: z
    .string()
    .min(1, 'Asset Register Name (Local) is required')
    .max(35, 'Asset Register Name (Local) must be 35 characters or less'),

  // Management firm / parent name - optional
  arMasterName: z
    .string()
    .max(35, 'Management firm company name must be 35 characters or less')
    .optional()
    .or(z.literal('')),

  // Project specific details
  arProjectName: z.string().optional().or(z.literal('')),
  arMasterDeveloper: z.string().optional().or(z.literal('')),
  arMasterCommunity: z.string().optional().or(z.literal('')),
  arCompanyNumber: z.string().optional().or(z.literal('')),

  // License Number - mandatory
  arLicenseNo: z
    .string()
    .min(1, 'Trade License Number is required')
    .max(50, 'Trade License Number must be 50 characters or less'),

  // Onboarding Date - mandatory
  arOnboardingDate: dayjsSchema.refine(
    (val) => val !== null && val !== undefined,
    'Registration Date is required'
  ),

  // License Expiry Date - mandatory
  arLicenseExpDate: dayjsSchema.refine(
    (val) => val !== null && val !== undefined,
    'Trade License Valid Until is required'
  ),

  // Regulatory Authority - mandatory (ID should be number)
  arRegulatorId: z.union([
    z.number().min(1, 'Management Type is required'),
    z.string().min(1, 'Management Type is required'),
  ]),

  // Optional fields
  arWorldCheckRemarks: z
    .string()
    .max(100, 'Notification remarks must be 100 characters or less')
    .optional()
    .or(z.literal('')),

  arContactAddress: z
    .string()
    .max(30, 'Registered Address must be 30 characters or less')
    .optional()
    .or(z.literal('')),

  arContactTel: z
    .string()
    .max(35, 'Contact Telephone must be 35 characters or less')
    .optional()
    .or(z.literal('')),

  arMobile: z
    .union([
      z
        .string()
        .max(15, 'Official Mobile Number must be 15 characters or less')
        .regex(
          /^[\d\-\+\(\)\s]+$/,
          'Mobile number contains invalid characters'
        ),
      z.literal(''),
      z.undefined(),
    ])
    .optional(),

  arEmail: z
    .union([
      z
        .string()
        .email('Invalid email format')
        .max(35, 'Official Email Address must be 35 characters or less'),
      z.literal(''),
      z.undefined(),
    ])
    .optional(),

  arPoBox: z
    .union([
      z.string().max(30, 'P.O. Box must be 30 characters or less'),
      z.literal(''),
      z.undefined(),
      z.null(),
    ])
    .optional(),

  arFax: z
    .union([
      z
        .string()
        .max(15, 'Fax number must be 15 characters or less')
        .regex(/^[\d\-\+\(\)\s]+$/, 'Fax number contains invalid characters'),
      z.literal(''),
      z.undefined(),
    ])
    .optional(),

  // Boolean fields (with string coercion for checkbox compatibility)
  arWorldCheckFlag: z
    .union([z.boolean(), z.string()])
    .transform((val) => {
      if (typeof val === 'string')
        return val === 'true' || val === '1' || val === 'on'
      return val
    })
    .optional(),
  arMigratedData: z
    .union([z.boolean(), z.string()])
    .transform((val) => {
      if (typeof val === 'string')
        return val === 'true' || val === '1' || val === 'on'
      return val
    })
    .optional(),

  // Additional fields
  arRemark: z
    .union([
      z.string().max(500, 'Notes must be 500 characters or less'),
      z.literal(''),
      z.undefined(),
      z.null(),
    ])
    .optional(),
  arRegulatorDTO: z.any().optional(),
})

// Developer Step 2: Documents Schema (Optional)
export const DeveloperStep2Schema = z.object({
  documents: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().min(1, 'Document name is required'),
        size: z.number(),
        type: z.string(),
        uploadDate: z.date(),
        status: z.enum(['uploading', 'completed', 'error', 'failed']),
        progress: z.number().optional(),
        file: z.any().optional(),
        url: z.string().optional(),
        classification: z.string().optional(),
      })
    )
    .optional()
    .default([]),
})

// Developer Step 3: Contact Details Schema
export const DeveloperStep3Schema = z.object({
  contactData: z
    .array(
      z.object({
        arcFirstName: z
          .string()
          .min(1, 'First name is required')
          .max(50, 'First name must be 50 characters or less'),

        arcLastName: z
          .string()
          .min(1, 'Last name is required')
          .max(50, 'Last name must be 50 characters or less'),

        arcContactName: z
          .string()
          .max(150, 'Full name must be 150 characters or less')
          .optional()
          .or(z.literal('')),

        arcContactEmail: z
          .string()
          .email('Invalid email format')
          .max(100, 'Email must be 100 characters or less'),

        arcContactAddressLine1: z
          .string()
          .min(1, 'Address Line 1 is required')
          .max(200, 'Address Line 1 must be 200 characters or less'),

        arcContactAddressLine2: z
          .string()
          .max(200, 'Address Line 2 must be 200 characters or less')
          .optional()
          .or(z.literal('')),

        arcContactAddress: z
          .string()
          .max(400, 'Contact address must be 400 characters or less')
          .optional()
          .or(z.literal('')),

        arcContactPoBox: z
          .string()
          .max(50, 'PO Box must be 50 characters or less')
          .optional()
          .or(z.literal('')),

        arcContactTelCode: z
          .string()
          .min(1, 'Dialling code is required')
          .max(10, 'Dialling code must be 10 characters or less'),

        arcCountryMobCode: z
          .string()
          .min(1, 'Country code is required')
          .max(50, 'Country code must be 50 characters or less'),

        arcContactMobNo: z
          .string()
          .min(1, 'Mobile number is required')
          .max(20, 'Mobile number must be 20 characters or less')
          .regex(
            /^[\d\-\+\(\)\s]+$/,
            'Mobile number contains invalid characters'
          ),

        arcContactTelNo: z
          .string()
          .max(20, 'Telephone number must be 20 characters or less')
          .regex(
            /^[\d\-\+\(\)\s]*$/,
            'Telephone number contains invalid characters'
          )
          .optional()
          .or(z.literal('')),

        arcContactFaxNo: z
          .string()
          .max(20, 'Fax number must be 20 characters or less')
          .regex(/^[\d\-\+\(\)\s]*$/, 'Fax number contains invalid characters')
          .optional()
          .or(z.literal('')),

        assetRegisterDTO: z
          .object({
            id: z.number(),
            enabled: z.boolean().optional(),
            deleted: z.boolean().optional(),
          })
          .optional(),
      })
    )
    .min(0, 'Contacts are optional')
    .max(10, 'Maximum 10 contacts allowed')
    .optional()
    .default([]),
})

// Developer Step 4: Fee Details Schema
export const DeveloperStep4Schema = z.object({
  fees: z
    .array(
      z.object({
        feeType: z.union([z.string(), z.number()]).refine((val) => {
          if (typeof val === 'number') return val > 0
          if (typeof val === 'string') return val.length > 0
          return false
        }, 'Fee type is required'),

        frequency: z.union([z.string(), z.number()]).refine((val) => {
          if (typeof val === 'number') return val > 0
          if (typeof val === 'string') return val.length > 0
          return false
        }, 'Frequency is required'),

        debitAmount: z
          .string()
          .min(1, 'Debit amount is required')
          .refine((val) => {
            if (!val || val === '') return false
            const num = parseFloat(val)
            return !isNaN(num) && num >= 0
          }, 'Debit amount must be a valid number'),

        feeToBeCollected: dayjsSchema.optional(),

        nextRecoveryDate: dayjsSchema.optional(),

        feePercentage: z
          .string()
          .refine((val) => {
            if (!val || val === '') return true // Optional field
            const num = parseFloat(val)
            return !isNaN(num) && num >= 0 && num <= 100
          }, 'Fee percentage must be between 0 and 100')
          .optional()
          .or(z.literal('')),

        amount: z
          .string()
          .min(1, 'Amount is required')
          .refine((val) => {
            if (!val || val === '') return false
            const num = parseFloat(val)
            return !isNaN(num) && num >= 0
          }, 'Amount must be a valid number'),

        vatPercentage: z
          .string()
          .min(1, 'VAT percentage is required')
          .refine((val) => {
            if (!val || val === '') return false
            const num = parseFloat(val)
            return !isNaN(num) && num >= 0 && num <= 100
          }, 'VAT percentage must be between 0 and 100'),

        currency: z.union([z.string(), z.number()]).refine((val) => {
          if (typeof val === 'number') return val > 0
          if (typeof val === 'string') return val.length > 0
          return false
        }, 'Currency is required'),

        debitAccount: z.union([z.string(), z.number()]).refine((val) => {
          if (typeof val === 'number') return val > 0
          if (typeof val === 'string') return val.length > 0
          return false
        }, 'Debit account is required'),

        assetRegisterDTO: z
          .object({
            id: z.number(),
          })
          .optional(),
      })
    )
    .optional()
    .default([]),
})

// Developer Step 5: Beneficiary Details Schema (Manager Cheques Specification)
export const DeveloperStep5Schema = z.object({
  beneficiaries: z
    .array(
      z.object({
        // Beneficiary ID - Mandatory, Numerical Only, Max 16 characters
        id: z
          .string()
          .min(1, 'Beneficiary ID is required')
          .max(16, 'Beneficiary ID must be 16 characters or less')
          .regex(/^\d+$/, 'Beneficiary ID must be numerical only'),

        // Transfer Type - Mandatory, Dropdown (TR/TT/MC) - Union for ID or string
        transferType: z.union([z.string(), z.number()]).refine((val) => {
          if (typeof val === 'number') return val > 0
          if (typeof val === 'string') return ['TR', 'TT', 'MC'].includes(val)
          return false
        }, 'Transfer type must be TR (Transfer), TT (Telegraphic Transfer), or MC (Manager Cheques)'),

        // Beneficiary Name - Mandatory, Alphabets only, Max 35 characters
        name: z
          .string()
          .min(1, 'Beneficiary name is required')
          .max(35, 'Beneficiary name must be 35 characters or less')
          .regex(
            /^[A-Za-z\s]+$/,
            'Beneficiary name can only contain alphabets and spaces'
          ),

        // Beneficiary Bank - Mandatory, Union for ID or string
        bankName: z
          .union([z.string(), z.number()])
          .refine((val) => {
            if (typeof val === 'number') return val > 0
            if (typeof val === 'string')
              return val.length > 0 && val.length <= 35
            return false
          }, 'Bank name is required')
          .refine((val) => {
            if (typeof val === 'string') return /^[A-Za-z\s]*$/.test(val)
            return true
          }, 'Bank name can only contain alphabets and spaces'),

        // Beneficiary Account Number/IBAN - Mandatory, Numerical Only, Max 35 characters
        account: z
          .string()
          .min(1, 'Account number/IBAN is required')
          .max(35, 'Account number/IBAN must be 35 characters or less')
          .regex(/^\d+$/, 'Account number/IBAN must be numerical only'),

        // Beneficiary Swift - Mandatory, Alpha Numerical, Max 11 characters
        swiftCode: z
          .string()
          .min(1, 'SWIFT code is required')
          .max(11, 'SWIFT code must be 11 characters or less')
          .regex(
            /^[A-Za-z0-9]+$/,
            'SWIFT code can only contain alphanumeric characters'
          ),

        // Beneficiary Routing Code - Non-Mandatory, Alpha Numerical, Max 10 characters
        routingCode: z
          .string()
          .max(10, 'Routing code must be 10 characters or less')
          .regex(
            /^[A-Za-z0-9]*$/,
            'Routing code can only contain alphanumeric characters'
          )
          .optional()
          .or(z.literal('')),

        assetRegisterDTO: z
          .object({
            id: z.number(),
          })
          .optional(),
      })
    )
    .optional()
    .default([]),
})

// Developer Step 6: Review Schema
export const DeveloperStep6Schema = z.object({
  termsAccepted: z.boolean().optional(),

  dataAccuracyConfirmed: z.boolean().optional(),

  reviewNotes: z
    .string()
    .max(1000, 'Review notes must be 1000 characters or less')
    .optional()
    .or(z.literal('')),
})

// Combined schema for all steps
export const DeveloperStepperSchemas = {
  step1: DeveloperStep1Schema,
  step2: DeveloperStep2Schema,
  step3: DeveloperStep3Schema,
  step4: DeveloperStep4Schema,
  step5: DeveloperStep5Schema,
  step6: DeveloperStep6Schema,
} as const

// Helper function to get step schema
// Each schema only contains fields for that specific step
export const getDeveloperStepSchema = (stepNumber: number) => {
  const stepKeys = [
    'step1',
    'step2',
    'step3',
    'step4',
    'step5',
    'step6',
  ] as const
  const stepKey = stepKeys[stepNumber]
  return stepKey ? DeveloperStepperSchemas[stepKey] : null
}

// Helper to validate only step-specific data
export const validateStepData = (stepNumber: number, data: unknown) => {
  const schema = getDeveloperStepSchema(stepNumber)
  if (!schema) {
    return { success: true, data, errors: [] }
  }

  // Extract only the fields that belong to this step's schema
  const stepFields = Object.keys(schema.shape)
  const stepData: Record<string, unknown> = {}
  const sourceData = (data ?? {}) as Record<string, unknown>

  stepFields.forEach((field) => {
    if (field in sourceData) {
      stepData[field] = sourceData[field]
    }
  })

  // Validate only the step-specific data
  const result = schema.safeParse(stepData)

  return result
}

// Helper function to get step validation key
export function getStepValidationKey(
  step: number
): keyof typeof DeveloperStepperSchemas {
  const stepKeys: Array<keyof typeof DeveloperStepperSchemas> = [
    'step1',
    'step2',
    'step3',
    'step4',
    'step5',
    'step6',
  ]
  return stepKeys[step] || 'step1'
}

// Validation helper function for individual field
export const validateDeveloperField = (
  stepNumber: number,
  fieldName: string,
  value: unknown
): string | true => {
  try {
    const schema = getDeveloperStepSchema(stepNumber)
    if (!schema) return true

    // Handle nested field paths
    if (fieldName.includes('[') || fieldName.includes('.')) {
      return true
    }

    // Get the specific field schema
    const shape = schema.shape as Record<string, z.ZodTypeAny>
    const fieldSchema = shape[fieldName]
    if (!fieldSchema) return true

    // Validate using safeParse
    const result = fieldSchema.safeParse(value)
    if (!result.success) {
      const error = result.error.issues[0]
      return error?.message || 'Invalid value'
    }

    return true
  } catch (error) {
    console.error(`[Validation Error] ${fieldName}:`, error)
    return 'Validation failed'
  }
}

// Type exports for TypeScript inference
export type DeveloperStep1Data = z.infer<typeof DeveloperStep1Schema>
export type DeveloperStep2Data = z.infer<typeof DeveloperStep2Schema>
export type DeveloperStep3Data = z.infer<typeof DeveloperStep3Schema>
export type DeveloperStep4Data = z.infer<typeof DeveloperStep4Schema>
export type DeveloperStep5Data = z.infer<typeof DeveloperStep5Schema>
export type DeveloperStep6Data = z.infer<typeof DeveloperStep6Schema>

// Combined type for all steps
export type DeveloperStepperData = {
  step1: DeveloperStep1Data
  step2: DeveloperStep2Data
  step3: DeveloperStep3Data
  step4: DeveloperStep4Data
  step5: DeveloperStep5Data
  step6: DeveloperStep6Data
}
