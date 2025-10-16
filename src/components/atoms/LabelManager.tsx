import React, { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { useCapitalPartnerLabelManagement } from '@/hooks/useCapitalPartnerLabelManagement'

interface LabelManagerProps {
  configId: string
  currentLabel: string
  labelId?: number
  onLabelUpdated?: () => void
}

export const LabelManager: React.FC<LabelManagerProps> = ({
  configId,
  currentLabel,
  labelId,
  onLabelUpdated,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [newLabel, setNewLabel] = useState(currentLabel)
  const [language, setLanguage] = useState('EN')
  
  const { updateLabel, createLabel, isUpdating, error } = useCapitalPartnerLabelManagement()

  const handleSave = async () => {
    try {
      if (labelId) {
        // Update existing label
        await updateLabel(labelId, newLabel)
      } else {
        // Create new label
        await createLabel(configId, newLabel, language)
      }
      
      onLabelUpdated?.()
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to save label:', error)
    }
  }

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        onClick={() => setIsOpen(true)}
        sx={{ ml: 1 }}
      >
        Edit Label
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Label: {configId}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              fullWidth
              label="Config ID"
              value={configId}
              disabled
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="New Label Value"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            {!labelId && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Language</InputLabel>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  label="Language"
                >
                  <MenuItem value="EN">English</MenuItem>
                  <MenuItem value="ES">Spanish</MenuItem>
                  <MenuItem value="AR">Arabic</MenuItem>
                </Select>
              </FormControl>
            )}
            
            <Typography variant="body2" color="text.secondary">
              Current label: <strong>{currentLabel}</strong>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={isUpdating || !newLabel.trim()}
          >
            {isUpdating ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
