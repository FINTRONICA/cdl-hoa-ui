# Asset Register Refactor Summary

## Updated Files

- `src/components/organisms/RightSlidePanel/RightSlideContactDetailsPanel.tsx`
  - Reworked the drawer form to read/write the new API schema (`arcContactName`, `arcContactAddress*`, `arcContactTelCode`, etc.).
  - Sets `enabled: true`, `deleted: false` on both contact and nested `assetRegisterDTO` before submit; validation and local state now use the same keys.

- `src/services/api/buildPartnerService.ts`
  - Expanded `BuildPartnerContactData` to the API-supplied fields.
  - POST/PUT helpers coerce missing flags to `enabled: true` / `deleted: false` and add the new metadata to `assetRegisterDTO`.

- `src/components/organisms/DeveloperStepper/developerTypes.ts`
  - Updated `ContactData` to match backend response so downstream consumers use consistent typing.

- `src/lib/validation/developerSchemas.ts`
  - Step 3 schema now validates the `arc*` contact properties (names, address lines, tel code, DTO flags) instead of the legacy structure.

- `src/components/organisms/DeveloperStepper/constants.ts`
  - Default form state no longer injects the old contact shape; it now starts empty so newly added contacts use the latest schema only.

- `src/components/organisms/DeveloperStepper/transformers.ts`
  - Step 2 transformer serialises contacts with the new `arc*` keys and preserves the status flags/nested DTO values when saving.

- `src/components/organisms/DeveloperStepper/steps/Step2.tsx`
  - Maps API contacts directly into the new model and derives table rows from those values; CRUD handlers now work off IDs and stay in sync after refresh.

- `src/components/organisms/DeveloperStepper/steps/Step5.tsx`
  - Displays the normalized `arc*` fields so the review page mirrors the backend response.

## Result

Contact CRUD now round-trips with the Asset Register API: creates/updates persist after reload, lists and review screens show the server values, and the type/validation layers align with the new schema. No outstanding issues detected in the updated modules.
