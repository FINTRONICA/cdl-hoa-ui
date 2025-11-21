# Budget Items CRUD Operations - Fix Summary

## Problem Statement

After successfully creating a budget item via POST API, the data was not displaying in the table on Step2. The GET API was not being called automatically after POST operations, and the table remained empty even though items were being created successfully.

## Root Causes Identified

1. **Query Not Enabled**: The React Query hook was disabled when `budgetCategoryId` was not available in form context
2. **Cache Invalidation Mismatch**: Query keys didn't match exactly between query and mutation invalidation
3. **Missing CategoryId**: `budgetCategoryId` might not be set in form when Step2 loads
4. **No Fallback Mechanism**: If React Query refetch failed, there was no direct API call fallback
5. **Query Key Variations**: Query keys with/without `budgetId` weren't being invalidated properly

## Solutions Implemented

### 1. Created `useBudgetItems` Hook (React Query Pattern)

**File**: `src/hooks/budget/useBudgetItems.ts`

**Pattern**: Matches `useBuildPartnerContacts` from DeveloperStepper

```typescript
// ✅ FIX: Hook structure matching DeveloperStepper pattern
export function useBudgetItems(
  budgetCategoryId?: number | string | null,
  budgetId?: number | string | null,
  page = 0,
  size = 20
) {
  const categoryId = budgetCategoryId 
    ? (typeof budgetCategoryId === 'string' ? parseInt(budgetCategoryId) : budgetCategoryId)
    : null
  
  const query = useQuery({
    queryKey: [
      BUDGET_ITEMS_QUERY_KEY,
      'byCategory',
      categoryId,
      effectiveBudgetId,
      { page: pagination.page, size: pagination.size },
    ],
    queryFn: () => budgetItemsService.getBudgetItemsByBudgetCategoryId(...),
    enabled: !!categoryId && !isNaN(categoryId) && categoryId > 0,
    staleTime: 0, // Always refetch to get latest data
    refetchOnMount: true,
  })
  
  return { ...query, refetch: refetchBudgetItems }
}
```

**Key Features**:
- Automatic data fetching when `budgetCategoryId` is available
- Pagination support
- Returns `refetch` function for manual refresh
- Proper TypeScript types

---

### 2. Enhanced Mutation Cache Invalidation

**File**: `src/hooks/budget/useBudgetItems.ts`

**Problem**: Cache invalidation wasn't matching query keys exactly

**Solution**: Invalidate all possible query key variations

```typescript
// ✅ FIX: Comprehensive cache invalidation
onSuccess: async (data, variables) => {
  const effectiveCategoryId = data.budgetCategoryDTO?.id || variables.budgetCategoryDTO?.id
  const effectiveBudgetId = data.budgetDTO?.id || variables.budgetDTO?.id
  
  // Invalidate all queries that start with BUDGET_ITEMS_QUERY_KEY
  await queryClient.invalidateQueries({ 
    queryKey: [BUDGET_ITEMS_QUERY_KEY],
    exact: false // Match all variations
  })
  
  // Invalidate specific query keys (with and without budgetId)
  if (effectiveCategoryId) {
    if (effectiveBudgetId) {
      await queryClient.invalidateQueries({ 
        queryKey: [BUDGET_ITEMS_QUERY_KEY, 'byCategory', effectiveCategoryId, effectiveBudgetId],
        exact: false
      })
    }
    // Also invalidate without budgetId
    await queryClient.invalidateQueries({ 
      queryKey: [BUDGET_ITEMS_QUERY_KEY, 'byCategory', effectiveCategoryId, undefined],
      exact: false
    })
  }
  
  // ✅ CRITICAL: Force refetch even inactive queries
  await queryClient.refetchQueries({ 
    queryKey: [BUDGET_ITEMS_QUERY_KEY, 'byCategory', effectiveCategoryId],
    exact: false,
    type: 'all' // Refetch ALL queries including inactive ones
  })
}
```

**Why This Works**:
- `exact: false` matches all query key variations
- `type: 'all'` refetches even disabled queries
- Uses categoryId from response (more reliable than variables)

---

### 3. CategoryId Fallback Mechanism

**File**: `src/components/organisms/BudgetStepper/ManagementFirmBudget/steps/Step2.tsx`

**Problem**: `budgetCategoryId` might not be in form context when Step2 loads

**Solution**: Track `lastKnownCategoryId` from API responses

