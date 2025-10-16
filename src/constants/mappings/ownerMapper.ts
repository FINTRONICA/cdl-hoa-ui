import type { OwnerData } from './types/owner'

// Owner Response interface - represents API response structure
export interface OwnerResponse {
  id: number
  ownerName?: string // Owner Name (English) - string, text field, mandatory (alphabets), alphabet (50,0)
  ownerNameArabic?: string // Owner Name (Arabic) - string, text field, optional (Arabic alphabets only), arabic alphabets (50,0)
  ownerId?: string // Owner ID - string
  ownershipPercentage?: number // Ownership Percentage - number, text field, optional, percentage (3,2)
  idType?: string // Owner ID Type - string, dropdown, mandatory, values: Passport, Emirates ID, Trade License
  reservePercentage?: number // Reserve Percentage - number, text field, optional
  idExpiryDate?: string // ID Expiry Date - date, calendar, optional, cannot be a past date
  idNumber?: string // ID Number - string, text field, mandatory, alphanumeric (20,0)
  unitMollakId?: string // Owner/unit Mollak ID - string, text field, optional, alphanumeric (20,0)
  contactNo?: string // Owner Contact No - string, text field, mandatory, alphanumeric (-20,0)
  ownerType?: string // Owner Type - string, dropdown, mandatory, values: Joint, Company, Individual
  nationality?: string // Nationality - string, dropdown, optional, standard list of all countries
  email?: string // Owner Email Address - string, text field, optional, all characters (50,0)
  floor?: string // Floor - string, text field, optional, alphanumeric (15,0)
  noOfBedroom?: string // No of Bedroom - string, text field, optional, alphanumeric (15,0)
  
  // Joint Owner 2
  jointOwner2Name?: string // Joint Owner 2 Name - string, text field, mandatory only if Owner type is Joint, alphanumeric (50,0)
  jointOwner2Nationality?: string // Nationality of Joint Owner 2 - string, dropdown, optional
  jointOwner2IdNo?: string // ID NO of Joint Owner 2 - string, text field, non-mandatory, text length 15
  jointOwner2IdExpiry?: string // ID Date of Expiry of Joint Owner 2 - date, calendar, optional
  
  // Joint Owner 3
  jointOwner3Name?: string // Joint Owner 3 Name - string, text field, optional, alphanumeric (50,0)
  jointOwner3Nationality?: string // Nationality of Joint Owner 3 - string, dropdown, optional
  jointOwner3IdNo?: string // ID NO of Joint Owner 3 - string, text field, optional, alphanumeric (20,0)
  jointOwner3IdExpiry?: string // ID Date of Expiry of Joint Owner 3 - date, calendar, optional
  
  // Joint Owner 4
  jointOwner4Name?: string // Joint Owner 4 Name - string, text field, optional, alphanumeric (50,0)
  jointOwner4Nationality?: string // Nationality of Joint Owner 4 - string, dropdown, optional
  jointOwner4IdNo?: string // ID NO of Joint Owner 4 - string, text field, optional, alphanumeric (20,0)
  jointOwner4IdExpiry?: string // ID Date of Expiry of Joint Owner 4 - date, calendar, optional
  
  // Joint Owner 5
  jointOwner5Name?: string // Joint Owner 5 Name - string, text field, optional, alphanumeric (50,0)
  jointOwner5Nationality?: string // Nationality of Joint Owner 5 - string, dropdown, optional
  jointOwner5IdNo?: string // ID NO of Joint Owner 5 - string, text field, optional, alphanumeric (20,0)
  jointOwner5IdExpiry?: string // ID Date of Expiry of Joint Owner 5 - date, calendar, optional
  
