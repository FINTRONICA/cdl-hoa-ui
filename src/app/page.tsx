'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Grid,
  Typography,
  TextField,
  Checkbox,
  Button,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Divider,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Visibility, VisibilityOff, Language, Google } from '@mui/icons-material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material'
import Image from 'next/image';

export default function Home() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState('en'); // Default language

  // Function to handle language change
  const handleLanguageChange = (event: any) => {
    setLanguage(event.target.value);
  };

  const labelSx = {
    color: '#6A7282',
    fontFamily: 'Outfit',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '14px',
    letterSpacing: 0,
  };

  const valueSx = {
    color: '#1E2939',
    fontFamily: 'Outfit',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '16px',
    letterSpacing: 0,
    wordBreak: 'break-word',
  };

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

  // Styles for the Select component
  const selectStyles = {
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
    '& .MuiSelect-select': {
      paddingRight: '14px', // Adjust as needed for icon spacing
    },
    '& .MuiInputLabel-root': {
      color: '#6A7282',
      '&.Mui-focused': {
        color: '#2563EB',
      },
    },
    '& .MuiSvgIcon-root': {
      color: '#6A7282',
    },
  };

  return (
    <Grid
      container
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url("/login-back.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: { xs: 2, md: 10 },
        // py: 4,
      }}
    >
      <Grid size={{ xs: 12, md: 5, lg: 4, }}>
        <Grid sx={{
          borderRadius: '24px',
          padding: '16px',
          background: '#FFFFFF80',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          boxShadow: 4
        }}>
          <Paper
            elevation={3}
            sx={{
              pt: 2,
              pr: 4,
              pb: 4,
              pl: 4,
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            {/* Header */}
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Image src="/Logo.png" alt="logo" width={100} height={40} />
              <Divider orientation="vertical" flexItem />
              <Typography sx={{
                fontFamily: 'Outfit',
                fontWeight: 600,
                fontSize: '28px',
                lineHeight: '100%',
                color: "#1E2939",
              }}>Login</Typography>
              <Box display="flex" alignItems="center">
                <FormControl fullWidth>
                  <Select
                    value={language}
                    onChange={handleLanguageChange}
                    displayEmpty
                    IconComponent={KeyboardArrowDownIcon} // Custom dropdown arrow
                    inputProps={{ 'aria-label': 'Language' }}
                    startAdornment={
                      <InputAdornment position="start">
                        <Language sx={{ color: '#2F80ED', fontSize: 20 }} />
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: '8px',
                      border: '2px solid #90CAF9', // Light blue
                      backgroundColor: 'transparent',
                      color: '#2F80ED',
                      pl: 0.5,
                      fontWeight: 500,
                      fontSize: '14px',
                      height: '36px',
                      '& .MuiSelect-icon': {
                        color: '#2F80ED',
                        right: 8,
                      },
                      '& fieldset': {
                        border: 'none', // Remove default border
                      },
                    }}
                    renderValue={(selected) => {
                      if (!selected) {
                        return <Typography sx={{ color: '#2F80ED' }}>Language</Typography>;
                      }
                      // return <Typography sx={{ color: '#2F80ED' }}>{selected}</Typography>;
                    }}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Español</MenuItem>
                  </Select>

                </FormControl>
              </Box>
            </Box>

            <Typography mt={1} sx={labelSx}>
              Welcome back, please login to access your personal account
            </Typography>

            {/* Form */}
            <Box mt={3}>
              <TextField
                // {...field}
                fullWidth
                placeholder="you@example.com"
                label="Email"
                type='email'
                InputLabelProps={{ sx: labelSx }}
                InputProps={{ sx: valueSx }}
                sx={[commonFieldStyles, { mb: 2 }]}
              />

              <TextField
                // {...field}
                fullWidth
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                InputLabelProps={{ sx: labelSx }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#CAD5E2' }}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: valueSx
                }}
                sx={[commonFieldStyles, { mb: 2 }]}
              />

              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <FormControlLabel
                  control={<Checkbox size="small" defaultChecked />}
                  label="Remember me"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontFamily: 'Outfit',
                      fontSize: '14px',
                      color: '#1E2939',
                    },
                  }}
                />
                <Button variant="text" sx={{ fontSize: '14px', fontFamily: 'Outfit', textTransform: 'none' }}>
                  Forgot Password
                </Button>
              </Box>

              <Button
                fullWidth
                variant="contained"
                sx={{
                  textTransform: 'none',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  fontSize: '16px',
                  lineHeight: '20px',
                  letterSpacing: 0,
                  borderRadius: '24px'
                }}
                onClick={() => { router.push('/dashboard') }}
              >
                Login
              </Button>

            </Box>

          </Paper>
        </Grid>

        {/* Footer */}
        <Typography
          variant="caption"
          textAlign="center"
          display="block"
          mt={2}
          color="text.secondary"
        >
          © 2025, Powered by <strong>Fintronika®</strong>
        </Typography>

      </Grid>
    </Grid>
  );
}

