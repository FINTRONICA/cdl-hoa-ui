// Owner data interface - replaced Investor with Owner
export interface OwnerData {
  owner: string // Owner Name (English) - string, text field, mandatory (alphabets), alphabet (50,0)
  ownerId: string // Owner ID - string, alphanumeric
  ownerNameArabic?: string | undefined // Owner Name (Arabic) - string, text field, optional (Arabic alphabets only), arabic alphabets (50,0)
  ownershipPercentage?: number | undefined // Ownership Percentage - number, text field, optional, percentage (3,2)
  idType: string // Owner ID Type - string, dropdown, mandatory, values: Passport, Emirates ID, Trade License
  reservePercentage?: number | undefined // Reserve Percentage - number, text field, optional
  idExpiryDate?: string | undefined // ID Expiry Date - date, calendar, optional, cannot be a past date
  idNumber: string // ID Number - string, text field, mandatory, alphanumeric (20,0)
  unitMollakId?: string | undefined // Owner/unit Mollak ID - string, text field, optional, alphanumeric (20,0)
  contactNo: string // Owner Contact No - string, text field, mandatory, alphanumeric (-20,0)
  ownerType: string // Owner Type - string, dropdown, mandatory, values: Joint, Company, Individual
  nationality?: string | undefined // Nationality - string, dropdown, optional, standard list of all countries
  email?: string | undefined // Owner Email Address - string, text field, optional, all characters (50,0)
  floor?: string | undefined // Floor - string, text field, optional, alphanumeric (15,0)
  noOfBedroom?: string | undefined // No of Bedroom - string, text field, optional, alphanumeric (15,0)
  
  // Joint Owner 2
  jointOwner2Name?: string | undefined // Joint Owner 2 Name - string, text field, mandatory only if Owner type is Joint, alphanumeric (50,0)
  jointOwner2Nationality?: string | undefined // Nationality of Joint Owner 2 - string, dropdown, optional, standard list of all countries
  jointOwner2IdNo?: string | undefined // ID NO of Joint Owner 2 - string, text field, non-mandatory, text length 15
  jointOwner2IdExpiry?: string | undefined // ID Date of Expiry of Joint Owner 2 - date, calendar, optional, cannot be a past date
  
  // Joint Owner 3
  jointOwner3Name?: string | undefined // Joint Owner 3 Name - string, text field, optional, alphanumeric (50,0)
  jointOwner3Nationality?: string | undefined // Nationality of Joint Owner 3 - string, dropdown, optional, standard list of all countries
  jointOwner3IdNo?: string | undefined // ID NO of Joint Owner 3 - string, text field, optional, alphanumeric (20,0)
  jointOwner3IdExpiry?: string | undefined // ID Date of Expiry of Joint Owner 3 - date, calendar, optional, cannot be a past date
  
  // Joint Owner 4
  jointOwner4Name?: string | undefined // Joint Owner 4 Name - string, text field, optional, alphanumeric (50,0)
  jointOwner4Nationality?: string | undefined // Nationality of Joint Owner 4 - string, dropdown, optional, standard list of all countries
  jointOwner4IdNo?: string | undefined // ID NO of Joint Owner 4 - string, text field, optional, alphanumeric (20,0)
  jointOwner4IdExpiry?: string | undefined // ID Date of Expiry of Joint Owner 4 - date, calendar, optional, cannot be a past date
  
  // Joint Owner 5
  jointOwner5Name?: string | undefined // Joint Owner 5 Name - string, text field, optional, alphanumeric (50,0)
  jointOwner5Nationality?: string | undefined // Nationality of Joint Owner 5 - string, dropdown, optional, standard list of all countries
  jointOwner5IdNo?: string | undefined // ID NO of Joint Owner 5 - string, text field, optional, alphanumeric (20,0)
  jointOwner5IdExpiry?: string | undefined // ID Date of Expiry of Joint Owner 5 - date, calendar, optional, cannot be a past date
  
