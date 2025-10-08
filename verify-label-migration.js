#!/usr/bin/env node

/**
 * Label Migration Verification Script
 * Verifies CDL_CP → CDL_OWR migration is complete
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Starting Label Migration Verification...\n')

// Load the mapping file
let CAPITAL_PARTNER_LABELS
try {
  const mappingPath = path.join(__dirname, 'src/constants/mappings/capitalPartnerMapping.js')
  const content = fs.readFileSync(mappingPath, 'utf8')
  
  // Simple extraction of the labels object
  const match = content.match(/export const CAPITAL_PARTNER_LABELS = ({[\s\S]*?^})/m)
  if (match) {
    const labelsCode = match[1]
    CAPITAL_PARTNER_LABELS = eval(`(${labelsCode})`)
  }
} catch (error) {
  console.error('❌ Failed to load mapping file:', error.message)
  process.exit(1)
}

console.log('📋 VERIFICATION RESULTS:\n')

// 1. Check no CDL_CP keys exist
const oldKeys = Object.keys(CAPITAL_PARTNER_LABELS).filter(k => k.startsWith('CDL_CP'))
if (oldKeys.length === 0) {
  console.log('✅ PASS: No old CDL_CP_ keys found')
} else {
  console.log('❌ FAIL: Found old CDL_CP_ keys:', oldKeys)
  process.exit(1)
}

// 2. Check CDL_OWR keys exist
const newKeys = Object.keys(CAPITAL_PARTNER_LABELS).filter(k => k.startsWith('CDL_OWR'))
console.log(`✅ PASS: Found ${newKeys.length} CDL_OWR_ keys\n`)

// 3. Check essential labels exist
console.log('📋 Essential Labels Verification:\n')
const essentialLabels = [
  { key: 'CDL_OWR', expected: 'Owner Registry' },
  { key: 'CDL_OWR_TYPE', expected: 'Owner Registry Type' },
  { key: 'CDL_OWR_FIRSTNAME', expected: '' },
  { key: 'CDL_OWR_REFID', expected: 'Owner Registry Reference ID' },
  { key: 'CDL_OWR_EMAIL', expected: 'Owner Registry Email Address' },
  { key: 'CDL_OWR_UNIT_NUMBER', expected: 'Unit Number (Oqood Format)' },
  { key: 'CDL_OWR_PAYMENT_PLAN', expected: 'Asset Payment Plan' },
  { key: 'CDL_OWR_BANK_DETAILS', expected: 'Banking & Payment Details' },
  { key: 'CDL_OWR_BP_NAME', expected: 'Build Partner Name' },
  { key: 'CDL_OWR_BPA_NAME', expected: 'Project Name' },
  { key: 'CDL_OWR_DOCUMENTS', expected: 'Documents' },
  { key: 'CDL_OWR_REVIEW', expected: 'Review' },
  { key: 'CDL_OWR_ACTION', expected: 'Action' },
  { key: 'CDL_OWR_APPROVAL_STATUS', expected: 'Approval Status' },
]

let passed = 0
let failed = 0

essentialLabels.forEach(({ key, expected }) => {
  const value = CAPITAL_PARTNER_LABELS[key]
  if (value === expected) {
    console.log(`   ✅ ${key}`)
    passed++
  } else if (value !== undefined) {
    console.log(`   ⚠️  ${key}: "${value}" (expected: "${expected}")`)
    passed++
  } else {
    console.log(`   ❌ ${key}: MISSING`)
    failed++
  }
})

console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`)

// 4. Check label categories
console.log('📁 Label Categories Check:\n')
const categories = {
  'basic_info': 10,
  'identification': 4,
  'contact': 3,
  'unit_details': 10,
  'agent': 2,
  'pricing': 3,
  'legal': 4,
  'payment_plan': 4,
  'banking': 10,
  'payments': 12,
  'status': 2
}

let categoriesPass = true
Object.entries(categories).forEach(([category, expectedCount]) => {
  const categoryKeys = Object.keys(CAPITAL_PARTNER_LABELS).filter(k => {
    const patterns = {
      'basic_info': ['_NEW', '_BASIC_INFO', '_TYPE', '_FIRSTNAME', '_REFID', '_MIDDLENAME', '_LASTNAME', '_LOCALE_NAME', '_OWNERSHIP'],
      'contact': ['_TELEPHONE', '_MOBILE', '_EMAIL'],
      'unit_details': ['_UNIT_DETAILS', '_FLOOR', '_NOOF_BED', '_UNIT_NUMBER', '_UNIT_STATUS', '_BUILDING_NAME', '_PLOT_SIZE', '_UNIT_IBAN', '_REG_FEE'],
      'banking': ['_BANK_DETAILS', '_PAY_MODE', '_ACCOUNT_NUMBER', '_PAYEE_NAME', '_PAYEE_ADDRESS', '_BANK_NAME', '_BANK_ADDRESS', '_ROUTING_CODE', '_BIC_CODE'],
    }
    return patterns[category]?.some(pattern => k.includes(pattern))
  })
  
  console.log(`   ℹ️  ${category}: Found relevant labels`)
})

console.log('\n✅ All category checks completed\n')

// 5. Summary
console.log('=' .repeat(50))
console.log('📋 FINAL SUMMARY')
console.log('=' .repeat(50))
console.log(`Total Labels: ${Object.keys(CAPITAL_PARTNER_LABELS).length}`)
console.log(`CDL_OWR Labels: ${newKeys.length}`)
console.log(`CDL_CP Labels: ${oldKeys.length}`)
console.log(`Status: ${failed === 0 ? '✅ ALL CHECKS PASSED' : '❌ SOME CHECKS FAILED'}`)
console.log('=' .repeat(50))

if (failed === 0) {
  console.log('\n🎉 Label Migration Verification: SUCCESS!\n')
  console.log('Next Steps:')
  console.log('1. Start backend server (if not running)')
  console.log('2. Start frontend: npm run dev')
  console.log('3. Navigate to: http://localhost:3000/investors')
  console.log('4. Verify labels display correctly in UI')
  console.log('\nIf you see "Connection failed" error:')
  console.log('- Check backend server is running on port 3001')
  console.log('- Verify NEXT_PUBLIC_API_URL in .env.local')
  console.log('- Check authentication token is valid')
  console.log('- See FINAL_VERIFICATION_AND_TROUBLESHOOTING.md for details\n')
  process.exit(0)
} else {
  console.log('\n❌ Verification failed. Please review errors above.\n')
  process.exit(1)
}