  // Property/Unit Details
  propertyId?: string // Property ID - string, text field, mandatory
  propertyName?: string // Property Name - string, dropdown, auto fetch from core banking, mandatory
  mgmtCompanyDevId?: string // Management Company/Developer ID - string, dropdown, mandatory
  mgmtCompanyDevName?: string // Management Company/Developer Name - string, text field, auto fetch, mandatory, alphanumeric (50,0)
  unitReferenceNumber?: string // Unit Reference Number - string, text field, optional, all characters (20,0)
  unitNo?: string // Unit no. - string, text field, mandatory, all characters (20,0)
  unitStatus?: string // Unit Status - string, dropdown, mandatory, default: Open
  towerBuildingName?: string // Tower/Building Name - string, text field, mandatory, alphanumeric (50,0)
  unitPlotSize?: string // Unit/Plot size - string, text field, non mandatory, alphanumeric (20,0)
  propertyType?: string // Property Type - string, dropdown, non mandatory, values: Land, Villa, Unit
  unitIban?: string // Unit IBAN - string, text field, optional, alphanumeric (50,0)
  agentName?: string // Name of Agent - string, text field, optional, alphanumeric (35,0)
  agentNationalId?: string // Agent National ID - string, text field, optional, numeric (10,0)
  grossSalePrice?: number // Gross Sale Price - number, text field, optional, numeric (17,2)
  salePrice?: number // Sale Price - number, text field, optional, numeric (17,2)
  vatApplicable?: string // VAT Applicable - string, text field, optional
  deedNo?: string // Deed No. - string, text field, non-mandatory, text length 15
  agreementContractNo?: string // Agreement No./Contract No. - string, text field, non-mandatory, text length 15
  agreementDate?: string // Agreement Date - date, text field, non-mandatory
  worldCheck?: string // World Check - string, radio button, optional, values: Yes, No
  amountWithinEscrow?: number // Amount Paid Within General Fund Escrow - number, text field, optional, numeric (17,2)
  amountOutEscrow?: number // Amount Paid Out of General Fund Escrow - number, text field, optional, numeric (17,2)
  totalAmountPaid?: number // Total Amount Paid - number, text field, auto-calculate, optional
  unitAreaSize?: string // Unit Area Size - string, text field, optional, alphanumeric (15,0)
  remarks?: string // Remarks - string, text field, optional, alphanumeric (50,0)
  
  taskStatusDTO?: { code?: string; [key: string]: unknown }
  ownerUnitDTO?: { [key: string]: unknown }
}

// Owner UI Data interface - represents the data structure used in the UI
export interface OwnerUIData extends OwnerData {
  id: number
  approvalStatus?: string
}

/**
 * Maps Owner API response to Owner UI data structure
 * Replaces Investor with Owner throughout the mapping
 * @param owner - Owner response from API
 * @returns OwnerUIData - Mapped owner data for UI consumption
 */
