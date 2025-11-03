import { FundEgressRequest } from '@/services/api/fundEgressService';
import { ApplicationSetting } from '@/services/api/applicationSettingService';
import { RealEstateAsset } from '@/services/api/realEstateAssetService';

// Type aliases for compatibility
type PaymentExpenseType = ApplicationSetting;
type PaymentExpenseSubType = ApplicationSetting;
type Currency = ApplicationSetting;
type DepositMode = ApplicationSetting;
type PaymentMode = ApplicationSetting;
type TransferType = ApplicationSetting;
type BuildAssetAccountStatus = ApplicationSetting;

// Form data interface (based on our current form fields)
export interface FormData {
  // Basic fields (old - kept for backward compatibility)
  tasReference?: string
  developerName?: string
  developerId?: string
  projectName?: string
  projectId?: string
  projectStatus?: string
  
  // New fields
  vaucherReferenceNumber?: string
  assetRegisterName?: string
  managementFirmName?: string
  managementFirmAccountStatus?: string | number
  
  // Account balances
  escrowAccount?: string
  corporateAccount?: string
  corporateAccount1?: string
  corporateAccount2?: string
  
  // Balance fields (right side data from account balance fields)
  subConstructionAccount?: string  // Escrow balance
  retentionAccount?: string        // Sub Construction balance
  retentionAccount1?: string       // Corporate balance
  retentionAccount2?: string       // Retention balance
  
  // Payment type fields
  paymentType?: string
  paymentSubType?: string
  paymentType1?: string // Regular Approval Ref No
  paymentSubType1?: string // Regular Approval Date
  
  // Invoice fields
  invoiceRef?: string
  invoiceCurrency?: string
  invoiceValue?: string
  invoiceDate?: string
  
  // Amount fields
  engineerApprovedAmount?: string
  totalEligibleAmount?: string
  amountPaid?: string
  amountPaid1?: string // Cap Exceeded
  totalAmountPaid?: string
  totalAmountPaid1?: string // Payment Currency
  debitCreditToEscrow?: string
  currentEligibleAmount?: string
  debitFromRetention?: string
  totalPayoutAmount?: string
  amountInTransit?: string
  vatCapExceeded?: string
  vatCapExceeded1?: string // Invoice Ref no
  vatCapExceeded2?: string // Payment Sub Type
  vatCapExceeded3?: string // Indicative Rate
  vatCapExceeded4?: string // Corporate Certification Engineer's Fees
  
  // Checkbox fields
  specialRate?: boolean
  corporateAmount?: boolean
  Forfeit?: boolean
  Refundtounitholder?: boolean
  Transfertootherunit?: boolean
  EngineerFeePaymentNeeded?: boolean
  'reviewNote*'?: boolean
  
  // HOA Approval fields
  hoaApprovalNumber?: string
  hoaApprovalDate?: string | Date | any
  
  // RT03 field
  RT03?: string
  
  // Budget fields
  budgetYear?: string | number
  budgetCategory?: string | number
  budgetSubCategory?: string | number
  budgetServiceName?: string | number
  provisionalBudget?: boolean
  HOAExemption?: boolean
  categoryCode?: string
  categoryName?: string
  subCategoryCode?: string
  subCategoryName?: string
  serviceCode?: string
  serviceName?: string
  provisionalBudgetCode?: string
  provisionalBudgetName?: string
  availableBudgetAmount?: string
  utilizedBudgetAmount?: string
  invoiceBudgetAmount?: string
  
  // Beneficiary fields (nested objects)
  voucherDTO?: {
    benVoucher?: string | number
    benVoucherName?: string
    benVoucherSwiftCode?: string
    benVoucherRoutingCode?: string
    benVoucherAccountNumber?: string
  }
  buildPartnerDTO?: {
    bpName?: string
  }
  
  // Routing sort code
  routinfSortcode?: string
  
