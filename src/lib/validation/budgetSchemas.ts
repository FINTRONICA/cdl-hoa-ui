import dayjs, { type Dayjs } from 'dayjs'
import { z } from 'zod'

import { type DocumentItem } from '@/components/organisms/DeveloperStepper/developerTypes'

const dateSchema = z
  .any()
  .refine((value) => value !== null && value !== undefined && value !== '', {
    message: 'Required field',
  })
  .transform((value) => {
    if (value === null || value === undefined || value === '') {
      return null
    }

    if (dayjs.isDayjs(value)) {
      return value
    }

    const parsed = dayjs(value)
    return parsed.isValid() ? parsed : null
  })

const stringRequired = z.string().min(1, 'Required field')

export const budgetManagementFirmStep1Schema = z.object({
  managementFirmGroupId: stringRequired,
  managementFirmGroupName: stringRequired,
  managementFirmGroupLocalName: stringRequired,
  masterCommunityName: stringRequired,
  masterCommunityLocalName: stringRequired,
  managementCompanyId: stringRequired,
  managementCompanyName: stringRequired,
  managementCompanyLocalName: stringRequired,
  managementFirmManagerEmail: z
    .string()
    .min(1, 'Required field')
    .email('Enter a valid email address'),
  serviceChargeGroupId: stringRequired,
  serviceChargeGroupName: stringRequired,
  serviceChargeGroupLocalName: stringRequired,
  budgetPeriodCode: stringRequired,
  budgetPeriodTitle: stringRequired,
  budgetPeriodFrom: dateSchema,
  budgetPeriodTo: dateSchema,
  categoryCode: stringRequired,
  categoryName: stringRequired,
  categoryLocalName: stringRequired,
  subCategoryCode: stringRequired,
  subCategoryName: stringRequired,
  subCategoryLocalName: stringRequired,
  serviceCode: stringRequired,
  serviceName: stringRequired,
  serviceLocalName: stringRequired,
  totalCost: z
    .string()
    .min(1, 'Required field')
    .refine((value) => !Number.isNaN(Number(value)), {
      message: 'Enter a valid number',
    }),
  vatAmount: z
    .string()
    .min(1, 'Required field')
    .refine((value) => !Number.isNaN(Number(value)), {
      message: 'Enter a valid number',
    }),
})

export type BudgetManagementFirmStep1Data = z.infer<
  typeof budgetManagementFirmStep1Schema
>

export type BudgetManagementFirmStep1FormValues = Omit<
  BudgetManagementFirmStep1Data,
  'budgetPeriodFrom' | 'budgetPeriodTo' | 'totalCost' | 'vatAmount'
> & {
  budgetPeriodFrom: Dayjs | null
  budgetPeriodTo: Dayjs | null
  totalCost: string
  vatAmount: string
  documents?: DocumentItem[]
}

// Helper function to validate numeric (10,0) format - max 10 digits, no decimals
const numericInteger = (maxDigits: number = 10) =>
  z
    .string()
    .min(1, 'Required field')
    .refine(
      (value) => {
        const num = Number(value)
        return (
          !Number.isNaN(num) &&
          Number.isInteger(num) &&
          value.length <= maxDigits &&
          num >= 0
        )
      },
      {
        message: `Enter a valid number (max ${maxDigits} digits, no decimals)`,
      }
    )

// Helper function for alphanumeric (50,0) - max 50 characters, alphanumeric only
const alphanumericString = (maxLength: number = 50) =>
  z
    .string()
    .min(1, 'Required field')
    .max(maxLength, `Maximum ${maxLength} characters allowed`)
    .regex(/^[a-zA-Z0-9\s]*$/, 'Only alphanumeric characters and spaces are allowed')

// Helper function for all characters (50,0) - max 50 characters, any character allowed
const allCharactersString = (maxLength: number = 50) =>
  z
    .string()
    .min(1, 'Required field')
    .max(maxLength, `Maximum ${maxLength} characters allowed`)

export const budgetMasterStep1Schema = z.object({
  // Charge Type ID - Numeric (10,0)
  chargeTypeId: numericInteger(10),
  
  // Charge Type - Alphanumeric (50,0)
  chargeType: alphanumericString(50),
  
  // Group Name ID - All Characters (50,0) - for storing the ID
  groupNameId: allCharactersString(50).optional(),
  
  // Group Name - Alphanumeric (50,0) - stores the label
  groupName: alphanumericString(50),
  
  // Category Code - All Characters (50,0)
  categoryCode: allCharactersString(50),
  
  // Category Name - Alphanumeric (50,0)
  categoryName: alphanumericString(50),
  
  // Category Sub Code - All Characters (50,0)
  categorySubCode: allCharactersString(50),
  
  // Category Sub Name - Alphanumeric (50,0)
  categorySubName: alphanumericString(50),
  
  // Category Sub To Sub Code - All Characters (50,0)
  categorySubToSubCode: allCharactersString(50),
  
  // Category Sub To Sub Name - Alphanumeric (50,0)
  categorySubToSubName: alphanumericString(50),
  
  // Service Name - Alphanumeric (50,0)
  serviceName: alphanumericString(50),
  
  // Service Code - All Characters (50,0)
  serviceCode: allCharactersString(50),
  
  // Provisional Budget Code - All Characters (50,0)
  provisionalBudgetCode: allCharactersString(50),
})

export type BudgetMasterStep1Data = z.infer<
  typeof budgetMasterStep1Schema
>

export type BudgetMasterStep1FormValues = Omit<
  BudgetMasterStep1Data,
  'chargeTypeId'
> & {
  chargeTypeId: string
  documents?: DocumentItem[]
}

// Helper function to get max length for a field (used in form components)
export const getFieldMaxLength = (fieldName: string): number | undefined => {
  try {
    const shapeFn = (budgetMasterStep1Schema as any)?._def?.shape
    const shape = typeof shapeFn === 'function' ? shapeFn() : undefined
    const node = shape?.[fieldName]
    if (!node) return undefined

    const unwrap = (n: any): any => {
      const typeName = n?._def?.typeName
      if (typeName === 'ZodOptional' || typeName === 'ZodNullable')
        return unwrap(n._def.innerType)
      if (typeName === 'ZodEffects') return unwrap(n._def.schema)
      if (typeName === 'ZodDefault') return unwrap(n._def.innerType)
      return n
    }

    const strNode = unwrap(node)
    if (strNode?._def?.typeName !== 'ZodString') return undefined
    
    // Check for max length in checks
    const checks: any[] = strNode._def?.checks || []
    const maxCheck = checks.find((c) => c?.kind === 'max')
    if (maxCheck?.value) return maxCheck.value
    
    // For numeric fields, check the refine validation
    if (fieldName === 'chargeTypeId') {
      return 10 // Max 10 digits for chargeTypeId
    }
    
    return undefined
  } catch {
    return undefined
  }
}

