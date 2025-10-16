import { useState, useMemo, useCallback } from 'react'

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
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
  } | null>(null)


  const memoizedSearchFields = useMemo(() => searchFields, [searchFields])

  const filtered = useMemo(() => {
  
    const hasSearchValues = Object.values(search).some(val => val.trim() !== '')
    let filteredData = data

    if (hasSearchValues) {
      
      filteredData = data.filter((row: unknown) => {
        return memoizedSearchFields.every((field) => {
          const searchVal = search[field]?.toLowerCase().trim() || ''
          if (!searchVal) return true
          const value = String((row as Record<string, unknown>)[field] ?? '').toLowerCase()
          return value.includes(searchVal)
        })
      })
    }

 
    if (sortConfig) {
      filteredData = [...filteredData].sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[sortConfig.key]
        const bVal = (b as Record<string, unknown>)[sortConfig.key]
        
        if (aVal === bVal) return 0
        
 
        const aStr = String(aVal ?? '')
        const bStr = String(bVal ?? '')
        const comparison = aStr < bStr ? -1 : 1
        return sortConfig.direction === 'asc' ? comparison : -comparison
      })
    }

    return filteredData
  }, [data, search, sortConfig, memoizedSearchFields])


  const pagination = useMemo(() => {
    const totalRows = filtered.length
    const totalPages = Math.ceil(totalRows / rowsPerPage)
    const startIndex = (page - 1) * rowsPerPage
    const endIndex = Math.min(startIndex + rowsPerPage, totalRows)
    
    return {
      totalRows,
      totalPages,
      startIndex,
      endIndex,
    }
  }, [filtered.length, rowsPerPage, page])

  
  const paginated = useMemo(() => {
    const { startIndex, endIndex } = pagination
    return filtered.slice(startIndex, endIndex)
  }, [filtered, pagination])


  const handleSearchChange = useCallback((field: string, value: string) => {
    setSearch(prev => {
      const newSearch = { ...prev, [field]: value }
    
      setPage(1)
      return newSearch
    })
  }, [])

 
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])


  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage)
    setPage(1) 
  }, [])


  const handleRowSelectionChange = useCallback((selectedRows: number[]) => {
    setSelectedRows(selectedRows)
  }, [])

  
  const handleRowExpansionChange = useCallback((expandedRows: number[]) => {
    setExpandedRows(expandedRows)
  }, [])


  const handleSort = useCallback((key: string) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return {
          key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        }
      } else {
        return { key, direction: 'asc' }
      }
    })
  }, [])

  return {
 
    filtered,
    paginated,
    

    totalRows: pagination.totalRows,
    totalPages: pagination.totalPages,
    startItem: pagination.startIndex + 1,
    endItem: pagination.endIndex,
    page,
    rowsPerPage,
    
   
    search,
    handleSearchChange,

    selectedRows,
    expandedRows,
    handleRowSelectionChange,
    handleRowExpansionChange,

    sortConfig,
    handleSort,
    
 
    handlePageChange,
    handleRowsPerPageChange,
  }
} 