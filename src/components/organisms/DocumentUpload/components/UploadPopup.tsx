import React, { useRef, useState, useCallback } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  LinearProgress,
  Alert,
  Chip,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import FileIcon from '@mui/icons-material/Description'
import { DropdownOption } from '../../../../services/api/applicationSettingService'
import { validateFile } from '../utils'
import { UploadConfig } from '../types'

interface FileWithProgress {
  id: string
  file: File
  progress?: number
  status?: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

interface UploadPopupProps {
  open: boolean
  onClose: () => void
  onUpload: (files: File[], documentType: string) => Promise<void>
  documentTypes: DropdownOption[]
  loading?: boolean
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxSize?: number // in MB
  uploadConfig?: UploadConfig
}

export const UploadPopup: React.FC<UploadPopupProps> = ({
  open,
  onClose,
  onUpload,
  documentTypes,
  loading = false,
  accept = '.pdf,.docx,.xlsx,.jpg,.jpeg,.png',
  multiple = true,
  maxFiles = 10,
  maxSize = 25,
  uploadConfig,
}) => {
  const [files, setFiles] = useState<FileWithProgress[]>([])
  const [selectedDocumentType, setSelectedDocumentType] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }, [])

  const handleFileSelect = useCallback(
    (selectedFiles: FileList) => {
      const fileArray = Array.from(selectedFiles)
      const validFiles: FileWithProgress[] = []
      const newErrors: string[] = []

      fileArray.forEach((file) => {
        // Use the same validation logic as DocumentUpload
        if (uploadConfig) {
          const validationResult = validateFile(file, uploadConfig)
          if (!validationResult.isValid) {
            newErrors.push(validationResult.error || 'File validation failed')
            return
          }
        } else {
          // Fallback validation if no uploadConfig provided
          // Check file size
          if (file.size > maxSize * 1024 * 1024) {
            newErrors.push(`${file.name} is too large (max ${maxSize}MB)`)
            return
          }

          // Check file type - allow PDF, DOCX, XLSX, JPEG, PNG
          const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
          const allowedExtensions = [
            '.pdf',
            '.docx',
            '.xlsx',
            '.jpg',
            '.jpeg',
            '.png',
          ]
          if (!allowedExtensions.includes(fileExtension)) {
            newErrors.push(
              `Only PDF, DOCX, XLSX, JPEG, PNG files are allowed. ${file.name} is not a supported file type.`
            )
            return
          }
        }

        // Check file count
        if (files.length + validFiles.length >= maxFiles) {
          newErrors.push(`Maximum ${maxFiles} files allowed`)
          return
        }

        validFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          file: file,
          status: 'pending',
          progress: 0,
        })
      })

      setErrors(newErrors)

      if (validFiles.length > 0) {
        setFiles((prev) => [...prev, ...validFiles])
      }
    },
    [files, maxFiles, maxSize, accept, uploadConfig]
  )

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files)
    }
  }

  const handleRemoveFile = (fileId: string) => {
    setFiles((prev) => {
      const filtered = prev.filter((f) => f.id !== fileId)

      return filtered
    })

    // Reset file input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleUpload = async () => {
    if (!selectedDocumentType) {
      setErrors(['Please select a document type'])
      return
    }

    if (files.length === 0) {
      setErrors(['Please select at least one file'])
      return
    }

    setIsUploading(true)
    setErrors([])

    try {
      // Extract the actual File objects from FileWithProgress objects
      const fileObjects = files.map((f) => f.file)
      await onUpload(fileObjects, selectedDocumentType)
      handleClose()
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Upload failed'])
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setFiles([])
    setSelectedDocumentType('')
    setErrors([])
    setIsUploading(false)
    onClose()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: 'Outfit',
          fontWeight: 600,
          fontSize: '18px',
          color: '#1F2937',
          pb: 1,
        }}
      >
        Upload File
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* File Type Instructions */}
        <Typography
          variant="body2"
          sx={{
            mb: 3,
            fontFamily: 'Outfit',
            color: '#6B7280',
            fontSize: '14px',
          }}
        >
          Supported formats: PDF, DOCX, XLSX, JPEG, PNG • Max size: {maxSize}MB
        </Typography>

        {/* Drag and Drop Area */}
        <Box
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleUploadClick}
          sx={{
            border: '2px dashed',
            borderColor: dragActive ? '#2563EB' : '#D1D5DB',
            borderRadius: '8px',
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: dragActive ? '#F0F9FF' : '#FAFAFA',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#2563EB',
              backgroundColor: '#F0F9FF',
            },
          }}
        >
          <CloudUploadIcon
            sx={{
              fontSize: 48,
              color: dragActive ? '#2563EB' : '#9CA3AF',
              mb: 2,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Outfit',
              fontWeight: 500,
              color: '#374151',
              mb: 1,
            }}
          >
            Choose files or drag and drop
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'Outfit',
              color: '#6B7280',
              fontSize: '14px',
            }}
          >
            Select a file to upload
          </Typography>
        </Box>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        {/* Document Type Selection */}
        <FormControl
          fullWidth
          sx={{
            mt: 3,
            '& .MuiOutlinedInput-notchedOutline': {
              border: '1px solid #d1d5db',
              borderRadius: '6px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              border: '1px solid #9ca3af',
            },
            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: '2px solid #2563eb',
            },
          }}
          variant="outlined"
        >
          <InputLabel
            sx={{
              fontFamily: 'Outfit',
              color: '#6B7280',
              '&.Mui-focused': {
                color: '#2563EB',
              },
            }}
          >
            Document Type
          </InputLabel>
          <Select
            value={selectedDocumentType}
            onChange={(e: SelectChangeEvent) =>
              setSelectedDocumentType(e.target.value)
            }
            label="Document Type"
            disabled={loading}
            sx={{
              height: '52px',
              fontFamily: 'Outfit',
              fontSize: '14px',
              color: '#374151',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#D1D5DB',
                borderWidth: '1px',
                borderRadius: '8px',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#9CA3AF',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#2563EB',
                borderWidth: '2px',
              },
              '& .MuiSelect-icon': {
                color: '#666',
              },
              '& .MuiSelect-select': {
                padding: '12px 14px',
                fontFamily: 'Outfit',
                fontSize: '14px',
                color: '#374151',
              },
            }}
            variant="outlined"
          >
            {/* {documentTypes.length > 0 ? (
              documentTypes.map((docType) => (
                <MenuItem
                  key={docType.id}
                  value={docType.id.toString()}
                  sx={{
                    fontFamily: 'Outfit',
                    fontSize: '14px',
                    color: '#374151',
                    '&:hover': {
                      backgroundColor: '#F3F4F6',
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#EFF6FF',
                      color: '#2563EB',
                    },
                  }}
                >
                  {docType.label}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled value="">
                No document types available
              </MenuItem>
            )} */}
             {documentTypes.map((docType) => (
              <MenuItem
                key={docType.id}
                value={docType.id.toString()}
                sx={{
                  fontFamily: 'Outfit',
                  fontSize: '14px',
                  color: '#374151',
                  '&:hover': {
                    backgroundColor: '#F3F4F6',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                  },
                }}
              >
                {docType.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Loading Indicator */}
        {loading && (
          <Box display="flex" justifyContent="center" py={2}>
            <LinearProgress sx={{ width: '100%' }} />
          </Box>
        )}

        {/* Selected Files */}
        {files.length > 0 && (
          <Box mt={3}>
            <Typography
              variant="subtitle2"
              sx={{
                fontFamily: 'Outfit',
                mb: 2,
                fontWeight: 500,
                color: '#374151',
                fontSize: '14px',
              }}
            >
              Selected Files ({files.length}):
            </Typography>
            {files.map((fileWithProgress) => (
              <Box
                key={fileWithProgress.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  mb: 1,
                  backgroundColor: '#F9FAFB',
                }}
              >
                <FileIcon sx={{ mr: 2, color: '#6B7280' }} />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'Outfit',
                      fontWeight: 500,
                      color: '#374151',
                      fontSize: '14px',
                    }}
                  >
                    {fileWithProgress.file.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: 'Outfit',
                      color: '#6B7280',
                      fontSize: '12px',
                    }}
                  >
                    {formatFileSize(fileWithProgress.file.size)}
                  </Typography>
                  {fileWithProgress.status === 'uploading' && (
                    <LinearProgress
                      variant="determinate"
                      value={fileWithProgress.progress || 0}
                      sx={{ mt: 1, height: 4 }}
                    />
                  )}
                  {fileWithProgress.status === 'error' && (
                    <Alert severity="error" sx={{ mt: 1, py: 0 }}>
                      {fileWithProgress.error}
                    </Alert>
                  )}
                  {fileWithProgress.status === 'success' && (
                    <Chip
                      label="Uploaded"
                      size="small"
                      color="success"
                      sx={{ mt: 1, height: 20 }}
                    />
                  )}
                </Box>
                <Button
                  onClick={() => handleRemoveFile(fileWithProgress.id)}
                  disabled={fileWithProgress.status === 'uploading'}
                  sx={{
                    minWidth: 'auto',
                    p: 1,
                    color: '#EF4444',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#FEF2F2',
                    },
                    '&:disabled': {
                      color: '#9CA3AF',
                      cursor: 'not-allowed',
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </Button>
              </Box>
            ))}
          </Box>
        )}

        {/* Error Messages */}
        {errors.length > 0 && (
          <Box mt={2}>
            {errors.map((error, index) => (
              <Alert key={index} severity="error" sx={{ mb: 1 }}>
                {error}
              </Alert>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2, gap: 2 }}>
        <Button
          onClick={handleClose}
          disabled={isUploading}
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
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={
            !selectedDocumentType ||
            files.length === 0 ||
            isUploading ||
            loading
          }
          sx={{
            fontFamily: 'Outfit',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0px',
            borderRadius: '8px',
            padding: '10px 24px',
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#1D4ED8',
              color: '#FFFFFF',
            },
            '&:disabled': {
              backgroundColor: '#9CA3AF',
              color: '#FFFFFF',
            },
          }}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
