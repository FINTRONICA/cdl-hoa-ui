import React, { useState, useEffect } from 'react'
import {
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Button,
  Drawer,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import { roleService } from '@/services/api/roleService'
import { useRoleManagementLabelApi } from '@/hooks/useRoleManagementLabelApi'
import { getRoleManagementLabel } from '@/constants/mappings/roleManagementMapping'
import { useAppStore } from '@/store'
interface RoleData {
  id?: string
  name: string
}

interface RightSlideRolePanelProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (roleName: string, roleData?: RoleData) => void
  mode?: 'add' | 'edit' | 'view'
  userData?: RoleData | undefined
  onSuccess?: (role: any) => void
  onError?: (error: string) => void
  onSwitchToEdit?: () => void
}

export const RightSlideRolePanel: React.FC<RightSlideRolePanelProps> = ({
  isOpen,
  onClose,
  onSave,
  mode = 'add',
  userData,
  onSuccess,
  onError,
  onSwitchToEdit,
}) => {
  const [selectedRole, setSelectedRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get current language from store
  const currentLanguage = useAppStore((state) => state.language) || 'EN'

  // Role Management Label API
  const { getLabel: getLabelFromApi } = useRoleManagementLabelApi()

  // Dynamic label function
  const getRoleLabelDynamic = React.useCallback(
    (configId: string): string => {
      const apiLabel = getLabelFromApi(configId, currentLanguage)

      if (apiLabel !== configId) {
        return apiLabel
      }

      const fallbackLabel = getRoleManagementLabel(configId)
      return fallbackLabel
    },
    [getLabelFromApi, currentLanguage]
  )

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
        borderColor: '#EF4444',
        borderWidth: '1px',
      },
      '&:hover fieldset': {
        borderColor: '#DC2626',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#EF4444',
        borderWidth: '2px',
      },
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

  useEffect(() => {
    if ((mode === 'edit' || mode === 'view') && userData) {
      setSelectedRole(userData.name)
    } else {
      setSelectedRole('')
    }
    setError(null) // Clear error when panel opens
  }, [mode, userData, isOpen])

  const handleSave = async () => {
    if (!selectedRole.trim()) {
      setError(`${getRoleLabelDynamic('CDL_ROLE_NAME')} is required`)
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (mode === 'edit' && userData) {
        // Update existing role
        const updatedRole = await roleService.updateRole(userData.name, {
          name: selectedRole.trim(),
        })

        onSuccess?.(updatedRole)
        onClose()
        setSelectedRole('')
      } else {
        // Create new role - let parent handle the API call
        onSave?.(selectedRole)
        onClose()
        setSelectedRole('')
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to save role'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
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
        {mode === 'edit'
          ? getRoleLabelDynamic('CDL_EDIT_ROLE')
          : mode === 'view'
            ? getRoleLabelDynamic('CDL_ROLE_VIEW_ONLY')
            : getRoleLabelDynamic('CDL_ADD_NEW_ROLE')}
        <IconButton onClick={onClose}>
          <CancelOutlinedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0, pt: '16px', px: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label={getRoleLabelDynamic('CDL_ROLE_NAME')}
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value)
            if (error) setError(null) // Clear error when user starts typing
          }}
          disabled={loading || mode === 'view'}
          error={!!error}
          helperText={
            error ||
            (mode === 'view' ? getRoleLabelDynamic('CDL_VIEW_ONLY') : undefined)
          }
          sx={error ? errorFieldStyles : commonFieldStyles}
          InputLabelProps={{ sx: labelSx }}
          InputProps={{ sx: valueSx }}
        />
      </DialogContent>

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 2,
          display: 'flex',
          gap: 2,
        }}
      >
        {mode === 'view' && onSwitchToEdit ? (
          <Button
            fullWidth
            variant="outlined"
            onClick={onSwitchToEdit}
            sx={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 500,
              fontStyle: 'normal',
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0.01em',
              borderRadius: '8px',
              borderColor: '#CAD5E2',
              color: '#475569',
              textTransform: 'none',
              height: '44px',
              '&:hover': {
                borderColor: '#CAD5E2',
                backgroundColor: '#F8FAFC',
              },
            }}
          >
            {getRoleLabelDynamic('CDL_EDIT')}
          </Button>
        ) : mode !== 'view' ? (
          <Button
            fullWidth
            variant="contained"
            onClick={handleSave}
            disabled={loading || !selectedRole.trim()}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
            sx={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 500,
              fontStyle: 'normal',
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0.01em',
              borderRadius: '8px',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              textTransform: 'none',
              height: '44px',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#1D4ED8',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              },
              '&:disabled': {
                backgroundColor: '#94A3B8',
                color: '#FFFFFF',
              },
            }}
          >
            {loading
              ? mode === 'edit'
                ? getRoleLabelDynamic('CDL_SAVING')
                : getRoleLabelDynamic('CDL_CREATING')
              : mode === 'edit'
                ? getRoleLabelDynamic('CDL_SAVE')
                : getRoleLabelDynamic('CDL_ADD_NEW_ROLE')}
          </Button>
        ) : null}
      </Box>
    </Drawer>
  )
}