  // Property/Unit Details
  propertyId?: string | undefined // Property ID - string, text field, user input, mandatory
  propertyName?: string | undefined // Property Name - string, dropdown, auto fetch from core banking, mandatory
  mgmtCompanyDevId?: string | undefined // Management Company/Developer ID - string, dropdown, user input, mandatory
  mgmtCompanyDevName?: string | undefined // Management Company/Developer Name - string, text field, auto fetch, mandatory, alphanumeric (50,0)
  unitReferenceNumber?: string | undefined // Unit Reference Number - string, text field, user input, optional, all characters (20,0)
  unitNo?: string | undefined // Unit no. - string, text field, user input, mandatory, all characters (20,0)
  unitStatus?: string | undefined // Unit Status - string, dropdown, user selection, mandatory, default: Open, values: Open, Transfer, Cancel, Transfer Joint, Cancellation under process, Others
  towerBuildingName?: string | undefined // Tower/Building Name - string, text field, user input, mandatory, alphanumeric (50,0)
  unitPlotSize?: string | undefined // Unit/Plot size - string, text field, user input, non mandatory, alphanumeric (20,0)
  propertyType?: string | undefined // Property Type - string, dropdown, user selection, non mandatory, values: Land, Villa, Unit
  unitIban?: string | undefined // Unit IBAN - string, text field, user input, optional, alphanumeric (50,0)
  agentName?: string | undefined // Name of Agent - string, text field, user input, optional, alphanumeric (35,0)
  agentNationalId?: string | undefined // Agent National ID - string, text field, user input, optional, numeric (10,0)
  grossSalePrice?: number | undefined // Gross Sale Price - number, text field, user input, optional, numeric (17,2)
  salePrice?: number | undefined // Sale Price - number, text field, user input, optional, numeric (17,2)
  vatApplicable?: string | undefined // VAT Applicable - string, text field, user input, optional
  deedNo?: string | undefined // Deed No. - string, text field, user input, non-mandatory, text length 15
  agreementContractNo?: string | undefined // Agreement No./Contract No. - string, text field, user input, non-mandatory, text length 15
  agreementDate?: string | undefined // Agreement Date - date, text field, user input, non-mandatory
  worldCheck?: string | undefined // World Check - string, radio button, user selection, optional, values: Yes, No
  amountWithinEscrow?: number | undefined // Amount Paid to Management Company/Developer (AED) Within General Fund Escrow - number, text field, user input, optional, numeric (17,2)
  amountOutEscrow?: number | undefined // Amount Paid to Management Company/Developer (AED) Out of General Fund Escrow - number, text field, user input, optional, numeric (17,2)
  totalAmountPaid?: number | undefined // Total Amount Paid - number, text field, auto-calculate, optional, system calculates (Out of General Funds Escrow + Within General Funds Escrow)
  unitAreaSize?: string | undefined // Unit Area Size - string, text field, user input, optional, alphanumeric (15,0)
  remarks?: string | undefined // Remarks - string, text field, user input, optional, alphanumeric (50,0)
}

// Owner ID Type options
export enum OwnerIdType {
  PASSPORT = 'Passport', // string, dropdown option
  EMIRATES_ID = 'Emirates ID', // string, dropdown option
  TRADE_LICENSE = 'Trade License' // string, dropdown option
}

// Owner Type options
export enum OwnerType {
  JOINT = 'Joint', // string, dropdown option
  COMPANY = 'Company', // string, dropdown option
  INDIVIDUAL = 'Individual' // string, dropdown option
}

// Unit Status options
export enum UnitStatus {
  OPEN = 'Open', // string, dropdown option, default value
  TRANSFER = 'Transfer', // string, dropdown option
  CANCEL = 'Cancel', // string, dropdown option
  TRANSFER_JOINT = 'Transfer Joint', // string, dropdown option
  CANCELLATION_PROCESS = 'Cancellation under process', // string, dropdown option
  OTHERS = 'Others' // string, dropdown option, capture text when selected
}

