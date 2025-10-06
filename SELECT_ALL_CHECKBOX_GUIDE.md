# Select All Checkbox Implementation Guide

## Overview

The `ExpandableDataTable` component now supports a configurable "Select All" checkbox functionality. This feature allows users to select/deselect all rows in a table with a single click, and is particularly useful for bulk operations.

## How to Enable Select All Functionality

### 1. Add the `showSelectAll` prop

To enable the select all checkbox, simply add the `showSelectAll={true}` prop to your `ExpandableDataTable` component:

```tsx
<ExpandableDataTable
  data={paginated}
  columns={tableColumns}
  // ... other props
  showSelectAll={true}
/>
```

### 2. Ensure you have checkbox columns

The select all functionality only works when your table has checkbox columns. Make sure your `tableColumns` array includes a checkbox column:

```tsx
const tableColumns = [
  { key: 'expand', label: '', type: 'expand' as const, width: 'w-12' },
  { key: 'checkbox', label: '', type: 'checkbox' as const, width: 'w-8' },
  // ... other columns
]
```

## When to Use Select All

Use the select all functionality when:

1. **Bulk Operations**: Your page has action buttons that operate on multiple selected rows
2. **Data Management**: Users need to perform operations like approve, reject, or delete multiple items
3. **Export/Download**: Users need to select multiple items for export or download

## Examples

### Example 1: Pending Activities Page (Enabled)

The pending activities page uses select all because it has bulk action buttons:

```tsx
// In src/app/activities/pending/page.tsx
const actionButtons = [
  {
    label: 'Reject',
    onClick: () => console.log('Reject selected rows'),
    disabled: selectedRows.length === 0, // Depends on selection
    variant: 'secondary' as const,
  },
  {
    label: 'Approve',
    onClick: () => console.log('Approve selected rows'),
    disabled: selectedRows.length === 0, // Depends on selection
    variant: 'primary' as const,
  },
]

// Table with select all enabled
<ExpandableDataTable
  // ... other props
  showSelectAll={true}
/>
```

### Example 2: Developers Page (Disabled)

The developers page doesn't use select all because it doesn't have bulk operations:

```tsx
// In src/app/developers/page.tsx
const tableColumns = [
  {
    key: 'name',
    label: 'Name',
    type: 'text' as const,
    // No checkbox column
  },
  // ... other columns
]

// Table without select all (default behavior)
<ExpandableDataTable
  // ... other props
  // showSelectAll prop not needed (defaults to false)
/>
```

## Features

### Indeterminate State

The select all checkbox shows an indeterminate state when some (but not all) rows are selected:

- **Unchecked**: No rows selected
- **Indeterminate**: Some rows selected
- **Checked**: All rows selected

### Automatic State Management

The component automatically manages the select all state based on the current selection:

```tsx
const allSelected = selectedRows.length === data.length && data.length > 0
const toggleAll = () => {
  if (allSelected) {
    onRowSelectionChange([]) // Deselect all
  } else {
    onRowSelectionChange(data.map((_, i) => i)) // Select all
  }
}
```

## Implementation Details

### Checkbox Component Enhancement

The `Checkbox` component has been enhanced to support the `indeterminate` prop:

```tsx
interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
  indeterminate?: boolean // New prop
}
```

### Conditional Rendering

The select all checkbox is only rendered when:
1. `showSelectAll` prop is `true`
2. The column type is `'checkbox'`

```tsx
{column.type === 'checkbox' && showSelectAll ? (
  <Checkbox
    checked={allSelected}
    onChange={toggleAll}
    indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
  />
) : (
  // Regular column header
)}
```

## Best Practices

1. **Only enable when needed**: Don't enable select all if your page doesn't have bulk operations
2. **Clear visual feedback**: Use the indeterminate state to show partial selections
3. **Consistent behavior**: Ensure individual row checkboxes work correctly with select all
4. **Accessibility**: The implementation includes proper ARIA attributes and keyboard navigation

## Migration Guide

If you have existing tables that need select all functionality:

1. Add `showSelectAll={true}` to your `ExpandableDataTable` component
2. Ensure your `tableColumns` includes a checkbox column
3. Test that bulk operations work correctly with the new functionality
4. Update any action buttons to depend on `selectedRows.length`

## Troubleshooting

### Select All Not Appearing

- Check that `showSelectAll={true}` is set
- Verify that your table has a checkbox column (`type: 'checkbox'`)
- Ensure the checkbox column is properly defined in `tableColumns`

### Selection State Issues

- Verify that `selectedRows` and `onRowSelectionChange` are properly passed
- Check that the `useTableState` hook is being used correctly
- Ensure data is properly paginated and indexed 