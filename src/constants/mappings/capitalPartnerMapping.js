// Owner Registry label mapping from OWNER_REGISTRY API response
// Maps configId to configValue for easy lookup and usage in components

export const CAPITAL_PARTNER_LABELS = {
  // Main Owner Registry Details
  'CDL_OWR': 'Owner Registry',
  'CDL_OWR_NEW': 'Register New Owner Registry',
  'CDL_OWR_BASIC_INFO': 'Owner Registry Basic Information',
  'CDL_OWR_TYPE': 'Owner Registry Type',
  'CDL_OWR_FIRSTNAME': 'Owner Registry Name',
  'CDL_OWR_REFID': 'Owner Registry Reference ID',
  'CDL_OWR_MIDDLENAME': 'Middle Name',
  'CDL_OWR_LASTNAME': 'Last Name',
  'CDL_OWR_LOCALE_NAME': 'Local Language Name',
  'CDL_OWR_OWNERSHIP': 'Ownership Share (%)',
  'CDL_OWR_ID_TYPE': 'Identification Document Type',
  'CDL_OWR_DOC_NO': 'Identification Document Number',
  'CDL_OWR_ID_EXP': 'Identification Expiry Date',
  'CDL_OWR_NATIONALITY': 'Nationality',
  'CDL_OWR_TELEPHONE': 'Account Contact Telephone',
  'CDL_OWR_MOBILE': 'Primary Mobile Number',
  'CDL_OWR_EMAIL': 'Owner Registry Email Address',

  // Unit Details
  'CDL_OWR_UNIT_DETAILS': 'Asset Unit Details',
  'CDL_OWR_FLOOR': 'Floor Number',
  'CDL_OWR_NOOF_BED': 'Number of Bedrooms',
  'CDL_OWR_UNIT_NUMBER': 'Unit Number (Oqood Format)',
  'CDL_OWR_UNIT_STATUS': 'Unit Status',
  'CDL_OWR_BUILDING_NAME': 'Building Name',
  'CDL_OWR_PLOT_SIZE': 'Plot Size (sq. m./sq. ft.)',
  'CDL_OWR_PROP_NUMBER': 'Property Identification Number',
  'CDL_OWR_UNIT_IBAN': 'Unit IBAN',
  'CDL_OWR_REG_FEE': 'Unit Registration Fee',
  'CDL_OWR_AGENT_NAME': 'Agent Full Name',
  'CDL_OWR_AGENT_ID': 'Agent National Identification Number',
  'CDL_OWR_NET_PRICE': 'Net Sale Price',
  'CDL_OWR_GROSS_PRICE': 'Gross Sale Price',
  'CDL_OWR_VAT_APPLICABLE': 'VAT Applicability',
  'CDL_OWR_DEED_REF_NO': 'Deed Reference Number',
  'CDL_OWR_CONTRACT_NO': 'Contract Number',
  'CDL_OWR_AGREEMENT_DATE': 'Agreement Execution Date',
  'CDL_OWR_SPA': 'Sale & Purchase Agreement (SPA)',
  'CDL_OWR_PAYMENT_PLAN': 'Asset Payment Plan',
  'CDL_OWR_FEE_REQ': 'Modification Fee Requirement',
  'CDL_OWR_WORLD_STATUS': 'World-Check Status',
  'CDL_OWR_WITH_ESCROW': 'Amount Paid to Build Partner (Within Escrow)',

  // Payment Plan & Installments
  'CDL_OWR_SEQ_NO': 'Installment Sequence Number',
  'CDL_OWR_DUE_DATE': 'Installment Due Date',
  'CDL_OWR_BOOKING_AMOUNT': 'Initial Booking Payment',

  // Banking & Payment Details
  'CDL_OWR_BANK_DETAILS': 'Banking & Payment Details',
  'CDL_OWR_PAY_MODE': 'Payment Method',
  'CDL_OWR_ACCOUNT_NUMBER': 'Bank Account Number',
  'CDL_OWR_PAYEE_NAME': 'Payee Full Name',
  'CDL_OWR_PAYEE_ADDRESS': 'Payee Address',
  'CDL_OWR_BANK_NAME': 'Bank Name',
  'CDL_OWR_BANK_ADDRESS': 'Bank Address',
  'CDL_OWR_ROUTING_CODE': 'Routing Number',
  'CDL_OWR_BIC_CODE': 'SWIFT / BIC Code',
  'CDL_OWR_VA_NUMBER': 'Retrieve Virtual Account Number',

  // Additional Payment Information
  'CDL_OWR_OUTSIDE_ESCROW': 'Amount Paid to Build Partner (Outside Escrow)',
  'CDL_OWR_PARTNER_PAYMENT': 'Total Owner Registry Payment',
  'CDL_OWR_BOOKING': 'Reservation & Booking Form',
  'CDL_OWR_OQOOD_STATUS': 'Oqood Paid Status',
  'CDL_OWR_OQOOD_PAID': 'Oqood Amount Paid',
  'CDL_OWR_UNIT_AREA': 'Unit Area Measurement',
  'CDL_OWR_FORFEIT_AMT': 'Forfeited Amount',
  'CDL_OWR_FROFEIT_AMT': 'Forfeit Amount',
  'CDL_OWR_DLD_FEE': 'Dubai Land Department Fee',
  'CDL_OWR_REFUND_AMOUNT': 'Refund Amount',
  'CDL_OWR_REMARKS': 'Additional Remarks',
  'CDL_OWR_TRANS_AMT': 'Transferred Amount',

  // Additional labels for UI
  'CDL_OWR_BP_NAME': 'Build Partner Name',
  'CDL_OWR_BP_ID': 'Build Partner ID',
  'CDL_OWR_BP_CIF': 'Build Partner CIF',
  'CDL_OWR_BPA_NAME': 'Project Name',
  'CDL_OWR_BPA_CIF': 'Project CIF',
  'CDL_OWR_DOCUMENTS': 'Documents',
  'CDL_OWR_REVIEW': 'Review',
  'CDL_OWR_ADD_PAYMENT_PLAN': 'Add Payment Plan',
  'CDL_OWR_INSTALLMENT_NUMBER': 'Installment Number',
  'CDL_OWR_INSTALLMENT_DATE': 'Installment Date',
  'CDL_OWR_ACTION': 'Action',
  'CDL_OWR_AMOUNT': 'Amount',
  'CDL_OWR_PROJECT_NAME': 'Project Name',
  'CDL_OWR_APPROVAL_STATUS': 'Approval Status',
  'CDL_OWR_SALES_PURCHASE_AGREEMENT': 'Sales Purchase Agreement',
  'CDL_OWR_PROJECT_PAYMENT_PLAN': 'Project Payment Plan',
  'CDL_OWR_MODIFICATION_FEE_NEEDED': 'Modification Fee Needed',
  'CDL_OWR_RESERVATION_BOOKING_FORM': 'Reservation Booking Form',
  'CDL_OWR_BENEFICIARY_ROUTING_CODE': 'Beneficiary Routing Code',
}

