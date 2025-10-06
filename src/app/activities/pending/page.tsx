'use client'

import React, { useState } from 'react'
import { TablePageLayout } from '../../../components/templates/TablePageLayout'
import { ExpandableDataTable } from '../../../components/organisms/ExpandableDataTable'
import { useTableState } from '../../../hooks/useTableState'
import { ActivityData, Tab, StatusCardData } from '../../../types/activities'
import { getStatusCardConfig } from '../../../utils/statusUtils'
import { CommentModal } from '../../../components/molecules/CommentModal'

const tabs: Tab[] = [
  { id: 'property ', label: 'Property' },
  { id: 'propertManagementCompany', label: 'Property Management Company' },
  { id: 'owner', label: 'Owner' },
  { id: 'guarantee', label: 'Guarantee' },
  { id: 'payment', label: 'Payment' },
  { id: 'partialPayments', label: 'Partial Payments' },
  { id: 'splitAllocate', label: 'Split & Allocate' },
  { id: 'tasDeposit', label: 'TAS Deposit' },
  { id: 'fundRollback', label: 'Fund Rollback' },
]

const activitiesData: ActivityData[] = [
  {
    developer: 'LnT Ultra',
    maker: 'Admin',
    recentActor: 'Admin',
    comment: '7',
    createdDate: '3 June 2025 19:45 PM',
    updatedDate: '4 June 2025 19:45 PM',
    status: 'In Review',
    activityId: 'ACT-LNTULTRA-001',
    activityType: 'Registration',
    projectName: 'LnT Ultra Project',
    priority: 'Medium',
    dueDate: '15 June 2025',
    documents: [
      { name: 'Documents Uploaded', status: 'Approved', color: 'green' },
      { name: 'Documents Verified', status: 'Pending', color: 'yellow' },
      { name: 'Documents Approved', status: 'In Review', color: 'blue' },
      { name: 'Documents Rejected', status: 'Rejected', color: 'red' },
    ],
    recentActivity: [
      {
        date: '4 June 2025 19:45 PM',
        action: 'Activity Created',
        color: 'blue',
      },
      {
        date: '3 June 2025 19:45 PM',
        action: 'Activity Submitted',
        color: 'green',
      },
      {
        date: '4 June 2025 14:30 PM',
        action: 'Activity Approved',
        color: 'yellow',
      },
    ],
  },
  {
    developer: 'Ambhuja',
    maker: 'Admin',
    recentActor: 'Admin',
    comment: '3',
    createdDate: '5 June 2025 10:24 AM',
    updatedDate: '5 June 2025 12:38 PM',
    status: 'Incomplete',
    activityId: 'ACT-AMBHUJA-002',
    activityType: 'Registration',
    projectName: 'Ambhuja Project',
    priority: 'High',
    dueDate: '20 June 2025',
    documents: [
      { name: 'Documents Uploaded', status: 'Pending', color: 'yellow' },
      { name: 'Documents Verified', status: 'Pending', color: 'yellow' },
      { name: 'Documents Approved', status: 'Pending', color: 'yellow' },
      { name: 'Documents Rejected', status: 'None', color: 'gray' },
    ],
    recentActivity: [
      {
        date: '5 June 2025 12:38 PM',
        action: 'Activity Created',
        color: 'blue',
      },
      {
        date: '5 June 2025 10:24 AM',
        action: 'Activity Submitted',
        color: 'green',
      },
    ],
  },
  {
    developer: 'DLF Infra',
    maker: 'Sr Admin',
    recentActor: 'Sr Admin',
    comment: '9',
    createdDate: '1 June 2025 19:45 PM',
    updatedDate: '2 June 2025 19:45 PM',
    status: 'Incomplete',
    activityId: 'ACT-DLFINFRA-003',
    activityType: 'Registration',
    projectName: 'DLF Infra Project',
    priority: 'Medium',
    dueDate: '25 June 2025',
    documents: [
      { name: 'Documents Uploaded', status: 'Approved', color: 'green' },
      { name: 'Documents Verified', status: 'In Review', color: 'blue' },
      { name: 'Documents Approved', status: 'Pending', color: 'yellow' },
      { name: 'Documents Rejected', status: 'None', color: 'gray' },
    ],
    recentActivity: [
      {
        date: '2 June 2025 19:45 PM',
        action: 'Activity Created',
        color: 'blue',
      },
      {
        date: '1 June 2025 19:45 PM',
        action: 'Activity Submitted',
        color: 'green',
      },
    ],
  },
  {
    developer: 'Bharat Infra',
    maker: 'Maker ENBD',
    recentActor: 'Maker ENBD',
    comment: '1',
    createdDate: '25 May 2025 19:45 PM',
    updatedDate: '26 May 2025 19:45 PM',
    status: 'Incomplete',
    activityId: 'ACT-BHARAT-004',
    activityType: 'Registration',
    projectName: 'Bharat Infra Project',
    priority: 'Low',
    dueDate: '30 June 2025',
    documents: [
      { name: 'Documents Uploaded', status: 'Approved', color: 'green' },
      { name: 'Documents Verified', status: 'Approved', color: 'green' },
      { name: 'Documents Approved', status: 'Pending', color: 'yellow' },
      { name: 'Documents Rejected', status: 'None', color: 'gray' },
    ],
    recentActivity: [
      {
        date: '26 May 2025 19:45 PM',
        action: 'Activity Created',
        color: 'blue',
      },
      {
        date: '25 May 2025 19:45 PM',
        action: 'Activity Submitted',
        color: 'green',
      },
    ],
  },
  {
    developer: 'Lodha Buildcom',
    maker: 'Checker ENBD',
    recentActor: 'Checker ENBD',
    comment: '5',
    createdDate: '22 May 2025 19:45 PM',
    updatedDate: '23 May 2025 19:45 PM',
    status: 'Approved',
    activityId: 'ACT-LODHA-005',
    activityType: 'Registration',
    projectName: 'Lodha Buildcom Project',
    priority: 'Medium',
    dueDate: '5 July 2025',
    documents: [
      { name: 'Documents Uploaded', status: 'Approved', color: 'green' },
      { name: 'Documents Verified', status: 'Approved', color: 'green' },
      { name: 'Documents Approved', status: 'Approved', color: 'green' },
      { name: 'Documents Rejected', status: 'None', color: 'gray' },
    ],
    recentActivity: [
      {
        date: '23 May 2025 19:45 PM',
        action: 'Activity Created',
        color: 'blue',
      },
      {
        date: '22 May 2025 19:45 PM',
        action: 'Activity Submitted',
        color: 'green',
      },
      {
        date: '23 May 2025 19:45 PM',
        action: 'Activity Approved',
        color: 'yellow',
      },
    ],
  },
  {
    developer: 'Reliance infra',
    maker: 'Checker ENBD',
    recentActor: 'Checker ENBD',
    comment: '8',
    createdDate: '21 May 2025 19:45 PM',
    updatedDate: '22 May 2025 19:45 PM',
    status: 'Incomplete',
    activityId: 'ACT-RELIANCE-006',
    activityType: 'Registration',
    projectName: 'Reliance Infra Project',
    priority: 'High',
    dueDate: '10 July 2025',
    documents: [
      { name: 'Documents Uploaded', status: 'Approved', color: 'green' },
      { name: 'Documents Verified', status: 'Pending', color: 'yellow' },
      { name: 'Documents Approved', status: 'Pending', color: 'yellow' },
      { name: 'Documents Rejected', status: 'None', color: 'gray' },
    ],
    recentActivity: [
      {
        date: '22 May 2025 19:45 PM',
        action: 'Activity Created',
        color: 'blue',
      },
      {
        date: '21 May 2025 19:45 PM',
        action: 'Activity Submitted',
        color: 'green',
      },
    ],
  },
  {
    developer: 'Godrej Properties',
    maker: 'Admin',
    recentActor: 'Admin',
    comment: '2',
    createdDate: '3 June 2025 19:45 PM',
    updatedDate: '4 June 2025 19:45 PM',
    status: 'In Review',
    activityId: 'ACT-GODREJ-007',
    activityType: 'Registration',
    projectName: 'Godrej Properties Project',
    priority: 'Medium',
    dueDate: '15 July 2025',
    documents: [
      { name: 'Documents Uploaded', status: 'Approved', color: 'green' },
      { name: 'Documents Verified', status: 'Approved', color: 'green' },
      { name: 'Documents Approved', status: 'In Review', color: 'blue' },
      { name: 'Documents Rejected', status: 'None', color: 'gray' },
    ],
    recentActivity: [
      {
        date: '4 June 2025 19:45 PM',
        action: 'Activity Created',
        color: 'blue',
      },
      {
        date: '3 June 2025 19:45 PM',
        action: 'Activity Submitted',
        color: 'green',
      },
    ],
  },
  {
    developer: 'Mahindra Lifespaces',
    maker: 'Maker ENBD',
    recentActor: 'Maker ENBD',
    comment: '6',
    createdDate: '1 June 2025 19:45 PM',
    updatedDate: '2 June 2025 19:45 PM',
    status: 'In Review',
    activityId: 'ACT-MAHINDRA-008',
    activityType: 'Registration',
    projectName: 'Mahindra Lifespaces Project',
    priority: 'Low',
    dueDate: '20 July 2025',
    documents: [
      { name: 'Documents Uploaded', status: 'Approved', color: 'green' },
      { name: 'Documents Verified', status: 'In Review', color: 'blue' },
      { name: 'Documents Approved', status: 'Pending', color: 'yellow' },
      { name: 'Documents Rejected', status: 'None', color: 'gray' },
    ],
    recentActivity: [
      {
        date: '2 June 2025 19:45 PM',
        action: 'Activity Created',
        color: 'blue',
      },
      {
        date: '1 June 2025 19:45 PM',
        action: 'Activity Submitted',
        color: 'green',
      },
    ],
  },
  {
    developer: 'Tata Infra',
    maker: 'Maker ENBD',
    recentActor: 'Maker ENBD',
    comment: '4',
    createdDate: '25 May 2025 19:45 PM',
    updatedDate: '26 May 2025 19:45 PM',
    status: 'Incomplete',
    activityId: 'ACT-TATA-009',
    activityType: 'Registration',
    projectName: 'Tata Infra Project',
    priority: 'Medium',
    dueDate: '25 July 2025',
    documents: [
      { name: 'Documents Uploaded', status: 'Approved', color: 'green' },
      { name: 'Documents Verified', status: 'Pending', color: 'yellow' },
      { name: 'Documents Approved', status: 'Pending', color: 'yellow' },
      { name: 'Documents Rejected', status: 'None', color: 'gray' },
    ],
    recentActivity: [
      {
        date: '26 May 2025 19:45 PM',
        action: 'Activity Created',
        color: 'blue',
      },
      {
        date: '25 May 2025 19:45 PM',
        action: 'Activity Submitted',
        color: 'green',
      },
    ],
  },
  {
    developer: 'Sobha Developers',
    maker: 'Admin',
    recentActor: 'Admin',
    comment: '10',
    createdDate: '20 May 2025 14:30 PM',
    updatedDate: '21 May 2025 09:15 AM',
    status: 'Approved',
    activityId: 'ACT-SOBHA-010',
    activityType: 'Registration',
    projectName: 'Sobha Developers Project',
    priority: 'High',
    dueDate: '30 July 2025',
    documents: [
      { name: 'Documents Uploaded', status: 'Approved', color: 'green' },
      { name: 'Documents Verified', status: 'Approved', color: 'green' },
      { name: 'Documents Approved', status: 'Approved', color: 'green' },
      { name: 'Documents Rejected', status: 'None', color: 'gray' },
    ],
    recentActivity: [
      {
        date: '21 May 2025 09:15 AM',
        action: 'Activity Created',
        color: 'blue',
      },
      {
        date: '20 May 2025 14:30 PM',
        action: 'Activity Submitted',
        color: 'green',
      },
      {
        date: '21 May 2025 09:15 AM',
        action: 'Activity Approved',
        color: 'yellow',
      },
    ],
  },
  {
    developer: 'Brigade Group',
    maker: 'Checker ENBD',
    recentActor: 'Checker ENBD',
    comment: '3',
    createdDate: '18 May 2025 11:20 AM',
    updatedDate: '19 May 2025 16:45 PM',
    status: 'Approved',
    activityId: 'ACT-BRIGADE-011',
    activityType: 'Registration',
    projectName: 'Brigade Group Project',
    priority: 'Medium',
    dueDate: '5 August 2025',
    documents: [
      { name: 'Documents Uploaded', status: 'Approved', color: 'green' },
      { name: 'Documents Verified', status: 'Approved', color: 'green' },
      { name: 'Documents Approved', status: 'Approved', color: 'green' },
      { name: 'Documents Rejected', status: 'None', color: 'gray' },
    ],
    recentActivity: [
      {
        date: '19 May 2025 16:45 PM',
        action: 'Activity Created',
        color: 'blue',
      },
      {
        date: '18 May 2025 11:20 AM',
        action: 'Activity Submitted',
        color: 'green',
      },
      {
        date: '19 May 2025 16:45 PM',
        action: 'Activity Approved',
        color: 'yellow',
      },
    ],
  },
  {
    developer: 'Prestige Estates',
    maker: 'Maker ENBD',
    recentActor: 'Maker ENBD',
    comment: '7',
    createdDate: '17 May 2025 13:15 PM',
    updatedDate: '18 May 2025 10:30 AM',
    status: 'Incomplete',
    activityId: 'ACT-PRESTIGE-012',
    activityType: 'Registration',
    projectName: 'Prestige Estates Project',
    priority: 'High',
    dueDate: '10 August 2025',
    documents: [
      { name: 'Documents Uploaded', status: 'Approved', color: 'green' },
      { name: 'Documents Verified', status: 'Pending', color: 'yellow' },
      { name: 'Documents Approved', status: 'Pending', color: 'yellow' },
      { name: 'Documents Rejected', status: 'None', color: 'gray' },
    ],
    recentActivity: [
      {
        date: '18 May 2025 10:30 AM',
        action: 'Activity Created',
        color: 'blue',
      },
      {
        date: '17 May 2025 13:15 PM',
        action: 'Activity Submitted',
        color: 'green',
      },
    ],
  },
  {
    developer: 'Puravankara',
    maker: 'Sr Admin',
    recentActor: 'Sr Admin',
    comment: '1',
    createdDate: '16 May 2025 09:45 AM',
    updatedDate: '17 May 2025 14:20 PM',
    status: 'Incomplete',
    activityId: 'ACT-PURAVANKARA-013',
    activityType: 'Registration',
    projectName: 'Puravankara Project',
    priority: 'Medium',
    dueDate: '15 August 2025',
    documents: [
      { name: 'Documents Uploaded', status: 'Approved', color: 'green' },
      { name: 'Documents Verified', status: 'In Review', color: 'blue' },
      { name: 'Documents Approved', status: 'Pending', color: 'yellow' },
      { name: 'Documents Rejected', status: 'None', color: 'gray' },
    ],
    recentActivity: [
      {
        date: '17 May 2025 14:20 PM',
        action: 'Activity Created',
        color: 'blue',
      },
      {
        date: '16 May 2025 09:45 AM',
        action: 'Activity Submitted',
        color: 'green',
      },
    ],
  },
  {
    developer: 'Shriram Properties',
    maker: 'Admin',
    recentActor: 'Admin',
    comment: '5',
    createdDate: '15 May 2025 16:30 PM',
    updatedDate: '16 May 2025 11:45 AM',
    status: 'Rejected',
    activityId: 'ACT-SHRIRAM-014',
    activityType: 'Registration',
    projectName: 'Shriram Properties Project',
    priority: 'High',
    dueDate: '20 August 2025',
    documents: [
      { name: 'Documents Uploaded', status: 'Approved', color: 'green' },
      { name: 'Documents Verified', status: 'Approved', color: 'green' },
      { name: 'Documents Approved', status: 'Rejected', color: 'red' },
      { name: 'Documents Rejected', status: 'Rejected', color: 'red' },
    ],
    recentActivity: [
      {
        date: '16 May 2025 11:45 AM',
        action: 'Activity Created',
        color: 'blue',
      },
      {
        date: '15 May 2025 16:30 PM',
        action: 'Activity Submitted',
        color: 'green',
      },
      {
        date: '16 May 2025 11:45 AM',
        action: 'Activity Rejected',
        color: 'red',
      },
    ],
  },
  {
    developer: 'Embassy Group',
    maker: 'Checker ENBD',
    recentActor: 'Checker ENBD',
    comment: '8',
    createdDate: '14 May 2025 12:10 PM',
    updatedDate: '15 May 2025 08:25 AM',
    status: 'In Review',
    activityId: 'ACT-EMBASSY-015',
    activityType: 'Registration',
    projectName: 'Embassy Group Project',
    priority: 'Medium',
    dueDate: '25 August 2025',
    documents: [
      { name: 'Documents Uploaded', status: 'Approved', color: 'green' },
      { name: 'Documents Verified', status: 'Approved', color: 'green' },
      { name: 'Documents Approved', status: 'In Review', color: 'blue' },
      { name: 'Documents Rejected', status: 'None', color: 'gray' },
    ],
    recentActivity: [
      {
        date: '15 May 2025 08:25 AM',
        action: 'Activity Created',
        color: 'blue',
      },
      {
        date: '14 May 2025 12:10 PM',
        action: 'Activity Submitted',
        color: 'green',
      },
    ],
  },
  {
    developer: 'Oberoi Realty',
    maker: 'Admin',
    recentActor: 'Admin',
    comment: '2',
    createdDate: '13 May 2025 10:20 AM',
    updatedDate: '14 May 2025 15:30 PM',
    status: 'Incomplete',
    activityId: 'ACT-OBEROI-016',
    activityType: 'Registration',
    projectName: 'Oberoi Realty Project',
    priority: 'Low',
    dueDate: '30 August 2025',
    documents: [
      { name: 'Documents Uploaded', status: 'Approved', color: 'green' },
      { name: 'Documents Verified', status: 'Pending', color: 'yellow' },
      { name: 'Documents Approved', status: 'Pending', color: 'yellow' },
      { name: 'Documents Rejected', status: 'None', color: 'gray' },
    ],
    recentActivity: [
      {
        date: '14 May 2025 15:30 PM',
        action: 'Activity Created',
        color: 'blue',
      },
      {
        date: '13 May 2025 10:20 AM',
        action: 'Activity Submitted',
        color: 'green',
      },
    ],
  },
  {
    developer: 'Phoenix Mills',
    maker: 'Maker ENBD',
    recentActor: 'Maker ENBD',
    comment: '9',
    createdDate: '12 May 2025 14:45 PM',
    updatedDate: '13 May 2025 11:15 AM',
    status: 'In Review',
    activityId: 'ACT-PHOENIX-017',
    activityType: 'Registration',
    projectName: 'Phoenix Mills Project',
    priority: 'Medium',
    dueDate: '5 September 2025',
    documents: [
      { name: 'Documents Uploaded', status: 'Approved', color: 'green' },
      { name: 'Documents Verified', status: 'Approved', color: 'green' },
      { name: 'Documents Approved', status: 'In Review', color: 'blue' },
      { name: 'Documents Rejected', status: 'None', color: 'gray' },
    ],
    recentActivity: [
      {
        date: '13 May 2025 11:15 AM',
        action: 'Activity Created',
        color: 'blue',
      },
      {
        date: '12 May 2025 14:45 PM',
        action: 'Activity Submitted',
        color: 'green',
      },
    ],
  },
  {
    developer: 'K Raheja Corpsss',
    maker: 'Checker ENBD',
    recentActor: 'Checker ENBD',
    comment: '6',
    createdDate: '11 May 2025 09:30 AM',
    updatedDate: '12 May 2025 16:20 PM',
    status: 'Approved',
    activityId: 'ACT-KRAHEJA-018',
    activityType: 'Registration',
    projectName: 'K Raheja Corp Project',
    priority: 'High',
    dueDate: '10 September 2025',
    documents: [
      { name: 'Documents Uploaded', status: 'Approved', color: 'green' },
      { name: 'Documents Verified', status: 'Approved', color: 'green' },
      { name: 'Documents Approved', status: 'Approved', color: 'green' },
      { name: 'Documents Rejected', status: 'None', color: 'gray' },
    ],
    recentActivity: [
      {
        date: '12 May 2025 16:20 PM',
        action: 'Activity Created',
        color: 'blue',
      },
      {
        date: '11 May 2025 09:30 AM',
        action: 'Activity Submitted',
        color: 'green',
      },
      {
        date: '12 May 2025 16:20 PM',
        action: 'Activity Approved',
        color: 'yellow',
      },
    ],
  },
  {
    developer: 'Hiranandani',
    maker: 'Admin',
    recentActor: 'Admin',
    comment: '4',
    createdDate: '10 May 2025 13:15 PM',
    updatedDate: '11 May 2025 10:45 AM',
    status: 'Incomplete',
    activityId: 'ACT-HIRANANDANI-019',
    activityType: 'Registration',
    projectName: 'Hiranandani Project',
    priority: 'Medium',
    dueDate: '15 September 2025',
    documents: [
      { name: 'Documents Uploaded', status: 'Approved', color: 'green' },
      { name: 'Documents Verified', status: 'Pending', color: 'yellow' },
      { name: 'Documents Approved', status: 'Pending', color: 'yellow' },
      { name: 'Documents Rejected', status: 'None', color: 'gray' },
    ],
    recentActivity: [
      {
        date: '11 May 2025 10:45 AM',
        action: 'Activity Created',
        color: 'blue',
      },
      {
        date: '10 May 2025 13:15 PM',
        action: 'Activity Submitted',
        color: 'green',
      },
    ],
  },
  {
    developer: 'Kalpataru Group',
    maker: 'Maker ENBD',
    recentActor: 'Maker ENBD',
    comment: '10',
    createdDate: '9 May 2025 11:20 AM',
    updatedDate: '10 May 2025 14:30 PM',
    status: 'In Review',
    activityId: 'ACT-KALPATARU-020',
    activityType: 'Registration',
    projectName: 'Kalpataru Group Project',
    priority: 'Low',
    dueDate: '20 September 2025',
    documents: [
      { name: 'Documents Uploaded', status: 'Approved', color: 'green' },
      { name: 'Documents Verified', status: 'Approved', color: 'green' },
      { name: 'Documents Approved', status: 'In Review', color: 'blue' },
      { name: 'Documents Rejected', status: 'None', color: 'gray' },
    ],
    recentActivity: [
      {
        date: '10 May 2025 14:30 PM',
        action: 'Activity Created',
        color: 'blue',
      },
      {
        date: '9 May 2025 11:20 AM',
        action: 'Activity Submitted',
        color: 'green',
      },
    ],
  },
]

