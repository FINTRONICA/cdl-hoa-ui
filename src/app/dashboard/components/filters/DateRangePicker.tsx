import React from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import { CalendarTodayOutlined } from '@mui/icons-material'

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onChange: (start: string, end: string) => void
  className?: string
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  className = '',
}) => {
  const handleStartDateChange = (date: Dayjs | null) => {
    console.log('[DateRangePicker] Start date changed:', date)
    if (date && dayjs.isDayjs(date) && date.isValid()) {
      const formattedDate = date.format('DD-MM-YYYY')
      console.log('[DateRangePicker] Formatted start date:', formattedDate)
      
      // If end date exists and is before the new start date, clear it
      if (endDate && dayjs(endDate, 'DD-MM-YYYY').isValid()) {
        const endDateObj = dayjs(endDate, 'DD-MM-YYYY')
        if (endDateObj.isBefore(date, 'day')) {
          console.warn('[DateRangePicker] End date is before new start date, clearing end date')
          onChange(formattedDate, '')
          return
        }
      }
      
      onChange(formattedDate, endDate)
    } else {
      onChange('', endDate)
    }
  }

  const handleEndDateChange = (date: Dayjs | null) => {
    console.log('[DateRangePicker] End date changed:', date)
    if (date && dayjs.isDayjs(date) && date.isValid()) {
      // Validate that end date is not before start date
      if (startDate && dayjs(startDate, 'DD-MM-YYYY').isValid()) {
        const startDateObj = dayjs(startDate, 'DD-MM-YYYY')
        if (date.isBefore(startDateObj, 'day')) {
          console.warn('[DateRangePicker] End date cannot be before start date')
          // Don't update if end date is before start date
          return
        }
      }
      const formattedDate = date.format('DD-MM-YYYY')
      console.log('[DateRangePicker] Formatted end date:', formattedDate)
      onChange(startDate, formattedDate)
    } else {
      onChange(startDate, '')
    }
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


  const commonFieldStyles = {
    height: '46px',
    fontFamily: 'Outfit, sans-serif',
    '& .MuiOutlinedInput-root': {
      height: '46px',
      borderRadius: '8px',
      fontFamily: 'Outfit, sans-serif',
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
      '&.Mui-error fieldset': {
        borderColor: '#CAD5E2',
      },
      '&.Mui-error:hover fieldset': {
        borderColor: '#CAD5E2',
      },
    },
    '& .MuiInputBase-input': {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '14px',
      color: '#1E2939',
    },
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={`date-range-picker flex gap-2 ${className}`}>
        <DatePicker
          label="Start Date"
          value={startDate && dayjs(startDate, 'DD-MM-YYYY').isValid() ? dayjs(startDate, 'DD-MM-YYYY') : null}
          onChange={handleStartDateChange}
          format="DD-MM-YYYY"
          slotProps={{
            textField: {
              fullWidth: true,
              sx: commonFieldStyles,
              InputLabelProps: { sx: labelSx },
              InputProps: {
                sx: valueSx,
                style: { height: '46px' },
              },
              error: false,
            },
            popper: {
              placement: 'bottom-start',
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 8],
                  },
                },
              ],
            },
          }}
          slots={{
            openPickerIcon: CalendarTodayOutlined,
          }}
        />

        <span className="flex items-center text-gray-100">|</span>

        <DatePicker
          label="End Date"
          value={endDate && dayjs(endDate, 'DD-MM-YYYY').isValid() ? dayjs(endDate, 'DD-MM-YYYY') : null}
          onChange={handleEndDateChange}
          format="DD-MM-YYYY"
          {...(startDate && dayjs(startDate, 'DD-MM-YYYY').isValid()
            ? { minDate: dayjs(startDate, 'DD-MM-YYYY') }
            : {})}
          slotProps={{
            textField: {
              fullWidth: true,
              sx: commonFieldStyles,
              InputLabelProps: { sx: labelSx },
              InputProps: {
                sx: valueSx,
                style: { height: '46px' },
              },
              error: false,
            },
            popper: {
              placement: 'bottom-start',
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 8],
                  },
                },
              ],
            },
          }}
          slots={{
            openPickerIcon: CalendarTodayOutlined,
          }}
        />
      </div>
    </LocalizationProvider>
  )
}
