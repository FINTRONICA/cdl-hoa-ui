import { z } from 'zod'
import dayjs, { Dayjs } from 'dayjs'

const dayjsSchema = z
  .custom<Dayjs | null>((val) => {
    if (val === null || val === undefined) return true
    return dayjs.isDayjs(val)
  }, 'Must be a valid Dayjs object or null')
  .nullable()

// Step 1: Budget Basic Information Schema
export const BudgetStep1Schema = z.object({
  assetRegisterId: z.string().min(1, 'Asset Register is required'),
  managementFirmId: z.string().min(1, 'Management Firm is required'),
  budgetId: z.string().min(1, 'Budget ID is required'),
  budgetName: z.string().min(1, 'Budget Name is required'),
  budgetPeriodCode: z.string().min(1, 'Budget Period Code is required'),
  propertyGroupId: z
    .string()
    .min(1, 'Property Group ID is required')
    .regex(/^\d+$/, 'Property Group ID must be a number'),
  propertyManagerEmail: z
    .string()
    .min(1, 'Property Manager Email is required')
    .email('Invalid email format'),
  masterCommunityName: z.string().min(1, 'Master Community Name is required'),
  masterCommunityNameLocale: z.string().optional().or(z.literal('')),
  isActive: z.boolean().optional().default(true),
})

// Step 2: Budget Items Schema
export const BudgetStep2Schema = z.object({
  budgetCategoryId: z.string().optional().or(z.literal('')),
  budgetItems: z
    .array(
      z.object({
        id: z.number().optional(),
        subCategoryCode: z.string().min(1, 'Sub-Category Code is required'),
        subCategoryName: z.string().min(1, 'Sub-Category Name is required'),
        subCategoryNameLocale: z.string().optional().or(z.literal('')),
        serviceCode: z.string().min(1, 'Service Code is required'),
        provisionalServiceCode: z.string().optional().or(z.literal('')),
        serviceName: z.string().min(1, 'Service Name is required'),
        serviceNameLocale: z.string().optional().or(z.literal('')),
        totalBudget: z
          .number()
          .min(0, 'Total Budget must be 0 or greater')
          .or(z.string().regex(/^\d*\.?\d+$/, 'Total Budget must be a valid number').transform(Number)),
        availableBudget: z
          .number()
          .min(0, 'Available Budget must be 0 or greater')
          .optional()
          .or(z.string().regex(/^\d*\.?\d+$/, 'Available Budget must be a valid number').transform(Number).optional()),
        utilizedBudget: z
          .number()
          .min(0, 'Utilized Budget must be 0 or greater')
          .optional()
          .or(z.string().regex(/^\d*\.?\d+$/, 'Utilized Budget must be a valid number').transform(Number).optional()),
      })
    )
    .optional()
    .default([]),
})

// Step 3: Review Schema (no validation needed, just display)
export const BudgetStep3Schema = z.object({})

// Type exports
export type BudgetStep1Data = z.infer<typeof BudgetStep1Schema>
export type BudgetStep2Data = z.infer<typeof BudgetStep2Schema>
export type BudgetStep3Data = z.infer<typeof BudgetStep3Schema>

// Combined schemas object
export const BudgetStepperSchemas = {
  step1: BudgetStep1Schema,
  step2: BudgetStep2Schema,
  step3: BudgetStep3Schema,
} as const

// Helper function to get step schema
export const getBudgetStepSchema = (stepNumber: number) => {
  switch (stepNumber) {
    case 0:
      return BudgetStep1Schema
    case 1:
      return BudgetStep2Schema
    case 2:
      return BudgetStep3Schema
    default:
      return z.object({})
  }
}