  // Other fields
  delRefNo?: string
  ppcNo?: string
  narration1?: string
  narration2?: string
  remarks?: string
  unitNo?: string
  towerName?: string
  unitStatus?: string
  amountReceived?: string
  forfeitAmount?: string
  regulatorApprovalRef?: string
  paymentDate?: string
  bankCharges?: string
  paymentMode?: string
  engineerFeePayment?: string
  uploadDocuments?: string // Amount to be Released
  engineerFeePayment1?: string // Payment Date
  uploadDocuments1?: string // VAT Payment Amount
  EngineerFeesPayment?: string
  engineerFeePayment2?: string // Bank Charges
  uploadDocuments2?: string // Payment to be made from CBS
}

// Helper function to create a default DTO
function createDefaultDTO(id: number = 0) {
  return {
    id,
    settingKey: '',
    settingValue: '',
    languageTranslationId: {
      id: 0,
      configId: '',
      configValue: '',
      content: null,
      status: null,
      enabled: true,
      deleted: false
    },
    remarks: null,
    status: null,
    enabled: true,
    deleted: false
  };
}

// Helper function to find real estate asset by name
function findRealEstateAssetByName(assets: RealEstateAsset[], name: string): RealEstateAsset | undefined {
  return assets.find(asset => asset.reaName === name);
}

// Helper function to find build partner by name
function findBuildPartnerByName(partners: any[], name: string): any | undefined {
  return partners.find(partner => partner.bpName === name);
}

/**
 * Map form data to FundEgressRequest
 * @param formData - Form data from the form
 * @param options - Additional data needed for mapping (dropdowns, assets, partners)
 * @returns FundEgressRequest object
 */
