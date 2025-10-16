import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
} from '@mui/material'
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material'

export interface ConfirmationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'warning' | 'error' | 'info' | 'success'
  loading?: boolean
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  error?: string | null
}

const variantConfig = {
  warning: {
    icon: WarningIcon,
    color: '#2196f3',
    confirmButtonColor: 'primary' as const,
  },
  error: {
    icon: ErrorIcon,
    color: '#2196f3',
    confirmButtonColor: 'primary' as const,
  },
  info: {
    icon: InfoIcon,
    color: '#2196f3',
    confirmButtonColor: 'primary' as const,
  },
  success: {
    icon: SuccessIcon,
    color: '#2196f3',
    confirmButtonColor: 'primary' as const,
  },
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  loading = false,
  maxWidth = 'sm',
  error = null,
}) => {
  const config = variantConfig[variant]
  const IconComponent = config.icon

  const handleConfirm = async () => {
    try {
      await onConfirm()
    } catch (error) {
      console.error('Error in confirmation action:', error)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <DialogTitle
        id="confirmation-dialog-title"
        sx={{
          fontFamily: 'Outfit',
          fontWeight: 600,
          fontSize: '18px',
          color: '#1F2937',
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconComponent
            sx={{
              color: variant === 'error' ? '#DC2626' : '#2563EB',
              fontSize: 20,
            }}
          />
          <Typography
            variant="h6"
            component="span"
            sx={{
              fontFamily: 'Outfit',
              fontWeight: 600,
              fontSize: '18px',
              color: '#1F2937',
            }}
          >
            {title}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          disabled={loading}
          sx={{
            color: '#6B7280',
            '&:hover': {
              backgroundColor: '#F3F4F6',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <DialogContentText
          id="confirmation-dialog-description"
          sx={{
            color: '#6B7280',
            fontSize: '14px',
            fontFamily: 'Outfit',
            lineHeight: '20px',
          }}
        >
          {message}
        </DialogContentText>
        {error && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
            }}
          >
            <Typography
              sx={{
                color: '#DC2626',
                fontSize: '14px',
                fontFamily: 'Outfit',
                fontWeight: 500,
              }}
            >
              {error}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2, gap: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            fontFamily: 'Outfit',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0px',
            borderRadius: '8px',
            padding: '10px 24px',
            border: '1px solid #D1D5DB',
            color: '#374151',
            backgroundColor: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#F9FAFB',
              borderColor: '#9CA3AF',
            },
            '&:disabled': {
              backgroundColor: '#F3F4F6',
              color: '#9CA3AF',
              borderColor: '#E5E7EB',
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading}
          autoFocus
          sx={{
            fontFamily: 'Outfit',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0px',
            borderRadius: '8px',
            padding: '10px 24px',
            backgroundColor: variant === 'error' ? '#DC2626' : '#2563EB',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: variant === 'error' ? '#B91C1C' : '#1D4ED8',
              color: '#FFFFFF',
            },
            '&:disabled': {
              backgroundColor: '#9CA3AF',
              color: '#FFFFFF',
            },
          }}
        >
          {loading ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
