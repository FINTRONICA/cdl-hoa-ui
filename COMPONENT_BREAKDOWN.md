# Component Breakdown for Pending Activities Page

## Overview

This document outlines the components that can be extracted from the pending activities page for reusability across the application.

## Components Created/Enhanced

### 1. **StatusCard** (Enhanced)

**Location**: `src/components/atoms/StatusCard/StatusCard.tsx`

**Purpose**: Reusable status metric cards with customizable styling

**Features**:

- Support for different variants (`default`, `compact`)
- Customizable colors, borders, and styling
- Dot indicators for status visualization
- Responsive design

**Usage**:

```tsx
<StatusCard
  label="Rejected"
  count={62}
  color="bg-[#FB2C361A]"
  textColor="text-[#FB2C36]"
  dotColor="bg-red-500"
  borderColor="border border-[#FB2C3626]"
  variant="compact"
/>
```

### 2. **ActionButtons** (New)

**Location**: `src/components/molecules/ActionButtons/ActionButtons.tsx`

**Purpose**: Reusable action button group with flexible configuration

**Features**:

- Support for text buttons and icon buttons
- Multiple variants (primary, secondary, danger)
- Disabled state handling
- Customizable styling

**Usage**:

```tsx
const actionButtons = [
  {
    label: 'Reject',
    onClick: () => console.log('Reject'),
    disabled: selectedRows.length === 0,
    variant: 'danger',
  },
  {
    label: 'Download',
    onClick: () => console.log('Download'),
    icon: '/download.svg',
    iconAlt: 'download icon',
  },
]

<ActionButtons buttons={actionButtons} />
```

### 3. **SearchInput** (New)

**Location**: `src/components/atoms/SearchInput/SearchInput.tsx`

**Purpose**: Reusable search input with consistent styling

**Features**:

- Consistent styling across the application
- Placeholder text support
- Disabled state
- Focus states with proper accessibility

**Usage**:

```tsx
<SearchInput
  placeholder="Search"
  value={searchValue}
  onChange={(value) => setSearchValue(value)}
  disabled={false}
/>
```

### 4. **StatusBadge** (New)

**Location**: `src/components/atoms/StatusBadge/StatusBadge.tsx`

**Purpose**: Reusable status badges with dots and colors

**Features**:

- Automatic color mapping for different statuses
- Dot indicators
- Consistent styling across the application
- Support for all status types (Approved, Rejected, Incomplete, In Review)

**Usage**:

```tsx
<StatusBadge status="Approved" />
<StatusBadge status="In Review" />
```

### 5. **TabNavigation** (Enhanced)

**Location**: `src/components/molecules/TabNavigation/TabNavigation.tsx`

**Purpose**: Reusable tab navigation component

**Features**:

- Active tab highlighting
- Hover states
- Consistent styling
- Accessible navigation

**Usage**:

```tsx
const tabs = [
  { id: 'developer', label: 'Developer' },
  { id: 'projects', label: 'Projects' },
]

<TabNavigation
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

### 6. **ExpandableTable** (New)

**Location**: `src/components/organisms/ExpandableTable/ExpandableTable.tsx`

**Purpose**: Complex table component with row expansion, selection, and pagination

**Features**:

- Row selection with checkboxes
- Row expansion with custom content
- Column-based search
- Pagination with configurable rows per page
- Status badge rendering
- Sortable columns
- Responsive design

**Usage**:

```tsx
const columns = [
  { key: 'developer', label: 'Developer', type: 'text', searchable: true },
  { key: 'status', label: 'Status', type: 'status', searchable: true },
]

<ExpandableTable
  columns={columns}
  data={paginatedData}
  searchState={search}
  onSearchChange={handleSearchChange}
  selectedRows={selectedRows}
  onRowSelectionChange={setSelectedRows}
  expandedRows={expandedRows}
  onRowExpansionChange={setExpandedRows}
  currentPage={page}
  totalPages={totalPages}
  totalRows={totalRows}
  rowsPerPage={rowsPerPage}
  startItem={startItem}
  endItem={endItem}
  onPageChange={setPage}
  onRowsPerPageChange={setRowsPerPage}
  statusOptions={statusOptions}
