

export const BUILD_PARTNER_LABELS = {
  // Asset Register labels NEW
  'CDL_AR_DETAILS': 'Asset Register details',
  'CDL_AR_ID': 'Asset Register ID',
  'CDL_AR_CIF': 'Asset Register CIF ID (Bank Core)',
  'CDL_AR_REGNO': 'Asset Register Registration No',
  'CDL_AR_REGDATE': 'HOA Regisntartion Date',
  'CDL_AR_NAME_LOCALE': 'Asset Register Name (Locale)',
  'CDL_AR_PROJECT': 'Project',
  'CDL_AR_MASTER_DEVELOPER': 'Master Developer',
  'CDL_AR_MASTER_COMMUNITY': 'Master Community',
  'CDL_AR_COMPANY_NUMBER': 'Company Number',
  'CDL_AR_NAME': 'Asset Register Name',
  'CDL_AR_MASTER': 'Management firm company name',
  'CDL_AR_REGULATORY_AUTHORITY': 'Management Type',
  'CDL_AR_STATUS': 'Status',
  
  'CDL_AR_ADDRESS': 'Registered Address',
  'CDL_AR_MOBILE': 'Official Mobile Number',
  'CDL_AR_EMAIL': 'Official Email Address',
  'CDL_AR_FAX': 'Official Fax Number',


  'CDL_AR_LICENSE': 'Trade License Number',
  'CDL_AR_LICENSE_VALID': 'Trade License Valid Until',

 
  'CDL_AR_WORLD_STATUS': 'Notification',
  'CDL_AR_WORLD_REMARKS': 'Remarks',

  
  'CDL_AR_NOTES': 'Additional Notes',


  'CDL_AR_DOC_MANAGEMENT': 'Document Management',
  'CDL_AR_DOC_TITLE': 'Document Title',
  'CDL_AR_DOC_CLASSIFICATION': 'Document Classification',
  'CDL_AR_DOC_DATE': 'Date of Submission',
  'CDL_AR_DOC_ACTION': 'Available Actions',

 
  'CDL_AR_CONTACT': 'Asset Register Contact & Identification',
  'CDL_AR_CONTACT_ADD': 'Add Contact Details',
  'CDL_AR_CONTACT_EDIT': 'Edit Contact Details',
  'CDL_AR_AUTH_FIRST_NAME': 'First Name',
  'CDL_AR_AUTH_LAST_NAME': 'Last Name',
  'CDL_AR_AUTH_NAME': 'Authorized Contact Name',
  'CDL_AR_BUSINESS_ADDRESS': 'Business Address',
  'CDL_AR_EMAIL_ADDRESS': 'Corporate Email Address',
  'CDL_AR_ADDRESS_LINE1': 'Address Line 1',
  'CDL_AR_ADDRESS_LINE2': 'Address Line 2',
  'CDL_AR_POBOX': 'P.O. Box Number',
  'CDL_AR_COUNTRY_CODE': 'International Dialing Code',
  'CDL_AR_MOBILE_NUMBER': 'Primary Mobile Number',
  'CDL_AR_TELEPHONE_NUMBER': 'Primary Telephone Number',
  'CDL_AR_FAX_NUMBER': 'Fax Number',
  'CDL_AR_ALTERNATE_NUMBER': 'Alternate Telephone Number',


  // Asset Register labels END
 
  

  'CDL_BP_DOC_MANAGEMENT': 'Document Management',
  'CDL_BP_DOC_TITLE': 'Document Title',
  'CDL_BP_DOC_CLASSIFICATION': 'Document Classification',
  'CDL_BP_DOC_DATE': 'Date of Submission',
  'CDL_BP_DOC_ACTION': 'Available Actions',



  // Common UI labels
  'CDL_COMMON_ACTION': 'Action',
  'CDL_COMMON_RETRY': 'Retry',
  'CDL_COMMON_CANCEL': 'Cancel',
  'CDL_COMMON_ADD': 'Add',
  'CDL_COMMON_UPDATE': 'Update',
  'CDL_COMMON_ADDING': 'Adding...',
  'CDL_COMMON_UPDATING': 'Updating...',
  'CDL_COMMON_LOADING': 'Loading...',
  'CDL_COMMON_VALIDATE_ACCOUNT': 'Validate Account',
  'CDL_COMMON_VALIDATE_BIC': 'Validate BIC',
  'CDL_COMMON_REQUIRED_FIELDS_PREFIX': 'Please fill in the required fields:',
  'CDL_COMMON_DROPDOWNS_LOAD_FAILED': 'Failed to load dropdown options. Please refresh the page.',
  'CDL_COMMON_SUBMIT_WAIT': 'Please wait for dropdown options to load before submitting.',
}

