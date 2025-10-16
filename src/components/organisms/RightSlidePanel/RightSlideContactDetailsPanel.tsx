import React, { useState } from 'react'
import {
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Drawer,
  Box,
  Alert,
  Snackbar,
  OutlinedInput,
} from '@mui/material'
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material'
import { Controller, useForm } from 'react-hook-form'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import {
  useSaveBuildPartnerContact,
  useBuildPartnerContactById,
} from '@/hooks/useBuildPartners'
import { DeveloperStep3Schema } from '@/lib/validation/developerSchemas'
import { useFeeDropdownLabels } from '@/hooks/useFeeDropdowns'
import {
  type BuildPartnerContactData,
  type BuildPartnerContactResponse,
} from '@/services/api/buildPartnerService'

interface RightSlidePanelProps {
  isOpen: boolean
  onClose: () => void
  onContactAdded?: (contact: unknown) => void
  onContactUpdated?: (contact: unknown, index: number) => void
  title?: string
  buildPartnerId?: string | undefined
  mode?: 'add' | 'edit'
  contactData?: {
    id?: string | number
    name?: string
    address?: string
    email?: string
    pobox?: string
    countrycode?: string
    mobileno?: string
    telephoneno?: string
    fax?: string
    buildPartnerDTO?: {
      id: number
    }
  }
  contactIndex?: number
}

interface ContactFormData {
  fname: string
  lname: string
  email: string
  address1: string
  address2: string
  pobox: string
  countrycode: string
  telephoneno: string
  mobileno: string
  fax: string
}

