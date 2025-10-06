import React, { useState } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Grid,
    TextField,
    Select as MuiSelect,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Drawer,
    Box,
    Checkbox as MuiCheckbox,
    FormControlLabel,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Switch,
    Typography,
    Chip,
} from '@mui/material'
import {
    KeyboardArrowDown as KeyboardArrowDownIcon,
    ExpandMore as ExpandMoreIcon,
    Edit as EditIcon,
} from '@mui/icons-material'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'

interface RightSlideUserPanelProps {
    isOpen: boolean
    onClose: () => void
    mode?: 'add' | 'edit'
    userData?: {
        firstName: string
        lastName: string
        emailId: string
        status: string
        username: string
        userId: string
        selectedRoles: string[]
        rolePermissions: Record<string, Permission[]>
        roleEnabled: Record<string, boolean>
    } | null
}

// API-ready interfaces for future integration
interface Permission {
    id: string
    name: string
    description: string
    enabled: boolean
}

interface Role {
    id: string
    name: string
    permissions: Permission[]
}

interface UserFormData {
    firstName: string
    lastName: string
    emailId: string
    status: string
    username: string
    userId: string
    selectedRoles: string[] // Changed to array to support multiple roles
    rolePermissions: Record<string, Permission[]> // Role ID -> Permissions mapping
    roleEnabled: Record<string, boolean> // Track if each role is enabled
}

const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
]



