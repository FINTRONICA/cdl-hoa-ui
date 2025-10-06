# PageActionButtons Component

## Overview

The `PageActionButtons` component is a reusable component that provides consistent action buttons across entity pages (Projects, Investors, Developers). It handles the common pattern of having Download Template, Upload Details, and Add New buttons.

## Features

- **Consistent Styling**: Uniform button appearance across all entity pages
- **Automatic Navigation**: Handles routing to entity-specific form pages
- **Customizable Actions**: Optional custom handlers for download and upload actions
- **Type Safety**: TypeScript support with proper entity type definitions
- **Hover Effects**: Enhanced user experience with hover states

## Usage

### Basic Usage

```tsx
import { PageActionButtons } from '@/components/molecules/PageActionButtons'

// In your page component
<PageActionButtons entityType="investor" />
```

### With Custom Handlers

```tsx
import { PageActionButtons } from '@/components/molecules/PageActionButtons'

const InvestorsPage = () => {
  const handleDownloadTemplate = () => {
    // Custom download logic
    downloadInvestorTemplate()
  }

  const handleUploadDetails = () => {
    // Custom upload logic
    uploadInvestorDetails()
  }

  return (
    <PageActionButtons 
      entityType="investor"
      onDownloadTemplate={handleDownloadTemplate}
      onUploadDetails={handleUploadDetails}
    />
  )
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `entityType` | `'project' \| 'investor' \| 'developer'` | Yes | The type of entity for this page |
| `onDownloadTemplate` | `() => void` | No | Custom handler for download template action |
| `onUploadDetails` | `() => void` | No | Custom handler for upload details action |
| `className` | `string` | No | Additional CSS classes |

## Entity Types

The component supports three entity types, each with their own configuration:

- **project**: Routes to `/projects/new`, shows "Add New Project"
- **investor**: Routes to `/investors/new`, shows "Add New Investor"  
- **developer**: Routes to `/developers/new`, shows "Add New Developer"

## Default Behavior

If no custom handlers are provided, the component will:

- **Download Template**: Log a message to console
- **Upload Details**: Log a message to console
- **Add New**: Navigate to the entity-specific form page

## Styling

The component uses consistent styling that matches the design system:

- **Download Template**: Blue text with hover background
- **Upload Details**: Light blue background with blue text
- **Add New**: Blue background with white text

All buttons include proper hover states and transitions for enhanced UX.

## Benefits

1. **DRY Principle**: Eliminates code duplication across pages
2. **Consistency**: Ensures uniform appearance and behavior
3. **Maintainability**: Changes only need to be made in one place
4. **Type Safety**: Prevents errors with entity type configuration
5. **Flexibility**: Allows custom handlers when needed 