// Property Type options
export enum PropertyType {
  LAND = 'Land', // string, dropdown option
  VILLA = 'Villa', // string, dropdown option
  UNIT = 'Unit' // string, dropdown option
}

// World Check options
export enum WorldCheck {
  YES = 'Yes', // string, radio button option
  NO = 'No' // string, radio button option
}














// Owner label mapping
// Maps configId to configValue for easy lookup and usage in components
// Each constant includes data type, field type, and validation rules

export const OWNER_LABELS = {
  // Main Owner Details
  'CDL_OWN_TITLE': 'Owner', // string, label
  'CDL_OWN_NEW': 'Register New Owner', // string, label
  'CDL_OWN_BASIC_INFO': 'Owner Basic Information', // string, label
  
  // 1. Owner Name (English)
  'CDL_OWN_OWNER_NAME_ENGLISH': 'Owner Name (English)', // string, text field, user input, mandatory (alphabets), alphabet (50,0)
  
  // 2. Owner Name (Arabic)
  'CDL_OWN_OWNER_NAME_ARABIC': 'Owner Name (Arabic)', // string, text field, user input, optional (Arabic alphabets only), arabic alphabets (50,0)
  
  // 3. Ownership Percentage
  'CDL_OWN_OWNERSHIP_PERCENTAGE': 'Ownership Percentage', // number, text field, user input, optional, percentage (3,2)
  
  // 4. Owner ID Type
  'CDL_OWN_ID_TYPE': 'Owner ID Type', // string, dropdown, user selection, mandatory, dropdown values: Passport, Emirates ID, Trade License
  'CDL_OWN_ID_TYPE_PASSPORT': 'Passport', // string, dropdown option
  'CDL_OWN_ID_TYPE_EMIRATES_ID': 'Emirates ID', // string, dropdown option
  'CDL_OWN_ID_TYPE_TRADE_LICENSE': 'Trade License', // string, dropdown option
  
  // Reserve Percentage
  'CDL_OWN_RESERVE_PERCENTAGE': 'Reserve Percentage', // number, text field, user input, optional, system considers "Reserve Percentage" at owner level if provided
  
  // 5. ID Expiry Date
  'CDL_OWN_ID_EXPIRY_DATE': 'ID Expiry Date', // date, calendar, user selection, optional, cannot be a past date
  
  // 6. ID Number
  'CDL_OWN_ID_NUMBER': 'ID Number', // string, text field, user input, mandatory, alphanumeric (20,0)
  
  // Owner/unit Mollak ID
  'CDL_OWN_UNIT_MOLLAK_ID': 'Owner/unit Mollak ID', // string, text field, user input, optional, alphanumeric (20,0)
  
  // 7. Owner Contact No
  'CDL_OWN_CONTACT_NO': 'Owner Contact no', // string, text field, user input, mandatory, alphanumeric (-20,0)
  
  // 8. Owner Type
  'CDL_OWN_TYPE': 'Owner Type', // string, dropdown, user selection, mandatory, dropdown values: Joint, Company, Individual
  'CDL_OWN_TYPE_JOINT': 'Joint', // string, dropdown option
  'CDL_OWN_TYPE_COMPANY': 'Company', // string, dropdown option
  'CDL_OWN_TYPE_INDIVIDUAL': 'Individual', // string, dropdown option
  
  // 9. Nationality
  'CDL_OWN_NATIONALITY': 'Nationality', // string, dropdown, user selection, optional, dropdown values: standard list of all countries
  
  // 10. Owner Email Address
  'CDL_OWN_EMAIL': 'Owner Email Address', // string, text field, user input, optional, all characters (50,0)
  
  // 11. Floor
  'CDL_OWN_FLOOR': 'Floor', // string, text field, user input, optional, alphanumeric (15,0)
  
  // 12. No of Bedroom
  'CDL_OWN_NO_OF_BEDROOM': 'No of Bedroom', // string, text field, user input, optional, alphanumeric (15,0)
  
  // 13. Joint Owner 2 Name
  'CDL_OWN_JOINT_OWNER_2_NAME': 'Joint Owner 2 Name', // string, text field, user input, mandatory only if Owner type is Joint, alphanumeric (50,0)
  
  // 14. Nationality of Joint Owner 2
  'CDL_OWN_JOINT_OWNER_2_NATIONALITY': 'Nationality of Joint owner 2', // string, dropdown, user selection, optional, dropdown values: standard list of all countries
  
  // 15. ID NO of Joint Owner 2
  'CDL_OWN_JOINT_OWNER_2_ID_NO': 'ID NO of Joint Owner 2', // string, text field, user input, non-mandatory, text length 15
  
  // 16. ID Date of Expiry of Joint Owner 2
  'CDL_OWN_JOINT_OWNER_2_ID_EXPIRY': '(ID) Date of Expiry of Joint Owner 2', // date, calendar, calendar, optional, cannot be a past date
  
  // 17. Joint Owner 3 Name
  'CDL_OWN_JOINT_OWNER_3_NAME': 'Joint Owner 3 Name', // string, text field, user input, optional, alphanumeric (50,0)
  
  // 18. Nationality of Joint Owner 3
  'CDL_OWN_JOINT_OWNER_3_NATIONALITY': 'Nationality of Joint owner 3', // string, dropdown, user selection, optional, dropdown values: standard list of all countries
  
  // 19. ID NO of Joint Owner 3
  'CDL_OWN_JOINT_OWNER_3_ID_NO': 'ID NO of Joint Owner 3', // string, text field, user input, optional, alphanumeric (20,0)
  
  // 20. ID Date of Expiry of Joint Owner 3
  'CDL_OWN_JOINT_OWNER_3_ID_EXPIRY': '(ID) Date of Expiry of Joint Owner 3', // date, calendar, calendar, optional, cannot be a past date
  
  // 21. Joint Owner 4 Name
  'CDL_OWN_JOINT_OWNER_4_NAME': 'Joint Owner 4 Name', // string, text field, user input, optional, alphanumeric (50,0)
  
  // 22. Nationality of Joint Owner 4
  'CDL_OWN_JOINT_OWNER_4_NATIONALITY': 'Nationality of Joint owner 4', // string, dropdown, user selection, optional, dropdown values: standard list of all countries
  
  // 23. ID NO of Joint Owner 4
  'CDL_OWN_JOINT_OWNER_4_ID_NO': 'ID NO of Joint Owner 4', // string, text field, user input, optional, alphanumeric (20,0)
  
  // 24. ID Date of Expiry of Joint Owner 4
  'CDL_OWN_JOINT_OWNER_4_ID_EXPIRY': '(ID) Date of Expiry of Joint Owner 4', // date, calendar, calendar, optional, cannot be a past date
  
  // 25. Joint Owner 5 Name
  'CDL_OWN_JOINT_OWNER_5_NAME': 'Joint Owner 5 Name', // string, text field, user input, optional, alphanumeric (50,0)
  
  // 26. Nationality of Joint Owner 5
  'CDL_OWN_JOINT_OWNER_5_NATIONALITY': 'Nationality of Joint owner 5', // string, dropdown, user selection, optional, dropdown values: standard list of all countries
  
  // 27. ID NO of Joint Owner 5
  'CDL_OWN_JOINT_OWNER_5_ID_NO': 'ID NO of Joint Owner 5', // string, text field, user input, optional, alphanumeric (20,0)
  
  // 28. ID Date of Expiry of Joint Owner 5
  'CDL_OWN_JOINT_OWNER_5_ID_EXPIRY': '(ID) Date of Expiry of Joint Owner 5', // date, calendar, calendar, optional, cannot be a past date
  
  // Property/Unit Details Section
  
  // 1. Property ID
  'CDL_OWN_PROPERTY_ID': 'Property ID', // string, text field, user input, mandatory
  
  // 2. Property Name
  'CDL_OWN_PROPERTY_NAME': 'Property Name', // string, dropdown, auto fetch from core banking, mandatory
  
  // 3. Management Company/Developer ID
  'CDL_OWN_MGMT_COMPANY_DEV_ID': 'Management Company/Developer ID', // string, dropdown, user input, mandatory, list of Developer and Management company in AutoEscrow
  
  // 4. Management Company/Developer Name
  'CDL_OWN_MGMT_COMPANY_DEV_NAME': 'Management Company/Developer Name', // string, text field, auto fetch, mandatory, alphanumeric (50,0)
  
  // 5. Unit Reference Number
  'CDL_OWN_UNIT_REFERENCE_NUMBER': 'Unit Reference Number', // string, text field, user input, optional, all characters (20,0)
  
  // 6. Unit no.
  'CDL_OWN_UNIT_NO': 'Unit no.', // string, text field, user input, mandatory, all characters (20,0)
  
  // 7. Unit Status
  'CDL_OWN_UNIT_STATUS': 'Unit Status', // string, dropdown, user selection, mandatory, default: Open
  'CDL_OWN_UNIT_STATUS_OPEN': 'Open', // string, dropdown option
  'CDL_OWN_UNIT_STATUS_TRANSFER': 'Transfer', // string, dropdown option
  'CDL_OWN_UNIT_STATUS_CANCEL': 'Cancel', // string, dropdown option
  'CDL_OWN_UNIT_STATUS_TRANSFER_JOINT': 'Transfer Joint', // string, dropdown option
  'CDL_OWN_UNIT_STATUS_CANCELLATION_PROCESS': 'Cancellation under process', // string, dropdown option
  'CDL_OWN_UNIT_STATUS_OTHERS': 'Others', // string, dropdown option, capture text when selected
  
  // 8. Tower/Building Name
  'CDL_OWN_TOWER_BUILDING_NAME': 'Tower/Building Name', // string, text field, user input, mandatory, alphanumeric (50,0)
  
  // 9. Unit/Plot size
  'CDL_OWN_UNIT_PLOT_SIZE': 'Unit/Plot size', // string, text field, user input, non mandatory, alphanumeric (20,0)
  
  // 10. Property Type (labeled as Property ID in document)
  'CDL_OWN_PROPERTY_TYPE': 'Property Type', // string, dropdown, user selection, non mandatory
  'CDL_OWN_PROPERTY_TYPE_LAND': 'Land', // string, dropdown option
  'CDL_OWN_PROPERTY_TYPE_VILLA': 'Villa', // string, dropdown option
  'CDL_OWN_PROPERTY_TYPE_UNIT': 'Unit', // string, dropdown option
  
  // 11. Unit IBAN
  'CDL_OWN_UNIT_IBAN': 'Unit IBAN', // string, text field, user input, optional, alphanumeric (50,0)
  
  // 13. Name of Agent
  'CDL_OWN_AGENT_NAME': 'Name of Agent', // string, text field, user input, optional, alphanumeric (35,0)
  
  // 14. Agent National ID
  'CDL_OWN_AGENT_NATIONAL_ID': 'Agent National ID', // string, text field, user input, optional, numeric (10,0)
  
  // 15. Gross Sale Price
  'CDL_OWN_GROSS_SALE_PRICE': 'Gross Sale Price', // number, text field, user input, optional, numeric (17,2)
  
  // 16. Sale Price
  'CDL_OWN_SALE_PRICE': 'Sale Price', // number, text field, user input, optional, numeric (17,2)
  
  // 17. VAT Applicable
  'CDL_OWN_VAT_APPLICABLE': 'VAT Applicable', // string, text field, user input, optional
  
  // 18. Deed No.
  'CDL_OWN_DEED_NO': 'Deed No.', // string, text field, user input, non-mandatory, text length 15
  
  // 19. Agreement No./Contract No.
  'CDL_OWN_AGREEMENT_CONTRACT_NO': 'Agreement No./Contract No.', // string, text field, user input, non-mandatory, text length 15
  
  // 20. Agreement Date
  'CDL_OWN_AGREEMENT_DATE': 'Agreement Date', // date, text field, user input, non-mandatory
  
  // 21. World Check
  'CDL_OWN_WORLD_CHECK': 'World Check', // string, radio button, user selection, optional, values: Yes, No
  'CDL_OWN_WORLD_CHECK_YES': 'Yes', // string, radio button option
  'CDL_OWN_WORLD_CHECK_NO': 'No', // string, radio button option
  
  // 22. Amount Paid to Management Company/Developer (AED) Within General Fund Escrow
  'CDL_OWN_AMOUNT_WITHIN_ESCROW': 'Amount Paid to Management Company/Developer (AED) Within General Fund Escrow', // number, text field, user input, optional, numeric (17,2)
  
  // 23. Amount Paid to Management Company/Developer (AED) Out of General Fund Escrow
  'CDL_OWN_AMOUNT_OUT_ESCROW': 'Amount Paid to Management Company/Developer (AED) Out of General Fund Escrow', // number, text field, user input, optional, numeric (17,2)
  
  // 24. Total Amount Paid
  'CDL_OWN_TOTAL_AMOUNT_PAID': 'Total Amount Paid', // number, text field, auto-calculate, optional, system calculates (Out of General Funds Escrow + Within General Funds Escrow)
  
  // 25. Unit Area Size
  'CDL_OWN_UNIT_AREA_SIZE': 'Unit Area Size', // string, text field, user input, optional, alphanumeric (15,0)
  
  // 26. Remarks
  'CDL_OWN_REMARKS': 'Remarks', // string, text field, user input, optional, alphanumeric (50,0)
} as const