export const mapOwnerResponseToOwnerData = (
  owner: OwnerResponse
): OwnerUIData => {
  try {
    const mapApiStatus = (taskStatusDTO: { code?: string; [key: string]: unknown } | null | undefined): string => {
      if (!taskStatusDTO) {
        return 'INITIATED'
      }
      return taskStatusDTO.code || 'INITIATED'
    }

    const mappedData: OwnerUIData = {
      id: owner.id,
      owner: owner.ownerName ?? '-', // Owner Name (English) - string, text field, mandatory (alphabets)
      ownerId: owner.ownerId ?? '-', // Owner ID - string
      ownerNameArabic: owner.ownerNameArabic, // Owner Name (Arabic) - string, optional (Arabic alphabets)
      ownershipPercentage: owner.ownershipPercentage, // Ownership Percentage - number, optional, percentage (3,2)
      idType: owner.idType ?? '-', // Owner ID Type - string, dropdown, mandatory
      reservePercentage: owner.reservePercentage, // Reserve Percentage - number, optional
      idExpiryDate: owner.idExpiryDate, // ID Expiry Date - date, optional, cannot be past date
      idNumber: owner.idNumber ?? '-', // ID Number - string, mandatory, alphanumeric (20,0)
      unitMollakId: owner.unitMollakId, // Owner/unit Mollak ID - string, optional, alphanumeric (20,0)
      contactNo: owner.contactNo ?? '-', // Owner Contact No - string, mandatory, alphanumeric (-20,0)
      ownerType: owner.ownerType ?? '-', // Owner Type - string, dropdown, mandatory
      nationality: owner.nationality, // Nationality - string, dropdown, optional
      email: owner.email, // Owner Email - string, optional, all characters (50,0)
      floor: owner.floor, // Floor - string, optional, alphanumeric (15,0)
      noOfBedroom: owner.noOfBedroom, // No of Bedroom - string, optional, alphanumeric (15,0)
      
      // Joint Owner 2
      jointOwner2Name: owner.jointOwner2Name, // Joint Owner 2 Name - string, mandatory if type is Joint
      jointOwner2Nationality: owner.jointOwner2Nationality, // Nationality - string, optional
      jointOwner2IdNo: owner.jointOwner2IdNo, // ID NO - string, non-mandatory, text length 15
      jointOwner2IdExpiry: owner.jointOwner2IdExpiry, // ID Expiry - date, optional
      
      // Joint Owner 3
      jointOwner3Name: owner.jointOwner3Name, // Joint Owner 3 Name - string, optional
      jointOwner3Nationality: owner.jointOwner3Nationality, // Nationality - string, optional
      jointOwner3IdNo: owner.jointOwner3IdNo, // ID NO - string, optional, alphanumeric (20,0)
      jointOwner3IdExpiry: owner.jointOwner3IdExpiry, // ID Expiry - date, optional
      
      // Joint Owner 4
      jointOwner4Name: owner.jointOwner4Name, // Joint Owner 4 Name - string, optional
      jointOwner4Nationality: owner.jointOwner4Nationality, // Nationality - string, optional
      jointOwner4IdNo: owner.jointOwner4IdNo, // ID NO - string, optional, alphanumeric (20,0)
      jointOwner4IdExpiry: owner.jointOwner4IdExpiry, // ID Expiry - date, optional
      
      // Joint Owner 5
      jointOwner5Name: owner.jointOwner5Name, // Joint Owner 5 Name - string, optional
      jointOwner5Nationality: owner.jointOwner5Nationality, // Nationality - string, optional
      jointOwner5IdNo: owner.jointOwner5IdNo, // ID NO - string, optional, alphanumeric (20,0)
      jointOwner5IdExpiry: owner.jointOwner5IdExpiry, // ID Expiry - date, optional
      
      // Property/Unit Details
      propertyId: owner.propertyId, // Property ID - string, mandatory
      propertyName: owner.propertyName, // Property Name - string, dropdown, auto fetch
      mgmtCompanyDevId: owner.mgmtCompanyDevId, // Management Company/Developer ID - string, dropdown, mandatory
      mgmtCompanyDevName: owner.mgmtCompanyDevName, // Management Company/Developer Name - string, auto fetch
      unitReferenceNumber: owner.unitReferenceNumber, // Unit Reference Number - string, optional
      unitNo: owner.unitNo, // Unit no. - string, mandatory
      unitStatus: owner.unitStatus || 'Open', // Unit Status - string, dropdown, default: Open
      towerBuildingName: owner.towerBuildingName, // Tower/Building Name - string, mandatory
      unitPlotSize: owner.unitPlotSize, // Unit/Plot size - string, non mandatory
      propertyType: owner.propertyType, // Property Type - string, dropdown, non mandatory
      unitIban: owner.unitIban, // Unit IBAN - string, optional
      agentName: owner.agentName, // Name of Agent - string, optional
      agentNationalId: owner.agentNationalId, // Agent National ID - string, optional
      grossSalePrice: owner.grossSalePrice, // Gross Sale Price - number, optional
      salePrice: owner.salePrice, // Sale Price - number, optional
      vatApplicable: owner.vatApplicable, // VAT Applicable - string, optional
      deedNo: owner.deedNo, // Deed No. - string, non-mandatory
      agreementContractNo: owner.agreementContractNo, // Agreement No./Contract No. - string, non-mandatory
      agreementDate: owner.agreementDate, // Agreement Date - date, non-mandatory
      worldCheck: owner.worldCheck, // World Check - string, radio button, optional
      amountWithinEscrow: owner.amountWithinEscrow, // Amount Within Escrow - number, optional
      amountOutEscrow: owner.amountOutEscrow, // Amount Out of Escrow - number, optional
      totalAmountPaid: owner.totalAmountPaid || (owner.amountWithinEscrow || 0) + (owner.amountOutEscrow || 0), // Total Amount - auto-calculate
      unitAreaSize: owner.unitAreaSize, // Unit Area Size - string, optional
      remarks: owner.remarks, // Remarks - string, optional
      
      approvalStatus: mapApiStatus(owner.taskStatusDTO),
    }
    
    return mappedData
  } catch (error) {
    console.error('Error mapping owner data:', error, owner)
    // Return a safe fallback object
    return {
      id: owner.id || 0,
      owner: '-',
      ownerId: '-',
      idType: '-',
      idNumber: '-',
      contactNo: '-',
      ownerType: '-',
      approvalStatus: 'INITIATED',
    }
  }
}

