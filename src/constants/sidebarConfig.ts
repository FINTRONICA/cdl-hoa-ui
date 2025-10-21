import {
  LayoutDashboard,
  User,
  Building,
  TicketSlash,
  FileText,
  UserCog,
  FileClock,
  SquarePen,
  SquareUserRound,
  FileKey,
  HandCoins,
  Landmark,
  UserPen,
  ListChecks,
  Banknote,
  FileChartPie,
  XCircle,
  BriefcaseBusiness,
  CircleUserRound,
  CircleDollarSign,
  ListCheck,
  AlignJustify,
  ShieldCheckIcon,
  Shield,
  Tv,
  Workflow,
  BanknoteArrowUp,
  ArrowsUpFromLine,

} from 'lucide-react'

interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  children?: SidebarItem[]
  permissions?: string[] // Array of required permissions, supports "*" wildcard
}

interface SidebarSection {
  id: string
  label: string
  items: SidebarItem[]
  icon: React.ComponentType<{ className?: string }>
  href?: string
  permissions?: string[] // Array of required permissions, supports "*" wildcard
}

// Type for the label resolver function
type LabelResolver = (sidebarId: string, fallback: string) => string

// Function to create sidebar configuration with dynamic labels and permissions
export const createSidebarConfig = (getLabel: LabelResolver): SidebarSection[] => [
  {
    id: 'dashboard',
    label: getLabel('dashboard', 'Dashboard'),
    icon: LayoutDashboard,
    href: '/dashboard',
    items: [],
    permissions: ['nav_menu_dashboard', 'nav_menu_all'], // Dashboard access or wildcard
  },
  {
    id: 'activity',
    label: getLabel('activity', 'Activity Manager'),
    icon: User,
    permissions: ['*'], // Show section if any child is accessible
    items: [
      {
        id: 'pending',
        label: getLabel('pending', 'Pending Activities'),
        icon: FileClock,
        href: '/activities/pending',
        permissions: ['nav_menu_task_engaged', 'nav_menu_all'],
      },
      {
        id: 'involved',
        label: getLabel('involved', 'Involved Activities'),
        icon: SquarePen,
        href: '/activities/involved',
        permissions: ['nav_menu_transactions', 'nav_menu_all'], // Using closest match
      },
    ],
  },
  {
    id: 'entities',
    label: getLabel('entities', 'ENTITIES'),
    icon: Building,
    permissions: ['*'], // Show section if any child is accessible
    // items: [
    //   {
    //     id: 'developers',
    //     label: getLabel('developers', 'Developers'),
    //     icon: SquareUserRound,
    //     href: '/entities/developers',
    //     permissions: ['nav_menu_bp', 'nav_menu_all'],
    //   },
    //   {
    //     id: 'projects',
    //     label: getLabel('projects', 'Projects'),
    //     icon: BriefcaseBusiness,
    //     href: '/entities/projects',
    //     permissions: ['nav_menu_bpa', 'nav_menu_all'],
    //   },
    //   {
    //     id: 'investors',
    //     label: getLabel('investors', 'Investor'),
    //     icon: CircleUserRound,
    //     href: '/investors',
    //     permissions: ['nav_menu_cp', 'nav_menu_all'],
    //   },
    // ],
    items: [
      {
        id: 'developers',
        label: getLabel('developers', 'Asset Register'),
        icon: SquareUserRound,
        href: '/entities/developers',
        permissions: ['nav_menu_bp', 'nav_menu_all'],
      },
      {
        id: 'projects',
        label: getLabel('projects', 'Management Firms'),
        icon: BriefcaseBusiness,
        href: '/entities/projects',
        permissions: ['nav_menu_bpa', 'nav_menu_all'],
      },
      {
        id: 'investors',
        label: getLabel('investors', 'Owner Registry'),
        icon: CircleUserRound,
        href: '/investors',
        permissions: ['nav_menu_cp', 'nav_menu_all'],
      },
    ],
  },
  {
    id: 'deposits',
    label: getLabel('deposits', 'DEPOSITS'),
    icon: CircleDollarSign,
    permissions: ['*'], // Show section if any child is accessible
    items: [
      // {
      //   id: 'unallocated',
      //   label: getLabel('unallocated', 'Unallocated Transaction'),
      //   icon: AlignJustify,
      //   href: '/transactions/unallocated',
      //   permissions: ['nav_menu_pending_tran', 'nav_menu_all'],
      // },
      // {
      //   id: 'discarded',
      //   label: getLabel('discarded', 'Discarded Transaction'),
      //   icon: XCircle,
      //   href: '/transactions/deposits',
      //   permissions: ['nav_menu_discarded_tran', 'nav_menu_all'],
      // },
      {
        id: 'allocated',
        label: getLabel('allocated', 'Allocated Transaction'),
        icon: ListCheck,
        href: '/transactions/allocated',
        permissions: ['nav_menu_processed_tran', 'nav_menu_all'],
      },
        {
          id: 'depositsTransactions',
          label: getLabel('depositsTransactions', 'Deposits Transactions'),
          icon: HandCoins,
          href: '/transactions/deposits',
          permissions: ['*'],
        },
        {
          id: 'Payment',
          label: 'payment',
          icon: Banknote,
  
          children: [
            {
              id: 'voucher',
              label: 'Voucher',
              icon: BanknoteArrowUp,
              href: '/transactions/manual',
            },
            // {
            //   id: 'online-payment',
            //   label: 'Online Payment',
            //   icon: BanknoteArrowUp,
            //   href: '/admin/workflow/action',
            // },
          ],
        },
      // {
      //   id: 'manual',
      //   label: getLabel('manual', 'Manual Payment'),
      //   icon: HandCoins,
      //   href: '/transactions/manual',
      //   permissions: ['nav_menu_manual_payment', 'nav_menu_all'],
      // },
      // {
      //   id: 'tas',
      //   label: getLabel('tas', 'TAS Payment'),
      //   icon: FileKey,
      //   href: '/transactions/tas',
      //   permissions: ['nav_menu_tas_payment', 'nav_menu_all'],
      // },
      // {
      //   id: 'fee-reconciliation',
      //   label: getLabel('fee-reconciliation', 'Fee Reconciliation'),
      //   icon: TicketSlash,
      //   href: '/transactions/fee-reconciliation',
      //   permissions: ['nav_menu_fees', 'nav_menu_all'],
      // }
    ],
  },
  // {
  //   id: 'payment',
  //   label: getLabel('payment', 'PAYMENT'),
  //   icon: Dock,
  //   permissions: ['*'], // Show section if any child is accessible
  //   items: [
  //     {
  //       id: 'manual',
  //       label: getLabel('manual', 'Manual Payment'),
  //       icon: HandCoins,
  //       href: '/transactions/manual',
  //       permissions: ['nav_menu_manual_payment','nav_menu_all'],
  //     },
  //     {
  //       id: 'tas',
  //       label: getLabel('tas', 'TAS Payment'),
  //       icon: FileKey,
  //       href: '/transactions/tas',
  //       permissions: ['nav_menu_tas_payment','nav_menu_all'],
  //     },
  //   ],
  // },
  // {
  //   id: 'guarantee',
  //   label: getLabel('guarantee', 'Guarantee'),
  //   icon: ShieldCheckIcon,
  //   href: '/guarantee',
  //   items: [],
  //   permissions: ['nav_menu_surety_bond', 'nav_menu_all'],
  // },
  // {
  //   id: 'fee-reconciliation',
  //   label: getLabel('fee-reconciliation', 'Fee Reconciliation'),
  //   icon: TicketSlash,
  //   href: '/fee-reconciliation',
  //   items: [],
  //   permissions: ['nav_menu_fees','nav_menu_all'],
  // },
  // {
  //   id: 'reports',
  //   label: getLabel('reports', 'REPORTS'),
  //   icon: FileText,
  //   permissions: ['*'], // Show section if any child is accessible
  //   items: [
  //     {
  //       id: 'business',
  //       label: getLabel('business', 'Business Report'),
  //       icon: FileChartPie,
  //       href: '/reports/business',
  //       permissions: ['nav_menu_reports', 'nav_menu_all'],
  //     },
  //   ],
  // },
  // {
  //   id: 'system-admin',
  //   label: getLabel('system-admin', 'SYSTEM ADMIN'),
  //   icon: UserCog,
  //   permissions: ['*'], // Show section if any child is accessible
  //   // permissions: ['nav_menu_system_admin'], // Show section if any child is accessible
  //   items: [
  //     {
  //       id: 'user',
  //       label: getLabel('user', 'User Management'),
  //       icon: UserPen,
  //       href: '/admin/user-management',
  //       permissions: ['nav_menu_system_admin', 'nav_menu_all'],
  //     },
  //     {
  //       id: 'role',
  //       label: getLabel('role', 'Role Management'),
  //       icon: ListChecks,
  //       href: '/admin/role-management',
  //       permissions: ['nav_menu_system_admin', 'nav_menu_all'],
  //     },
  //     {
  //       id: 'fee-type',
  //       label: getLabel('fee-type', 'Fee Type'),
  //       icon: Banknote,
  //       href: '/admin/fee-types',
  //       permissions: ['nav_menu_fees', 'nav_menu_all'],
  //     },
  //     {
  //       id: 'security',
  //       label: getLabel('security', 'Security'),
  //       icon: Shield,
  //       href: '/admin/security',
  //       permissions: ['nav_menu_system_admin', '*'],
  //     },
  //     {
  //       id: 'workflow',
  //       label: getLabel('workflow', 'WORKFLOW'),
  //       icon: Workflow,
  //       permissions: ['nav_menu_workflow', 'nav_menu_all'],
  //       children: [
  //     {
  //       id: 'workflow-action',
  //       label: getLabel('action', 'Action'),
  //       icon: BanknoteArrowUp,
  //       href: '/admin/workflow/action',
  //       permissions: ['nav_menu_workflow_action', 'nav_menu_all'],
  //     },
  //     {
  //       id: 'workflow-definition',
  //       label: getLabel('definition', 'Definition'),
  //       icon: Tv,
  //       href: '/admin/workflow/definition',
  //       permissions: ['nav_menu_workflow_definition', 'nav_menu_all'],
  //     },

  //     {
  //       id: 'workflow-stage-template',
  //       label: getLabel('stage-template', 'Stage Template'),
  //       icon: ArrowsUpFromLine,
  //       href: '/admin/workflow/stage-template',
  //       permissions: ['nav_menu_workflow_stage_template', 'nav_menu_all'],
  //     },
  //     {
  //       id: 'workflow-amount-rule',
  //       label: getLabel('amount-rule', 'Amount Rule'),
  //       icon: HandCoins,
  //       href: '/admin/workflow/amount-rule',
  //       permissions: ['nav_menu_workflow_amount_rule', 'nav_menu_all'],
  //     },
  //     {
  //       id: 'amount-stage-overrides',
  //       label: getLabel('amount-stage-overrides', 'Amount Stage'),
  //       icon: Banknote,
  //       href: '/admin/workflow/amount-stage-override',
  //       permissions: ['nav_menu_workflow_amount_stage_override', 'nav_menu_all'],
  //     },

  //       ],
  //     },
  //   ],
  // },
]