const statusOptions = ['Incomplete', 'In Review', 'Rejected', 'Approved']

const tableColumns = [
  { key: 'checkbox', label: '', type: 'checkbox' as const, width: 'w-2' },
  {
    key: 'developer',
    label: 'Developer',
    type: 'text' as const,
    width: 'w-[162px]',
    sortable: true,
  },
  {
    key: 'maker',
    label: 'Maker',
    type: 'text' as const,
    width: 'w-[124px]',
    sortable: true,
  },
  {
    key: 'recentActor',
    label: 'Recent Actor',
    type: 'text' as const,
    width: 'w-[124px]',
    sortable: true,
  },
  {
    key: 'comment',
    label: 'Comment',
    type: 'comment' as const,
    width: 'w-20',
    sortable: true,
  },
  {
    key: 'createdDate',
    label: 'Created Date',
    type: 'text' as const,
    width: 'w-40',
    sortable: true,
  },
  {
    key: 'updatedDate',
    label: 'Updated Date',
    type: 'text' as const,
    width: 'w-40',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status',
    type: 'status' as const,
    width: 'w-[129px]',
    sortable: true,
  },
  { key: 'actions', label: 'Actions', type: 'actions' as const, width: 'w-20' },
]

const PendingActivitiesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('developer')
  const [commentModalOpen, setCommentModalOpen] = useState(false)
  const [selectedComment, setSelectedComment] = useState<{ comment: string; developer: string; activityId?: string } | null>(null)
  // const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)

  // Use the generic table state hook
  const {
    search,
    paginated,
    totalRows,
    totalPages,
    startItem,
    endItem,
    page,
    rowsPerPage,
    selectedRows,
    expandedRows,
    handleSearchChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleRowSelectionChange,
    handleRowExpansionChange,
  } = useTableState({
    data: activitiesData,
    searchFields: [
      'developer',
      'maker',
      'recentActor',
      'comment',
      'createdDate',
      'updatedDate',
      'status',
    ],
    initialRowsPerPage: 20,
  })

  // Generate status cards data
  const statusCards: StatusCardData[] = [
    {
      label: 'Rejected',
      count: activitiesData.filter((item) => item.status === 'Rejected').length,
      ...getStatusCardConfig('Rejected'),
    },
    {
      label: 'Incomplete',
      count: activitiesData.filter((item) => item.status === 'Incomplete')
        .length,
      ...getStatusCardConfig('Incomplete'),
    },
    {
      label: 'In Review',
      count: activitiesData.filter((item) => item.status === 'In Review')
        .length,
      ...getStatusCardConfig('In Review'),
    },
    {
      label: 'Approved',
      count: activitiesData.filter((item) => item.status === 'Approved').length,
      ...getStatusCardConfig('Approved'),
    },
  ]

  // Action buttons
  const actionButtons = [
    {
      label: 'Reject',
      onClick: () => console.log('Reject selected rows'),
      disabled: selectedRows.length === 0,
      variant: 'secondary' as const,
    },
    {
      label: 'Approve',
      onClick: () => console.log('Approve selected rows'),
      disabled: selectedRows.length === 0,
      variant: 'primary' as const,
    },
    {
      label: 'Download',
      onClick: () => console.log('Download'),
      icon: '/download.svg',
      disabled: selectedRows.length === 0,
      iconAlt: 'download icon',
    },
  ]

  // Handle comment click
  const handleCommentClick = (column: string, value: unknown): React.ReactNode => {
    if (column === 'comment' && typeof value === 'object' && value !== null) {
      const { comment, row: rowData } = value as { comment: string; row: ActivityData }
      setSelectedComment({
        comment,
        developer: rowData.developer,
        activityId: rowData.activityId,
      })
      setCommentModalOpen(true)
    }
    return null
  }

  // Handle row actions
  const handleRowDelete = (row: ActivityData, index: number) => {
    console.log('Delete row:', row, 'at index:', index)
    // Add your delete logic here
    alert(`Delete activity: ${row.activityId}`)
  }

  const handleRowView = (row: ActivityData, index: number) => {
    console.log('View row:', row, 'at index:', index)
    // Add your view logic here
    alert(`View activity: ${row.activityId}`)
  }

  // Render expanded content
  const renderExpandedContent = (row: ActivityData) => (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        <h4 className="mb-4 text-sm font-semibold text-gray-900">
          Activity Info
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Activity ID:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.activityId}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Activity Type:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.activityType}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Activity Status:</span>
            <span className="ml-2 font-medium text-gray-800">{row.status}</span>
          </div>
          <div>
            <span className="text-gray-600">Developer:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.developer}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Project:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.projectName}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Investor:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.recentActor}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Guarantee:</span>
            <span className="ml-2 font-medium text-gray-800">Pending</span>
          </div>
          <div>
            <span className="text-gray-600">Payment:</span>
            <span className="ml-2 font-medium text-gray-800">Pending</span>
          </div>
          <div>
            <span className="text-gray-600">Partial Payment:</span>
            <span className="ml-2 font-medium text-gray-800">Pending</span>
          </div>
          <div>
            <span className="text-gray-600">Split & Allocate:</span>
            <span className="ml-2 font-medium text-gray-800">Pending</span>
          </div>
          <div>
            <span className="text-gray-600">TAS Deposit:</span>
            <span className="ml-2 font-medium text-gray-800">Pending</span>
          </div>
          <div>
            <span className="text-gray-600">Fund Rollback:</span>
            <span className="ml-2 font-medium text-gray-800">Pending</span>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h4 className="mb-4 text-sm font-semibold text-gray-900">
          Documentation Status
        </h4>
        <div className="space-y-3">
          {row.documents.map((doc, docIndex) => (
            <button
              key={docIndex}
              className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
            >
              {doc.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <TablePageLayout
        title="Pending Activities"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        statusCards={statusCards}
        actionButtons={actionButtons}
      >
        <ExpandableDataTable<ActivityData>
          data={paginated}
          columns={tableColumns}
          searchState={search}
          onSearchChange={handleSearchChange}
          paginationState={{
            page,
            rowsPerPage,
            totalRows,
            totalPages,
            startItem,
            endItem,
          }}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          selectedRows={selectedRows}
          onRowSelectionChange={handleRowSelectionChange}
          expandedRows={expandedRows}
          onRowExpansionChange={handleRowExpansionChange}
          renderExpandedContent={renderExpandedContent}
          statusOptions={statusOptions}
          renderCustomCell={handleCommentClick}
          onRowDelete={handleRowDelete}
          onRowView={handleRowView}
          showDeleteAction={true}
          showViewAction={true}
        />
      </TablePageLayout>
      
      {/* Comment Modal */}
      {selectedComment && (
        <CommentModal
          open={commentModalOpen}
          onClose={() => {
            setCommentModalOpen(false)
            setSelectedComment(null)
          }}
          comment={selectedComment.comment}
          developer={selectedComment.developer}
          activityId={selectedComment.activityId || undefined}
        />
      )}
    </>
  )
}

export default PendingActivitiesPage
