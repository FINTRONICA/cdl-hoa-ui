import { NextResponse } from 'next/server'

import { type BudgetMasterFormOptions } from '@/types/budget'

const DEFAULT_FORM_OPTIONS: BudgetMasterFormOptions = {
  chargeTypes: [
    {
      id: '1',
      label: 'Service Charge',
      description: 'Regular service charges',
    },
    {
      id: '2',
      label: 'Maintenance Fee',
      description: 'Maintenance and upkeep fees',
    },
    {
      id: '3',
      label: 'Special Assessment',
      description: 'Special assessment charges',
    },
  ],
  groupNames: [
    {
      id: 'GRP-001',
      label: 'Residential Group A',
    },
    {
      id: 'GRP-002',
      label: 'Residential Group B',
    },
    {
      id: 'GRP-003',
      label: 'Commercial Group',
    },
  ],
  categories: [
    {
      id: 'CAT-MAINT',
      label: 'Maintenance',
    },
    {
      id: 'CAT-ADMIN',
      label: 'Administration',
    },
    {
      id: 'CAT-SECURITY',
      label: 'Security',
    },
  ],
  categorySubs: [
    {
      id: 'SUB-ELEC',
      label: 'Electrical',
    },
    {
      id: 'SUB-PLUMB',
      label: 'Plumbing',
    },
    {
      id: 'SUB-AC',
      label: 'HVAC',
    },
  ],
  categorySubToSubs: [
    {
      id: 'SUB2-REPAIR',
      label: 'Repairs',
    },
    {
      id: 'SUB2-UPGRADE',
      label: 'Upgrades',
    },
    {
      id: 'SUB2-INSPECT',
      label: 'Inspections',
    },
  ],
  services: [
    {
      id: 'SRV-001',
      label: '24/7 Maintenance Service',
    },
    {
      id: 'SRV-002',
      label: 'Emergency Response',
    },
    {
      id: 'SRV-003',
      label: 'Regular Maintenance',
    },
  ],
}

export async function GET() {
  return NextResponse.json({ options: DEFAULT_FORM_OPTIONS })
}

