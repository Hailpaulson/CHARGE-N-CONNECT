import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert
} from '@mui/material';
import { toast } from 'react-hot-toast';

const connectorTypes = [
  'Type 1 (J1772)',
  'Type 2 (Mennekes)',
  'CCS1',
  'CCS2',
  'CHAdeMO',
  'Tesla'
];

const StationManagement = ({ station, onSave, onCancel }) => {
  const [stationData, setStationData] = useState(station || {
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    available: true,
    pricePerHour: '',
    powerOutput: '',
    connectorType: '',
    location: {
      type: 'Point',
      coordinates: [0, 0] // [longitude, latitude]
    },
    operatingHours: {
      start: '00:00',
      end: '23:59'
    }
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!stationData.name) newErrors.name = 'Station name is required';
    if (!stationData.address) newErrors.address = 'Address is required';
    if (!stationData.city) newErrors.city = 'City is required';
    if (!stationData.state) newErrors.state = 'State is required';
    if (!stationData.zipCode) newErrors.zipCode = 'ZIP Code is required';
    if (!stationData.pricePerHour) newErrors.pricePerHour = 'Price per hour is required';
    if (!stationData.powerOutput) newErrors.powerOutput = 'Power output is required';
    if (!stationData.connectorType) newErrors.connectorType = 'Connector type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'available') {
      setStationData(prev => ({
        ...prev,
        available: checked
      }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setStationData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setStationData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(stationData);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Please correct the errors below
            </Alert>
          )}
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Station Name"
            name="name"
            value={stationData.name}
            onChange={handleChange}
            required
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Price per Hour"
            name="pricePerHour"
            type="number"
            value={stationData.pricePerHour}
            onChange={handleChange}
            required
            error={!!errors.pricePerHour}
            helperText={errors.pricePerHour}
            InputProps={{
              startAdornment: '$',
              inputProps: { min: 0, step: 0.01 }
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={stationData.address}
            onChange={handleChange}
            required
            error={!!errors.address}
            helperText={errors.address}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={stationData.city}
            onChange={handleChange}
            required
            error={!!errors.city}
            helperText={errors.city}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="State"
            name="state"
            value={stationData.state}
            onChange={handleChange}
            required
            error={!!errors.state}
            helperText={errors.state}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="ZIP Code"
            name="zipCode"
            value={stationData.zipCode}
            onChange={handleChange}
            required
            error={!!errors.zipCode}
            helperText={errors.zipCode}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Power Output (kW)"
            name="powerOutput"
            type="number"
            value={stationData.powerOutput}
            onChange={handleChange}
            required
            error={!!errors.powerOutput}
            helperText={errors.powerOutput}
            InputProps={{
              inputProps: { min: 0 }
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Connector Type"
            name="connectorType"
            value={stationData.connectorType}
            onChange={handleChange}
            required
            error={!!errors.connectorType}
            helperText={errors.connectorType}
          >
            {connectorTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Operating Hours Start"
            name="operatingHours.start"
            type="time"
            value={stationData.operatingHours.start}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Operating Hours End"
            name="operatingHours.end"
            type="time"
            value={stationData.operatingHours.end}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={stationData.available}
                onChange={handleChange}
                name="available"
              />
            }
            label="Available for Booking"
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            {onCancel && (
              <Button variant="outlined" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" variant="contained" color="primary">
              {station ? 'Update Station' : 'Add Station'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StationManagement; 