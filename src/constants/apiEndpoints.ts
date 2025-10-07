// API Base URL and Version
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://103.181.200.143:8082',
  VERSION: 'v1',
  API_PREFIX: '/api/v1',
} as const

// API Endpoints organized by controller
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
  },

  // Admin
  ADMIN: {
    CREATE_USER: '/admin/create-user',
    GET_USERS: '/admin/users',
  },

  // Dashboard
  DASHBOARD: {
    SUMMARY: '/dashboard/summary',
  },

  // Application Configuration
  APP_LANGUAGE_CODE: {
    GET_BY_ID: (id: string) => `/app-language-code/${id}`,
    UPDATE: (id: string) => `/app-language-code/${id}`,
    DELETE: (id: string) => `/app-language-code/${id}`,
    GET_ALL: '/app-language-code',
    SAVE: '/app-language-code',
    FIND_ALL: '/app-language-code/find-all',
  },

  APP_LANGUAGE_TRANSLATION: {
    GET_BY_ID: (id: string) => `/app-language-translation/${id}`,
    UPDATE: (id: string) => `/app-language-translation/${id}`,
    DELETE: (id: string) => `/app-language-translation/${id}`,
    GET_ALL: '/app-language-translation',
    SAVE: '/app-language-translation',
    FIND_ALL: '/app-language-translation/find-all',
    NAV_MENU: '/app-language-translation/nav-menu',
    BUILD_PARTNER: '/app-language-translation/build-partner',
    BUILD_PARTNER_ASSET: '/app-language-translation/build-partner-assests',
    CAPITAL_PARTNER: '/app-language-translation/capital-partner',
    WORKFLOW_ACTIONS: '/app-language-translation/workflow-actions',
    WORKFLOW_DEFINITION: '/app-language-translation/workflow-definition',
    WORKFLOW_STAGE_TEMPLATE:
      '/app-language-translation/workflow-stage-template',
    WORKFLOW_AMOUNT_RULE: '/app-language-translation/workflow-amount-rule',
    WORKFLOW_AMOUNT_STAGE: '/app-language-translation/workflow-amount-stage',
    WORKFLOW_AMOUNT_STAGE_OVERRIDE:
      '/app-language-translation/workflow-amount-stage-override',
    WORKFLOW_REQUEST_LABELS: '/app-language-translation/workflow-request',
    TRANSCATIONS_LABEL: '/app-language-translation/transactions',
    PROCESSED_TRANSACTIONS_LABEL:
      '/app-language-translation/processed-transactions',
    PENDING_TRANSACTIONS_LABEL:
      '/app-language-translation/pending-transactions',
    USER_MANAGEMENT_LABEL: '/app-language-translation/user-management',
    ROLE_MANAGEMENT_LABEL: '/app-language-translation/role-management',
    GROUP_MANAGEMENT_LABEL: '/app-language-translation/group-management',
    PAYMENTS_LABEL: '/app-language-translation/payments',
    FEE_REPUSH: '/app-language-translation/fee-repush',
  },

  APPLICATION_CONFIGURATION: {
    GET_BY_ID: (id: string) => `/application-configuration/${id}`,
    UPDATE: (id: string) => `/application-configuration/${id}`,
    DELETE: (id: string) => `/application-configuration/${id}`,
    GET_ALL: '/application-configuration',
    SAVE: '/application-configuration',
    FIND_ALL: '/application-configuration/find-all',
  },

  APPLICATION_FORM_DESIGN: {
    GET_BY_ID: (id: string) => `/application-form-design/${id}`,
    UPDATE: (id: string) => `/application-form-design/${id}`,
    DELETE: (id: string) => `/application-form-design/${id}`,
    GET_ALL: '/application-form-design',
    SAVE: '/application-form-design',
    FIND_ALL: '/application-form-design/find-all',
  },

  APPLICATION_MODULE: {
    GET_BY_ID: (id: string) => `/application-module/${id}`,
    UPDATE: (id: string) => `/application-module/${id}`,
    DELETE: (id: string) => `/application-module/${id}`,
    GET_ALL: '/application-module',
    SAVE: '/application-module',
    FIND_ALL: '/application-module/find-all',
  },

  APPLICATION_SETTING: {
    GET_BY_ID: (id: string) => `/application-setting/${id}`,
    UPDATE: (id: string) => `/application-setting/${id}`,
    DELETE: (id: string) => `/application-setting/${id}`,
    GET_ALL: '/application-setting',
    SAVE: '/application-setting',
    FIND_ALL: '/application-setting/find-all',
  },

  // Fee Dropdowns
  FEE_DROPDOWNS: {
    CATEGORIES: '/application-setting?settingKey.equals=FEE_CATEGORY',
    FREQUENCIES: '/application-setting?settingKey.equals=FEE_FREQUENCY',
    CURRENCIES: '/application-setting?settingKey.equals=CURRENCY',
    COUNTRIES: '/application-setting?settingKey.equals=COUNTRY',
    DEBIT_ACCOUNTS: '/application-setting?settingKey.equals=DEBIT_ACOUNT_TYPE',
  },

  // Beneficiary Dropdowns
  BENEFICIARY_DROPDOWNS: {
    BANK_NAMES: '/application-setting?settingKey.equals=DEBIT_ACOUNT_TYPE',
    TRANSFER_TYPES: '/application-setting?settingKey.equals=TRANSFER_TYPE',
  },

  // Developer Dropdowns
  DEVELOPER_DROPDOWNS: {
    REGULATORY_AUTHORITIES: '/application-setting?settingKey.equals=REGULATOR',
  },

  // Project Dropdowns
  PROJECT_DROPDOWNS: {
    TYPES: '/application-setting?settingKey.equals=BUILD_ASSEST_TYPE',
    STATUSES: '/application-setting?settingKey.equals=BUILD_ASSEST_STATUS',
    BANK_ACCOUNT_STATUS:
      '/application-setting?settingKey.equals=BUILD_ASSEST_ACCOUNT_STATUS',
    BLOCKED_PAYMENT_TYPE:
      '/application-setting?settingKey.equals=BLOCKED_PAYMENT',
  },

  // Validation APIs
  VALIDATION: {
    ACCOUNT: '/validation/account',
    BIC: '/validation/bic',
    SWIFT: '/validation/swift',
    IBAN: '/validation/iban',
    CORE_BANK_ACCOUNT: (accountNumber: string) =>
      `/core-bank-get/sbi/apis/account-status?accountNumber=${accountNumber}`,
    CORE_BANK_SWIFT: (swiftCode: string) =>
      `/core-bank-get/sbi/apis/validate-swift?swiftCode=${swiftCode}`,
  },

  BUILD_PARTNER: {
    GET_BY_ID: (id: string) => `/build-partner/${id}`,
    UPDATE: (id: string) => `/build-partner/${id}`,
    DELETE: (id: string) => `/build-partner/${id}`,
    SOFT_DELETE: (id: string) => `/build-partner/soft/${id}`,
    GET_ALL: '/build-partner?deleted.equals=false&enabled.equals=true',
    SAVE: '/build-partner',
    FIND_ALL:
      '/build-partner/find-all?deleted.equals=false&enabled.equals=true',
  },

  APPLICATION_TABLE_DESIGN: {
    GET_BY_ID: (id: string) => `/application-table-design/${id}`,
    UPDATE: (id: string) => `/application-table-design/${id}`,
    DELETE: (id: string) => `/application-table-design/${id}`,
    GET_ALL: '/application-table-design',
    SAVE: '/application-table-design',
    FIND_ALL: '/application-table-design/find-all',
  },

  APPLICATION_USER: {
    GET_BY_ID: (id: string) => `/application-user/${id}`,
    UPDATE: (id: string) => `/application-user/${id}`,
    DELETE: (id: string) => `/application-user/${id}`,
    GET_ALL: '/application-user',
    SAVE: '/application-user',
    FIND_ALL: '/application-user/find-all',
  },

  // Banking
  BANK_ACCOUNT: {
    GET_BY_ID: (id: string) => `/bank-account/${id}`,
    UPDATE: (id: string) => `/bank-account/${id}`,
    DELETE: (id: string) => `/bank-account/${id}`,
    SAVE: '/bank-account',
    FIND_ALL: '/bank-account/find-all',
  },

  BANK_API_HEADER: {
    GET_BY_ID: (id: string) => `/bank-api-header/${id}`,
    UPDATE: (id: string) => `/bank-api-header/${id}`,
    DELETE: (id: string) => `/bank-api-header/${id}`,
    SAVE: '/bank-api-header',
    FIND_ALL: '/bank-api-header/find-all',
  },

  BANK_API_PARAMETER: {
    GET_BY_ID: (id: string) => `/bank-api-parameter/${id}`,
    UPDATE: (id: string) => `/bank-api-parameter/${id}`,
    DELETE: (id: string) => `/bank-api-parameter/${id}`,
    SAVE: '/bank-api-parameter',
    FIND_ALL: '/bank-api-parameter/find-all',
  },

  BANK_BRANCH: {
    GET_BY_ID: (id: string) => `/bank-branch/${id}`,
    UPDATE: (id: string) => `/bank-branch/${id}`,
    DELETE: (id: string) => `/bank-branch/${id}`,
    SAVE: '/bank-branch',
    FIND_ALL: '/bank-branch/find-all',
  },

  BANK_CONFIG: {
    GET_BY_ID: (id: string) => `/bank-config/${id}`,
    UPDATE: (id: string) => `/bank-config/${id}`,
    DELETE: (id: string) => `/bank-config/${id}`,
    SAVE: '/bank-config',
    FIND_ALL: '/bank-config/find-all',
  },

  // Data Storage
  BINARY_DATA_STORE: {
    GET_BY_ID: (id: string) => `/binary-data-store/${id}`,
    UPDATE: (id: string) => `/binary-data-store/${id}`,
    DELETE: (id: string) => `/binary-data-store/${id}`,
    SAVE: '/binary-data-store',
    FIND_ALL: '/binary-data-store/find-all',
  },




