// Asset Register label mapping from ASSET_REGISTER API response
// Maps configId to configValue for easy lookup and usage in components

export const BUILD_PARTNER_LABELS = {
  // Main Asset Register Details
  'CDL_AR_DETAILS': 'Asset Register details',
  'CDL_AR_ID': 'Asset Register ID',
  'CDL_AR_CIF': 'Asset Register CIF',
  'CDL_AR_REGNO': 'Asset Register Registration No',
  'CDL_AR_REGDATE': 'RERA Registration Date',
  'CDL_AR_NAME_LOCALE': 'Asset Register Name (Locale)',
  'CDL_AR_NAME': 'Asset Register Name',
  'CDL_AR_MASTER': 'Master Asset Register',
  'CDL_AR_REGULATORY_AUTHORITY': 'Regulatory Authority',
  'CDL_AR_STATUS': 'Status',

  // Address and Contact Information
  'CDL_AR_ADDRESS': 'Registered Address',
  'CDL_AR_MOBILE': 'Official Mobile Number',
  'CDL_AR_EMAIL': 'Official Email Address',
  'CDL_AR_FAX': 'Official Fax Number',

  // License Information
  'CDL_AR_LICENSE': 'Asset Register License Number',
  'CDL_AR_LICENSE_VALID': 'License Valid Until',

  // World-Check Status
  'CDL_AR_WORLD_STATUS': 'World-Check Status',
  'CDL_AR_WORLD_REMARKS': 'World-Check Status Remarks',

  // Additional Information
  'CDL_AR_NOTES': 'Additional Notes',

  // Document Management
  'CDL_AR_DOC_MANAGEMENT': 'Document Management',
  'CDL_AR_DOC_TITLE': 'Document Title',
  'CDL_AR_DOC_CLASSIFICATION': 'Document Classification',
  'CDL_AR_DOC_DATE': 'Date of Submission',
  'CDL_AR_DOC_ACTION': 'Actions',

  // Contact & Identification
  'CDL_AR_CONTACT': 'Asset Register Contact & Identification',
  'CDL_AR_AUTH_NAME': 'Authorized Contact Name',
  'CDL_AR_BUSINESS_ADDRESS': 'Business Address',
  'CDL_AR_EMAIL_ADDRESS': 'Corporate Email Address',
  'CDL_AR_POBOX': 'P.O. Box Number',
  'CDL_AR_COUNTRY_CODE': 'International Dialing Code',
  'CDL_AR_MOBILE_NUMBER': 'Primary Mobile Number',
  'CDL_AR_TELEPHONE_NUMBER': 'Primary Telephone Number',
  'CDL_AR_FAX_NUMBER': 'Fax Number',
  'CDL_AR_ALTERNATE_NUMBER': 'Alternate Telephone Number',

  // Escrow Fee & Collection Details
  'CDL_AR_FEES': 'Escrow Fee & Collection Details',
  'CDL_AR_FEES_TYPE': 'Type of Fee',
  'CDL_AR_FEES_FREQUENCY': 'Collection Frequency',
  'CDL_AR_FEES_ACCOUNT': 'Designated Debit Account',
  'CDL_AR_FEES_TOTAL': 'Total Fees Due',
  'CDL_AR_FEES_DATE': 'Next Collection Date',
  'CDL_AR_FEES_RATE': 'Fee Rate (%)',
  'CDL_AR_FEES_AMOUNT': 'Fee Amount',
  'CDL_AR_FEES_VAT': 'Applicable VAT (%)',
  'CDL_AR_FEES_CURRENCY': 'Transaction Currency',
  'CDL_AR_FEES_TOTAL_AMOUNT': 'Collected Amount',

  // Beneficiary Banking Information
  'CDL_AR_BENE_INFO': 'Beneficiary Banking Information',
  'CDL_AR_BENE_REF': 'Beneficiary Reference ID',
  'CDL_AR_BENE_PAYMODE': 'Payment Transfer Mode',
  'CDL_AR_BENE_NAME': 'Beneficiary Full Name',
  'CDL_AR_BENE_BANK': 'Beneficiary Bank Name',
  'CDL_AR_BENE_BIC': 'SWIFT / BIC Code',
  'CDL_AR_BENE_ROUTING': 'Bank Routing Number',
  'CDL_AR_BENE_ACCOUNT': 'Bank Account Number',
}

// Utility function to get label by configId
export const getBuildPartnerLabel = (configId) => {
  return BUILD_PARTNER_LABELS[configId] || configId
}

// Utility function to get all labels for a specific category
export const getBuildPartnerLabelsByCategory = (category) => {
  const categories = {
    'details': [
      'CDL_AR_DETAILS', 'CDL_AR_ID', 'CDL_AR_CIF', 'CDL_AR_REGNO', 
      'CDL_AR_REGDATE', 'CDL_AR_NAME_LOCALE', 'CDL_AR_NAME', 
      'CDL_AR_MASTER', 'CDL_AR_REGULATORY_AUTHORITY', 'CDL_AR_STATUS'
    ],
    'contact': [
      'CDL_AR_ADDRESS', 'CDL_AR_MOBILE', 'CDL_AR_EMAIL', 'CDL_AR_FAX',
      'CDL_AR_CONTACT', 'CDL_AR_AUTH_NAME', 'CDL_AR_BUSINESS_ADDRESS',
      'CDL_AR_EMAIL_ADDRESS', 'CDL_AR_POBOX', 'CDL_AR_COUNTRY_CODE',
      'CDL_AR_MOBILE_NUMBER', 'CDL_AR_TELEPHONE_NUMBER', 'CDL_AR_FAX_NUMBER',
      'CDL_AR_ALTERNATE_NUMBER'
    ],
    'license': [
      'CDL_AR_LICENSE', 'CDL_AR_LICENSE_VALID'
    ],
    'worldcheck': [
      'CDL_AR_WORLD_STATUS', 'CDL_AR_WORLD_REMARKS'
    ],
    'documents': [
      'CDL_AR_DOC_MANAGEMENT', 'CDL_AR_DOC_TITLE', 'CDL_AR_DOC_CLASSIFICATION',
      'CDL_AR_DOC_DATE', 'CDL_AR_DOC_ACTION'
    ],
    'fees': [
      'CDL_AR_FEES', 'CDL_AR_FEES_TYPE', 'CDL_AR_FEES_FREQUENCY',
      'CDL_AR_FEES_ACCOUNT', 'CDL_AR_FEES_TOTAL', 'CDL_AR_FEES_DATE',
      'CDL_AR_FEES_RATE', 'CDL_AR_FEES_AMOUNT', 'CDL_AR_FEES_VAT',
      'CDL_AR_FEES_CURRENCY', 'CDL_AR_FEES_TOTAL_AMOUNT'
    ],
    'beneficiary': [
      'CDL_AR_BENE_INFO', 'CDL_AR_BENE_REF', 'CDL_AR_BENE_PAYMODE',
      'CDL_AR_BENE_NAME', 'CDL_AR_BENE_BANK', 'CDL_AR_BENE_BIC',
      'CDL_AR_BENE_ROUTING', 'CDL_AR_BENE_ACCOUNT'
    ]
  }

  return categories[category]?.map(configId => ({
    configId,
    label: BUILD_PARTNER_LABELS[configId]
  })) || []
}

// Export the full mapping object for direct access
export default BUILD_PARTNER_LABELS
