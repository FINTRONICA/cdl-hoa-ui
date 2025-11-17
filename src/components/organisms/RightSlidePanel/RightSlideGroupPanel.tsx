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
import { groupService } from '@/services/api/groupService'
import { useGroupManagementLabelApi } from '@/hooks/useGroupManagementLabelApi'
import { getGroupManagementLabel } from '@/constants/mappings/groupManagementMapping'
import { useAppStore } from '@/store'

interface GroupData {
  id?: string
  name: string
  description?: string
}

interface RightSlideGroupPanelProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (groupName: string, groupData?: GroupData) => void
  mode?: 'add' | 'edit' | 'view'
  userData?: GroupData | undefined
  onSuccess?: (group: any) => void
  onError?: (error: string) => void
  onSwitchToEdit?: () => void
}

export const RightSlideGroupPanel: React.FC<RightSlideGroupPanelProps> = ({
  isOpen,
  onClose,
  onSave,
  mode = 'add',
  userData,
  onSuccess,
  onError,
  onSwitchToEdit,
}) => {
  const [selectedGroup, setSelectedGroup] = useState('')
  const [selectedDescription, setSelectedDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get current language from store
  const currentLanguage = useAppStore((state) => state.language) || 'EN'

  // Group Management Label API
  const { getLabel: getLabelFromApi } = useGroupManagementLabelApi()

  // Dynamic label function
  const getGroupLabelDynamic = React.useCallback(
    (configId: string): string => {
      const apiLabel = getLabelFromApi(configId, currentLanguage)

      if (apiLabel !== configId) {
        return apiLabel
      }

      const fallbackLabel = getGroupManagementLabel(configId)
      return fallbackLabel
    },
    [getLabelFromApi, currentLanguage]
  )

  useEffect(() => {
    if ((mode === 'edit' || mode === 'view') && userData) {
      setSelectedGroup(userData.name)
      // Convert 'N/A' to empty string for description
      setSelectedDescription(
        userData.description && userData.description !== 'N/A'
          ? userData.description
          : ''
      )
    } else {
      setSelectedGroup('')
      setSelectedDescription('')
    }
    setError(null) // Clear error when panel opens
  }, [mode, userData, isOpen])

  const handleSave = async () => {
    if (!selectedGroup.trim()) {
      setError(getGroupLabelDynamic('CDL_GROUP_NAME_HELPER'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (mode === 'edit' && userData) {
        // Update existing group
        const updatedGroup = await groupService.updateGroup(userData.id!, {
          name: selectedGroup.trim(),
          description: selectedDescription.trim() || '',
        })

        onSuccess?.(updatedGroup)
        onSave?.(selectedGroup, userData)
        onClose()
        setSelectedGroup('')
        setSelectedDescription('')
      } else {
        // Create new group - let parent handle the API call
        onSave?.(selectedGroup, {
          name: selectedGroup,
          description: selectedDescription,
        })
        onClose()
        setSelectedGroup('')
        setSelectedDescription('')
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to save group'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
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

  const multilineFieldStyles = {
    '& .MuiOutlinedInput-root': {
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
          px: 3,
          py: 2,
        }}
      >
        {mode === 'edit'
          ? getGroupLabelDynamic('CDL_EDIT_GROUP')
          : mode === 'view'
            ? getGroupLabelDynamic('CDL_GROUP_VIEW_ONLY')
            : getGroupLabelDynamic('CDL_ADD_NEW_GROUP')}
        <IconButton onClick={onClose}>
          <CancelOutlinedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: '20px',
          marginBottom: '80px',
          px: 3,
          pt: '16px',
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label={getGroupLabelDynamic('CDL_ACCESS_GRANT_NAME') + '*'}
          value={selectedGroup}
          onChange={(e) => {
            setSelectedGroup(e.target.value)
            if (error) setError(null) // Clear error when user starts typing
          }}
          disabled={loading || mode === 'view'}
          error={!!error}
          // helperText={
          //   error ||
          //   (mode === 'view'
          //     ? getGroupLabelDynamic('CDL_VIEW_ONLY')
          //     : undefined)
          // }
          variant="outlined"
          sx={{
            ...(error ? errorFieldStyles : commonFieldStyles),
            mb: 3,
          }}
          InputLabelProps={{ sx: labelSx }}
          InputProps={{ sx: valueSx }}
        />

        <TextField
          fullWidth
          label={getGroupLabelDynamic('CDL_ACCESS_GRANT_DESC')}
          value={selectedDescription}
          onChange={(e) => {
            setSelectedDescription(e.target.value)
            if (error) setError(null) // Clear error when user starts typing
          }}
          disabled={loading || mode === 'view'}
          multiline
          rows={3}
          // helperText={
          //   mode === 'view' ? getGroupLabelDynamic('CDL_VIEW_ONLY') : undefined
          // }
          variant="outlined"
          sx={multilineFieldStyles}
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
          backgroundColor: 'white',
          borderTop: '1px solid #E5E7EB',
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
          zIndex: 10,
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
            {getGroupLabelDynamic('CDL_EDIT')}
          </Button>
        ) : mode !== 'view' ? (
          <Button
            fullWidth
            variant="contained"
            onClick={handleSave}
            disabled={loading || !selectedGroup.trim()}
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
                ? getGroupLabelDynamic('CDL_SAVING')
                : getGroupLabelDynamic('CDL_CREATING')
              : mode === 'edit'
                ? getGroupLabelDynamic('CDL_SAVE')
                : getGroupLabelDynamic('CDL_ADD_NEW_GROUP')}
          </Button>
        ) : null}
      </Box>
    </Drawer>
  )
}