// Utility function to get label by configId
export const getOwnerLabel = (configId: string): string => {
  return OWNER_LABELS[configId as keyof typeof OWNER_LABELS] || configId
}

// Utility function to get all labels for a specific category
export const getOwnerLabelsByCategory = (category: string) => {
  const categories: Record<string, string[]> = {
    'basic_info': [
      'CDL_OWN_TITLE',
      'CDL_OWN_NEW',
      'CDL_OWN_BASIC_INFO',
      'CDL_OWN_OWNER_NAME_ENGLISH',
      'CDL_OWN_OWNER_NAME_ARABIC',
      'CDL_OWN_OWNERSHIP_PERCENTAGE',
      'CDL_OWN_RESERVE_PERCENTAGE'
    ],
    'identification': [
      'CDL_OWN_ID_TYPE',
      'CDL_OWN_ID_TYPE_PASSPORT',
      'CDL_OWN_ID_TYPE_EMIRATES_ID',
      'CDL_OWN_ID_TYPE_TRADE_LICENSE',
      'CDL_OWN_ID_NUMBER',
      'CDL_OWN_ID_EXPIRY_DATE',
      'CDL_OWN_UNIT_MOLLAK_ID'
    ],
    'contact': [
      'CDL_OWN_CONTACT_NO',
      'CDL_OWN_EMAIL'
    ],
    'owner_type': [
      'CDL_OWN_TYPE',
      'CDL_OWN_TYPE_JOINT',
      'CDL_OWN_TYPE_COMPANY',
      'CDL_OWN_TYPE_INDIVIDUAL'
    ],
    'location': [
      'CDL_OWN_NATIONALITY',
      'CDL_OWN_FLOOR',
      'CDL_OWN_NO_OF_BEDROOM'
    ],
    'joint_owner_2': [
      'CDL_OWN_JOINT_OWNER_2_NAME',
      'CDL_OWN_JOINT_OWNER_2_NATIONALITY',
      'CDL_OWN_JOINT_OWNER_2_ID_NO',
      'CDL_OWN_JOINT_OWNER_2_ID_EXPIRY'
    ],
    'joint_owner_3': [
      'CDL_OWN_JOINT_OWNER_3_NAME',
      'CDL_OWN_JOINT_OWNER_3_NATIONALITY',
      'CDL_OWN_JOINT_OWNER_3_ID_NO',
      'CDL_OWN_JOINT_OWNER_3_ID_EXPIRY'
    ],
    'joint_owner_4': [
      'CDL_OWN_JOINT_OWNER_4_NAME',
      'CDL_OWN_JOINT_OWNER_4_NATIONALITY',
      'CDL_OWN_JOINT_OWNER_4_ID_NO',
      'CDL_OWN_JOINT_OWNER_4_ID_EXPIRY'
    ],
    'joint_owner_5': [
      'CDL_OWN_JOINT_OWNER_5_NAME',
      'CDL_OWN_JOINT_OWNER_5_NATIONALITY',
      'CDL_OWN_JOINT_OWNER_5_ID_NO',
      'CDL_OWN_JOINT_OWNER_5_ID_EXPIRY'
    ],
    'property_details': [
      'CDL_OWN_PROPERTY_ID',
      'CDL_OWN_PROPERTY_NAME',
      'CDL_OWN_MGMT_COMPANY_DEV_ID',
      'CDL_OWN_MGMT_COMPANY_DEV_NAME',
      'CDL_OWN_PROPERTY_TYPE',
      'CDL_OWN_PROPERTY_TYPE_LAND',
      'CDL_OWN_PROPERTY_TYPE_VILLA',
      'CDL_OWN_PROPERTY_TYPE_UNIT'
    ],
    'unit_details': [
      'CDL_OWN_UNIT_REFERENCE_NUMBER',
      'CDL_OWN_UNIT_NO',
      'CDL_OWN_UNIT_STATUS',
      'CDL_OWN_UNIT_STATUS_OPEN',
      'CDL_OWN_UNIT_STATUS_TRANSFER',
      'CDL_OWN_UNIT_STATUS_CANCEL',
      'CDL_OWN_UNIT_STATUS_TRANSFER_JOINT',
      'CDL_OWN_UNIT_STATUS_CANCELLATION_PROCESS',
      'CDL_OWN_UNIT_STATUS_OTHERS',
      'CDL_OWN_TOWER_BUILDING_NAME',
      'CDL_OWN_UNIT_PLOT_SIZE',
      'CDL_OWN_UNIT_IBAN',
      'CDL_OWN_UNIT_AREA_SIZE'
    ],
    'agent_details': [
      'CDL_OWN_AGENT_NAME',
      'CDL_OWN_AGENT_NATIONAL_ID'
    ],
    'pricing_details': [
      'CDL_OWN_GROSS_SALE_PRICE',
      'CDL_OWN_SALE_PRICE',
      'CDL_OWN_VAT_APPLICABLE'
    ],
    'legal_details': [
      'CDL_OWN_DEED_NO',
      'CDL_OWN_AGREEMENT_CONTRACT_NO',
      'CDL_OWN_AGREEMENT_DATE',
      'CDL_OWN_WORLD_CHECK',
      'CDL_OWN_WORLD_CHECK_YES',
      'CDL_OWN_WORLD_CHECK_NO'
    ],
    'payment_details': [
      'CDL_OWN_AMOUNT_WITHIN_ESCROW',
      'CDL_OWN_AMOUNT_OUT_ESCROW',
      'CDL_OWN_TOTAL_AMOUNT_PAID'
    ],
    'additional_info': [
      'CDL_OWN_REMARKS'
    ]
  }

  return categories[category]?.map(configId => ({
    configId,
    label: OWNER_LABELS[configId as keyof typeof OWNER_LABELS]
  })) || []
}

// Export the full mapping object for direct access
export default OWNER_LABELS

