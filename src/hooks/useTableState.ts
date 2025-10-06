import { useState, useMemo, useEffect, useCallback } from 'react'

interface TableState<T> {
  search: Record<string, string>
  page: number
  rowsPerPage: number
  selectedRows: number[]
  expandedRows: number[]
}

interface UseTableStateProps<T> {
  data: T[]
  searchFields: string[]
  initialRowsPerPage?: number
}

export const useTableState = <T>({
  data,
  searchFields,
  initialRowsPerPage = 20,
}: UseTableStateProps<T>) => {
  const [search, setSearch] = useState<Record<string, string>>(
    () => Object.fromEntries(searchFields.map(field => [field, '']))
  )
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage)
  const [page, setPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  // Memoize search fields to prevent unnecessary re-renders
  const memoizedSearchFields = useMemo(() => searchFields, [searchFields])

  // Optimized filtered data with better memoization
  const filtered = useMemo(() => {
    // Early return if no search values
    const hasSearchValues = Object.values(search).some(val => val.trim() !== '')
    if (!hasSearchValues) return data

    return data.filter((row: any) =>
      memoizedSearchFields.every((field) => {
        const searchVal = search[field]?.toLowerCase().trim() || ''
        if (!searchVal) return true
        const value = String(row[field] ?? '').toLowerCase()
        return value.includes(searchVal)
      })
    )
  }, [data, search, memoizedSearchFields])

  // Memoize pagination calculations
  const paginationData = useMemo(() => {
    const totalRows = filtered.length
    const totalPages = Math.ceil(totalRows / rowsPerPage)
    const startItem = totalRows > 0 ? (page - 1) * rowsPerPage + 1 : 0
    const endItem = Math.min(page * rowsPerPage, totalRows)
    const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage)

    return {
      totalRows,
      totalPages,
      startItem,
      endItem,
      paginated,
    }
  }, [filtered, page, rowsPerPage])

  // Reset to page 1 if current page is beyond available data
  useEffect(() => {
    if (page > paginationData.totalPages && paginationData.totalPages > 0) {
      setPage(1)
    }
  }, [page, paginationData.totalPages])

  // Optimized handlers with useCallback
  const handleSearchChange = useCallback((field: string, value: string) => {
    setSearch((prev) => ({ ...prev, [field]: value }))
    setPage(1) // Reset to first page when searching
  }, [])

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage)
    setPage(1) // Reset to first page when changing rows per page
  }, [])

  const handleRowSelectionChange = useCallback((newSelectedRows: number[]) => {
    setSelectedRows(newSelectedRows)
  }, [])

  const handleRowExpansionChange = useCallback((newExpandedRows: number[]) => {
    setExpandedRows(newExpandedRows)
  }, [])

  return {
    // State
    search,
    filtered: paginationData.paginated, // Return only paginated data
    paginated: paginationData.paginated,
    totalRows: paginationData.totalRows,
    totalPages: paginationData.totalPages,
    startItem: paginationData.startItem,
    endItem: paginationData.endItem,
    page,
    rowsPerPage,
    selectedRows,
    expandedRows,
    
    // Handlers
    handleSearchChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleRowSelectionChange,
    handleRowExpansionChange,
  }
} 