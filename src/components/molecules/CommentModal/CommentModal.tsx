'use client'

import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

interface CommentModalProps {
  open: boolean
  onClose: () => void
  comment: string
  developer: string
  activityId?: string | undefined
}

export const CommentModal: React.FC<CommentModalProps> = ({
  open,
  onClose,
  comment,
  developer,
  activityId,
}) => {
  // Dummy comment text - you can replace this with actual comment data
  const dummyCommentText = `This is a detailed comment for ${developer} regarding their project registration. 

The comment provides additional context about the current status and any specific requirements or issues that need to be addressed.

Key points:
• Project documentation review status
• Compliance requirements
• Next steps for approval process
• Any outstanding items that need attention

This comment helps track the progress and provides clear guidance for the next actions required.`

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e5e7eb',
          pb: 2,
        }}
      >
        <Box>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontFamily: 'Outfit',
              fontWeight: 400,
              fontStyle: 'normal',
              fontSize: '20px',
              lineHeight: '100%',
              letterSpacing: '-0.02em',
              verticalAlign: 'middle',
              color: '#1E2939'
            }}
          >
            Comment Details
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              mt: 0.5,
              fontFamily: 'Outfit',
              fontWeight: 500,
              color: '#1E2939'
            }}
          >
            {developer} {activityId && `• ${activityId}`}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 1,
              fontFamily: 'Outfit',
              fontWeight: 500,
              color: '#1E2939'
            }}
          >
            Comment ID: {comment}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              lineHeight: 1.6,
              fontFamily: 'Outfit',
              fontWeight: 400,
              color: '#1E2939',
              fontSize: '14px',
             
            }}
          >
            {dummyCommentText}
          </Typography>
        </Box>

      </DialogContent>

     
    </Dialog>
  )
} 