// Keep the original static configuration for backward compatibility
// This ensures no CSS breaks and existing components continue to work
export const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    items: [],
  },
  {
    id: 'activity',
    label: 'Activity Manager',
    icon: User,
    items: [
      {
        id: 'pending',
        label: 'Pending Activities',
        icon: FileClock,
        href: '/activities/pending',
      },
      {
        id: 'involved',
        label: 'Involved Activities',
        icon: SquarePen,
        href: '/activities/involved',
      },
    ],
  },
  {
    id: 'entities',
    label: 'ENTITIES',
    icon: Building,
    items: [
      {
        id: 'developers',
        label: 'Developers',
        icon: SquareUserRound,
        href: '/entities/developers',
      },
      {
        id: 'projects',
        label: 'Projects',
        icon: BriefcaseBusiness,
        href: '/projects',
      },
      {
        id: 'investors',
        label: 'Investor',
        icon: CircleUserRound,
        href: '/investors',
      },
    ],
  },
  // {
  //   id: 'deposits',
  //   label: 'DEPOSITS',
  //   icon: CircleDollarSign,
  //   items: [
  //     {
  //       id: 'unallocated',
  //       label: 'Unallocated Transaction',
  //       icon: AlignJustify,
  //       href: '/transactions/unallocated',
  //     },
  //     {
  //       id: 'discarded',
  //       label: 'Discarded Transaction',
  //       icon: XCircle,
  //       href: '/transactions/discarded',
  //     },
  //     {
  //       id: 'allocated',
  //       label: 'Allocated Transaction',
  //       icon: ListCheck,
  //       href: '/transactions/allocated',
  //     },
  //   ],
  // },
  // {
  //   id: 'guarantee',
  //   label: 'Guarantee',
  //   icon: ShieldCheckIcon,
  //   href: '/guarantee',
  //   items: [],
  // },
  // {
  //   id: 'fee-reconciliation',
  //   label: 'Fee Reconciliation',
  //   icon: TicketSlash,
  //   href: '/fee-reconciliation',
  //   items: [],
  // },
  // {
  //   id: 'reports',
  //   label: 'REPORTS',
  //   icon: FileText,
  //   items: [
  //     {
  //       id: 'business',
  //       label: 'Business Report',
  //       icon: FileChartPie,
  //       href: '/reports/business',
  //     },
  //   ],
  // },
  {
    id: 'system-admin',
    label: 'SYSTEM ADMIN',
    icon: UserCog,
    items: [
      {
        id: 'bank',
        label: 'Bank Management',
        icon: Landmark,
        href: '/admin/bank-management',
      },
      {
        id: 'user',
        label: 'User Management',
        icon: UserPen,
        href: '/admin/user-management',
      },
      {
        id: 'role',
        label: 'Role Management',
        icon: ListChecks,
        href: '/admin/role-management',
      },
      {
        id: 'fee-type',
        label: 'Fee Type',
        icon: Banknote,
        href: '/admin/fee-types',
      },
      {
        id: 'security',
        label: 'Security',
        icon: Shield,
        href: '/admin/security',
      },
      {
        id: 'workflow',
        label: 'WORK FLOW',
        icon: Workflow,

        children: [
          {
            id: 'workflow-action',
            label: 'Action',
            icon: BanknoteArrowUp,
            href: '/admin/workflow/action',
          },
          {
            id: 'workflow-definition',
            label: 'Definition',
            icon: Tv,
            href: '/admin/workflow/definition',
          },

          {
            id: 'workflow-stage-template',
            label: 'Stage Template',
            icon: ArrowsUpFromLine,
            href: '/admin/workflow/stage-template',
          },
          {
            id: 'workflow-amount-rule',
            label: 'Amount Rule',
            icon: HandCoins,
            href: '/admin/workflow/amount-rule',
          },
          {
            id: 'amount-stage-overrides',
            label: 'Amount Stage ',
            icon: UserPen,
            href: '/admin/workflow/amount-stage-override',

          },
        ],
      },
    ],
  },
] as const

export type { SidebarItem, SidebarSection, LabelResolver } 