// Asset Register HOA
ASSET_REGISTER_ACCOUNT: {
  GET_BY_ID: (id: string) => `/asset-register-account/${id}`,
  UPDATE: (id: string) => `/asset-register-account/${id}`,
  DELETE: (id: string) => `/asset-register-account/${id}`,
  SAVE: '/asset-register-account',
  FIND_ALL: '/asset-register-account/find-all',
},
ASSET_REGISTER_BENEFICIARY: {
   GET_BY_ID: (id: string) =>
      `/asset-register-beneficiary?assetRegisterId.equals=${id}`,
    UPDATE: (id: string) => `/asset-register-beneficiary/${id}`,
    DELETE: (id: string) => `/asset-register-beneficiary/${id}`,
    SAVE: '/asset-register-beneficiary',
    FIND_ALL: '/asset-register-beneficiary/find-all',
    UPLOAD: '/asset-register-beneficiary/upload',
},
ASSET_REGISTER_CONTACT: {
  GET_BY_ID: (id: string) =>
      `/asset-register-contact?assetRegisterId.equals=${id}`,
    UPDATE: (id: string) => `/asset-register-contact/${id}`,
    DELETE: (id: string) => `/asset-register-contact/${id}`,
    SAVE: '/asset-register-contact',
    FIND_ALL: '/asset-register-contact/find-all',
},
ASSET_REGISTER_FEES: {
    GET_BY_ID: (id: string) =>
      `//asset-register-fees?assetRegisterId.equals=${id}`,
    UPDATE: (id: string) => `//asset-register-fees/${id}`,
    DELETE: (id: string) => `//asset-register-fees/${id}`,
    GET_ALL: '//asset-register-fees',
    SAVE: '//asset-register-fees',
    FIND_ALL: '//asset-register-fees/find-all',
},


  // MANAGEMENT_FIRMS HOA
  MANAGEMENT_FIRMS: { 
    GET_BY_ID: (id: string) => `/management-firms/${id}`,
    UPDATE: (id: string) => `/management-firms/${id}`,
    DELETE: (id: string) => `/management-firms/${id}`,
    SOFT_DELETE: (id: string) => `/management-firms/soft/${id}`,
    GET_ALL: '/management-firms?deleted.equals=false&enabled.equals=true',
    SAVE: '/management-firms',
    FIND_ALL:
      '/management-firms/find-all?deleted.equals=false&enabled.equals=true',
  },

  MANAGEMENT_FIRMS_BENEFICIARY: {
    GET_BY_ID: (id: string) => `/management-firms-beneficiary/${id}`,
    UPDATE: (id: string) => `/management-firms-beneficiary/${id}`,
    DELETE: (id: string) => `/management-firms-beneficiary/${id}`,
    GET_ALL: '/management-firms-beneficiary',
    SAVE: '/management-firms-beneficiary',
    FIND_ALL: '/management-firms-beneficiary/find-all',
    GET_BY_PROJECT_ID: (projectId: string) => `/management-firms-beneficiary?managementFirmsId.equals=${projectId}`,
  },

  MANAGEMENT_FIRMS_CLOSURE: {
    GET_BY_ID: (id: string) => `/management-firms-closure/${id}`,
    UPDATE: (id: string) => `/management-firms-closure/${id}`,
    DELETE: (id: string) => `/management-firms-closure/${id}`,
    GET_ALL: '/management-firms-closure',
    SAVE: '/management-firms-closure',
    FIND_ALL: '/management-firms-closure/find-all',
    GET_BY_PROJECT_ID: (projectId: string) => `/management-firms-closure?managementFirmsId.equals=${projectId}`,
  },

  MANAGEMENT_FIRMS_FEE: {
    GET_BY_ID: (id: string) => `/management-firms-fee/${id}`,
    UPDATE: (id: string) => `/management-firms-fee/${id}`,
    DELETE: (id: string) => `/management-firms-fee/${id}`,
    GET_ALL: '/management-firms-fee',
    SAVE: '/management-firms-fee',
    FIND_ALL: '/management-firms-fee/find-all',
    GET_BY_PROJECT_ID: (projectId: string) => `/management-firms-fee?managementFirmsId.equals=${projectId}`,
  },

  MANAGEMENT_FIRMS_FEE_HISTORY: {
    GET_BY_ID: (id: string) => `/management-firms-fee-history/${id}`,
    UPDATE: (id: string) => `/management-firms-fee-history/${id}`,
    DELETE: (id: string) => `/management-firms-fee-history/${id}`,
    GET_ALL: '/management-firms-fee-history',
    SAVE: '/management-firms-fee-history',
    FIND_ALL: '/management-firms-fee-history/find-all',
    FEE_REPUSH: (id: string) => `/management-firms-fee-history/fee-repush/${id}`,
  },

  MANAGEMENT_FIRMS_FINANCIAL_SUMMARY: {
    GET_BY_ID: (id: string) => `/management-firms-financial-summary/${id}`,
    UPDATE: (id: string) => `/management-firms-financial-summary/${id}`,
    DELETE: (id: string) => `/management-firms-financial-summary/${id}`,
    GET_ALL: '/management-firms-financial-summary',
    SAVE: '/management-firms-financial-summary',
    FIND_ALL: '/management-firms-financial-summary/find-all',
    DELETE_SOFT: '/management-firms-financial-summary/soft/',
    GET_BY_PROJECT_ID: (projectId: string) => `/management-firms-financial-summary?managementFirmsId.equals=${projectId}`,
  },

  MANAGEMENT_FIRMS_PAYMENT_PLAN: {
    GET_BY_ID: (id: string) => `/management-firms-payment-plan/${id}`,
    UPDATE: (id: string) => `/management-firms-payment-plan/${id}`,
    DELETE: (id: string) => `/management-firms-payment-plan/${id}`,
    GET_ALL: '/management-firms-payment-plan',
    SAVE: '/management-firms-payment-plan',
    FIND_ALL: '/management-firms-payment-plan/find-all',
    GET_BY_PROJECT_ID: (projectId: string) => `/management-firms-payment-plan?managementFirmsId.equals=${projectId}`,
  },

  MANAGEMENT_FIRMS_BANK_ACCOUNT: {
    GET_BY_ID: (id: string) => `/management-firms-bank-account/${id}`,
    SAVE: '/management-firms-bank-account',
    UPDATE: (id: string) => `/management-firms-bank-account/${id}`,
    DELETE: (id: string) => `/management-firms-bank-account/${id}`,
    GET_ALL: '/management-firms-bank-account',
    FIND_ALL: '/management-firms-bank-account/find-all',
    GET_BY_PROJECT_ID: (projectId: string) => `/management-firms-bank-account?managementFirmsId.equals=${projectId}`,
  },

  MANAGEMENT_FIRMS_DOCUMENT: {
    GET_BY_ID: (id: string) => `/management-firms-document/${id}`,
    UPDATE: (id: string) => `/management-firms-document/${id}`,
    DELETE: (id: string) => `/management-firms-document/${id}`,
    GET_ALL: '/management-firms-document',
    SAVE: '/management-firms-document',
    FIND_ALL: '/management-firms-document/find-all',
    UPLOAD: '/management-firms-document/upload',
    DOWNLOAD: (id: string) => `/management-firms-document/download/${id}`,
    DOWNLOAD_TEMPLATE: (fileName: string) =>
      `/management-firms-document/download/templates/${fileName}`,
  },

