import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating
} from '@mui/material';
import { Search as SearchIcon, LocationOn } from '@mui/icons-material';
import toast from 'react-hot-toast';

// Mock data for testing
const mockStations = [
  {
    id: 1,
    name: "EV Station Downtown",
    address: "123 Main St, Downtown",
    pricePerHour: 15,
    rating: 4.5,
    available: true
  },
  {
    id: 2,
    name: "Green Charge Hub",
    address: "456 Park Ave, Midtown",
    pricePerHour: 12,
    rating: 4.0,
    available: true
  },
  {
    id: 3,
    name: "Home Charging Point",
    address: "789 Residential Blvd",
    pricePerHour: 10,
    rating: 4.8,
    available: true
  }
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function BookingStation() {
  const [stations, setStations] = useState(mockStations);
  const [search, setSearch] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);
  const [bookingDialog, setBookingDialog] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    startTime: '',
    duration: ''
  });

  const handleSearch = (e) => {
    setSearch(e.target.value);
    // Filter stations based on search
    const filtered = mockStations.filter(station => 
      station.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
      station.address.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setStations(filtered);
  };

  const handleBookingOpen = (station) => {
    setSelectedStation(station);
    setBookingDialog(true);
  };

  const handleBookingClose = () => {
    setBookingDialog(false);
    setSelectedStation(null);
    setBookingDetails({
      date: '',
      startTime: '',
      duration: ''
    });
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookStation = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/bookings/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          stationId: selectedStation.id,
          ...bookingDetails
        })
      });

      if (response.ok) {
        toast.success('Booking successful!');
        handleBookingClose();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to book station');
      }
    } catch (error) {
      console.error('Error booking station:', error);
      toast.error('Error occurred while booking');
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            placeholder="Search by location or provider name"
            value={search}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        {stations.map((station) => (
          <Grid item xs={12} sm={6} md={4} key={station.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {station.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2">{station.address}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Price: ${station.pricePerHour}/hour
                </Typography>
                <Rating value={station.rating} readOnly />
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  variant="contained" 
                  onClick={() => handleBookingOpen(station)}
                >
                  Book Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={bookingDialog} onClose={handleBookingClose}>
        <DialogTitle>Book Charging Station</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                name="date"
                label="Date"
                value={bookingDetails.date}
                onChange={handleBookingChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="time"
                name="startTime"
                label="Start Time"
                value={bookingDetails.startTime}
                onChange={handleBookingChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                name="duration"
                label="Duration (hours)"
                value={bookingDetails.duration}
                onChange={handleBookingChange}
                InputProps={{ inputProps: { min: 1, max: 24 } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBookingClose}>Cancel</Button>
          <Button onClick={handleBookStation} variant="contained" color="primary">
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default BookingStation; 