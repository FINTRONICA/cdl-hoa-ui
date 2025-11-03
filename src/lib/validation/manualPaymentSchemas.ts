import { z } from 'zod'


export const ManualPaymentPrimitives = {

  amountRequired: z
    .string()
    .trim()
    .min(1, 'Required field')
    .refine((v) => /^\d+(\.\d{1,2})?$/.test(v), {
      message: 'Please enter a valid amount (numbers and up to 2 decimal places)'
    })
    .transform((v) => parseFloat(v)),

 
  currency: z
    .string()
    .min(1, 'Currency is required'),

 
  dateValue: z
    .any()
    .refine((v) => v !== null && v !== undefined && v !== '', {
      message: 'Select a date',
    }),

  nonEmptyTrimmed: z
    .string()
    .transform((v) => (typeof v === 'string' ? v.trim() : v))
    .refine((v) => !!v && v.length > 0, { message: 'Required field' }),

 
  nonEmptyTrimmedMax: (len: number) =>
    z
      .string()
      .trim()
      .min(1, 'Required field')
      .max(len, `Max ${len} characters`),
  trimmedMax: (len: number) =>
    z
      .string()
      .trim()
      .max(len, `Max ${len} characters`),

  // IDs coming from dropdowns can be string codes or numeric IDs
  idRequired: z.union([z.number(), z.string().min(1, 'Required field')]),
  idOptional: z.union([z.number(), z.string()]).optional().nullable(),
  
  // Backend dropdown values - required but no additional validation
  // Can be either string or number since dropdowns may return IDs or values
  backendDropdownRequired: z.union([z.string().min(1, 'Required field'), z.number()]),
}