/>
```

## Additional Components That Could Be Extracted

### 7. **Pagination** (Already exists)

**Location**: `src/components/molecules/Pagination/Pagination.tsx`

**Purpose**: Reusable pagination component

### 8. **Checkbox** (Already exists)

**Location**: `src/components/atoms/Checkbox/Checkbox.tsx`

**Purpose**: Reusable checkbox component

### 9. **Typography** (Already exists)

**Location**: `src/components/atoms/Typography/Typography.tsx`

**Purpose**: Consistent text styling

## Benefits of This Breakdown

### 1. **Reusability**

- Components can be used across different pages
- Consistent UI patterns throughout the application
- Reduced code duplication

### 2. **Maintainability**

- Centralized styling and behavior
- Easier to update and fix bugs
- Better testing capabilities

### 3. **Flexibility**

- Components are highly configurable
- Support for different use cases
- Easy to extend with new features

### 4. **Performance**

- Smaller bundle sizes through code splitting
- Optimized rendering with proper memoization
- Better tree shaking

## Implementation Strategy

### Phase 1: Core Components

1. ✅ StatusCard (Enhanced)
2. ✅ ActionButtons (New)
3. ✅ SearchInput (New)
4. ✅ StatusBadge (New)

### Phase 2: Complex Components

1. ✅ TabNavigation (Enhanced)
2. ✅ ExpandableTable (New)

### Phase 3: Integration

1. Update existing pages to use new components
2. Create comprehensive documentation
3. Add unit tests for all components
4. Create Storybook stories for visual testing

## Example Refactored Page

See `src/app/activities/pending/refactored-example.tsx` for a complete example of how the pending activities page can be refactored using these reusable components.

## Migration Guide

### From Original Page to Refactored Components

1. **Replace Status Cards**:

   ```tsx
   // Before
   <div className="grid grid-cols-4 gap-4">
     {statusCards.map((card, i) => (
       <div key={i} className={`${card.color} ${card.borderColor}`}>
         {/* Complex inline styling */}
       </div>
     ))}
   </div>

   // After
   <StatusCards cards={statusCards} />
   ```

2. **Replace Action Buttons**:

   ```tsx
   // Before
   <div className="flex justify-end gap-2">
     <button className="...">Reject</button>
     <button className="...">Approve</button>
     {/* More buttons */}
   </div>

   // After
   <ActionButtons buttons={actionButtons} />
   ```

3. **Replace Table**:

   ```tsx
   // Before
   <table className="...">
     {/* Complex table with inline logic */}
   </table>

   // After
   <ExpandableTable
     columns={columns}
     data={data}
     // ... other props
   />
   ```

## Best Practices

1. **Props Interface**: Always define clear TypeScript interfaces for component props
2. **Default Values**: Provide sensible defaults for optional props
3. **Accessibility**: Include proper ARIA labels and keyboard navigation
4. **Error Handling**: Handle edge cases and provide fallbacks
5. **Documentation**: Include JSDoc comments for complex components
6. **Testing**: Write unit tests for all component logic
7. **Storybook**: Create stories for visual testing and documentation

## Future Enhancements

1. **Theme Support**: Add support for different themes (light/dark mode)
2. **Internationalization**: Add i18n support for labels and text
3. **Animation**: Add smooth transitions and animations
4. **Virtualization**: Add virtual scrolling for large datasets
5. **Keyboard Navigation**: Enhanced keyboard navigation support
6. **Drag and Drop**: Add drag and drop functionality for table rows
7. **Export Features**: Add CSV/Excel export functionality
8. **Advanced Filtering**: Add advanced filtering and sorting options