export const RightSlideUserPanel: React.FC<RightSlideUserPanelProps> = ({
    isOpen,
    onClose,
    mode = 'add',
    userData,
}) => {
    // Mock data for roles and permissions (will be replaced with API calls)
    const mockRoles: Role[] = [
        {
            id: 'sr-admin',
            name: 'Sr. Admin',
            permissions: [
                { id: 'user_create', name: 'Create Users', description: 'Can create new users', enabled: false },
                { id: 'user_edit', name: 'Edit Users', description: 'Can edit existing users', enabled: false },
                { id: 'user_delete', name: 'Delete Users', description: 'Can delete users', enabled: false },
                { id: 'role_assign', name: 'Assign Roles', description: 'Can assign roles to users', enabled: false },
            ]
        },
        {
            id: 'assigner',
            name: 'Assigner',
            permissions: [
                { id: 'task_assign', name: 'Assign Tasks', description: 'Can assign tasks to users', enabled: false },
                { id: 'task_view', name: 'View Tasks', description: 'Can view all tasks', enabled: false },
            ]
        },
        {
            id: 'admin',
            name: 'Admin',
            permissions: [
                { id: 'admin_report_view', name: 'Admin Report View', description: 'Can view admin reports', enabled: true },
                { id: 'admin_sec', name: 'ADMIN_SEC', description: 'Admin security permissions', enabled: true },
                { id: 'am_approval', name: 'AM Approval', description: 'Can approve AM requests', enabled: true },
                { id: 'am_involved', name: 'AM Involved', description: 'Can view involved AM activities', enabled: true },
                { id: 'am_pending', name: 'AM Pending', description: 'Can view pending AM activities', enabled: true },
                { id: 'permission_1', name: 'Permission 1', description: 'General permission 1', enabled: false },
            ]
        },
        {
            id: 'maker',
            name: 'Maker',
            permissions: [
                { id: 'transaction_create', name: 'Create Transactions', description: 'Can create new transactions', enabled: false },
                { id: 'transaction_edit', name: 'Edit Transactions', description: 'Can edit transactions', enabled: false },
            ]
        },
        {
            id: 'checker',
            name: 'Checker',
            permissions: [
                { id: 'transaction_verify', name: 'Verify Transactions', description: 'Can verify transactions', enabled: false },
                { id: 'approval_process', name: 'Approval Process', description: 'Can process approvals', enabled: false },
            ]
        },
        {
            id: 'reviewer',
            name: 'Reviewer',
            permissions: [
                { id: 'content_review', name: 'Review Content', description: 'Can review content', enabled: false },
                { id: 'quality_check', name: 'Quality Check', description: 'Can perform quality checks', enabled: false },
            ]
        },
        {
            id: 'manager',
            name: 'Manager',
            permissions: [
                { id: 'manager_reports', name: 'Manager Reports', description: 'Can view manager reports', enabled: false },
                { id: 'team_oversight', name: 'Team Oversight', description: 'Can oversee team activities', enabled: false },
                { id: 'approval_workflow', name: 'Approval Workflow', description: 'Can manage approval workflows', enabled: false },
            ]
        },
        {
            id: 'enbd',
            name: 'ENBD',
            permissions: [
                { id: 'bank_operations', name: 'Bank Operations', description: 'Can perform bank operations', enabled: false },
                { id: 'financial_approve', name: 'Financial Approval', description: 'Can approve financial transactions', enabled: false },
            ]
        },
    ]

    const [isEditMode, setIsEditMode] = useState(false)
    
    const [formData, setFormData] = useState<UserFormData>(() => {
        if (mode === 'edit' && userData) {
            return userData
        }
        return {
            firstName: 'Rakesh',
            lastName: 'Raushan',
            emailId: 'rakesh.raushan@email.com',
            status: 'active',
            username: 'RakeshR',
            userId: 'RakeshR0234',
            selectedRoles: ['admin', 'manager'], // Pre-selected roles
            rolePermissions: {
                admin: mockRoles.find(r => r.id === 'admin')?.permissions || [],
                manager: mockRoles.find(r => r.id === 'manager')?.permissions || [],
            }, // Initialize with pre-selected roles' permissions
            roleEnabled: { admin: true, manager: true }, // Track role enabled state
        }
    })

    // Update form data when userData changes (for edit mode)
    React.useEffect(() => {
        if (mode === 'edit' && userData) {
            setFormData(userData)
            setIsEditMode(false) // Reset edit mode when new user is selected
        }
    }, [mode, userData])

    const commonFieldStyles = {
        height: '46px',
        '& .MuiOutlinedInput-root': {
            height: '46px',
            borderRadius: '8px',
            '& fieldset': {
                borderColor: '#E2E8F0',
                borderWidth: '1px',
            },
            '&:hover fieldset': {
                borderColor: '#E2E8F0',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#2563EB',
            },
        },
    }

    const selectStyles = {
        ...commonFieldStyles,
        '& .MuiSelect-icon': {
            color: '#666',
        },
    }

    const handleInputChange = (field: keyof UserFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleRoleSelection = (roleId: string, checked: boolean) => {
        setFormData(prev => {
            let newSelectedRoles = [...prev.selectedRoles]
            
            if (checked) {
                if (!newSelectedRoles.includes(roleId)) {
                    newSelectedRoles.push(roleId)
                }
            } else {
                newSelectedRoles = newSelectedRoles.filter(id => id !== roleId)
            }

            // Initialize role permissions when role is selected
            const newRolePermissions = { ...prev.rolePermissions }
            if (checked && !newRolePermissions[roleId]) {
                const role = mockRoles.find(r => r.id === roleId)
                if (role) {
                    newRolePermissions[roleId] = [...role.permissions]
                }
            } else if (!checked) {
                delete newRolePermissions[roleId]
            }

            return {
                ...prev,
                selectedRoles: newSelectedRoles,
                rolePermissions: newRolePermissions,
            }
        })
    }

    const handleRoleToggle = (roleId: string, enabled: boolean) => {
        setFormData(prev => {
            const newRoleEnabled = { ...prev.roleEnabled, [roleId]: enabled }
            
            // If role is disabled, disable all its permissions
            const newRolePermissions = { ...prev.rolePermissions }
            if (!enabled && newRolePermissions[roleId]) {
                newRolePermissions[roleId] = newRolePermissions[roleId].map(permission => ({
                    ...permission,
                    enabled: false
                }))
            }
            
            return {
                ...prev,
                roleEnabled: newRoleEnabled,
                rolePermissions: newRolePermissions
            }
        })
    }

    const handlePermissionToggle = (roleId: string, permissionId: string, enabled: boolean) => {
        // Don't allow permission toggle if role is disabled
        if (!formData.roleEnabled[roleId]) {
            return
        }
        
        setFormData(prev => ({
            ...prev,
            rolePermissions: {
                ...prev.rolePermissions,
                [roleId]: prev.rolePermissions[roleId]?.map(permission =>
                    permission.id === permissionId
                        ? { ...permission, enabled }
                        : permission
                ) || []
            }
        }))
    }

    const handleAddUser = () => {
        console.log('Adding user:', formData)
        onClose()
    }

    const handleSaveUser = () => {
        console.log('Saving user:', formData)
        setIsEditMode(false)
        onClose()
    }

    const handleCancel = () => {
        if (isEditMode) {
            setIsEditMode(false)
            // Reset form data to original user data
            if (userData) {
                setFormData(userData)
            }
        } else {
            onClose()
        }
    }

    const handleEditClick = () => {
        setIsEditMode(true)
    }

    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: "460px",
                    height: 'calc(100vh - 48px)', // Full viewport height minus margins
                    maxHeight: 'calc(100vh - 48px)', // Ensure it doesn't exceed viewport
                    borderRadius: '12px',
                    background: '#FFFFFFE5',
                    boxShadow: '-8px 0px 8px 0px #62748E14',
                    backdropFilter: 'blur(10px)',
                    padding: '24px',
                    marginTop: "24px",
                    marginBottom: "12px",
                    overflow: 'hidden', // Prevent content from spilling out
                },
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: "36px", paddingLeft: "4px", paddingTop: 0, paddingBottom: 0, paddingRight: 0 }}>
                <span className="font-sans font-medium text-lg leading-7 tracking-0 text-[#1E2939]">
                    {mode === 'edit' ? (isEditMode ? 'Edit' : userData?.firstName + ' ' + userData?.lastName) : 'Add New User'}
                </span>
                <IconButton onClick={onClose}>
                    <img src="/close.svg" alt="close" />
                </IconButton>
            </DialogTitle>

            <DialogContent
                dividers
                sx={{
                    padding: 0,
                    paddingTop: "16px",
                }}
            >
                <Grid container rowSpacing={4} columnSpacing={2} mt={3}>
                    {/* Edit Button for View Mode */}
                    {mode === 'edit' && !isEditMode && (
                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    onClick={handleEditClick}
                                    sx={{
                                        borderColor: '#2563EB',
                                        color: '#2563EB',
                                        '&:hover': {
                                            borderColor: '#1D4ED8',
                                            backgroundColor: '#F8FAFC',
                                        },
                                    }}
                                >
                                    Edit
                                </Button>
                            </Box>
                        </Grid>
                    )}

                    {/* First Name */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="First Name"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            disabled={mode === 'edit' && !isEditMode}
                            sx={commonFieldStyles}
                        />
                    </Grid>

                    {/* Last Name */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            disabled={mode === 'edit' && !isEditMode}
                            sx={commonFieldStyles}
                        />
                    </Grid>

                    {/* Email ID and Status - Side by Side */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Email ID"
                            type="email"
                            value={formData.emailId}
                            onChange={(e) => handleInputChange('emailId', e.target.value)}
                            disabled={mode === 'edit' && !isEditMode}
                            sx={commonFieldStyles}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <MuiSelect
                                value={formData.status}
                                onChange={(e) => handleInputChange('status', e.target.value)}
                                label="Status"
                                disabled={mode === 'edit' && !isEditMode}
                                IconComponent={KeyboardArrowDownIcon}
                                sx={selectStyles}
                            >
                                {statusOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </MuiSelect>
                        </FormControl>
                    </Grid>

                    {/* Username and User ID - Side by Side */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Username"
                            value={formData.username}
                            onChange={(e) => handleInputChange('username', e.target.value)}
                            disabled={mode === 'edit' && !isEditMode}
                            sx={commonFieldStyles}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="User ID"
                            value={formData.userId}
                            onChange={(e) => handleInputChange('userId', e.target.value)}
                            disabled={mode === 'edit' && !isEditMode}
                            sx={commonFieldStyles}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <span className="font-sans font-medium text-[18px] leading-7 tracking-0 text-[#1E2939]">
                            Role and Permission
                        </span>
                    </Grid>
                    
                    {/* Role Selection Dropdown */}
                    <Grid size={{ xs: 12 }}>
                        <FormControl fullWidth>
                            <InputLabel>Select a Role</InputLabel>
                            <MuiSelect
                                value=""
                                label="Select a Role"
                                disabled={mode === 'edit' && !isEditMode}
                                IconComponent={KeyboardArrowDownIcon}
                                sx={selectStyles}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            '& .MuiMenu-list': {
                                                padding: '8px',
                                            },
                                        },
                                    },
                                }}
                            >
                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, minWidth: '300px' }}>
                                    {mockRoles.map((role) => (
                                        <MenuItem 
                                            key={role.id} 
                                            value={role.id}
                                            sx={{
                                                minHeight: '36px',
                                                fontSize: '14px',
                                                '&:hover': {
                                                    backgroundColor: '#F1F5F9',
                                                },
                                            }}
                                        >
                                            <FormControlLabel
                                                control={
                                                    <MuiCheckbox
                                                        checked={formData.selectedRoles.includes(role.id)}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            handleRoleSelection(role.id, e.target.checked);
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                        sx={{
                                                            '&.Mui-checked': {
                                                                color: '#2563EB',
                                                            },
                                                        }}
                                                    />
                                                }
                                                label={role.name}
                                                sx={{
                                                    margin: 0,
                                                    width: '100%',
                                                    '& .MuiFormControlLabel-label': {
                                                        fontSize: '14px',
                                                        color: '#1E2939',
                                                    },
                                                }}
                                            />
                                        </MenuItem>
                                    ))}
                                </Box>
                            </MuiSelect>
                        </FormControl>
                    </Grid>

                    {/* Selected Roles Accordion */}
                    {formData.selectedRoles.length > 0 && (
                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ mt: 2 }}>
                                {formData.selectedRoles.map((roleId) => {
                                    const role = mockRoles.find(r => r.id === roleId)
                                    const rolePermissions = formData.rolePermissions[roleId] || []
                                    
                                    if (!role) return null

                                    return (
                                        <Accordion 
                                            key={roleId}
                                            sx={{ 
                                                mb: 1,
                                                '&:before': { display: 'none' },
                                                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
                                                border: '1px solid #E2E8F0',
                                            }}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                sx={{
                                                    backgroundColor: '#F8FAFC',
                                                    '&:hover': {
                                                        backgroundColor: '#F1F5F9',
                                                    },
                                                }}
                                            >
                                                                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Typography variant="body1" fontWeight={500} color="#1E2939">
                                                                {role.name}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                ({rolePermissions.filter(p => p.enabled).length} of {rolePermissions.length} permissions enabled)
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <IconButton size="small" sx={{ color: '#666' }}>
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                            <Switch
                                                                checked={formData.roleEnabled[roleId] || false}
                                                                onChange={(e) => handleRoleToggle(roleId, e.target.checked)}
                                                                disabled={mode === 'edit' && !isEditMode}
                                                                size="medium"
                                                                sx={{
                                                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                                                        color: '#2563EB',
                                                                    },
                                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                                        backgroundColor: '#2563EB',
                                                                    },
                                                                    transform: 'scale(1.2)', // Make role switches bigger
                                                                }}
                                                            />
                                                        </Box>
                                                    </Box>
                                            </AccordionSummary>
                                            <AccordionDetails sx={{ pt: 0 }}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                    {rolePermissions.map((permission) => (
                                                        <Box 
                                                            key={permission.id}
                                                            sx={{ 
                                                                display: 'flex', 
                                                                justifyContent: 'space-between', 
                                                                alignItems: 'center',
                                                                p: 1,
                                                                borderRadius: '4px',
                                                                backgroundColor: '#FAFAFA',
                                                            }}
                                                        >
                                                            <Box>
                                                                <Typography variant="body2" fontWeight={500}>
                                                                    {permission.name}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {permission.description}
                                                                </Typography>
                                                            </Box>
                                                            <Switch
                                                                checked={permission.enabled}
                                                                disabled={!formData.roleEnabled[roleId] || (mode === 'edit' && !isEditMode)}
                                                                onChange={(e) => handlePermissionToggle(roleId, permission.id, e.target.checked)}
                                                                size="small"
                                                                sx={{
                                                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                                                        color: '#2563EB',
                                                                    },
                                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                                        backgroundColor: '#2563EB',
                                                                    },
                                                                    '& .Mui-disabled': {
                                                                        opacity: 0.5,
                                                                    },
                                                                    transform: 'scale(0.9)', // Make permission switches smaller
                                                                }}
                                                            />
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </AccordionDetails>
                                        </Accordion>
                                    )
                                })}
                            </Box>
                        </Grid>
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
                    display: 'flex',
                    gap: 2,
                }}
            >
                {mode === 'edit' && isEditMode && (
                    <Button 
                        fullWidth 
                        variant="outlined" 
                        onClick={handleCancel}
                        sx={{
                            borderColor: '#2563EB',
                            color: '#2563EB',
                            '&:hover': {
                                borderColor: '#1D4ED8',
                                backgroundColor: '#F8FAFC',
                            },
                        }}
                    >
                        Cancel
                    </Button>
                )}
                
                <Button 
                    fullWidth 
                    variant="contained" 
                    color="primary" 
                    onClick={mode === 'edit' ? handleSaveUser : handleAddUser}
                >
                    {mode === 'edit' ? 'Save' : 'Add User'}
                </Button>
            </Box>
        </Drawer>
    )
} 