export const manualPaymentStep1Schema = z.object({
  // OLD FIELDS - COMMENTED OUT
  // tasReference: ManualPaymentPrimitives.nonEmptyTrimmed,
  // developerName: ManualPaymentPrimitives.nonEmptyTrimmed,
  // developerId: ManualPaymentPrimitives.nonEmptyTrimmed,
  // projectName: ManualPaymentPrimitives.idRequired,
  // projectId: ManualPaymentPrimitives.nonEmptyTrimmed,
  // projectStatus: ManualPaymentPrimitives.idOptional,
  // corporateAccount1: ManualPaymentPrimitives.nonEmptyTrimmed,
  // retentionAccount1: z.string().optional().nullable(),
  // corporateAccount2: ManualPaymentPrimitives.nonEmptyTrimmed,
  // retentionAccount2: z.string().optional().nullable(),
  // paymentType1: ManualPaymentPrimitives.nonEmptyTrimmedMax(15), 
  // paymentSubType1: ManualPaymentPrimitives.dateValue,
  // engineerApprovedAmount: ManualPaymentPrimitives.trimmedMax(15).optional().nullable(),
  // amountPaid1: ManualPaymentPrimitives.trimmedMax(15).optional().nullable(),
  // totalAmountPaid1: ManualPaymentPrimitives.idRequired,
  // vatCapExceeded3: ManualPaymentPrimitives.amountRequired, 
  // vatCapExceeded4: ManualPaymentPrimitives.trimmedMax(15).optional().nullable(),
  // delRefNo: ManualPaymentPrimitives.nonEmptyTrimmedMax(15), 
  // ppcNo: ManualPaymentPrimitives.trimmedMax(15).optional().nullable(),

  // NEW FIELDS START
  vaucherReferenceNumber: ManualPaymentPrimitives.nonEmptyTrimmed,
  assetRegisterName: ManualPaymentPrimitives.idRequired,
  managementFirmName: ManualPaymentPrimitives.nonEmptyTrimmedMax(100),
  managementFirmAccountStatus: ManualPaymentPrimitives.idOptional,
  
  // Account balances (kept as they are used)
  escrowAccount: ManualPaymentPrimitives.nonEmptyTrimmed,
  subConstructionAccount: z.string().optional().nullable(),
  retentionAccount: z.string().optional().nullable(),

  paymentType: ManualPaymentPrimitives.idRequired,
  paymentSubType: ManualPaymentPrimitives.idOptional,

  hoaApprovalNumber: ManualPaymentPrimitives.nonEmptyTrimmedMax(50),
  hoaApprovalDate: ManualPaymentPrimitives.dateValue,

  invoiceRef: ManualPaymentPrimitives.nonEmptyTrimmedMax(15),
  invoiceCurrency: ManualPaymentPrimitives.idRequired,
  invoiceValue: ManualPaymentPrimitives.nonEmptyTrimmedMax(15),
  invoiceDate: ManualPaymentPrimitives.dateValue.optional().nullable(),

  specialRate: z.coerce.boolean().optional().nullable(),
  corporateAmount: z.coerce.boolean().optional().nullable(),

  RT03: ManualPaymentPrimitives.nonEmptyTrimmedMax(50),
  totalEligibleAmount: ManualPaymentPrimitives.trimmedMax(15).optional().nullable(),
  amountPaid: ManualPaymentPrimitives.trimmedMax(15).optional().nullable(),
  capExceeded: z.coerce.boolean().optional().nullable(),
  totalAmountPaid: ManualPaymentPrimitives.trimmedMax(15).optional().nullable(),
  paymentCurrency: ManualPaymentPrimitives.idRequired,
  debitCreditToEscrow: ManualPaymentPrimitives.trimmedMax(15).optional().nullable(),
  currentEligibleAmount: ManualPaymentPrimitives.trimmedMax(15).optional().nullable(),
  debitFromRetention: ManualPaymentPrimitives.trimmedMax(15).optional().nullable(),
  totalPayoutAmount: ManualPaymentPrimitives.trimmedMax(15).optional().nullable(),
  amountInTransit: ManualPaymentPrimitives.trimmedMax(15).optional().nullable(),

  // Budget Details
  budgetYear: ManualPaymentPrimitives.idRequired,
  budgetCategory: ManualPaymentPrimitives.idRequired,
  budgetSubCategory: ManualPaymentPrimitives.idRequired,
  budgetServiceName: ManualPaymentPrimitives.idRequired,
  provisionalBudget: z.coerce.boolean().optional().nullable(),
  HOAExemption: z.coerce.boolean().optional().nullable(),
  categoryCode: ManualPaymentPrimitives.nonEmptyTrimmedMax(50),
  categoryName: z.string().optional().nullable(),
  subCategoryCode: ManualPaymentPrimitives.nonEmptyTrimmedMax(50),
  subCategoryName: z.string().optional().nullable(),
  serviceCode: ManualPaymentPrimitives.nonEmptyTrimmedMax(50),
  serviceName: z.string().optional().nullable(),
  provisionalBudgetCode: ManualPaymentPrimitives.nonEmptyTrimmedMax(50),
  provisionalBudgetName: z.string().optional().nullable(),
  availableBudgetAmount: z.string().optional().nullable(),
  utilizedBudgetAmount: z.string().optional().nullable(),
  invoiceBudgetAmount: z.string().optional().nullable(),

  // Beneficiary Details - Use nested objects for proper validation
  voucherDTO: z.object({
    benVoucher: ManualPaymentPrimitives.idRequired, // Required if voucherDTO exists
    benVoucherName: z.string().optional().nullable(),
    benVoucherSwiftCode: z.string().optional().nullable(),
    benVoucherRoutingCode: z.string().optional().nullable(),
    benVoucherAccountNumber: z.string().optional().nullable(),
  }), // Required object (benVoucher is required, so object must exist)
  
  // Build Partner DTO for bank name
  buildPartnerDTO: z.object({
    bpName: z.string().optional().nullable(),
  }).optional().nullable(),

  engineerFeePayment: ManualPaymentPrimitives.backendDropdownRequired,
  routinfSortcode: ManualPaymentPrimitives.nonEmptyTrimmedMax(50),


  narration1: ManualPaymentPrimitives
    .trimmedMax(50)
    .regex(/^[A-Za-z0-9\s]*$/, 'Only alphanumeric characters allowed')
    .optional()
    .nullable(),
  narration2: ManualPaymentPrimitives
    .trimmedMax(50)
    .regex(/^[A-Za-z0-9\s]*$/, 'Only alphanumeric characters allowed')
    .optional()
    .nullable(),
  remarks: ManualPaymentPrimitives.trimmedMax(30).optional().nullable(),

 
  unitNo: z.string().optional().nullable(),
  towerName: z.string().optional().nullable(),
  unitStatus: z.string().optional().nullable(),
  amountReceived: z.coerce.number().optional().nullable(),
  Forfeit: z.coerce.boolean().optional().nullable(),
  Refundtounitholder: z.coerce.boolean().optional().nullable(),
  Transfertootherunit: z.coerce.boolean().optional().nullable(),
  forfeitAmount: z.coerce.number().optional().nullable(),
  regulatorApprovalRef: ManualPaymentPrimitives.trimmedMax(15).optional().nullable(),
  paymentDate: ManualPaymentPrimitives.dateValue.optional().nullable(),


  bankCharges: ManualPaymentPrimitives.backendDropdownRequired,
  paymentMode: ManualPaymentPrimitives.backendDropdownRequired,
  engineerFeePayment: ManualPaymentPrimitives.backendDropdownRequired, 
  uploadDocuments: z.coerce.number().optional().nullable(), 
  engineerFeePayment1: ManualPaymentPrimitives.dateValue.optional().nullable(), 
  uploadDocuments1: z.coerce.number().optional().nullable(), 
  EngineerFeePaymentNeeded: z.coerce.boolean().optional().nullable(),
  EngineerFeesPayment: z.coerce.number().optional().nullable(),
  engineerFeePayment2: z.coerce.number().optional().nullable(), 
  uploadDocuments2: ManualPaymentPrimitives.backendDropdownRequired, 
  'reviewNote*': z.coerce.boolean().optional().nullable(),
})

export type ManualPaymentStep1Data = z.infer<typeof manualPaymentStep1Schema>

export const manualPaymentRootSchema = manualPaymentStep1Schema

export const getFieldMaxLength = (fieldName: string): number | undefined => {
  try {
    const shapeFn = (manualPaymentStep1Schema as any)?._def?.shape
    const shape = typeof shapeFn === 'function' ? shapeFn() : undefined
    const node = shape?.[fieldName]
    if (!node) return undefined

    const unwrap = (n: any): any => {
      const typeName = n?._def?.typeName
      if (typeName === 'ZodOptional' || typeName === 'ZodNullable') return unwrap(n._def.innerType)
      if (typeName === 'ZodEffects') return unwrap(n._def.schema)
      return n
    }

    const strNode = unwrap(node)
    if (strNode?._def?.typeName !== 'ZodString') return undefined
    const checks: any[] = strNode._def?.checks || []
    const maxCheck = checks.find((c) => c?.kind === 'max')
    return maxCheck?.value
  } catch {
    return undefined
  }
}