// Owner Registry HOA
  OWNER_REGISTRY: {
    GET_BY_ID: (id: string) => `/owner-registry/${id}`,
    UPDATE: (id: string) => `/owner-registry/${id}`,
    DELETE: (id: string) => `/owner-registry/${id}`,
    SOFT_DELETE: (id: string) => `/owner-registry/soft/${id}`,
    GET_ALL: '/owner-registry?deleted.equals=false&enabled.equals=true',
    SAVE: '/owner-registry',
    FIND_ALL: '/owner-registry/find-all',
  },

  OWNER_REGISTRY_BANK_INFO: {
    GET_BY_ID: (id: string) => `/owner-registry-bank-info/${id}`,
    UPDATE: (id: string) => `/owner-registry-bank-info/${id}`,
    DELETE: (id: string) => `/owner-registry-bank-info/${id}`,
    GET_ALL: '/owner-registry-bank-info',
    SAVE: '/owner-registry-bank-info',
    FIND_ALL: '/owner-registry-bank-info/find-all',
  },

  OWNER_REGISTRY_UNIT_BOOKING: {
    GET_BY_ID: (id: string) => `/owner-registry-unit-booking/${id}`,
    UPDATE: (id: string) => `/owner-registry-unit-booking/${id}`,
    DELETE: (id: string) => `/owner-registry-unit-booking/${id}`,
    GET_ALL: '/owner-registry-unit-booking',
    SAVE: '/owner-registry-unit-booking',
    FIND_ALL: '/owner-registry-unit-booking/find-all',
  },

  OWNER_REGISTRY_PAYMENT_PLAN: {
    GET_BY_ID: (id: string) => `/owner-registry-payment-plan/${id}`,
    UPDATE: (id: string) => `/owner-registry-payment-plan/${id}`,
    DELETE: (id: string) => `/owner-registry-payment-plan/${id}`,
    GET_ALL: '/owner-registry-payment-plan',
    SAVE: '/owner-registry-payment-plan',
    FIND_ALL: '/owner-registry-payment-plan/find-all',
  },

  OWNER_REGISTRY_UNIT: {
    GET_BY_ID: (id: string) => `/owner-registry-unit/${id}`,
    UPDATE: (id: string) => `/owner-registry-unit/${id}`,
    DELETE: (id: string) => `/owner-registry-unit/${id}`,
    GET_ALL: '/owner-registry-unit',
    SAVE: '/owner-registry-unit',
    FIND_ALL: '/owner-registry-unit/find-all',
  },

  OWNER_REGISTRY_UNIT_PURCHASE: {
    GET_BY_ID: (id: string) => `/owner-registry-unit-purchase/${id}`,
    UPDATE: (id: string) => `/owner-registry-unit-purchase/${id}`,
    DELETE: (id: string) => `/owner-registry-unit-purchase/${id}`,
    GET_ALL: '/owner-registry-unit-purchase',
    SAVE: '/owner-registry-unit-purchase',
    FIND_ALL: '/owner-registry-unit-purchase/find-all',
  },

  OWNER_REGISTRY_UNIT_TYPE: {
    GET_BY_ID: (id: string) => `/owner-registry-unit-type/${id}`,
    UPDATE: (id: string) => `/owner-registry-unit-type/${id}`,
    DELETE: (id: string) => `/owner-registry-unit-type/${id}`,
    GET_ALL: '/owner-registry-unit-type',
    SAVE: '/owner-registry-unit-type',
    FIND_ALL: '/owner-registry-unit-type/find-all',
  },



  // Build Partner
  BUILD_PARTNER_ACCOUNT: {
    GET_BY_ID: (id: string) => `/build-partner-account/${id}`,
    UPDATE: (id: string) => `/build-partner-account/${id}`,
    DELETE: (id: string) => `/build-partner-account/${id}`,
    SAVE: '/build-partner-account',
    FIND_ALL: '/build-partner-account/find-all',
  },
   BUILD_PARTNER_BENEFICIARY: {
    GET_BY_ID: (id: string) =>
      `/build-partner-beneficiary?buildPartnerId.equals=${id}`,
    UPDATE: (id: string) => `/build-partner-beneficiary/${id}`,
    DELETE: (id: string) => `/build-partner-beneficiary/${id}`,
    SAVE: '/build-partner-beneficiary',
    FIND_ALL: '/build-partner-beneficiary/find-all',
    UPLOAD: '/build-partner-beneficiary/upload',
  },

  BUILD_PARTNER_CONTACT: {
    GET_BY_ID: (id: string) =>
      `/build-partner-contact?buildPartnerId.equals=${id}`,
    UPDATE: (id: string) => `/build-partner-contact/${id}`,
    DELETE: (id: string) => `/build-partner-contact/${id}`,
    SAVE: '/build-partner-contact',
    FIND_ALL: '/build-partner-contact/find-all',
  },
  BUILD_PARTNER_FEES: {
    GET_BY_ID: (id: string) =>
      `/build-partner-fees?buildPartnerId.equals=${id}`,
    UPDATE: (id: string) => `/build-partner-fees/${id}`,
    DELETE: (id: string) => `/build-partner-fees/${id}`,
    GET_ALL: '/build-partner-fees',
    SAVE: '/build-partner-fees',
    FIND_ALL: '/build-partner-fees/find-all',
  },


  
  // Capital Partner
  CAPITAL_PARTNER: {
    GET_BY_ID: (id: string) => `/capital-partner/${id}`,
    UPDATE: (id: string) => `/capital-partner/${id}`,
    DELETE: (id: string) => `/capital-partner/${id}`,
    SOFT_DELETE: (id: string) => `/capital-partner/soft/${id}`,
    GET_ALL: '/capital-partner?deleted.equals=false&enabled.equals=true',
    SAVE: '/capital-partner',
    FIND_ALL: '/capital-partner/find-all',
  },

  CAPITAL_PARTNER_BANK_INFO: {
    GET_BY_ID: (id: string) => `/capital-partner-bank-info/${id}`,
    UPDATE: (id: string) => `/capital-partner-bank-info/${id}`,
    DELETE: (id: string) => `/capital-partner-bank-info/${id}`,
    GET_ALL: '/capital-partner-bank-info',
    SAVE: '/capital-partner-bank-info',
    FIND_ALL: '/capital-partner-bank-info/find-all',
  },

  CAPITAL_PARTNER_UNIT_BOOKING: {
    GET_BY_ID: (id: string) => `/capital-partner-unit-booking/${id}`,
    UPDATE: (id: string) => `/capital-partner-unit-booking/${id}`,
    DELETE: (id: string) => `/capital-partner-unit-booking/${id}`,
    GET_ALL: '/capital-partner-unit-booking',
    SAVE: '/capital-partner-unit-booking',
    FIND_ALL: '/capital-partner-unit-booking/find-all',
  },

  CAPITAL_PARTNER_PAYMENT_PLAN: {
    GET_BY_ID: (id: string) => `/capital-partner-payment-plan/${id}`,
    UPDATE: (id: string) => `/capital-partner-payment-plan/${id}`,
    DELETE: (id: string) => `/capital-partner-payment-plan/${id}`,
    GET_ALL: '/capital-partner-payment-plan',
    SAVE: '/capital-partner-payment-plan',
    FIND_ALL: '/capital-partner-payment-plan/find-all',
  },

  CAPITAL_PARTNER_UNIT: {
    GET_BY_ID: (id: string) => `/capital-partner-unit/${id}`,
    UPDATE: (id: string) => `/capital-partner-unit/${id}`,
    DELETE: (id: string) => `/capital-partner-unit/${id}`,
    GET_ALL: '/capital-partner-unit',
    SAVE: '/capital-partner-unit',
    FIND_ALL: '/capital-partner-unit/find-all',
  },

  CAPITAL_PARTNER_UNIT_PURCHASE: {
    GET_BY_ID: (id: string) => `/capital-partner-unit-purchase/${id}`,
    UPDATE: (id: string) => `/capital-partner-unit-purchase/${id}`,
    DELETE: (id: string) => `/capital-partner-unit-purchase/${id}`,
    GET_ALL: '/capital-partner-unit-purchase',
    SAVE: '/capital-partner-unit-purchase',
    FIND_ALL: '/capital-partner-unit-purchase/find-all',
  },

  CAPITAL_PARTNER_UNIT_TYPE: {
    GET_BY_ID: (id: string) => `/capital-partner-unit-type/${id}`,
    UPDATE: (id: string) => `/capital-partner-unit-type/${id}`,
    DELETE: (id: string) => `/capital-partner-unit-type/${id}`,
    GET_ALL: '/capital-partner-unit-type',
    SAVE: '/capital-partner-unit-type',
    FIND_ALL: '/capital-partner-unit-type/find-all',
  },

  // Configuration
  CONFIGURATION_STORE: {
    GET_BY_ID: (id: string) => `/configuration-store/${id}`,
    UPDATE: (id: string) => `/configuration-store/${id}`,
    DELETE: (id: string) => `/configuration-store/${id}`,
    GET_ALL: '/configuration-store',
    SAVE: '/configuration-store',
    FIND_ALL: '/configuration-store/find-all',
  },

  // Feature Flags
  FEATURE_FLAG: {
    GET_BY_ID: (id: string) => `/feature-flag/${id}`,
    UPDATE: (id: string) => `/feature-flag/${id}`,
    DELETE: (id: string) => `/feature-flag/${id}`,
    GET_ALL: '/feature-flag',
    SAVE: '/feature-flag',
    FIND_ALL: '/feature-flag/find-all',
  },

  // Financial Institution
  FINANCIAL_INSTITUTION: {
    GET_BY_ID: (id: string) => `/financial-institution/${id}`,
    UPDATE: (id: string) => `/financial-institution/${id}`,
    DELETE: (id: string) => `/financial-institution/${id}`,
    GET_ALL: '/financial-institution',
    SAVE: '/financial-institution',
    FIND_ALL: '/financial-institution/find-all',
  },

  // App Language Translation - Surety Bond
  APP_LANGUAGE_TRANSLATION_SURETY_BOND: {
    GET_BY_ID: (id: string) => `/app-language-translation/surety-bond/${id}`,
    UPDATE: (id: string) => `/app-language-translation/surety-bond/${id}`,
    DELETE: (id: string) => `/app-language-translation/surety-bond/${id}`,
    GET_ALL: '/app-language-translation/surety-bond',
    SAVE: '/app-language-translation/surety-bond',
    FIND_ALL: '/app-language-translation/surety-bond/find-all',
  },

  // Fund Management
  FUND_EGRESS: {
    GET_BY_ID: (id: string) => `/fund-egress/${id}`,
    UPDATE: (id: string) => `/fund-egress/${id}`,
    DELETE: (id: string) => `/fund-egress/${id}`,
    SOFT_DELETE: (id: string) => `/fund-egress/soft/${id}`,
    GET_ALL: '/fund-egress?deleted.equals=false&enabled.equals=true',
    SAVE: '/fund-egress',
    FIND_ALL: '/fund-egress/find-all',
  },

  FUND_INGRESS: {
    GET_BY_ID: (id: string) => `/fund-ingress/${id}`,
    UPDATE: (id: string) => `/fund-ingress/${id}`,
    DELETE: (id: string) => `/fund-ingress/${id}`,
    GET_ALL: '/fund-ingress',
    SAVE: '/fund-ingress',
    FIND_ALL: '/fund-ingress/find-all',
  },

  // Pending Fund Ingress (Pending Transactions)
  PENDING_FUND_INGRESS: {
    GET_BY_ID: (id: string) => `/pending-fund-ingress/${id}`,
    UPDATE: (id: string) => `/pending-fund-ingress/${id}`,
    DELETE: (id: string) => `/pending-fund-ingress/${id}`,
    SOFT_DELETE: (id: string) => `/pending-fund-ingress/soft/${id}`,
    GET_ALL: '/pending-fund-ingress?deleted.equals=false&enabled.equals=true',
    SAVE: '/pending-fund-ingress',
    FIND_ALL: '/pending-fund-ingress/find-all',
  },

  // Processed Fund Ingress (Allocated Transactions)
  PROCESSED_FUND_INGRESS: {
    GET_BY_ID: (id: string) => `/processed-fund-ingress/${id}`,
    UPDATE: (id: string) => `/processed-fund-ingress/${id}`,
    DELETE: (id: string) => `/processed-fund-ingress/${id}`,
    SOFT_DELETE: (id: string) => `/processed-fund-ingress/soft/${id}`,
    GET_ALL: '/processed-fund-ingress?deleted.equals=false&enabled.equals=true',
    SAVE: '/processed-fund-ingress',
    FIND_ALL: '/processed-fund-ingress/find-all',
  },

  // Primary Bank Account
  PRIMARY_BANK_ACCOUNT: {
    GET_BY_ID: (id: string) => `/primary-bank-account/${id}`,
    UPDATE: (id: string) => `/primary-bank-account/${id}`,
    DELETE: (id: string) => `/primary-bank-account/${id}`,
    GET_ALL: '/primary-bank-account',
    SAVE: '/primary-bank-account',
    FIND_ALL: '/primary-bank-account/find-all',
  },

  // Real Estate Assets
  REAL_ESTATE_ASSET: {
    GET_BY_ID: (id: string) => `/real-estate-assest/${id}`,
    UPDATE: (id: string) => `/real-estate-assest/${id}`,
    DELETE: (id: string) => `/real-estate-assest/${id}`,
    SOFT_DELETE: (id: string) => `/real-estate-assest/soft/${id}`,
    GET_ALL: '/real-estate-assest?deleted.equals=false&enabled.equals=true',
    SAVE: '/real-estate-assest',
    FIND_ALL:
      '/real-estate-assest/find-all?deleted.equals=false&enabled.equals=true',
  },

  REAL_ESTATE_ASSET_BENEFICIARY: {
    GET_BY_ID: (id: string) => `/real-estate-assest-beneficiary/${id}`,
    UPDATE: (id: string) => `/real-estate-assest-beneficiary/${id}`,
    DELETE: (id: string) => `/real-estate-assest-beneficiary/${id}`,
    GET_ALL: '/real-estate-assest-beneficiary',
    SAVE: '/real-estate-assest-beneficiary',
    FIND_ALL: '/real-estate-assest-beneficiary/find-all',
    GET_BY_PROJECT_ID: (projectId: string) => `/real-estate-assest-beneficiary?realEstateAssestId.equals=${projectId}`,
  },

  REAL_ESTATE_ASSET_CLOSURE: {
    GET_BY_ID: (id: string) => `/real-estate-assest-closure/${id}`,
    UPDATE: (id: string) => `/real-estate-assest-closure/${id}`,
    DELETE: (id: string) => `/real-estate-assest-closure/${id}`,
    GET_ALL: '/real-estate-assest-closure',
    SAVE: '/real-estate-assest-closure',
    FIND_ALL: '/real-estate-assest-closure/find-all',
    GET_BY_PROJECT_ID: (projectId: string) => `/real-estate-assest-closure?realEstateAssestId.equals=${projectId}`,
  },

  REAL_ESTATE_ASSET_FEE: {
    GET_BY_ID: (id: string) => `/real-estate-asset-fee/${id}`,
    UPDATE: (id: string) => `/real-estate-asset-fee/${id}`,
    DELETE: (id: string) => `/real-estate-asset-fee/${id}`,
    GET_ALL: '/real-estate-asset-fee',
    SAVE: '/real-estate-asset-fee',
    FIND_ALL: '/real-estate-asset-fee/find-all',
    GET_BY_PROJECT_ID: (projectId: string) => `/real-estate-asset-fee?realEstateAssestId.equals=${projectId}`,
  },

  REAL_ESTATE_ASSET_FEE_HISTORY: {
    GET_BY_ID: (id: string) => `/real-estate-asset-fee-history/${id}`,
    UPDATE: (id: string) => `/real-estate-asset-fee-history/${id}`,
    DELETE: (id: string) => `/real-estate-asset-fee-history/${id}`,
    GET_ALL: '/real-estate-asset-fee-history',
    SAVE: '/real-estate-asset-fee-history',
    FIND_ALL: '/real-estate-asset-fee-history/find-all',
    FEE_REPUSH: (id: string) => `/real-estate-asset-fee-history/fee-repush/${id}`,
  },

  REAL_ESTATE_ASSET_FINANCIAL_SUMMARY: {
    GET_BY_ID: (id: string) => `/real-estate-asset-financial-summary/${id}`,
    UPDATE: (id: string) => `/real-estate-asset-financial-summary/${id}`,
    DELETE: (id: string) => `/real-estate-asset-financial-summary/${id}`,
    GET_ALL: '/real-estate-asset-financial-summary',
    SAVE: '/real-estate-asset-financial-summary',
    FIND_ALL: '/real-estate-asset-financial-summary/find-all',
    DELETE_SOFT: '/real-estate-asset-financial-summary/soft/',
    GET_BY_PROJECT_ID: (projectId: string) => `/real-estate-asset-financial-summary?realEstateAssestId.equals=${projectId}`,
  },

  REAL_ESTATE_ASSET_PAYMENT_PLAN: {
    GET_BY_ID: (id: string) => `/real-estate-assest-payment-plan/${id}`,
    UPDATE: (id: string) => `/real-estate-assest-payment-plan/${id}`,
    DELETE: (id: string) => `/real-estate-assest-payment-plan/${id}`,
    GET_ALL: '/real-estate-assest-payment-plan',
    SAVE: '/real-estate-assest-payment-plan',
    FIND_ALL: '/real-estate-assest-payment-plan/find-all',
    GET_BY_PROJECT_ID: (projectId: string) => `/real-estate-assest-payment-plan?realEstateAssestId.equals=${projectId}`,
  },

  REAL_ESTATE_BANK_ACCOUNT: {
    GET_BY_ID: (id: string) => `/real-estate-bank-account/${id}`,
    SAVE: '/real-estate-bank-account',
    UPDATE: (id: string) => `/real-estate-bank-account/${id}`,
    DELETE: (id: string) => `/real-estate-bank-account/${id}`,
    GET_ALL: '/real-estate-bank-account',
    FIND_ALL: '/real-estate-bank-account/find-all',
    GET_BY_PROJECT_ID: (projectId: string) => `/real-estate-bank-account?realEstateAssestId.equals=${projectId}`,
  },

  REAL_ESTATE_DOCUMENT: {
    GET_BY_ID: (id: string) => `/real-estate-document/${id}`,
    UPDATE: (id: string) => `/real-estate-document/${id}`,
    DELETE: (id: string) => `/real-estate-document/${id}`,
    GET_ALL: '/real-estate-document',
    SAVE: '/real-estate-document',
    FIND_ALL: '/real-estate-document/find-all',
    UPLOAD: '/real-estate-document/upload',
    DOWNLOAD: (id: string) => `/real-estate-document/download/${id}`,
    DOWNLOAD_TEMPLATE: (fileName: string) =>
      `/real-estate-document/download/templates/${fileName}`,
  },

  // Secondary Bank Account
  SECONDARY_BANK_ACCOUNT: {
    GET_BY_ID: (id: string) => `/secondary-bank-account/${id}`,
    UPDATE: (id: string) => `/secondary-bank-account/${id}`,
    DELETE: (id: string) => `/secondary-bank-account/${id}`,
    GET_ALL: '/secondary-bank-account',
    SAVE: '/secondary-bank-account',
    FIND_ALL: '/secondary-bank-account/find-all',
  },

  // Surety Bond
  SURETY_BOND: {
    GET_BY_ID: (id: string) => `/surety-bond/${id}`,
    UPDATE: (id: string) => `/surety-bond/${id}`,
    DELETE: (id: string) => `/surety-bond/${id}`,
    SOFT_DELETE: (id: string) => `/surety-bond/soft/${id}`,
    GET_ALL: '/surety-bond',
    SAVE: '/surety-bond',
    FIND_ALL: '/surety-bond/find-all',
  },

  SURETY_BOND_RECOVERY: {
    GET_BY_ID: (id: string) => `/surety-bond-recovery/${id}`,
    UPDATE: (id: string) => `/surety-bond-recovery/${id}`,
    DELETE: (id: string) => `/surety-bond-recovery/${id}`,
    GET_ALL: '/surety-bond-recovery',
    SAVE: '/surety-bond-recovery',
    FIND_ALL: '/surety-bond-recovery/find-all',
  },

  SURETY_BOND_RELEASE: {
    GET_BY_ID: (id: string) => `/surety-bond-release/${id}`,
    UPDATE: (id: string) => `/surety-bond-release/${id}`,
    DELETE: (id: string) => `/surety-bond-release/${id}`,
    GET_ALL: '/surety-bond-release',
    SAVE: '/surety-bond-release',
    FIND_ALL: '/surety-bond-release/find-all',
  },

  SURETY_BOND_TYPE: {
    GET_BY_ID: (id: string) => `/surety-bond-type/${id}`,
    UPDATE: (id: string) => `/surety-bond-type/${id}`,
    DELETE: (id: string) => `/surety-bond-type/${id}`,
    GET_ALL: '/surety-bond-type',
    SAVE: '/surety-bond-type',
    FIND_ALL: '/surety-bond-type/find-all',
  },
  //Auth Admin User
  AUTH_ADMIN_USER: {
    GET_BY_ID: (id: string) => `/auth-admin-user/auth/users/${id}`,
    UPDATE: (id: string) => `/auth-admin-user/auth/users/${id}`,
    DELETE: (id: string) => `/auth-admin-user/auth/users/${id}`,
    GET_ALL: '/auth-admin-user/auth/users/roles-groups',
    SAVE: '/auth-admin-user/auth/users',
    FIND_ALL: '/auth-admin-user/auth/users/find-all',
    GROUP_MAPPING: (id: string) =>
      `/auth-admin-user/auth/users/${id}/group-mapping`,
    GET_ALL_ROLES: '/auth-admin-user/auth/roles',
    CREATE_ROLE: '/auth-admin-user/auth/roles',
    GET_ROLE_BY_NAME: (roleName: string) =>
      `/auth-admin-user/auth/roles/${roleName}`,
    ASSIGN_ROLE: (userId: string, roleId: string) =>
      `/auth-admin-user/auth/users/${userId}/roles/${roleId}`,
    REMOVE_ROLE: (userId: string, roleId: string) =>
      `/auth-admin-user/auth/users/${userId}/roles/${roleId}`,
    UNASSIGN_ROLES_PERMISSIONS_API:
      '/auth-admin-user/auth/users/un-assign/roles-permissions',
    ASSIGN_ROLES_PERMISSIONS_API:
      '/auth-admin-user/auth/users/assign/roles-permissions',
  },

  // Auth Admin Group (Permissions)
  AUTH_ADMIN_GROUP: {
    GET_BY_ID: (id: string) => `/auth-admin-group/auth/groups/${id}`,
    UPDATE: (id: string) => `/auth-admin-group/auth/groups/${id}`,
    DELETE: (id: string) => `/auth-admin-group/auth/groups/${id}`,
    GET_ALL: '/auth-admin-group/auth/groups?size=999', // Keep original for user management
    SAVE: '/auth-admin-group/auth/groups',
    FIND_ALL: '/auth-admin-group/auth/groups/find-all',
    CREATE_GROUP: '/auth-admin-group/auth/groups',
    GET_ALL_GROUPS: '/auth-admin-group/auth/groups', // New endpoint for group management
    GET_GROUP_BY_NAME: (groupName: string) =>
      `/auth-admin-group/auth/groups/${groupName}`,
    ASSIGN_GROUP: (userId: string, groupId: string) =>
      `/auth-admin-group/auth/users/${userId}/groups/${groupId}`,
    REMOVE_GROUP: (userId: string, groupId: string) =>
      `/auth-admin-group/auth/users/${userId}/groups/${groupId}`,
  },

  // Workflow
  WORKFLOW_APPROVAL_MATRIX: {
    GET_BY_ID: (id: string) => `/work-flow-approval-matrix/${id}`,
    UPDATE: (id: string) => `/work-flow-approval-matrix/${id}`,
    DELETE: (id: string) => `/work-flow-approval-matrix/${id}`,
    GET_ALL: '/work-flow-approval-matrix',
    SAVE: '/work-flow-approval-matrix',
    FIND_ALL: '/work-flow-approval-matrix/find-all',
  },

  // Workflow Action
  WORKFLOW_ACTION: {
    GET_BY_ID: (id: string) => `/workflow-action/${id}`,
    UPDATE: (id: string) => `/workflow-action/${id}`,
    DELETE: (id: string) => `/workflow-action/${id}`,
    GET_ALL: '/workflow-action',
    SAVE: '/workflow-action',
    FIND_ALL: '/workflow-action/find-all',
    SEARCH: '/workflow-action-controller/search',
  },

  // Workflow Definition
  WORKFLOW_DEFINITION: {
    GET_BY_ID: (id: string) => `/workflow-definition/${id}`,
    UPDATE: (id: string) => `/workflow-definition/${id}`,
    DELETE: (id: string) => `/workflow-definition/${id}`,
    UPDATE_DEFINITION: (id: string) => `/workflow-definition/update/${id}`,
    GET_ALL: '/workflow-definition',
    SAVE: '/workflow-definition',
    FIND_ALL: '/workflow-definition/find-all',
    SEARCH: '/workflow-definition/search',
    CREATE_DEFINITION: '/workflow-definition/create',
  },

  // Workflow Stage Template
  WORKFLOW_STAGE_TEMPLATE: {
    GET_BY_ID: (id: string) => `/workflow-stage-template/${id}`,
    UPDATE: (id: string) => `/workflow-stage-template/${id}`,
    DELETE: (id: string) => `/workflow-stage-template/${id}`,
    GET_ALL: '/workflow-stage-template',
    SAVE: '/workflow-stage-template',
    FIND_ALL: '/workflow-stage-template/find-all',
  },

  // Workflow Amount Rule
  WORKFLOW_AMOUNT_RULE: {
    GET_BY_ID: (id: string) => `/workflow-amount-rule/${id}`,
    UPDATE: (id: string) => `/workflow-amount-rule/${id}`,
    DELETE: (id: string) => `/workflow-amount-rule/${id}`,
    GET_ALL: '/workflow-amount-rule',
    SAVE: '/workflow-amount-rule',
    FIND_ALL: '/workflow-amount-rule/find-all',
  },

  // Workflow Amount Stage Override
  WORKFLOW_AMOUNT_STAGE_OVERRIDE: {
    GET_BY_ID: (id: string) => `/workflow-amount-stage-override/${id}`,
    UPDATE: (id: string) => `/workflow-amount-stage-override/${id}`,
    DELETE: (id: string) => `/workflow-amount-stage-override/${id}`,
    GET_ALL: '/workflow-amount-stage-override',
    SAVE: '/workflow-amount-stage-override',
    FIND_ALL: '/workflow-amount-stage-override/find-all',
  },

  // Workflow Request
  WORKFLOW_REQUEST: {
  
    CREATE_REQUEST: '/workflow-request/create-request',
  },



 // Workflow Queue
  WORKFLOW_QUEUE: {
    GET_BY_ID: (id: string) => `/workflow/requests/${id}`,
    GET_BY_LOGS_ID: (id: string) => `/workflow/requests/${id}`,
    GET_STATUS_BY_ID: (id: string) => `/workflow/requests/${id}`,
    GET_ALL_AWAITING_ACTIONS: '/workflow/awaiting-actions',
    GET_ALL_MY_ENGAGEMENTS: '/workflow/my-engagements',
    SAVE: '/workflow/stages/bulk-decision',
    GET_SUMMARY: '/workflow/summary',
  },

  // Workflow Execution
  WORKFLOW_EXECUTION: {
    GET_BY_ID: (id: string) => `/workflow-execution/${id}`,
    UPDATE: (id: string) => `/workflow-execution/${id}`,
    DELETE: (id: string) => `/workflow-execution/${id}`,
    GET_ALL: '/workflow-execution',
    SAVE: (id: string) => `/workflow-execution/${id}/decision`,
    FIND_ALL: '/workflow-execution/find-all',
  },

  WORKFLOW_INSTANCE: {
    GET_BY_ID: (id: string) => `/workflow-instance/${id}`,
    UPDATE: (id: string) => `/workflow-instance/${id}`,
    DELETE: (id: string) => `/workflow-instance/${id}`,
    GET_ALL: '/workflow-instance',
    SAVE: '/workflow-instance',
    FIND_ALL: '/workflow-instance/find-all',
  },

  // Build Partner Stepper APIs
  BUILD_PARTNER_CREATE: {
    DETAILS_SAVE: '/build-partner',
    CONTACT_SAVE: '/build-partner-contact',
    FEES_SAVE: '/build-partner-fees',
    BENEFICIARY_SAVE: '/build-partner-beneficiary',
    REVIEW_SAVE: '/build-partner-review',
    GET_STEP_DATA: (step: number) => `/build-partner/create/${step}/data`,
    VALIDATE_STEP: (step: number) => `/build-partner/create/${step}/validate`,
  },

  // Customer Details API
  CUSTOMER_DETAILS: {
    GET_BY_CIF: (cif: string) =>
      `/core-bank-get/sbi/apis/customer-details?customerCif=${cif}`,
  },

  // Additional endpoints can be added here as needed
} as const

