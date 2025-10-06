interface InvestorData {
  investorNameEnglish: string; // Text Field
  investorNameArabic: string; // Text Field
  ownershipPercentage: number; // Text Field
  investorIdType: string; // Dropdown
  reservePercentage: number; // Text Field
  idExpiryDate: Date | null; // Calendar
  idNumber: string; // Text Field
  investorUnitMollakId: string; // Text Field
  investorContactNo: string; // Text Field
  investorType: string; // Dropdown
  nationality: string; // Dropdown
  investorEmailAddress: string; // Text Field
  floor: string; // Text Field
  noOfBedroom: string; // Text Field
  jointOwner2Name: string; // Text Field
  nationalityJointOwner2: string; // Dropdown
  idNoDateOfExpiryJointOwner2: string; // Text Field
  dateOfExpiryJointOwner2Calendar: Date | null; // Calendar
  jointOwner3Name: string; // Text Field
  nationalityJointOwner3: string; // Dropdown
  idNoDateOfExpiryJointOwner3: string; // Text Field
  dateOfExpiryJointOwner3Calendar: Date | null; // Calendar
  jointOwner4Name: string; // Text Field
  nationalityJointOwner4: string; // Dropdown
  idNoDateOfExpiryJointOwner4: string; // Text Field
  dateOfExpiryJointOwner4Calendar: Date | null; // Calendar
  jointOwner5Name: string; // Text Field
  nationalityJointOwner5: string; // Dropdown
  idNoDateOfExpiryJointOwner5: string; // Text Field
  dateOfExpiryJointOwner5Calendar: Date | null; // Calendar
}

interface UnityData {
  propertyId: string; // Text Field
  propertyName: string; // Dropdown Auto Fetch
  managementCompanyDeveloperId: string; // Dropdown
  managementCompanyDeveloperName: string; // Text Field Auto Fetch
  unitReferenceNumber: string; // Text Field
  unitNo: string; // Text Field
  unitStatus: string; // Dropdown
  towerBuildingName: string; // Text Field
  unitPlotSize: number; // Text Field
  propertyIdDropdown: string; // Dropdown
  unitIban: string; // Text Field
  nameOfAgent: string; // Text Field
  agentNationalId: string; // Text Field
  grossSalePrice: number; // Text Field
  salePrice: number; // Text Field
  vatApplicable: string; // Text Field
  deedNo: string; // Text Field
  agreementNo: string; // Text Field
  agreementDate: Date | null; // Calendar
  worldCheck: "Yes" | "No"; // Radio
  amountPaidWithinGeneralFundEscrow1: number; // Text Field
  amountPaidWithinGeneralFundEscrow2: number; // Text Field
  totalAmountPaid: number; // AutoCalculate
  unitAreaSize: number; // Text Field
  remarks: string; // Text Field
}

export interface OwnerData {
  investor: InvestorData;
  unity: UnityData;
}
