import { z } from 'zod'

// Step 6 validation schema for React Hook Form
export const step6ValidationSchema = z.object({
  estimate: z.object({
    revenue: z.string().min(1, 'Total Revenue is required').regex(/^[0-9,\s]+$/, 'Must contain only numbers and commas'),
    constructionCost: z.string().min(1, 'Build Cost is required').regex(/^[0-9,\s]+$/, 'Must contain only numbers and commas'),
    projectManagementExpense: z.string().min(1, 'Asset Management Expense is required').regex(/^[0-9,\s]+$/, 'Must contain only numbers and commas'),
    landCost: z.string().min(1, 'Land Acquisition Cost is required').regex(/^[0-9,\s]+$/, 'Must contain only numbers and commas'),
    marketingExpense: z.string().min(1, 'Marketing Expense is required').regex(/^[0-9,\s]+$/, 'Must contain only numbers and commas'),
    date: z.any().optional(), // Date fields are optional
  }),
  actual: z.object({
    soldValue: z.string().min(1, 'Total Units Sold Value is required').regex(/^[0-9,\s]+$/, 'Must contain only numbers and commas'),
    constructionCost: z.string().min(1, 'Build Cost is required').regex(/^[0-9,\s]+$/, 'Must contain only numbers and commas'),
    infraCost: z.string().optional().refine((val) => {
      if (!val || val === '') return true;
      return /^[0-9,\s]+$/.test(val);
    }, 'Must contain only numbers and commas'),
    landCost: z.string().min(1, 'Land Acquisition Cost is required').regex(/^[0-9,\s]+$/, 'Must contain only numbers and commas'),
    projectManagementExpense: z.string().min(1, 'Asset Management Expense is required').regex(/^[0-9,\s]+$/, 'Must contain only numbers and commas'),
    marketingExpense: z.string().min(1, 'Marketing Expense is required').regex(/^[0-9,\s]+$/, 'Must contain only numbers and commas'),
    date: z.any().optional(), // Date fields are optional
  }),
  breakdown: z.array(z.object({
    outOfEscrow: z.string().optional().refine((val) => {
      if (!val || val === '') return true;
      return /^[0-9,\s]+$/.test(val);
    }, 'Must contain only numbers and commas'),
    withinEscrow: z.string().optional().refine((val) => {
      if (!val || val === '') return true;
      return /^[0-9,\s]+$/.test(val);
    }, 'Must contain only numbers and commas'),
    total: z.string().optional().refine((val) => {
      if (!val || val === '') return true;
      return /^[0-9,\s]+$/.test(val);
    }, 'Must contain only numbers and commas'),
    exceptionalCapValue: z.string().optional().refine((val) => {
      if (!val || val === '') return true;
      return /^[0-9,\s]+$/.test(val);
    }, 'Must contain only numbers and commas'),
  })).optional(),
})

// Validate all Step 6 fields using the new Zod schema
export const validateStep6Fields = (formData: any): { isValid: boolean; errors: Record<string, string> } => {
  try {
    const result = step6ValidationSchema.safeParse(formData)
    
    if (!result.success) {
      const errors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.')
        errors[path] = issue.message
      })
      return { isValid: false, errors }
    }
    
    return { isValid: true, errors: {} }
  } catch (error) {
    console.error('Step 6 validation error:', error)
    return { isValid: false, errors: { general: 'Validation failed' } }
  }
}