```typescript
// ✅ FIX: Fallback categoryId tracking
const [lastKnownCategoryId, setLastKnownCategoryId] = useState<number | null>(null)

// Use form categoryId or fallback to last known
const effectiveCategoryId = budgetCategoryId || lastKnownCategoryId

// Extract categoryId from API response and store it
const items: BudgetItemResponse[] = useMemo(() => {
  if (apiBudgetItemsResponse?.content && apiBudgetItemsResponse.content.length > 0) {
    const firstItem = apiBudgetItemsResponse.content[0]
    if (firstItem?.budgetCategoryDTO?.id) {
      const categoryIdFromItem = firstItem.budgetCategoryDTO.id
      setLastKnownCategoryId(categoryIdFromItem)
      // Also update form if not set
      if (!budgetCategoryId) {
        setValue('budgetCategoryId', categoryIdFromItem.toString())
      }
    }
    return apiBudgetItemsResponse.content
  }
  return watch('budgetItems') || []
}, [apiBudgetItemsResponse, setValue, watch, budgetCategoryId, lastKnownCategoryId])
```

**Why This Works**:
- If form doesn't have categoryId, we use the one from API response
- Automatically updates form with categoryId when found
- Ensures query is always enabled when we have a valid categoryId

---

### 4. Extract CategoryId from POST Response

**File**: `src/components/organisms/BudgetStepper/ManagementFirmBudget/steps/Step2.tsx`

**Problem**: CategoryId might not be in form when POST completes

**Solution**: Extract from POST response and update form

```typescript
// ✅ FIX: Extract categoryId from POST response
const handleBudgetItemAdded = async (newItem: BudgetItemResponse) => {
  // Get categoryId from response (most reliable source)
  const responseCategoryId = newItem.budgetCategoryDTO?.id // e.g., 158
  
  // Update lastKnownCategoryId and form if we got categoryId from response
  if (responseCategoryId) {
    setLastKnownCategoryId(responseCategoryId)
    if (!budgetCategoryId || budgetCategoryId.toString() !== responseCategoryId.toString()) {
      setValue('budgetCategoryId', responseCategoryId.toString())
    }
  }
  
  const categoryIdToUse = responseCategoryId || budgetCategoryId || lastKnownCategoryId
  
  // Now we can refetch with the correct categoryId
  if (categoryIdToUse) {
    await refetchBudgetItems()
  }
}
```

**Example Flow**:
1. POST creates item with `budgetCategoryDTO.id: 158`
2. Extract `158` from response
3. Set in form: `setValue('budgetCategoryId', '158')`
4. Set in state: `setLastKnownCategoryId(158)`
5. Query becomes enabled and refetches data

---

### 5. Direct API Call Fallback

**File**: `src/components/organisms/BudgetStepper/ManagementFirmBudget/steps/Step2.tsx`

**Problem**: React Query refetch might fail if query is disabled

**Solution**: Direct API call as fallback

```typescript
// ✅ FIX: Direct API call fallback
if (categoryIdToUse) {
  try {
    // First try React Query refetch
    const result = await refetchBudgetItems()
    
    // If refetch didn't work, try direct API call
    if (!result.data || !result.data.content || result.data.content.length === 0) {
      console.log('[Step2] ⚠️ React Query refetch returned empty, trying direct API call...')
      
      // Direct API call as fallback
      const categoryIdNum = typeof categoryIdToUse === 'string' 
        ? parseInt(categoryIdToUse) 
        : categoryIdToUse
      const directResult = await budgetItemsService.getBudgetItemsByBudgetCategoryId(
        categoryIdNum,
        0,
        1000,
        effectiveBudgetId || undefined
      )
      
      if (directResult.content && directResult.content.length > 0) {
        // Update form with direct API result
        setValue('budgetItems', directResult.content)
      }
    }
  } catch (error) {
    // Fallback: add item to local state
    const existing = items || []
    const updatedItems = [...existing, newItem]
    setValue('budgetItems', updatedItems)
  }
}
```

**Why This Works**:
- Bypasses React Query if it's disabled
- Directly calls the service
- Updates form state immediately
- Ensures data is always displayed

---

### 6. Fixed Service Method for GET_BY_ID

**File**: `src/services/api/budgetApi/budgetItemsService.ts`

**Problem**: GET_BY_ID endpoint uses query parameters, might return array/paginated response

**Solution**: Handle all response formats

```typescript
// ✅ FIX: Handle different response formats
async getBudgetItemsById(id: number): Promise<BudgetItemResponse> {
  const url = buildApiUrl(API_ENDPOINTS.BUDGET_ITEM.GET_BY_ID(id.toString()))
  
  // Endpoint might return: single object, array, or paginated response
  const data = await apiClient.get<BudgetItemResponse | BudgetItemResponse[] | PaginatedResponse<BudgetItemResponse>>(url)
  
  // Handle all formats
  if (Array.isArray(data)) {
    return data[0] // Get first item from array
  } else if (data && typeof data === 'object' && 'content' in data) {
    return (data as PaginatedResponse<BudgetItemResponse>).content[0] // Get first from paginated
  } else {
    return data as BudgetItemResponse // Single object
  }
}
```

