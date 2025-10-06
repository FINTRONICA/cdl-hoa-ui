import { Dayjs } from 'dayjs'

export interface PropertyManagementData {
  propertyManagement: string;
  companyId: string;
  clientOrRegulatory: string;
  companyName: string;
  companyNumber: string;
  project: string;
  masterDeveloper: string;
  masterCommunity: string;
  cifId: string;
  managementType: string;
  companyNameArabic: string;
  tradeLicenseNumber: string;
  tradeLicenseExpiry: Dayjs | null;
  account1Mobile: string;
  account1Tel: string;
  account1Fax: string;
  account1Email: string;
  account2Name: string;
  account2Tel: string;
  account2Mobile: string;
  account2Email: string;
  account3Name: string;
  account3Tel: string;
  account3Mobile: string;
  account3Email: string;
  account4Name: string;
  account4Tel: string;
  account4Mobile: string;
  account4Email: string;
  account5Name: string;
  account5Tel: string;
  account5Mobile: string;
  account5Email: string;
  migratedData: boolean;
  remarks: string;
  notification: boolean
}