// Helper function to construct API endpoint paths (for use with apiClient that has baseURL configured)
export const buildApiUrl = (endpoint: string): string => {
  return endpoint
}

// Helper function to construct API URLs with parameters
export const buildApiUrlWithParams = (
  endpoint: string,
  params: Record<string, string>
): string => {
  const url = buildApiUrl(endpoint)
  const searchParams = new URLSearchParams(params)
  return `${url}?${searchParams.toString()}`
}

// Common query parameters for pagination and filtering
export const API_QUERY_PARAMS = {
  PAGE: 'page',
  SIZE: 'size',
  SORT: 'sort',
  DISTINCT: 'distinct',
} as const

// Common filter operators
export const FILTER_OPERATORS = {
  EQUALS: 'equals',
  IN: 'in',
  NOT_IN: 'notIn',
  GREATER_THAN: 'greaterThan',
  LESS_THAN: 'lessThan',
  GREATER_THAN_OR_EQUAL: 'greaterThanOrEqual',
  LESS_THAN_OR_EQUAL: 'lessThanOrEqual',
  NOT_EQUALS: 'notEquals',
  CONTAINS: 'contains',
  DOES_NOT_CONTAIN: 'doesNotContain',
} as const

// Helper function to build filter parameters
export const buildFilterParams = (
  field: string,
  operator: keyof typeof FILTER_OPERATORS,
  value: string | number | boolean
): string => {
  return `${field}.${FILTER_OPERATORS[operator]}=${encodeURIComponent(String(value))}`
}

// Helper function to build pagination parameters
export const buildPaginationParams = (
  page: number = 0,
  size: number = 10,
  sort?: string
): Record<string, string> => {
  const params: Record<string, string> = {
    [API_QUERY_PARAMS.PAGE]: String(page),
    [API_QUERY_PARAMS.SIZE]: String(size),
  }

  if (sort) {
    params[API_QUERY_PARAMS.SORT] = sort
  }

  return params
}