export function mapFormDataToFundEgress(
  formData: FormData,
  options: {
    paymentTypes: PaymentExpenseType[]
    paymentSubTypes: PaymentExpenseSubType[]
    currencies: Currency[]
    depositModes: DepositMode[]
    paymentModes: PaymentMode[]
    transferTypes: TransferType[]
    buildAssetAccountStatuses: BuildAssetAccountStatus[]
    realEstateAssets: RealEstateAsset[]
    buildPartners: any[]
    balances?: Record<string, any>
  }
): FundEgressRequest {
  const {
    paymentTypes,
    paymentSubTypes,
    currencies,
    depositModes,
    paymentModes,
    transferTypes,
    buildAssetAccountStatuses,
    realEstateAssets,
    buildPartners
  } = options;

  // Find selected real estate asset - use assetRegisterName (new) or projectName (old)
  const assetId = formData.assetRegisterName ? String(formData.assetRegisterName) : formData.projectName
  const selectedAsset = assetId
    ? realEstateAssets.find((asset) => asset.id === parseInt(assetId))
    : undefined;
  
  // Find selected build partner - use managementFirmName (new) or developerName (old)
  const partnerName = formData.managementFirmName || formData.developerName
  const selectedPartner = partnerName ? findBuildPartnerByName(buildPartners, partnerName) : undefined;

  // Helper to parse numbers from formatted strings like "AED 1,234.56"
  const parseAmount = (value?: string) => {
    if (typeof value !== 'string') return 0;
    const cleaned = value.replace(/[^\d.\-]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Helper to normalize various date-like values to ISO string (or null)
  const toIsoDate = (value: any): string | null => {
    if (!value) return null;
    // dayjs
    if (value && typeof value === 'object' && typeof value.toDate === 'function') {
      try {
        return value.toDate().toISOString();
      } catch {
        /* fallthrough */
      }
    }
    // Date
    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value.toISOString();
    }
    // ISO-like string
    if (typeof value === 'string') {
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d.toISOString();
    }
    return null;
  };

  const request: FundEgressRequest = {
    // Core required fields
    fePaymentDate: formData.paymentDate || new Date().toISOString(),
    fePaymentAmount: parseFloat(formData.totalAmountPaid || '0'),
    feIsManualPayment: true,
    feIsTasPayment: false,
    status: 'INITIATED',
    enabled: true,

    // Basic fields - pass null for missing fields (support both old and new field names)
    fePaymentRefNumber: formData.vaucherReferenceNumber || formData.tasReference || null,
    feInvoiceRefNo: formData.invoiceRef || null,
    feInvoiceValue: parseFloat(formData.invoiceValue || '0'),
    feInvoiceDate: formData.invoiceDate || null,
    feRemark: formData.remarks || null,
    feNarration1: formData.narration1 || null,
    feNarration2: formData.narration2 || null,

    // Amount fields - pass null for missing fields
    feEngineerApprovedAmt: parseFloat(formData.engineerApprovedAmount || '0'),
    feTotalEligibleAmtInv: parseFloat(formData.totalEligibleAmount || '0'),
    feAmtPaidAgainstInv: parseFloat(formData.amountPaid || '0'),
    feCapExcedded: formData.amountPaid1 || null,
    feTotalAmountPaid: parseFloat(formData.totalAmountPaid || '0'),
    feDebitFromEscrow: parseFloat(formData.debitCreditToEscrow || '0'),
    feCurEligibleAmt: parseFloat(formData.currentEligibleAmount || '0'),
    feDebitFromRetention: parseFloat(formData.debitFromRetention || '0'),
    feTotalPayoutAmt: parseFloat(formData.totalPayoutAmount || '0'),
    feAmountInTransit: parseFloat(formData.amountInTransit || '0'),
    feVarCapExcedded: formData.vatCapExceeded || null,
    feIndicativeRate: parseFloat(formData.vatCapExceeded3 || '0'),
    feCorpCertEngFee: formData.vatCapExceeded4 || null,

    // Unit holder fields - pass null for missing fields
    feAmtRecdFromUnitHolder: parseFloat(formData.amountReceived || '0'),
    feForFeit: formData.Forfeit || false,
    feForFeitAmt: parseFloat(formData.forfeitAmount || '0'),
    feRefundToUnitHolder: formData.Refundtounitholder || false,
    feTransferToOtherUnit: formData.Transfertootherunit || false,
    feUnitReraApprovedRefNo: formData.regulatorApprovalRef || null,
    feUnitTransferAppDate: formData.paymentDate || null,

    // Payment fields - pass null for missing fields
    feAmountToBeReleased: parseFloat(formData.uploadDocuments || '0'),
    feBeneDateOfPayment: formData.engineerFeePayment1 || null,
    feBeneVatPaymentAmt: parseFloat(formData.uploadDocuments1 || '0'),
    feIsEngineerFee: formData.EngineerFeePaymentNeeded || false,
    feCorporatePaymentEngFee: parseFloat(formData.EngineerFeesPayment || '0'),
    // Bank charges (backend expects 'fBbankCharges' key). Compute once and assign to both keys for safety
    ...(function() {
      const value = formData.engineerFeePayment2
      if (value === null || value === undefined || value === '') return null
      if (typeof value === 'number') {
        const computed = isNaN(value) ? null : value
        return { fBbankCharges: computed, fbbankCharges: computed } as any
      }
      if (typeof value === 'string') {
        const trimmed = value.trim()
        if (!trimmed) return null
        const parsed = parseFloat(trimmed)
        const computed = isNaN(parsed) ? null : parsed
        return { fBbankCharges: computed, fbbankCharges: computed } as any
      }
      return { fBbankCharges: null, fbbankCharges: null } as any
    })(),

    // Account balances - prefer fetched balances if available, else parse from display strings
    feCurBalInEscrowAcc:
      (options.balances?.escrow?.details?.transferLimits?.creditTransfer ?? null) !== null
        ? Number(options.balances?.escrow?.details?.transferLimits?.creditTransfer)
        : parseAmount(formData.subConstructionAccount),
    feCorporateAccBalance:
      (options.balances?.corporate?.details?.transferLimits?.creditTransfer ?? null) !== null
        ? Number(options.balances?.corporate?.details?.transferLimits?.creditTransfer)
        : parseAmount(formData.retentionAccount1),
    feSubConsAccBalance:
      (options.balances?.subConstruction?.details?.transferLimits?.creditTransfer ?? null) !== null
        ? Number(options.balances?.subConstruction?.details?.transferLimits?.creditTransfer)
        : parseAmount(formData.retentionAccount),
    feCurBalInRetentionAcc:
      (options.balances?.retention?.details?.transferLimits?.creditTransfer ?? null) !== null
        ? Number(options.balances?.retention?.details?.transferLimits?.creditTransfer)
        : parseAmount(formData.retentionAccount2),

    // Special fields - pass null for missing fields
    feSpecialRate: formData.specialRate || false,
    feCorporatePayment: formData.corporateAmount || false,
    feDealRefNo: formData.delRefNo || null,
    fePpcNumber: formData.ppcNo || null,

    // Additional required fields that might be missing
    feInvoiceNumber: formData.invoiceRef || null,
    feGlAccountNumber: null,
    feGlBranchCode: null,
    feUnitRegistrationFee: null,
    feResponseObject: null,
    feSplitPayment: false,
    feRtZeroThree: formData.RT03 || null,
    feEngineerRefNo: null,
    feEngineerApprovalDate: null,
    // HOA Approval details - use new fields if available, fallback to old fields
    feReraApprovedRefNo: formData.hoaApprovalNumber || formData.paymentType1 || null,
    feReraApprovedDate: formData.hoaApprovalDate ? toIsoDate(formData.hoaApprovalDate) : toIsoDate(formData.paymentSubType1),
    feUniqueRefNo: null,
    fePaymentResponseObj: null,
    fePaymentStatus: 'PENDING',
    feResPaymentRefNo: null,
    feResUniqueRefNo: null,
    feResHeader: null,
    feSpecialField1: null,
    feSpecialField2: null,
    feSpecialField3: null,
    feSpecialField4: null,
    feSpecialField5: null,
    feSpecialField6: null,
    feTasPaymentStatus: null,
    feSpecialField7: null,
    feEngineerFeePayment: null,
    feErrorResponseObject: null,
    fePropertyRegistrationFee: null,
    feBalanceAmount: null,
    feDocVerified: false,
    fePaymentBodyObj: null,
    feTreasuryRate: null,
    feBenefFromProject: false,
    feIncludeInPayout: false,
    feTasPaymentSuccess: false,
    fetasPaymentRerun: false,
    feDiscardPayment: false,
    feBeneficiaryToMaster: false,
    feRefundAmount: null,
    feTransferAmount: null,

    // DTOs - Send only the id field for dropdown selections, pass null if not found or arrays are empty
    expenseTypeDTO: formData.paymentType ? { id: parseInt(formData.paymentType) } : null,
    expenseSubTypeDTO: formData.paymentSubType ? { id: parseInt(formData.paymentSubType) } : null,
    invoiceCurrencyDTO: formData.invoiceCurrency ? { id: parseInt(formData.invoiceCurrency) } : null,
    paymentCurrencyDTO: formData.totalAmountPaid1 ? { id: parseInt(formData.totalAmountPaid1) } : null,
    chargedCodeDTO: formData.bankCharges ? { id: parseInt(formData.bankCharges) } : null,
    paymentModeDTO: formData.paymentMode ? { id: parseInt(formData.paymentMode) } : null,
    transactionTypeDTO: formData.engineerFeePayment ? { id: parseInt(formData.engineerFeePayment) } : null,

    // Real estate asset - use assetRegisterName (new) or projectName (old) directly (id) if available
    realEstateAssestDTO: formData.assetRegisterName
      ? { id: parseInt(String(formData.assetRegisterName)) }
      : formData.projectName
      ? { id: parseInt(formData.projectName) }
      : selectedAsset
      ? { id: selectedAsset.id }
      : null,

    // Build partner - use managementFirmName (new) or developerName (old) if available
    buildPartnerDTO: (() => {
      if (formData.managementFirmName) {
        const partnerByName = buildPartners.find((p: any) => p.bpName === formData.managementFirmName)
        return partnerByName ? { id: partnerByName.id, bpName: partnerByName.bpName } : null
      }
      return selectedPartner ? { id: selectedPartner.id } : null
    })(),

    // Capital partner unit - pass null if not found
    capitalPartnerUnitDTO: formData.unitNo ? {
      id: 0,
      unitRefId: formData.unitNo,
      altUnitRefId: null,
      name: formData.unitNo,
      isResale: false,
      resaleDate: null,
      unitSysId: null,
      otherFormatUnitNo: null,
      virtualAccNo: null,
      towerName: formData.towerName || null,
      unitPlotSize: null,
      floor: null,
      noofBedroom: null,
      isModified: false,
      partnerUnitDTO: null,
      capitalPartnerUnitTypeDTO: null,
      realEstateAssestDTO: selectedAsset!,
      unitStatusDTO: formData.unitStatus ? {
        id: 0,
        settingKey: 'UNIT_STATUS',
        settingValue: formData.unitStatus,
        languageTranslationId: {
          id: 0,
          configId: `CDL_UNIT_STATUS_${formData.unitStatus}`,
          configValue: formData.unitStatus,
          content: null,
          status: null,
          enabled: true,
          deleted: false
        },
        remarks: null,
        status: null,
        enabled: true,
        deleted: false
      } : null,
      deleted: false
    } : null,

    // Additional DTOs that might be required
    paymentStatusOptionDTO: null,
    voucherPaymentTypeDTO: null,
    voucherPaymentSubTypeDTO: null,
    beneficiaryFeePaymentDTO: null,
    payoutToBeMadeFromCbsDTO: formData.uploadDocuments2
      ? { id: parseInt(formData.uploadDocuments2) }
      : null,
    transferCapitalPartnerUnitDTO: null,
    realEstateAssestBeneficiaryDTO: null,
    suretyBondDTO: null,
    taskStatusDTO: null,
    deleted: false
  };

  // Log the request for debugging
  console.log('🔍 FormDataMapper: Generated API payload:', {
    requestKeys: Object.keys(request),
    requestSize: JSON.stringify(request).length,
    hasRequiredFields: {
      fePaymentDate: !!request.fePaymentDate,
      fePaymentAmount: !!request.fePaymentAmount,
      feIsManualPayment: request.feIsManualPayment,
      status: !!request.status,
      enabled: request.enabled
    },
    dtoFields: {
      expenseTypeDTO: !!request.expenseTypeDTO,
      expenseSubTypeDTO: !!request.expenseSubTypeDTO,
      invoiceCurrencyDTO: !!request.invoiceCurrencyDTO,
      paymentCurrencyDTO: !!request.paymentCurrencyDTO,
      chargedCodeDTO: !!request.chargedCodeDTO,
      paymentModeDTO: !!request.paymentModeDTO,
      transactionTypeDTO: !!request.transactionTypeDTO,
      realEstateAssestDTO: !!request.realEstateAssestDTO,
      buildPartnerDTO: !!request.buildPartnerDTO,
      capitalPartnerUnitDTO: !!request.capitalPartnerUnitDTO
    }
  });

  return request;
}

/**
 * Simplified mapper that only includes the fields from your JSON format
 * Sends strings instead of parsing to float
 */
export function mapFormDataToFundEgressSimplified(
  formData: FormData,
  options: {
    paymentTypes: PaymentExpenseType[]
    paymentSubTypes: PaymentExpenseSubType[]
    currencies: Currency[]
    depositModes: DepositMode[]
    paymentModes: PaymentMode[]
    transferTypes: TransferType[]
    realEstateAssets: RealEstateAsset[]
    buildPartners: any[]
    balances?: Record<string, any>
  }
): FundEgressRequest {
  const {
    paymentTypes,
    paymentSubTypes,
    currencies,
    depositModes,
    paymentModes,
    transferTypes,
    realEstateAssets,
    buildPartners
  } = options;

  // Find selected real estate asset - use assetRegisterName (new) or projectName (old)
  const assetId = formData.assetRegisterName ? String(formData.assetRegisterName) : formData.projectName
  const selectedAsset = assetId
    ? realEstateAssets.find((asset) => asset.id === parseInt(assetId))
    : undefined;
  
  // Find selected build partner - use managementFirmName (new) or developerName (old)
  const partnerName = formData.managementFirmName || formData.developerName
  const selectedPartner = partnerName ? buildPartners.find(partner => partner.bpName === partnerName) : undefined;

  // Helper to parse numbers from formatted strings like "AED 1,234.56"
  const parseAmount = (value?: string) => {
    if (typeof value !== 'string') return '0';
    const cleaned = value.replace(/[^\d.\-]/g, '');
    return cleaned === '' ? '0' : cleaned;
  };

  const request: FundEgressRequest = {
    // Core required fields
    fePaymentDate: formData.paymentDate || new Date().toISOString(),
    fePaymentAmount: formData.totalAmountPaid || '0',
    feIsManualPayment: true,
    feIsTasPayment: false,
    status: 'INITIATED',
    enabled: true,
    // Basic fields (support both old and new field names)
    fePaymentRefNumber: formData.vaucherReferenceNumber || formData.tasReference || '',
    feInvoiceRefNo: formData.invoiceRef || '',
    feInvoiceValue: formData.invoiceValue || '0',
    feInvoiceDate: formData.invoiceDate || '',
    feRemark: formData.remarks || '',
    feNarration1: formData.narration1 || '',
    feNarration2: formData.narration2 || '',

    // Amount fields - send as strings
    feEngineerApprovedAmt: formData.engineerApprovedAmount || '0',
    feTotalEligibleAmtInv: formData.totalEligibleAmount || '0',
    feAmtPaidAgainstInv: formData.amountPaid || '0',
    feCapExcedded: formData.amountPaid1 || '',
    feTotalAmountPaid: formData.totalAmountPaid || '0',
    feDebitFromEscrow: formData.debitCreditToEscrow || '0',
    feCurEligibleAmt: formData.currentEligibleAmount || '0',
    feDebitFromRetention: formData.debitFromRetention || '0',
    feTotalPayoutAmt: formData.totalPayoutAmount || '0',
    feAmountInTransit: formData.amountInTransit || '0',
    feIndicativeRate: formData.vatCapExceeded3 || '0',

    // Unit holder fields
    feAmtRecdFromUnitHolder: formData.amountReceived || '0',
    feForFeit: formData.Forfeit || false,
    feForFeitAmt: formData.forfeitAmount || '0',
    feRefundToUnitHolder: formData.Refundtounitholder || false,
    feTransferToOtherUnit: formData.Transfertootherunit || false,
    feUnitTransferAppDate: formData.paymentDate || null,
    feUnitReraApprovedRefNo: formData.regulatorApprovalRef || null,
    // HOA Approval details - use new fields if available, fallback to old fields
    feReraApprovedRefNo: formData.hoaApprovalNumber || formData.paymentType1 || null,
    feReraApprovedDate: ((): any => {
      const v: any = formData.hoaApprovalDate || formData.paymentSubType1;
      if (!v) return null as any;
      if (v && typeof v === 'object' && typeof v.toDate === 'function') {
        try { return v.toDate().toISOString() as any } catch { return null as any }
      }
      if (v instanceof Date) return (v as Date).toISOString() as any;
      if (typeof v === 'string') {
        const d = new Date(v); return isNaN(d.getTime()) ? null as any : d.toISOString() as any;
      }
      return null as any;
    })(),
    

    // Payment fields
    feAmountToBeReleased: formData.uploadDocuments || '0',
    feBeneVatPaymentAmt: formData.uploadDocuments1 || '0',
    feIsEngineerFee: formData.EngineerFeePaymentNeeded || false,
    feCorporatePaymentEngFee: formData.EngineerFeesPayment || '0',
    // Bank charges (backend expects 'fBbankCharges' key)
    ...(function() {
      const value = formData.engineerFeePayment2
      if (value === null || value === undefined || value === '') return null
      if (typeof value === 'number') {
        const computed = isNaN(value) ? null : value
        return { fBbankCharges: computed, fbbankCharges: computed } as any
      }
      if (typeof value === 'string') {
        const trimmed = value.trim()
        if (!trimmed) return null
        const parsed = parseFloat(trimmed)
        const computed = isNaN(parsed) ? null : parsed
        return { fBbankCharges: computed, fbbankCharges: computed } as any
      }
      return { fBbankCharges: null, fbbankCharges: null } as any
    })(),

    // Account balances - prefer fetched balances if available, else parse from display strings
    feCurBalInEscrowAcc:
      (options.balances?.escrow?.details?.transferLimits?.creditTransfer ?? null) !== null
        ? String(options.balances?.escrow?.details?.transferLimits?.creditTransfer)
        : parseAmount(formData.subConstructionAccount),
    feCorporateAccBalance:
      (options.balances?.corporate?.details?.transferLimits?.creditTransfer ?? null) !== null
        ? String(options.balances?.corporate?.details?.transferLimits?.creditTransfer)
        : parseAmount(formData.retentionAccount1),
    feSubConsAccBalance:
      (options.balances?.subConstruction?.details?.transferLimits?.creditTransfer ?? null) !== null
        ? String(options.balances?.subConstruction?.details?.transferLimits?.creditTransfer)
        : parseAmount(formData.retentionAccount),
    feCurBalInRetentionAcc:
      (options.balances?.retention?.details?.transferLimits?.creditTransfer ?? null) !== null
        ? String(options.balances?.retention?.details?.transferLimits?.creditTransfer)
        : parseAmount(formData.retentionAccount2),

    // Special fields
    feSpecialRate: formData.specialRate || false,
    feCorporatePayment: formData.corporateAmount || false,
    feDealRefNo: formData.delRefNo || null,
    fePpcNumber: formData.ppcNo || null,
    feCorpCertEngFee: formData.vatCapExceeded4 || '0',
    feRtZeroThree: formData.RT03 || null,
    feSplitPayment: false,
    fePaymentStatus: 'PENDING',
    feDocVerified: false,
    feBenefFromProject: false,
    feIncludeInPayout: false,
    feTasPaymentSuccess: false,
    fetasPaymentRerun: false,
    feDiscardPayment: false,
    feBeneficiaryToMaster: false,

    // DTOs - Send only the id field, pass null if arrays are empty
    expenseTypeDTO: formData.paymentType ? { id: parseInt(formData.paymentType) } : null,
    expenseSubTypeDTO: formData.paymentSubType ? { id: parseInt(formData.paymentSubType) } : null,
    invoiceCurrencyDTO: formData.invoiceCurrency ? { id: parseInt(formData.invoiceCurrency) } : null,
    paymentCurrencyDTO: formData.totalAmountPaid1 ? { id: parseInt(formData.totalAmountPaid1) } : null,
    chargedCodeDTO: formData.bankCharges ? { id: parseInt(formData.bankCharges) } : null,
    paymentModeDTO: formData.paymentMode ? { id: parseInt(formData.paymentMode) } : null,
    transactionTypeDTO: formData.engineerFeePayment ? { id: parseInt(formData.engineerFeePayment) } : null,

    // Real estate asset - use assetRegisterName (new) or projectName (old) directly (id) if available
    realEstateAssestDTO: (() => {
      if (formData.assetRegisterName) {
        return { id: parseInt(String(formData.assetRegisterName)) }
      }
      if (formData.projectName) {
        return { id: parseInt(formData.projectName) }
      }
      return selectedAsset ? { id: selectedAsset.id } : null
    })(),

    // Build partner - send id and bpName if managementFirmName is used
    buildPartnerDTO: (() => {
      if (formData.managementFirmName) {
        const partner = buildPartners.find((p: any) => p.bpName === formData.managementFirmName)
        return partner ? { id: partner.id, bpName: partner.bpName } : null
      }
      return selectedPartner ? { id: selectedPartner.id } : null
    })(),

    // Capital partner unit - send only id
    capitalPartnerUnitDTO: formData.unitNo ? { id: 0 } : null,

    // Payout to be made from CBS
    payoutToBeMadeFromCbsDTO: formData.uploadDocuments2
      ? { id: parseInt(formData.uploadDocuments2) }
      : null,

    deleted: false
  };

  return request;
}