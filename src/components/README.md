# Component Library - Atomic Design

This component library follows the Atomic Design methodology, organizing components into atoms, molecules, organisms, and templates.

## Structure

### Atoms

Basic UI building blocks that can't be broken down further:

- **Avatar**: User profile images with fallback initials
- **Badge**: Status indicators with different variants
- **Button**: Primary and secondary action buttons
- **Checkbox**: Form input for boolean values
- **Icon**: SVG icon wrapper
- **IconButton**: Button with icon only
- **Input**: Text input fields
- **Select**: Dropdown selection component
- **Spinner**: Loading indicator
- **StatusCard**: Metric cards with counts and colors
- **Typography**: Text components with consistent styling

### Molecules

Simple combinations of atoms that form a functional unit:

- **ActionButtons**: Group of action buttons (Reject, Approve, Download, More)
- **MetricCard**: Card displaying metrics with trends
- **Pagination**: Page navigation component
- **SearchBar**: Search input with icon
- **StatusCards**: Grid of status metric cards
- **TabNavigation**: Tab-based navigation
- **TablePagination**: Table-specific pagination
- **TableRow**: Individual table row component
- **TableSearchRow**: Search inputs for table columns
- **UserProfile**: User information display

### Organisms

Complex UI sections composed of molecules and atoms:

- **ActivitiesTable**: Complete table with search, pagination, and row expansion
- **DashboardCharts**: Chart components for dashboard
- **DashboardStats**: Statistics display for dashboard
- **DataTable**: Reusable data table component
- **Header**: Page header with actions and filters
- **Sidebar**: Navigation sidebar

### Templates

Page-level layouts that combine organisms:

- **DashboardLayout**: Standard dashboard page layout
- **TableLayout**: Table-focused page layout

## Best Practices

### 1. Component Design

- Each component should have a single responsibility
- Use TypeScript interfaces for all props
- Provide default values for optional props
- Include proper accessibility attributes

### 2. Styling

- Use Tailwind CSS utility classes
- Follow the design system (colors, spacing, typography)
- Maintain consistent hover and focus states
- Use responsive design patterns

### 3. State Management

- Keep components as stateless as possible
- Use custom hooks for complex state logic
- Lift state up when needed for parent components

### 4. Reusability

- Make components configurable through props
- Avoid hardcoding values
- Use composition over inheritance
- Export components with proper TypeScript types

### 5. Performance

- Use React.memo for expensive components
- Implement proper key props for lists
- Avoid unnecessary re-renders
- Use useMemo and useCallback when appropriate

## Usage Examples

### Basic Atom Usage

```tsx
import { Button } from '@/components/atoms/Button'

;<Button variant="primary" onClick={handleClick}>
  Click me
</Button>
```

### Molecule Usage

```tsx
import { StatusCards } from '@/components/molecules/StatusCards'

;<StatusCards cards={statusData} />
```

### Organism Usage

```tsx
import { ActivitiesTable } from '@/components/organisms/ActivitiesTable'

;<ActivitiesTable
  data={activities}
  search={searchState}
  onSearchChange={handleSearch}
  // ... other props
/>
```

## Custom Hooks

### useActivitiesTable

Manages the state and logic for activities table:

- Search functionality
- Pagination
- Row selection
- Row expansion
- Filtering

## Data Structure

### Activity Data

```typescript
interface ActivityData {
  developer: string
  maker: string
  recentActor: string
  comment: string
  createdDate: string
  updatedDate: string
  status: string
  activityId: string
  activityType: string
  projectName: string
  priority: string
  dueDate: string
  documents: Array<{ name: string; status: string; color: string }>
  recentActivity: Array<{ date: string; action: string; color: string }>
}
```

## File Organization

```
src/
├── components/
│   ├── atoms/           # Basic UI components
│   ├── molecules/       # Component combinations
│   ├── organisms/       # Complex UI sections
│   ├── templates/       # Page layouts
│   └── index.ts         # Re-exports
├── hooks/               # Custom React hooks
├── data/                # Static data and constants
└── types/               # TypeScript type definitions
```

## Contributing

When adding new components:

1. Follow the atomic design hierarchy
2. Create proper TypeScript interfaces
3. Add to the appropriate index.ts file
4. Include proper documentation
5. Follow the existing naming conventions
6. Test the component thoroughly
