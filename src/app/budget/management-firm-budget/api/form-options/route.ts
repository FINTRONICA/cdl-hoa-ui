import { NextResponse } from 'next/server'

import { type BudgetFormOptions } from '@/types/budget'

const DEFAULT_FORM_OPTIONS: BudgetFormOptions = {
  managementFirmGroups: [
    {
      id: 'MFG-1001',
      label: 'Downtown Management Group',
      description: 'Primary firm for downtown communities',
    },
    {
      id: 'MFG-2034',
      label: 'Lakeside HOA Services',
      description: 'Covers lakeside estates and villas',
    },
    {
      id: 'MFG-3045',
      label: 'Skyline Property Managers',
      description: 'Specialised in high-rise towers',
    },
  ],
  serviceChargeGroups: [
    {
      id: 'SCG-11',
      label: 'Residential Villas - Tier A',
    },
    {
      id: 'SCG-22',
      label: 'Residential Apartments - Tier B',
    },
    {
      id: 'SCG-33',
      label: 'Mixed Use Communities',
    },
  ],
  categories: [
    {
      id: 'CAT-OPS',
      label: 'Operations',
    },
    {
      id: 'CAT-MAINT',
      label: 'Maintenance',
    },
    {
      id: 'CAT-ADMIN',
      label: 'Administration',
    },
  ],
  subCategories: [
    {
      id: 'SUB-SECURITY',
      label: 'Security Services',
    },
    {
      id: 'SUB-LANDSCAPE',
      label: 'Landscaping',
    },
    {
      id: 'SUB-CLEANING',
      label: 'Cleaning & Housekeeping',
    },
  ],
  services: [
    {
      id: 'SRV-SEC-01',
      label: '24/7 Guarding',
    },
    {
      id: 'SRV-LAND-02',
      label: 'Seasonal Landscaping',
    },
    {
      id: 'SRV-HK-03',
      label: 'Common Area Cleaning',
    },
  ],
  budgetPeriods: [
    {
      code: '2024',
      title: 'Fiscal Year 2024',
      from: '2024-01-01',
      to: '2024-12-31',
    },
    {
      code: '2025',
      title: 'Fiscal Year 2025',
      from: '2025-01-01',
      to: '2025-12-31',
    },
    {
      code: '2026',
      title: 'Fiscal Year 2026',
      from: '2026-01-01',
      to: '2026-12-31',
    },
  ],
}

export async function GET() {
  return NextResponse.json({ options: DEFAULT_FORM_OPTIONS })
}

