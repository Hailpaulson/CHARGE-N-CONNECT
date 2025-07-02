import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Switch,
  FormControlLabel
} from '@mui/material';

const StationDialog = ({ open, onClose, station, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    pricePerHour: '',
    connectorType: '',
    powerOutput: '',
    available: true,
    description: ''
  });

  useEffect(() => {
    if (station) {
      setFormData({
        name: station.name || '',
        location: station.location || '',
        pricePerHour: station.pricePerHour || '',
        connectorType: station.connectorType || '',
        powerOutput: station.powerOutput || '',
        available: station.available ?? true,
        description: station.description || ''
      });
    } else {
      // Reset form when adding new station
      setFormData({
        name: '',
        location: '',
        pricePerHour: '',
        connectorType: '',
        powerOutput: '',
        available: true,
        description: ''
      });
    }
  }, [station]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (e) => {
    setFormData(prev => ({
      ...prev,
      available: e.target.checked
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      pricePerHour: parseFloat(formData.pricePerHour),
      powerOutput: parseFloat(formData.powerOutput)
    });
  };

  const connectorTypes = [
    'Type 1 (J1772)',
    'Type 2 (Mennekes)',
    'CCS1',
    'CCS2',
    'CHAdeMO',
    'Tesla'
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#2A2D3E',
          color: '#FFFFFF'
        }
      }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        {station ? 'Edit Station' : 'Add New Station'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="name"
              label="Station Name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiOutlinedInput-input': { color: '#FFFFFF' }
              }}
            />

            <TextField
              name="location"
              label="Location"
              value={formData.location}
              onChange={handleChange}
              required
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiOutlinedInput-input': { color: '#FFFFFF' }
              }}
            />

            <FormControl fullWidth>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Connector Type
              </InputLabel>
              <Select
                name="connectorType"
                value={formData.connectorType}
                onChange={handleChange}
                required
                sx={{
                  color: '#FFFFFF',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.23)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.4)'
                  }
                }}
              >
                {connectorTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="powerOutput"
              label="Power Output (kW)"
              type="number"
              value={formData.powerOutput}
              onChange={handleChange}
              required
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiOutlinedInput-input': { color: '#FFFFFF' }
              }}
            />

            <TextField
              name="pricePerHour"
              label="Price per Hour ($)"
              type="number"
              value={formData.pricePerHour}
              onChange={handleChange}
              required
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiOutlinedInput-input': { color: '#FFFFFF' }
              }}
            />

            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiOutlinedInput-input': { color: '#FFFFFF' }
              }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.available}
                  onChange={handleSwitchChange}
                  name="available"
                  color="primary"
                />
              }
              label="Available"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', p: 2 }}>
          <Button 
            onClick={onClose}
            sx={{ 
              color: 'rgba(255,255,255,0.7)',
              '&:hover': { color: '#FFFFFF' }
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            variant="contained"
            sx={{ 
              bgcolor: '#0075FF',
              '&:hover': { bgcolor: '#0052CC' }
            }}
          >
            {station ? 'Save Changes' : 'Add Station'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StationDialog; 