---

## Complete Data Flow

### Before Fix (Broken Flow)
```
POST /budget-item → ✅ Success (200 OK)
  ↓
❌ GET API not called
❌ Query disabled (no categoryId)
❌ Table shows empty
```

### After Fix (Working Flow)
```
POST /budget-item → ✅ Success (200 OK)
  ↓
Extract categoryId from response (158)
  ↓
Update form: setValue('budgetCategoryId', '158')
Update state: setLastKnownCategoryId(158)
  ↓
Mutation invalidates cache
  ↓
Force refetch queries (type: 'all')
  ↓
GET /budget-item?budgetCategoryDTO.id.equals=158
  ↓
✅ Table displays new item
```

---

## Code Structure Comparison

### DeveloperStepper Pattern (Reference)
```
Labels → useBuildPartnerLabelsWithCache
Service → buildPartnerService
Hook → useBuildPartnerContacts (React Query)
Component → Step2 uses hook
Mutations → useSaveBuildPartnerContact (invalidates cache)
```

### Budget Management Firm (Fixed to Match)
```
Labels → useBudgetManagementFirmLabelsApi
Service → budgetItemsService (matches buildPartnerService pattern)
Hook → useBudgetItems (matches useBuildPartnerContacts pattern)
Component → Step2 uses hook
Mutations → useCreateBudgetItem (invalidates cache)
```

---

## Key Files Modified

1. **`src/hooks/budget/useBudgetItems.ts`** (NEW)
   - Created React Query hooks for budget items
   - Matches `useBuildPartnerContacts` pattern
   - Comprehensive cache invalidation

2. **`src/services/api/budgetApi/budgetItemsService.ts`**
   - Fixed `getBudgetItemsById` to handle all response formats
   - Matches `buildPartnerService` API call pattern
   - Proper error handling

3. **`src/components/organisms/BudgetStepper/ManagementFirmBudget/steps/Step2.tsx`**
   - Uses `useBudgetItems` hook instead of manual API calls
   - Added `lastKnownCategoryId` fallback
   - Direct API call fallback mechanism
   - Extracts categoryId from POST response

4. **`src/components/organisms/RightSlidePanel/RightSlideBudgetItemPanel.tsx`**
   - Uses `useCreateBudgetItem` and `useUpdateBudgetItem` mutations
   - Mutations handle cache invalidation automatically

---

## Testing Checklist

✅ **CREATE (POST)**
- [x] Create budget item via panel
- [x] POST API called successfully
- [x] CategoryId extracted from response
- [x] Form updated with categoryId
- [x] GET API called automatically
- [x] Table displays new item

✅ **READ (GET)**
- [x] Query enabled when categoryId available
- [x] Data fetched on component mount
- [x] Data fetched when categoryId changes
- [x] Pagination works correctly

✅ **UPDATE (PUT)**
- [x] Update budget item via panel
- [x] PUT API called successfully
- [x] Cache invalidated
- [x] GET API called automatically
- [x] Table displays updated item

✅ **DELETE**
- [x] Delete budget item via confirmation
- [x] DELETE API called successfully
- [x] Cache invalidated
- [x] GET API called automatically
- [x] Item removed from table

---

## Debugging Tips

### Check Console Logs
All operations have comprehensive logging:
- `[useBudgetItems]` - Hook state
- `[Step2]` - Component state
- `[useCreateBudgetItem]` - Mutation state
- `[BudgetItemsService]` - API calls

### Verify Query State
```typescript
console.log('categoryId:', categoryId)
console.log('enabled:', !!categoryId && !isNaN(categoryId) && categoryId > 0)
console.log('hasData:', !!apiBudgetItemsResponse)
console.log('itemsCount:', apiBudgetItemsResponse?.content?.length || 0)
```

### Verify Cache Invalidation
```typescript
// Check React Query DevTools
// Query should be invalidated and refetched after POST
```

---

## Summary

The fix ensures that:
1. ✅ CategoryId is always available (from form, response, or state)
2. ✅ Query is enabled when categoryId exists
3. ✅ Cache is properly invalidated after mutations
4. ✅ Multiple fallback mechanisms ensure data is fetched
5. ✅ Code structure matches DeveloperStepper pattern
6. ✅ All CRUD operations work correctly with automatic data refresh

The table will now display data immediately after POST operations, and all CRUD operations work seamlessly with automatic data refresh.

