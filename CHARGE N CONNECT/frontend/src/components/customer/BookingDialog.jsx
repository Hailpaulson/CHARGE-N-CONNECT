import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box
} from '@mui/material';

const theme = {
  primary: '#1A1F37',
  secondary: '#2A2D3E',
  accent: '#0075FF',
  text: {
    primary: '#FFFFFF',
    secondary: '#A0AEC0'
  }
};

const BookingDialog = ({ open, onClose, station, onConfirm }) => {
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [errors, setErrors] = useState({});

  const calculateTotalPrice = () => {
    return station.pricePerHour * duration;
  };

  // Format location object to string
  const formatLocation = (location) => {
    if (!location) return 'Location not available';
    if (typeof location === 'string') return location;
    if (location.address) return location.address;
    if (location.coordinates) {
      return `${location.coordinates[1]}, ${location.coordinates[0]}`;
    }
    return 'Location details not available';
  };

  const resetForm = () => {
    // Set default date-time to current time rounded to next hour
    const now = new Date();
    now.setMinutes(0);
    now.setHours(now.getHours() + 1);
    setStartTime(now.toISOString().slice(0, 16)); // Format: "YYYY-MM-DDThh:mm"
    setDuration(1);
    setErrors({});
  };

  const handleConfirm = () => {
    // Validate inputs
    const newErrors = {};
    const selectedTime = new Date(startTime);
    const now = new Date();
    
    if (!startTime) {
      newErrors.startTime = 'Please select a start time';
    } else if (selectedTime < now) {
      newErrors.startTime = 'Start time must be in the future';
    }

    if (!duration || duration < 1) {
      newErrors.duration = 'Duration must be at least 1 hour';
    } else if (duration > 24) {
      newErrors.duration = 'Duration cannot exceed 24 hours';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onConfirm({
      startTime: selectedTime,
      duration: Number(duration),
      totalPrice: calculateTotalPrice()
    });
  };

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: theme.secondary,
          color: theme.text.primary,
          borderRadius: 2
        }
      }}
    >
      <DialogTitle>Book Charging Station</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Station Details:
          </Typography>
          <Typography>Name: {station?.name || 'Name not available'}</Typography>
          <Typography>Location: {formatLocation(station?.location)}</Typography>
          <Typography>Price per hour: ${station?.pricePerHour?.toFixed(2) || '0.00'}</Typography>
          
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              type="datetime-local"
              label="Start Time"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                setErrors({ ...errors, startTime: null });
              }}
              error={!!errors.startTime}
              helperText={errors.startTime}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: new Date().toISOString().slice(0, 16)
              }}
              sx={{ mt: 2 }}
            />
          </Box>

          <TextField
            fullWidth
            type="number"
            label="Duration (hours)"
            value={duration}
            onChange={(e) => {
              setDuration(Number(e.target.value));
              setErrors({ ...errors, duration: null });
            }}
            error={!!errors.duration}
            helperText={errors.duration}
            InputProps={{ 
              inputProps: { min: 1, max: 24 }
            }}
            sx={{ mt: 2 }}
          />

          <Typography variant="h6" sx={{ mt: 2 }}>
            Total Price: ${calculateTotalPrice().toFixed(2)}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          onClose();
          resetForm();
        }}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Confirm Booking
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingDialog; 