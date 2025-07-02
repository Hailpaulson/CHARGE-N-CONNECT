import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const chargerTypes = [
  'Type 1',
  'Type 2 (Mennekes)',
  'CHAdeMO',
  'CCS'
];

const VehicleList = ({ onVehicleSelect }) => {
  const [vehicles, setVehicles] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    chargerType: ''
  });

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/vehicles/my-vehicles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to fetch vehicles');
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/vehicles`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Vehicle added successfully');
      setOpen(false);
      fetchVehicles();
      setFormData({
        make: '',
        model: '',
        year: '',
        licensePlate: '',
        chargerType: ''
      });
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast.error('Failed to add vehicle');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">My Vehicles</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Vehicle
        </Button>
      </Box>

      <Grid container spacing={2}>
        {vehicles.map((vehicle) => (
          <Grid item xs={12} sm={6} md={4} key={vehicle._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{vehicle.make} {vehicle.model}</Typography>
                <Typography color="textSecondary">Year: {vehicle.year}</Typography>
                <Typography>License Plate: {vehicle.licensePlate}</Typography>
                <Typography>Charger Type: {vehicle.chargerType}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onVehicleSelect(vehicle)}
                  sx={{ mt: 1 }}
                >
                  Select Vehicle
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Vehicle</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Make"
                  required
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Model"
                  required
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Year"
                  type="number"
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="License Plate"
                  required
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Charger Type"
                  required
                  value={formData.chargerType}
                  onChange={(e) => setFormData({ ...formData, chargerType: e.target.value })}
                >
                  {chargerTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Add Vehicle</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VehicleList; 