export const RightSlideContactDetailsPanel: React.FC<RightSlidePanelProps> = ({
  isOpen,
  onClose,
  onContactAdded,
  onContactUpdated,
  buildPartnerId,
  mode = 'add',
  contactData,
  contactIndex,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const addContactMutation = useSaveBuildPartnerContact()

  // Fetch full contact data from API when in edit mode
  const { data: apiContactData } = useBuildPartnerContactById(
    mode === 'edit' && contactData?.id ? contactData.id : null
  )

  const {
    countryCodes = [],
    countryCodesLoading,
    countryCodesError,
    getDisplayLabel,
  } = useFeeDropdownLabels()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    defaultValues: {
      fname: '',
      lname: '',
      email: '',
      address1: '',
      address2: '',
      pobox: '',
      countrycode: '',
      telephoneno: '',
      mobileno: '',
      fax: '',
    },
    mode: 'onChange', // Enable real-time validation
  })

  // Validation function using DeveloperStep3Schema
  const validateContactField = (
    fieldName: string,
    _value: any,
    allValues: ContactFormData
  ) => {
    try {
      // Transform current form data to match DeveloperStep3Schema format
      const selectedCountryCode = countryCodes.find(
        (country) => country.id.toString() === allValues.countrycode.toString()
      )
      const countryCodeValue = selectedCountryCode
        ? selectedCountryCode.configValue
        : allValues.countrycode

      const contactForValidation = {
        contactData: [
          {
            name: `${allValues.fname} ${allValues.lname}`.trim(),
            address: `${allValues.address1} ${allValues.address2}`.trim(),
            email: allValues.email,
            pobox: allValues.pobox,
            countrycode: countryCodeValue,
            mobileno: allValues.mobileno,
            telephoneno: allValues.telephoneno,
            fax: allValues.fax,
            buildPartnerDTO: {
              id: buildPartnerId ? parseInt(buildPartnerId) : undefined,
            },
          },
        ],
      }

      // Validate using DeveloperStep3Schema
      const result = DeveloperStep3Schema.safeParse(contactForValidation)

      if (result.success) {
        return true
      } else {
        // Map form field names to schema field names
        const fieldMapping: Record<string, string> = {
          fname: 'name',
          lname: 'name',
          email: 'email',
          address1: 'address',
          address2: 'address',
          pobox: 'pobox',
          countrycode: 'countrycode',
          mobileno: 'mobileno',
          telephoneno: 'telephoneno',
          fax: 'fax',
        }

        const schemaFieldName = fieldMapping[fieldName]

        if (!schemaFieldName) {
          return true
        }

        // Find the specific field error
        const fieldError = result.error.issues.find(
          (issue) =>
            issue.path.includes('contactData') &&
            issue.path.includes(0) &&
            issue.path.includes(schemaFieldName)
        )

        if (fieldError) {
          return fieldError.message
        }

        return true
      }
    } catch (error) {
      return true // Return true on error to avoid blocking the form
    }
  }

  // Populate form when in edit mode
  React.useEffect(() => {
    if (isOpen && mode === 'edit' && (apiContactData || contactData)) {
      // Prefer API data if available, otherwise use local contactData
      const dataToUse: any = apiContactData || contactData

      // Extract first and last name from API response or local data
      const firstName =
        dataToUse.bpcFirstName || contactData?.name?.split(' ')[0] || ''
      const lastName =
        dataToUse.bpcLastName ||
        contactData?.name?.split(' ').slice(1).join(' ') ||
        ''

      // Extract address lines
      const address1 = dataToUse.bpcContactAddressLine1 || ''
      const address2 = dataToUse.bpcContactAddressLine2 || ''

      // Find the country code ID from the dropdown options
      // The API returns the country code value in bpcCountryMobCode (e.g., "Dubai")
      const countryCodeFromApi =
        dataToUse.bpcCountryMobCode || contactData?.countrycode || ''
      let countryCodeId = countryCodeFromApi

      if (countryCodes.length > 0 && countryCodeFromApi) {
        const matchingCountry = countryCodes.find(
          (country) =>
            country.configValue === countryCodeFromApi ||
            country.id?.toString() === countryCodeFromApi
        )
        if (matchingCountry) {
          countryCodeId = matchingCountry.id?.toString() || ''
        }
      }

      reset({
        fname: firstName,
        lname: lastName,
        email: dataToUse.bpcContactEmail || contactData?.email || '',
        address1: address1,
        address2: address2,
        pobox: dataToUse.bpcContactPoBox || contactData?.pobox || '',
        countrycode: countryCodeId,
        telephoneno:
          dataToUse.bpcContactTelNo || contactData?.telephoneno || '',
        mobileno: dataToUse.bpcContactMobNo || contactData?.mobileno || '',
        fax: dataToUse.bpcContactFaxNo || contactData?.fax || '',
      })
    } else if (isOpen && mode === 'add') {
      reset({
        fname: '',
        lname: '',
        email: '',
        address1: '',
        address2: '',
        pobox: '',
        countrycode: '',
        telephoneno: '',
        mobileno: '',
        fax: '',
      })
    }
  }, [isOpen, mode, contactData, apiContactData, reset, countryCodes])

  const onSubmit = async (data: ContactFormData) => {
    try {
      setErrorMessage(null)
      setSuccessMessage(null)

      const selectedCountryCode = countryCodes.find(
        (country) => country.id.toString() === data.countrycode.toString()
      )
      const countryCodeValue = selectedCountryCode
        ? selectedCountryCode.configValue
        : data.countrycode

      const isEditing = mode === 'edit'

      // Transform form data to match DeveloperStep3Schema format
      const contactForValidation = {
        contactData: [
          {
            name: `${data.fname} ${data.lname}`.trim(),
            address: `${data.address1} ${data.address2}`.trim(),
            email: data.email,
            pobox: data.pobox,
            countrycode: countryCodeValue,
            mobileno: data.mobileno,
            telephoneno: data.telephoneno,
            fax: data.fax,
            buildPartnerDTO: {
              id: buildPartnerId ? parseInt(buildPartnerId) : undefined,
            },
          },
        ],
      }

      const validationResult =
        DeveloperStep3Schema.safeParse(contactForValidation)
      if (!validationResult.success) {
        const errorMessages = validationResult.error.issues.map(
          (issue: { message: string }) => issue.message
        )
        setErrorMessage(errorMessages.join(', '))
        return
      }

      // Use original format for API call
      const contactPayload: BuildPartnerContactData = {
        ...(isEditing && contactData?.id && { id: contactData.id }),
        bpcFirstName: data.fname,
        bpcLastName: data.lname,
        bpcContactEmail: data.email,
        bpcContactAddressLine1: data.address1,
        bpcContactAddressLine2: data.address2,
        bpcContactPoBox: data.pobox,
        bpcCountryMobCode: countryCodeValue,
        bpcContactTelNo: data.telephoneno,
        bpcContactMobNo: data.mobileno,
        bpcContactFaxNo: data.fax,
        // Preserve workflow-related fields from API data when editing
        ...(isEditing && apiContactData
          ? {
              enabled:
                (apiContactData as BuildPartnerContactResponse).enabled ??
                false,
              deleted:
                (apiContactData as BuildPartnerContactResponse).deleted ?? null,
              workflowStatus:
                (apiContactData as BuildPartnerContactResponse)
                  .workflowStatus ?? null,
            }
          : {}),
        ...(buildPartnerId && {
          buildPartnerDTO: {
            id: parseInt(buildPartnerId),
          },
        }),
      }

      await addContactMutation.mutateAsync({
        data: contactPayload,
        isEditing: isEditing,
        developerId: buildPartnerId,
      })

      setSuccessMessage(
        isEditing
          ? 'Contact updated successfully!'
          : 'Contact added successfully!'
      )

      // Prepare contact data for parent component
      // Convert country code ID back to display value for the table
      const selectedCountryCodeForDisplay = countryCodes.find(
        (country) => country.id?.toString() === data.countrycode?.toString()
      )

      const countryCodeDisplayValue = selectedCountryCodeForDisplay
        ? selectedCountryCodeForDisplay.configValue
        : countryCodeValue

      const contactForForm = {
        ...(isEditing && contactData?.id && { id: contactData.id }),
        name: `${data.fname} ${data.lname}`.trim(),
        address: `${data.address1} ${data.address2}`.trim(),
        email: data.email,
        pobox: data.pobox,
        countrycode: countryCodeDisplayValue,
        mobileno: data.mobileno,
        telephoneno: data.telephoneno,
        fax: data.fax,
        buildPartnerDTO: {
          id: buildPartnerId ? parseInt(buildPartnerId) : undefined,
        },
      }

      // Call appropriate callback based on mode
      if (isEditing && onContactUpdated && contactIndex !== undefined) {
        onContactUpdated(contactForForm, contactIndex)
      } else if (!isEditing && onContactAdded) {
        onContactAdded(contactForForm)
      }

      // Reset form and close after a short delay
      setTimeout(() => {
        reset()
        onClose()
      }, 1500)
    } catch (error: unknown) {
      const errorData = error as {
        response?: { data?: { message?: string } }
        message?: string
      }
      const errorMessage =
        errorData?.response?.data?.message ||
        errorData?.message ||
        'Failed to add contact. Please try again.'
      setErrorMessage(errorMessage)
    }
  }

  const handleClose = () => {
    reset()
    setErrorMessage(null)
    setSuccessMessage(null)
    onClose()
  }

  // Common styles for form components
  const commonFieldStyles = {
    '& .MuiOutlinedInput-root': {
      height: '46px',
      borderRadius: '8px',
      '& fieldset': {
        borderColor: '#CAD5E2',
        borderWidth: '1px',
      },
      '&:hover fieldset': {
        borderColor: '#CAD5E2',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2563EB',
      },
    },
  }

  const errorFieldStyles = {
    '& .MuiOutlinedInput-root': {
      height: '46px',
      borderRadius: '8px',
      '& fieldset': {
        borderColor: 'red',
        borderWidth: '1px',
      },
    },
  }

  const selectStyles = {
    height: '46px',
    borderRadius: '8px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#CAD5E2',
      borderWidth: '1px',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#CAD5E2',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#2563EB',
    },
    '& .MuiSelect-icon': {
      color: '#666',
    },
  }

  const labelSx = {
    color: '#6A7282',
    fontFamily: 'Outfit',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '12px',
    letterSpacing: 0,
  }

  const valueSx = {
    color: '#1E2939',
    fontFamily: 'Outfit',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '14px',
    letterSpacing: 0,
    wordBreak: 'break-word',
  }

  const renderTextField = (
    name: keyof ContactFormData,
    label: string,
    defaultValue = '',
    gridSize: number = 6,
    required = false
  ) => (
    <Grid key={name} size={{ xs: 12, md: gridSize }}>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={{
          validate: (value: any) => {
            const allValues = control._formValues as ContactFormData
            return validateContactField(name, value, allValues)
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label={label}
            fullWidth
            required={required}
            error={!!errors[name]}
            helperText={errors[name]?.message}
            InputLabelProps={{ sx: labelSx }}
            InputProps={{ sx: valueSx }}
            sx={errors[name] ? errorFieldStyles : commonFieldStyles}
          />
        )}
      />
    </Grid>
  )

  const renderSelectField = (
    name: keyof ContactFormData,
    label: string,
    options: string[],
    gridSize: number = 6,
    required = false
  ) => (
    <Grid key={name} size={{ xs: 12, md: gridSize }}>
      <Controller
        name={name}
        control={control}
        rules={required ? { required: `${label} is required` } : {}}
        defaultValue={''}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors[name]}>
            <InputLabel sx={labelSx}>{label}</InputLabel>
            <Select
              {...field}
              input={<OutlinedInput label={label} />}
              label={label}
              sx={{ ...selectStyles, ...valueSx }}
              IconComponent={KeyboardArrowDownIcon}
            >
              {options.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
    </Grid>
  )

  // New render function for API-driven dropdowns
  const renderApiSelectField = (
    name: keyof ContactFormData,
    label: string,
    options: unknown[],
    gridSize: number = 6,
    required = false,
    loading = false
  ) => (
    <Grid key={name} size={{ xs: 12, md: gridSize }}>
      <Controller
        name={name}
        control={control}
        rules={{
          validate: (value: any) => {
            const allValues = control._formValues as ContactFormData
            return validateContactField(name, value, allValues)
          },
        }}
        defaultValue={''}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors[name]} required={required}>
            <InputLabel sx={labelSx}>
              {loading ? `Loading...` : label}
            </InputLabel>
            <Select
              {...field}
              input={
                <OutlinedInput
                  label={loading ? `Loading...` : label}
                />
              }
              label={loading ? `Loading...` : label}
              sx={{ ...selectStyles, ...valueSx }}
              IconComponent={KeyboardArrowDownIcon}
              disabled={loading}
            >
              {options.map((option) => (
                <MenuItem
                  key={(option as { id?: string }).id}
                  value={(option as { id?: string }).id}
                >
                  {getDisplayLabel(
                    option as any,
                    (option as { configValue?: string }).configValue
                  )}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
    </Grid>
  )

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: 460,
          borderRadius: 3,
          backgroundColor: 'white',
          backdropFilter: 'blur(15px)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 500,
          fontStyle: 'normal',
          fontSize: '20px',
          lineHeight: '28px',
          letterSpacing: '0.15px',
          verticalAlign: 'middle',
        }}
      >
        {mode === 'edit' ? 'Edit Contact Details' : 'Add Contact Details'}
        <IconButton onClick={handleClose}>
          <CancelOutlinedIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          {/* Show error if country codes fail to load */}
          {countryCodesError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to load country code options. Please refresh the page.
            </Alert>
          )}

          {/* Show info if using fallback country codes */}
          {!countryCodesLoading &&
            !countryCodesError &&
            countryCodes.length === 0 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Using default country code options. API data not available.
              </Alert>
            )}

          <Grid container rowSpacing={4} columnSpacing={2} mt={3}>
            {renderTextField('fname', 'First Name', '', 6, true)}
            {renderTextField('lname', 'Last Name', '', 6, true)}
            {renderTextField('email', 'Email Id', '', 12, true)}
            {renderTextField('address1', 'Address Line 1', '', 12, true)}
            {renderTextField('address2', 'Address Line 2', '', 12, false)}
            {renderTextField('pobox', 'PO Box', '', 12, false)}
            {countryCodes.length > 0
              ? renderApiSelectField(
                  'countrycode',
                  'Country Code',
                  countryCodes,
                  6,
                  true,
                  countryCodesLoading
                )
              : renderSelectField(
                  'countrycode',
                  'Country Code',
                  ['+971', '+1', '+44', '+91'],
                  6,
                  true
                )}
            {renderTextField('telephoneno', 'Telephone Number', '', 6, false)}
            {renderTextField('mobileno', 'Mobile Number', '', 6, true)}
            {renderTextField('fax', 'FAX', '', 12, false)}
          </Grid>
        </DialogContent>

        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 2,
          }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClose}
                disabled={addContactMutation.isPending || countryCodesLoading}
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: 0,
                }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                type="submit"
                disabled={addContactMutation.isPending || countryCodesLoading}
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: 0,
                  backgroundColor: '#2563EB',
                  color: '#fff',
                }}
              >
                {addContactMutation.isPending
                  ? mode === 'edit'
                    ? 'Updating...'
                    : 'Adding...'
                  : mode === 'edit'
                    ? 'Update'
                    : 'Add'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>

      {/* Error and Success Notifications */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setErrorMessage(null)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Drawer>
  )
}
