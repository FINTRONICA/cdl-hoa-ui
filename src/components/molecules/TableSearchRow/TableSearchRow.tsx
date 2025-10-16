import React from 'react'
import { Select } from '../../atoms/Select'

interface Column {
  key: string
  label: string
  width?: string
  sortable?: boolean
  searchable?: boolean
  type?:
    | 'text'
    | 'status'
    | 'date'
    | 'actions'
    | 'checkbox'
    | 'expand'
    | 'user'
    | 'select'
    | 'custom'
    | 'comment'
  options?: { value: string; label: string }[]
  statusOptions?: string[]
}

interface TableSearchRowProps {
  columns: Column[]
  search: Record<string, string>
  onSearchChange: (field: string, value: string) => void
  statusOptions?: string[]
}

export const TableSearchRow: React.FC<TableSearchRowProps> = ({
  columns,
  search,
  onSearchChange,
  statusOptions = [],
}) => {
  return (
    <tr className="sticky top-[52px] z-20 border-b border-gray-200 pb-4">
      {columns.map((column) => {
        if (
          column.type === 'expand' ||
          column.type === 'actions' ||
          column.type === 'checkbox' ||
          column.type === 'select' ||
          column.type === 'custom' ||
          column.type === 'comment'
        ) {
          return (
            <th
              key={column.key}
              className={`${column.width || ''} px-4 py-2 pb-4 ${column.type === 'checkbox' ? 'border-r border-[#CAD5E2] text-center align-middle' : ''}`}
            ></th>
          )
        }
        // Status dropdown
        if (column.type === 'status' || column.key === 'status') {
          // Use column-specific status options if available, otherwise fall back to global statusOptions
          const columnStatusOptions = column.statusOptions || statusOptions

          return (
            <th
              key={column.key}
              className={`${column.width || ''} px-4 py-2 pb-4 align-middle`}
            >
              <Select
                value={search[column.key] || ''}
                onChange={(value) => onSearchChange(column.key, value)}
                options={columnStatusOptions.map((opt) => ({
                  value: opt,
                  label: opt,
                }))}
                placeholder="Search"
                className="w-full min-w-0 h-8 something px-2 py-1 text-xs font-outfit font-normal not-italic border border-gray-300 rounded-md text-gray-900 focus:outline-none [&>option]:text-gray-900 shadow-none placeholder:text-xs placeholder:font-outfit placeholder:font-normal placeholder:not-italic"
              />
            </th>
          )
        }
        // Default: text input
        return (
          <th
            key={column.key}
            className={`${column.width || ''} px-4 py-2 pb-4 align-middle`}
          >
            <input
              placeholder="Search"
              value={search[column.key] || ''}
              onChange={(e) => onSearchChange(column.key, e.target.value)}
              className="w-full min-w-0 h-8 px-2 py-1 text-xs font-outfit font-normal not-italic  border border-gray-300 rounded-md placeholder:text-xs placeholder:font-outfit placeholder:font-normal placeholder:not-italic placeholder:text-gray-400 text-gray-900 focus:outline-none shadow-none"
            />
          </th>
        )
      })}
    </tr>
  )
}
