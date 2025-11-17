# Investor Stepper Updates

## Files Updated

- `src/components/organisms/InvestorStepper/steps/Step1.tsx`  
  - Realigned field names with the Step 1 schema/payload (`investorId`, `investorFirstName`, etc.) so save-and-next now triggers the API request.

- `src/components/organisms/InvestorStepper/steps/Step2.tsx`  
  - Added a reset routine that clears Step 2 fields whenever you enter the step for a new owner registry (prevents old data from being re-submitted).
  - Re-enabled the management-firm dropdown and ensured auto-fill uses the latest mapping data.

- `src/hooks/useRealEstateAssets1.ts` / `src/services/api/realEstateAssetService1.ts`  
  - Normalised management-firm responses so dropdown options surface the correct `mfName`, `mfId`, and asset-register details.

- `src/components/organisms/InvestorStepper/steps/Step5.tsx`  
  - Updated display mapping for management-firm and asset-register fields so the review step reflects the new data structure.

## Behavioural Notes

- Step 1, Step 2, and Step 3 now fire their respective API calls on “Save and Next”.
- Step 2 no longer pre-fills with data from previously edited owners.
- Step 5 shows only data returned for the current owner registry.

Run through the create → edit flow to confirm the APIs respond as expected after these changes.***


