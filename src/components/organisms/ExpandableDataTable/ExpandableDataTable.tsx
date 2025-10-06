import React from "react";
import { Checkbox } from "../../atoms/Checkbox";
import { StatusBadge } from "../../atoms/StatusBadge";
import { TableSearchRow } from "../../molecules/TableSearchRow";
import { ActionDropdown } from "../../molecules/ActionDropdown";

import { MultiSelect } from "../../atoms/MultiSelect";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { formatDateForDisplay } from "../../../utils";

interface Column {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  searchable?: boolean;
  type?:
    | "text"
    | "status"
    | "date"
    | "actions"
    | "checkbox"
    | "expand"
    | "user"
    | "select"
    | "custom"
    | "comment";
  options?: { value: string; label: string }[];
}

interface ExpandableDataTableProps<T = Record<string, unknown>> {
  data: T[];
  columns: Column[];
  searchState: Record<string, string>;
  onSearchChange: (field: string, value: string) => void;
  paginationState: {
    page: number;
    rowsPerPage: number;
    totalRows: number;
    totalPages: number;
    startItem: number;
    endItem: number;
  };
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  selectedRows: number[];
  onRowSelectionChange: (selectedRows: number[]) => void;
  expandedRows: number[];
  onRowExpansionChange: (expandedRows: number[]) => void;
  renderExpandedContent?: (row: T, index: number) => React.ReactNode;
  statusOptions?: string[];
  className?: string;
  onDataChange?: (
    rowIndex: number,
    field: string,
    value: string | string[]
  ) => void;
  renderCustomCell?: (column: string, value: unknown) => React.ReactNode;
  onRowDelete?: (row: T, index: number) => void;
  onRowView?: (row: T, index: number) => void;
  showDeleteAction?: boolean;
  showViewAction?: boolean;
  onRowClick?: (row: T, index: number) => void;
  showAllSearch?: boolean;
}