// Utility function to get label by configId
export const getCapitalPartnerLabel = (configId) => {
  return CAPITAL_PARTNER_LABELS[configId] || configId
}

// Utility function to get all labels for a specific category
export const getCapitalPartnerLabelsByCategory = (category) => {
  const categories = {
    'basic_info': [
      'CDL_OWR', 'CDL_OWR_NEW', 'CDL_OWR_BASIC_INFO', 'CDL_OWR_TYPE',
      'CDL_OWR_FIRSTNAME', 'CDL_OWR_REFID', 'CDL_OWR_MIDDLENAME',
      'CDL_OWR_LASTNAME', 'CDL_OWR_LOCALE_NAME', 'CDL_OWR_OWNERSHIP'
    ],
    'identification': [
      'CDL_OWR_ID_TYPE', 'CDL_OWR_DOC_NO', 'CDL_OWR_ID_EXP',
      'CDL_OWR_NATIONALITY'
    ],
    'contact': [
      'CDL_OWR_TELEPHONE', 'CDL_OWR_MOBILE', 'CDL_OWR_EMAIL'
    ],
    'unit_details': [
      'CDL_OWR_UNIT_DETAILS', 'CDL_OWR_FLOOR', 'CDL_OWR_NOOF_BED',
      'CDL_OWR_UNIT_NUMBER', 'CDL_OWR_UNIT_STATUS', 'CDL_OWR_BUILDING_NAME',
      'CDL_OWR_PLOT_SIZE', 'CDL_OWR_PROP_NUMBER', 'CDL_OWR_UNIT_IBAN',
      'CDL_OWR_REG_FEE'
    ],
    'agent': [
      'CDL_OWR_AGENT_NAME', 'CDL_OWR_AGENT_ID'
    ],
    'pricing': [
      'CDL_OWR_NET_PRICE', 'CDL_OWR_GROSS_PRICE', 'CDL_OWR_VAT_APPLICABLE'
    ],
    'legal': [
      'CDL_OWR_DEED_REF_NO', 'CDL_OWR_CONTRACT_NO', 'CDL_OWR_AGREEMENT_DATE',
      'CDL_OWR_SPA'
    ],
    'payment_plan': [
      'CDL_OWR_PAYMENT_PLAN', 'CDL_OWR_SEQ_NO', 'CDL_OWR_DUE_DATE',
      'CDL_OWR_BOOKING_AMOUNT'
    ],
    'banking': [
      'CDL_OWR_BANK_DETAILS', 'CDL_OWR_PAY_MODE', 'CDL_OWR_ACCOUNT_NUMBER',
      'CDL_OWR_PAYEE_NAME', 'CDL_OWR_PAYEE_ADDRESS', 'CDL_OWR_BANK_NAME',
      'CDL_OWR_BANK_ADDRESS', 'CDL_OWR_ROUTING_CODE', 'CDL_OWR_BIC_CODE',
      'CDL_OWR_VA_NUMBER'
    ],
    'payments': [
      'CDL_OWR_WITH_ESCROW', 'CDL_OWR_OUTSIDE_ESCROW', 'CDL_OWR_PARTNER_PAYMENT',
      'CDL_OWR_BOOKING', 'CDL_OWR_OQOOD_STATUS', 'CDL_OWR_OQOOD_PAID',
      'CDL_OWR_UNIT_AREA', 'CDL_OWR_FORFEIT_AMT', 'CDL_OWR_DLD_FEE',
      'CDL_OWR_REFUND_AMOUNT', 'CDL_OWR_REMARKS', 'CDL_OWR_TRANS_AMT'
    ],
    'status': [
      'CDL_OWR_FEE_REQ', 'CDL_OWR_WORLD_STATUS'
    ]
  }

  return categories[category]?.map(configId => ({
    configId,
    label: CAPITAL_PARTNER_LABELS[configId]
  })) || []
}

// Export the full mapping object for direct access
export default CAPITAL_PARTNER_LABELS
