import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  Paper
} from '@mui/material';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const vehicleTypes = [
  'Electric Car',
  'Electric Bike',
  'Electric Scooter',
  'Electric Bus',
  'Other'
];

function VehicleRegistration() {
  const [vehicle, setVehicle] = useState({
    model: '',
    type: '',
    manufacturer: '',
    year: '',
    licensePlate: '',
    batteryCapacity: '',
    chargingSpeed: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/customer/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(vehicle)
      });

      if (response.ok) {
        toast.success('Vehicle registered successfully!');
        setVehicle({
          model: '',
          type: '',
          manufacturer: '',
          year: '',
          licensePlate: '',
          batteryCapacity: '',
          chargingSpeed: ''
        });
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to register vehicle');
      }
    } catch (error) {
      console.error('Error registering vehicle:', error);
      toast.error('Error occurred while registering vehicle');
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Register Your Electric Vehicle
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Vehicle Model"
              name="model"
              value={vehicle.model}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              select
              label="Vehicle Type"
              name="type"
              value={vehicle.type}
              onChange={handleChange}
            >
              {vehicleTypes.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Manufacturer"
              name="manufacturer"
              value={vehicle.manufacturer}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Year"
              name="year"
              type="number"
              value={vehicle.year}
              onChange={handleChange}
              inputProps={{ min: "1900", max: new Date().getFullYear() }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="License Plate Number"
              name="licensePlate"
              value={vehicle.licensePlate}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Battery Capacity (kWh)"
              name="batteryCapacity"
              type="number"
              value={vehicle.batteryCapacity}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Charging Speed (kW)"
              name="chargingSpeed"
              type="number"
              value={vehicle.chargingSpeed}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Register Vehicle
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default VehicleRegistration; 