// Utility function to get label by configId
export const getBuildPartnerLabel = (configId) => {
  return BUILD_PARTNER_LABELS[configId] || configId
}

// Utility function to get all labels for a specific category
export const getBuildPartnerLabelsByCategory = (category) => {
  const categories = {
    'details': [
      'CDL_BP_DETAILS', 'CDL_BP_ID', 'CDL_BP_CIF', 'CDL_BP_REGNO', 
      'CDL_BP_REGDATE', 'CDL_BP_NAME_LOCALE', 'CDL_BP_NAME', 
      'CDL_BP_MASTER', 'CDL_BP_REGULATORY_AUTHORITY', 'CDL_BP_STATUS'
    ],
    'contact': [
      'CDL_BP_ADDRESS', 'CDL_BP_MOBILE', 'CDL_BP_EMAIL', 'CDL_BP_FAX',
      'CDL_BP_CONTACT', 'CDL_BP_AUTH_NAME', 'CDL_BP_BUSINESS_ADDRESS',
      'CDL_BP_EMAIL_ADDRESS', 'CDL_BP_POBOX', 'CDL_BP_COUNTRY_CODE',
      'CDL_BP_MOBILE_NUMBER', 'CDL_BP_TELEPHONE_NUMBER', 'CDL_BP_FAX_NUMBER',
      'CDL_BP_ALTERNATE_NUMBER'
    ],
    'license': [
      'CDL_BP_LICENSE', 'CDL_BP_LICENSE_VALID'
    ],
    'worldcheck': [
      'CDL_BP_WORLD_STATUS', 'CDL_BP_WORLD_REMARKS'
    ],
    'documents': [
      'CDL_BP_DOC_MANAGEMENT', 'CDL_BP_DOC_TITLE', 'CDL_BP_DOC_CLASSIFICATION',
      'CDL_BP_DOC_DATE', 'CDL_BP_DOC_ACTION'
    ],
    'fees': [
      'CDL_BP_FEES', 'CDL_BP_FEES_TYPE', 'CDL_BP_FEES_FREQUENCY',
      'CDL_BP_FEES_ACCOUNT', 'CDL_BP_FEES_TOTAL', 'CDL_BP_FEES_DATE',
      'CDL_BP_FEES_RATE', 'CDL_BP_FEES_AMOUNT', 'CDL_BP_FEES_VAT',
      'CDL_BP_FEES_CURRENCY', 'CDL_BP_FEES_TOTAL_AMOUNT'
    ],
    'beneficiary': [
      'CDL_BP_BENE_INFO', 'CDL_BP_BENE_REF', 'CDL_BP_BENE_PAYMODE',
      'CDL_BP_BENE_NAME', 'CDL_BP_BENE_BANK', 'CDL_BP_BENE_BIC',
      'CDL_BP_BENE_ROUTING', 'CDL_BP_BENE_ACCOUNT'
    ]
  }

  return categories[category]?.map(configId => ({
    configId,
    label: BUILD_PARTNER_LABELS[configId]
  })) || []
}

// Export the full mapping object for direct access
export default BUILD_PARTNER_LABELS
