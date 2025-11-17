import React, { useState, useCallback } from 'react'
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
import { useBuildPartnerLabelsWithCache } from '@/hooks/useBuildPartnerLabelsWithCache'
import { getBuildPartnerLabel } from '@/constants/mappings/buildPartnerMapping'
import { useAppStore } from '@/store'
import { FormError } from '../../atoms/FormError'
import type { ContactData } from '../DeveloperStepper/developerTypes'
import type { FeeDropdownOption } from '@/services/api/feeDropdownService'

interface RightSlidePanelProps {
  isOpen: boolean
  onClose: () => void
  onContactAdded?: (contact: unknown) => void
  onContactUpdated?: (contact: unknown, index: number) => void
  title?: string
  buildPartnerId?: string | undefined
  mode?: 'add' | 'edit'
  contactData?: ContactData | null
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

export const RightSlideAddMultipleOwnersPanel: React.FC<RightSlidePanelProps> = ({
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

  const { data: apiContactData } = useBuildPartnerContactById(
    mode === 'edit' && contactData?.id ? contactData.id : null
  )

  const {
    countryCodes = [],
    countryCodesLoading,
    countryCodesError,
    getDisplayLabel,
  } = useFeeDropdownLabels()

  // Phase 1: Dynamic label foundation
  const { data: buildPartnerLabels, getLabel } =
    useBuildPartnerLabelsWithCache()
  const currentLanguage = useAppStore((state) => state.language) || 'EN'

  const getBuildPartnerLabelDynamic = useCallback(
    (configId: string): string => {
      const fallback = getBuildPartnerLabel(configId)
      return buildPartnerLabels
        ? getLabel(configId, currentLanguage, fallback)
        : fallback
    },
    [buildPartnerLabels, currentLanguage, getLabel]
  )

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    getValues,
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
    mode: 'onChange',
  })