export const ExpandableDataTable = <T extends Record<string, unknown>>({
  data,
  columns,
  searchState,
  onSearchChange,
  paginationState,
  onPageChange,
  onRowsPerPageChange,
  selectedRows,
  onRowSelectionChange,
  expandedRows,
  onRowExpansionChange,
  renderExpandedContent,
  statusOptions = [],
  className = "",
  onDataChange,
  renderCustomCell,
  onRowDelete,
  onRowView,
  showDeleteAction = true,
  showViewAction = true,
  onRowClick,
  showAllSearch,
}: ExpandableDataTableProps<T>) => {
  const { page, rowsPerPage, totalRows, totalPages, startItem, endItem } =
    paginationState;

  // Selection logic

  const toggleRow = (index: number) => {
    const newSelected = selectedRows.includes(index)
      ? selectedRows.filter((i) => i !== index)
      : [...selectedRows, index];
    onRowSelectionChange(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === data.length) {
      onRowSelectionChange([]);
    } else {
      onRowSelectionChange(data.map((_, index) => index));
    }
  };

  const toggleExpandedRow = (index: number) => {
    const newExpanded = expandedRows.includes(index)
      ? expandedRows.filter((i) => i !== index)
      : [...expandedRows, index];
    onRowExpansionChange(newExpanded);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className={`${className} flex flex-col h-full`}>
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] table-fixed">
            <thead className="sticky top-0 z-20 ">
              <tr className="border-b border-gray-200">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`${column.width || "w-auto"} text-xs font-semibold px-4 py-3.5 text-[#1E2939] ${column.type === "checkbox" ? "border-r border-[#CAD5E2] text-center" : "text-left"}`}
                  >
                    {column.type === "checkbox" ? (
                      <div className="flex items-center justify-center w-4 h-4">
                        <Checkbox
                          checked={
                            selectedRows.length === data.length &&
                            data.length > 0
                          }
                          onChange={toggleSelectAll}
                          className="w-4 h-4"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center  gap-1 font-sans font-normal leading-[16px] tracking-normal">
                        {column.label}
                        {column.sortable && (
                          <img src="/arrow-down.svg" alt="sort icon" />
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
              {/* Search Row */}
              {showAllSearch && (
                <TableSearchRow
                  columns={columns}
                  search={searchState}
                  onSearchChange={onSearchChange}
                  statusOptions={statusOptions}
                />
              )} 
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {data.map((row, index) => (
                <React.Fragment key={index}>
                  <tr
                    className={`transition-colors min-h-[64px] ${
                      selectedRows.includes(index)
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : ""
                    } ${onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}`}
                    onClick={
                      onRowClick ? () => onRowClick(row, index) : undefined
                    }
                  >
                    {columns.map((column) => {
                      if (column.type === "expand") {
                        return (
                          <td
                            key={column.key}
                            className="w-8 px-2.5 py-1.5 whitespace-nowrap justify-center items-center"
                          >
                            <button
                              className="p-1 transition-colors rounded hover:bg-gray-100"
                              onClick={() => toggleExpandedRow(index)}
                            >
                              {expandedRows.includes(index) ? (
                                <img
                                  src="/chevron-down.svg"
                                  alt="chevron-down icon"
                                />
                              ) : (
                                <img
                                  src="/chevron-right.svg"
                                  alt="chevron-right icon"
                                />
                              )}
                            </button>
                          </td>
                        );
                      }

                      if (column.type === "checkbox") {
                        return (
                          <td
                            key={column.key}
                            className="whitespace-nowrap text-center border-r border-[#CAD5E2]"
                          >
                            <div className="flex items-center justify-center">
                              <Checkbox
                                checked={selectedRows.includes(index)}
                                onChange={() => toggleRow(index)}
                                className="w-4 h-4"
                              />
                            </div>
                          </td>
                        );
                      }

                      if (column.type === "status") {
                        const status = String(
                          (row as Record<string, unknown>)[column.key] || ""
                        );
                        return (
                          <td
                            key={column.key}
                            className="items-center justify-center p-4 whitespace-nowrap"
                          >
                            <StatusBadge status={status} />
                          </td>
                        );
                      }

                      if (column.type === "actions") {
                        return (
                          <td
                            key={column.key}
                            className="flex items-center justify-center p-4 text-right whitespace-nowrap"
                          >
                            <ActionDropdown
                              onDelete={
                                onRowDelete
                                  ? () => onRowDelete(row, index)
                                  : undefined
                              }
                              onView={
                                onRowView
                                  ? () => onRowView(row, index)
                                  : undefined
                              }
                              showDelete={showDeleteAction}
                              showView={showViewAction}
                            />
                          </td>
                        );
                      }

                      if (column.type === "user") {
                        const userName = String(
                          (row as Record<string, unknown>)[column.key] || ""
                        );
                        const initials = userName
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .toUpperCase();
                        return (
                          <td
                            key={column.key}
                            className="p-4 whitespace-nowrap text-sm font-normal not-italic text-[#1E2939] font-sans leading-4"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 text-xs font-medium text-white bg-blue-500 rounded-full">
                                {initials}
                              </div>
                              <span>{userName}</span>
                            </div>
                          </td>
                        );
                      }

                      if (column.type === "select") {
                        const currentValue = (row as Record<string, unknown>)[
                          column.key
                        ];
                        const valueArray = Array.isArray(currentValue)
                          ? currentValue
                          : [String(currentValue || "")];
                        const options = column.options || [];
                        return (
                          <td
                            key={column.key}
                            className="p-4 whitespace-nowrap text-sm font-normal not-italic text-[#1E2939] font-sans leading-4"
                          >
                            <MultiSelect
                              value={valueArray}
                              onChange={(value) => {
                                if (onDataChange) {
                                  onDataChange(index, column.key, value);
                                }
                              }}
                              options={options}
                              className="w-full h-8 min-w-0 text-xs not-italic font-normal font-outfit"
                            />
                          </td>
                        );
                      }

                      // Handle custom cell rendering
                      if (column.type === "custom" && renderCustomCell) {
                        const value = (row as Record<string, unknown>)[
                          column.key
                        ];
                        return (
                          <td
                            key={column.key}
                            className="p-4 whitespace-nowrap text-sm font-normal not-italic text-[#1E2939] font-sans leading-4"
                          >
                            {renderCustomCell(column.key, value)}
                          </td>
                        );
                      }

                      // Handle comment cells as clickable links
                      if (column.type === "comment") {
                        const commentValue = String(
                          (row as Record<string, unknown>)[column.key] || ""
                        );
                        return (
                          <td
                            key={column.key}
                            className="p-4 whitespace-nowrap text-sm font-normal not-italic text-[#1E2939] font-sans leading-4"
                          >
                            <button
                              className="font-medium text-blue-600 underline cursor-pointer hover:text-blue-800"
                              onClick={() => {
                                // This will be handled by the parent component
                                if (renderCustomCell) {
                                  renderCustomCell(column.key, {
                                    comment: commentValue,
                                    row,
                                  });
                                }
                              }}
                            >
                              {commentValue}
                            </button>
                          </td>
                        );
                      }

                      // Handle date columns (createdDate, updatedDate, approvedDate)
                      if (
                        column.key === "createdDate" ||
                        column.key === "updatedDate" ||
                        column.key === "approvedDate"
                      ) {
                        const dateValue = String(
                          (row as Record<string, unknown>)[column.key] || ""
                        );
                        const { date, time } = formatDateForDisplay(dateValue);
                        return (
                          <td
                            key={column.key}
                            className="p-4 text-sm font-normal not-italic text-[#1E2939] font-sans leading-4"
                          >
                            <div className="flex flex-col">
                              <span className="font-sans font-normal text-[14px] leading-[16px] align-middle tracking-[0] text-[#1E2939]">
                                {date}
                              </span>
                              <span className="font-sans font-normal text-[14px] leading-[16px] align-middle tracking-[0] text-[#1E2939]">
                                {time}
                              </span>
                            </div>
                          </td>
                        );
                      }

                      return (
                        <td
                          key={column.key}
                          className="p-4 whitespace-nowrap text-sm font-normal not-italic text-[#1E2939] font-sans leading-4"
                        >
                          {String(
                            (row as Record<string, unknown>)[column.key] || ""
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  {expandedRows.includes(index) && renderExpandedContent && (
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <td colSpan={columns.length} className="px-6 py-6">
                        {renderExpandedContent(row, index)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pl-6 pr-4 pt-3.5 bg-[#FFFFFFBF] border-t border-t-[#E2E8F0] mt-auto">
        <div className="flex items-center gap-6">
          <span className="text-sm text-[#4A5565] font-sans font-normal leading-4 align-bottom">
            {startItem}-{endItem} of {totalRows} row(s)
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none [&>option]:text-gray-900 shadow-sm"
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            >
              {[10, 20, 50, 100].map((opt) => (
                <option key={opt} value={opt} className="text-gray-900">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(1)}
            className="p-2 text-gray-400 transition-colors rounded-lg hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100"
            title="First page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            disabled={page === 1}
            onClick={() => onPageChange(Math.max(1, page - 1))}
            className="p-2 text-gray-400 transition-colors rounded-lg hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {generatePageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md font-sans leading-3.5 transition-colors ${
                page === pageNum
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            className="p-2 text-gray-400 transition-colors rounded-lg hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(totalPages)}
            className="p-2 text-gray-400 transition-colors rounded-lg hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100"
            title="Last page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