  const validateContactField = (
    fieldName: keyof ContactFormData,
    _value: unknown,
    allValues: ContactFormData
  ) => {
    try {
      const selectedCountryCode = countryCodes.find(
        (country) =>
          country.id?.toString() === allValues.countrycode?.toString()
      )
      const countryCodeValue =
        selectedCountryCode?.configValue ?? allValues.countrycode ?? ''

      const jointOwnDetailsContactAddress = `${allValues.address1} ${allValues.address2}`.trim()
      const contactForValidation = {
        contactData: [
          {
            jointOwnDetailsContactName: `${allValues.fname} ${allValues.lname}`.trim(),
            jointOwnDetailsFirstName: allValues.fname,
            jointOwnDetailsLastName: allValues.lname,
            jointOwnDetailsContactEmail: allValues.email,
            jointOwnDetailsContactAddress,
            jointOwnDetailsContactAddressLine1: allValues.address1,
            jointOwnDetailsContactAddressLine2: allValues.address2,
            jointOwnDetailsContactPoBox: allValues.pobox,
            jointOwnDetailsContactTelCode: countryCodeValue,
            jointOwnDetailsCountryMobCode: countryCodeValue,
            jointOwnDetailsContactMobNo: allValues.mobileno,
            jointOwnDetailsContactTelNo: allValues.telephoneno,
            jointOwnDetailsContactFaxNo: allValues.fax,
            assetRegisterDTO: buildPartnerId
              ? {
                  id: parseInt(buildPartnerId),
                }
              : undefined,
          },
        ],
      }

      const result = DeveloperStep3Schema.safeParse(contactForValidation)

      if (result.success) {
        return true
      } else {
        const fieldMapping: Record<string, string> = {
          fname: 'arcFirstName',
          lname: 'arcLastName',
          email: 'arcContactEmail',
          address1: 'arcContactAddressLine1',
          address2: 'arcContactAddressLine2',
          pobox: 'arcContactPoBox',
          countrycode: 'arcContactTelCode',
          mobileno: 'arcContactMobNo',
          telephoneno: 'arcContactTelNo',
          fax: 'arcContactFaxNo',
        }

        const schemaFieldName = fieldMapping[fieldName]

        if (!schemaFieldName) {
          return true
        }

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
    } catch {
      return true
    }
  }

  React.useEffect(() => {
    if (isOpen && mode === 'edit' && (apiContactData || contactData)) {
      const dataToUse =
        (apiContactData as BuildPartnerContactResponse | undefined) ??
        contactData ??
        ({} as ContactData)

      const firstName = dataToUse.jointOwnDetailsFirstName || ''
      const lastName = dataToUse.jointOwnDetailsLastName || ''

      const address1 = dataToUse.jointOwnDetailsContactAddressLine1 || ''
      const address2 = dataToUse.jointOwnDetailsContactAddressLine2 || ''

      const countryCodeFromApi =
        dataToUse.jointOwnDetailsContactTelCode || dataToUse.jointOwnDetailsCountryMobCode || ''
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
          email: dataToUse.jointOwnDetailsContactEmail || '',
        address1: address1,
        address2: address2,
          pobox: dataToUse.jointOwnDetailsContactPoBox || '',
        countrycode: countryCodeId,
          telephoneno: dataToUse.jointOwnDetailsContactTelNo || '',
          mobileno: dataToUse.jointOwnDetailsContactMobNo || '',
          fax: dataToUse.jointOwnDetailsContactFaxNo || '',
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

      // Trigger validation on all fields to show errors even if not touched
      const isValid = await trigger([
        'fname',
        'lname',
        'email',
        'address1',
        'address2',
        'pobox',
        'countrycode',
        'mobileno',
        'telephoneno',
        'fax',
      ])

      // If field-level validation fails, don't proceed
      if (!isValid) {
        return
      }

      const selectedCountryCode = countryCodes.find(
        (country) =>
          country.id?.toString() === data.countrycode?.toString()
      )
      const countryCodeValue =
        selectedCountryCode?.configValue ?? data.countrycode ?? ''

      const isEditing = mode === 'edit'

      const jointOwnDetailsContactAddress = `${data.address1} ${data.address2}`.trim()
      const contactForValidation = {
        contactData: [
          {
            jointOwnDetailsContactName: `${data.fname} ${data.lname}`.trim(),
            jointOwnDetailsFirstName: data.fname,
            jointOwnDetailsLastName: data.lname,
            jointOwnDetailsContactEmail: data.email,
            jointOwnDetailsContactAddress,
            jointOwnDetailsContactAddressLine1: data.address1,
            jointOwnDetailsContactAddressLine2: data.address2,
            jointOwnDetailsContactPoBox: data.pobox,
            jointOwnDetailsContactTelCode: countryCodeValue,
            jointOwnDetailsCountryMobCode: countryCodeValue,
            jointOwnDetailsContactMobNo: data.mobileno,
            jointOwnDetailsContactTelNo: data.telephoneno,
            jointOwnDetailsContactFaxNo: data.fax,
            assetRegisterDTO: buildPartnerId
              ? {
                  id: parseInt(buildPartnerId),
                }
              : undefined,
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

      const jointOwnDetailsContactTelCodeValue =
        selectedCountryCode?.configValue || countryCodeValue
      const jointOwnDetailsCountryMobCodeValue =
        selectedCountryCode?.configValue || countryCodeValue

      const contactPayload: BuildPartnerContactData = {
        ...(isEditing && contactData?.id && { id: contactData.id }),
        jointOwnDetailsFirstName: data.fname,
        jointOwnDetailsLastName: data.lname,
        jointOwnDetailsContactEmail: data.email,
        jointOwnDetailsContactName: `${data.fname} ${data.lname}`.trim(),
        jointOwnDetailsContactAddress: `${data.address1} ${data.address2}`.trim(),
        jointOwnDetailsContactAddressLine1: data.address1,
        jointOwnDetailsContactAddressLine2: data.address2,
        jointOwnDetailsContactPoBox: data.pobox,
        jointOwnDetailsCountryMobCode: jointOwnDetailsCountryMobCodeValue,
        jointOwnDetailsContactTelCode: jointOwnDetailsContactTelCodeValue,
        jointOwnDetailsContactTelNo: data.telephoneno,
        jointOwnDetailsContactMobNo: data.mobileno,
        jointOwnDetailsContactFaxNo: data.fax,
        enabled: true,
        deleted: false,
        workflowStatus:
          (apiContactData as BuildPartnerContactResponse | undefined)
            ?.workflowStatus ?? null,
        ...(buildPartnerId && {
          assetRegisterDTO: {
            id: parseInt(buildPartnerId),
            enabled: true,
            deleted: false,
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

      const contactForForm: ContactData = {
        ...(isEditing && contactData?.id && { id: contactData.id }),
        jointOwnDetailsContactName: contactPayload.jointOwnDetailsContactName ?? null,
        jointOwnDetailsFirstName: contactPayload.jointOwnDetailsFirstName ?? null,
        jointOwnDetailsLastName: contactPayload.jointOwnDetailsLastName ?? null,
        jointOwnDetailsContactEmail: contactPayload.jointOwnDetailsContactEmail ?? null,
        jointOwnDetailsContactAddress: contactPayload.jointOwnDetailsContactAddress ?? null,
        jointOwnDetailsContactAddressLine1: contactPayload.jointOwnDetailsContactAddressLine1 ?? null,
        jointOwnDetailsContactAddressLine2: contactPayload.jointOwnDetailsContactAddressLine2 ?? null,
        jointOwnDetailsContactPoBox: contactPayload.jointOwnDetailsContactPoBox ?? null,
        jointOwnDetailsCountryMobCode: contactPayload.jointOwnDetailsCountryMobCode ?? null,
        jointOwnDetailsContactTelCode: contactPayload.jointOwnDetailsContactTelCode ?? null,
        jointOwnDetailsContactTelNo: contactPayload.jointOwnDetailsContactTelNo ?? null,
        jointOwnDetailsContactMobNo: contactPayload.jointOwnDetailsContactMobNo ?? null,
        jointOwnDetailsContactFaxNo: contactPayload.jointOwnDetailsContactFaxNo ?? null,
        enabled: true,
        deleted: false,
        workflowStatus: contactPayload.workflowStatus ?? null,
        ...(buildPartnerId && {
          assetRegisterDTO: {
            id: parseInt(buildPartnerId),
            enabled: true,
            deleted: false,
          },
        }),
      }

      if (isEditing && onContactUpdated && contactIndex !== undefined) {
        onContactUpdated(contactForForm, contactIndex)
      } else if (!isEditing && onContactAdded) {
        onContactAdded(contactForForm)
      }

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
          validate: (value: unknown) => {
            const allValues = getValues()
            return validateContactField(name, value, allValues)
          },
        }}
        render={({ field }) => (
          <>
            <TextField
              {...field}
              label={label}
              fullWidth
              required={required}
              error={!!errors[name]}
              InputLabelProps={{ sx: labelSx }}
              InputProps={{ sx: valueSx }}
              sx={errors[name] ? errorFieldStyles : commonFieldStyles}
            />
            <FormError
              error={(errors[name]?.message as string) || ''}
              touched={true}
            />
          </>
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
            <FormError
              error={(errors[name]?.message as string) || ''}
              touched={true}
            />
          </FormControl>
        )}
      />
    </Grid>
  )

  const renderApiSelectField = (
    name: keyof ContactFormData,
    label: string,
    options: FeeDropdownOption[],
    gridSize: number = 6,
    required = false,
    loading = false
  ) => (
    <Grid key={name} size={{ xs: 12, md: gridSize }}>
      <Controller
        name={name}
        control={control}
        rules={{
          validate: (value: unknown) => {
            const allValues = getValues()
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
              input={<OutlinedInput label={loading ? `Loading...` : label} />}
              label={loading ? `Loading...` : label}
              sx={{ ...selectStyles, ...valueSx }}
              IconComponent={KeyboardArrowDownIcon}
              disabled={loading}
            >
              {options.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {getDisplayLabel(option, option.configValue)}
                </MenuItem>
              ))}
            </Select>
            <FormError
              error={(errors[name]?.message as string) || ''}
              touched={true}
            />
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
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
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
          flexShrink: 0,
          borderBottom: '1px solid #E5E7EB',
          backgroundColor: 'white',
          zIndex: 11,
        }}
      >
        {mode === 'edit'
          ? getBuildPartnerLabelDynamic('CDL_AR_CONTACT_EDIT')
          : getBuildPartnerLabelDynamic('CDL_AR_CONTACT_ADD')}
        <IconButton onClick={handleClose}>
          <CancelOutlinedIcon />
        </IconButton>
      </DialogTitle>

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <DialogContent
          dividers
          sx={{
            flex: 1,
            overflowY: 'auto',
            paddingBottom: '20px',
            marginBottom: '80px', // Space for fixed buttons
          }}
        >
          {countryCodesError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to load country code options. Please refresh the page.
            </Alert>
          )}

          {!countryCodesLoading &&
            !countryCodesError &&
            countryCodes.length === 0 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Using default country code options. API data not available.
              </Alert>
            )}

          <Grid container rowSpacing={4} columnSpacing={2} mt={3}>
            {renderTextField(
              'fname',
              getBuildPartnerLabelDynamic('CDL_AR_AUTH_FIRST_NAME'),
              '',
              6,
              true
            )}
            {renderTextField(
              'lname',
              getBuildPartnerLabelDynamic('CDL_AR_AUTH_LAST_NAME'),
              '',
              6,
              true
            )}
            {renderTextField(
              'email',
              getBuildPartnerLabelDynamic('CDL_AR_EMAIL_ADDRESS'),
              '',
              12,
              true
            )}
            {renderTextField(
              'address1',
              getBuildPartnerLabelDynamic('CDL_AR_ADDRESS_LINE1'),
              '',
              12,
              true
            )}
            {renderTextField(
              'address2',
              getBuildPartnerLabelDynamic('CDL_AR_ADDRESS_LINE2'),
              '',
              12,
              false
            )}
            {renderTextField(
              'pobox',
              getBuildPartnerLabelDynamic('CDL_AR_POBOX'),
              '',
              12,
              false
            )}
            {countryCodes.length > 0
              ? renderApiSelectField(
                  'countrycode',
                  getBuildPartnerLabelDynamic('CDL_AR_COUNTRY_CODE'),
                  countryCodes,
                  6,
                  true,
                  countryCodesLoading
                )
              : renderSelectField(
                  'countrycode',
                  getBuildPartnerLabelDynamic('CDL_AR_COUNTRY_CODE'),
                  ['+971', '+1', '+44', '+91'],
                  6,
                  true
                )}
            {renderTextField(
              'telephoneno',
              getBuildPartnerLabelDynamic('CDL_AR_TELEPHONE_NUMBER'),
              '',
              6,
              false
            )}
            {renderTextField(
              'mobileno',
              getBuildPartnerLabelDynamic('CDL_AR_MOBILE_NUMBER'),
              '',
              6,
              true
            )}
            {renderTextField(
              'fax',
              getBuildPartnerLabelDynamic('CDL_AR_FAX_NUMBER'),
              '',
              12,
              false
            )}
          </Grid>
        </DialogContent>

        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 2,
            backgroundColor: 'white',
            borderTop: '1px solid #E5E7EB',
            boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
            zIndex: 10,
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
