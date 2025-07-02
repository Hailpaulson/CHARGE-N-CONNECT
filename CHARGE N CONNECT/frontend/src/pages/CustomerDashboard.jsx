import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  IconButton,
  InputBase,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  History as HistoryIcon,
  Search as SearchIcon,
  AccountCircle as AccountIcon,
  EvStation as StationIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import StationList from '../components/customer/StationList';
import CustomerProfile from '../components/customer/CustomerProfile';
import BookingDialog from '../components/customer/BookingDialog';

const drawerWidth = 240;

const theme = {
  primary: '#1A1F37',    // Dark blue background
  secondary: '#2A2D3E',  // Slightly lighter blue for cards
  accent: '#0075FF',     // Bright blue for highlights
  text: {
    primary: '#FFFFFF',
    secondary: '#A0AEC0'
  }
};

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchStations();
    fetchBookings();
  }, []);

  const fetchStations = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching stations from:', `${API_URL}/stations`);
      
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/stations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Stations response:', response.data);
      setStations(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error);
      setError('Failed to load stations. ' + (error.response?.data?.message || error.message));
      toast.error('Failed to load stations');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, skipping booking fetch');
        return;
      }

      const response = await axios.get(`${API_URL}/bookings/customer`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Bookings response:', response.data);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      if (error.response?.status === 404) {
        console.log('No bookings found or endpoint not available');
        setBookings([]);
      } else {
        toast.error('Failed to fetch bookings');
      }
    }
  };

  const handleBookStation = (station) => {
    setSelectedStation(station);
    setBookingDialogOpen(true);
  };

  const handleBookingConfirm = async (bookingDetails) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/bookings`,
        {
          stationId: selectedStation._id,
          startTime: bookingDetails.startTime.toISOString(),
          duration: bookingDetails.duration,
          totalPrice: Number(bookingDetails.totalPrice.toFixed(2))
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Station booked successfully');
      setBookingDialogOpen(false);
      setSelectedStation(null);
      await Promise.all([fetchStations(), fetchBookings()]);
    } catch (error) {
      console.error('Error booking station:', error);
      toast.error(error.response?.data?.message || 'Failed to book station');
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, index: 0 },
    { text: 'Charging Stations', icon: <StationIcon />, index: 1 },
    { text: 'Booking History', icon: <HistoryIcon />, index: 2 },
    { text: 'Profile', icon: <AccountIcon />, index: 3 },
  ];

  const filteredStations = stations.filter(station => 
    station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatLocation = (location) => {
    if (!location) return 'Location not available';
    if (typeof location === 'string') return location;
    if (location.address) return location.address;
    if (location.coordinates) {
      return `${location.coordinates[1]}, ${location.coordinates[0]}`; // Latitude, Longitude
    }
    return 'Location details not available';
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      bgcolor: theme.primary, 
      minHeight: '100vh',
      color: theme.text.primary 
    }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: theme.secondary,
            borderRight: 'none',
          },
        }}
      >
        <Toolbar sx={{ bgcolor: theme.secondary }}>
          <Typography variant="h6" sx={{ 
            color: theme.text.primary, 
            fontWeight: 'bold',
            fontSize: '1.5rem'
          }}>
            E-Charge
          </Typography>
        </Toolbar>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={activeTab === item.index}
                onClick={() => setActiveTab(item.index)}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'rgba(0, 117, 255, 0.2)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 117, 255, 0.3)',
                    }
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  color: theme.text.primary,
                  borderRadius: '8px',
                  mx: 1,
                  my: 0.5,
                }}
              >
                <ListItemIcon sx={{ color: activeTab === item.index ? theme.accent : theme.text.secondary }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      color: activeTab === item.index ? theme.text.primary : theme.text.secondary 
                    } 
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar 
          position="fixed" 
          sx={{ 
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
            bgcolor: theme.secondary,
            boxShadow: 'none',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Paper
              component="form"
              sx={{ 
                p: '2px 4px', 
                display: 'flex', 
                alignItems: 'center', 
                width: 400,
                bgcolor: 'rgba(255,255,255,0.1)',
                border: 'none',
                boxShadow: 'none',
                color: theme.text.primary
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Stations"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <IconButton type="button" sx={{ p: '10px', color: theme.text.secondary }}>
                <SearchIcon />
              </IconButton>
            </Paper>

            <Button
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              variant="outlined"
              sx={{
                color: '#ff3d57',
                borderColor: '#ff3d57',
                '&:hover': {
                  bgcolor: 'rgba(255, 61, 87, 0.04)',
                  borderColor: '#ff3d57'
                },
                textTransform: 'none',
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Toolbar />

        {/* Dashboard Overview */}
        {activeTab === 0 && (
          <Box>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={3}>
                <Card sx={{ 
                  bgcolor: theme.secondary,
                  boxShadow: 'none',
                  borderRadius: 2,
                  p: 2
                }}>
                  <Typography variant="h6" color={theme.text.secondary}>Total Bookings</Typography>
                  <Typography variant="h4" color={theme.text.primary}>{bookings.length}</Typography>
                </Card>
              </Grid>
              {/* Add more stat cards here */}
            </Grid>

            <Card sx={{ 
              bgcolor: theme.secondary,
              boxShadow: 'none',
              borderRadius: 2,
              p: 3,
              mb: 4
            }}>
              <Typography variant="h5" color={theme.text.primary} gutterBottom>
                Welcome back!
              </Typography>
              <Typography color={theme.text.secondary}>
                Find and book charging stations near you.
              </Typography>
            </Card>
          </Box>
        )}

        {/* Stations Grid */}
        {activeTab === 1 && (
          <Grid container spacing={3}>
            {filteredStations.map((station) => (
              <Grid item xs={12} sm={6} md={4} key={station._id}>
                <Card sx={{ 
                  bgcolor: theme.secondary,
                  boxShadow: 'none',
                  borderRadius: 2,
                  '&:hover': {
                    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
                  }
                }}>
                  <CardContent>
                    <Typography variant="h6" color={theme.text.primary}>{station.name}</Typography>
                    <Typography color={theme.text.secondary}>
                      Location: {formatLocation(station.location)}
                    </Typography>
                    <Typography color={theme.text.primary} sx={{ mt: 2 }}>
                    ₹{station.pricePerHour}/hour
                    </Typography>
                    <Typography 
                      sx={{ 
                        color: station.available ? '#4CAF50' : '#f44336',
                        mt: 1 
                      }}
                    >
                      {station.available ? 'Available' : 'Occupied'}
                    </Typography>
                    {station.available && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          setSelectedStation(station);
                          setBookingDialogOpen(true);
                        }}
                        sx={{ 
                          mt: 2,
                          bgcolor: theme.accent,
                          '&:hover': {
                            bgcolor: '#0052CC'
                          }
                        }}
                      >
                        Book Now
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {activeTab === 2 && (
          <Grid container spacing={3}>
            {bookings.map((booking) => (
              <Grid item xs={12} sm={6} md={4} key={booking._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">
                      {booking.station?.name || 'Station'}
                    </Typography>
                    <Typography>
                      Start: {new Date(booking.startTime).toLocaleString()}
                    </Typography>
                    <Typography>
                      Duration: {booking.duration} hours
                    </Typography>
                    <Typography>
                      Price: ₹{booking.price?.toFixed(2)}
                    </Typography>
                    <Typography color="textSecondary">
                      Status: {booking.status}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {activeTab === 3 && (
          <Box>
            <Typography variant="h4" gutterBottom>
              My Profile
            </Typography>
            <Card sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
              <CardContent>
                <CustomerProfile 
                  onEditSuccess={() => {
                    toast.success('Profile updated successfully');
                    // Optionally refresh user data here
                  }}
                />
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Booking Dialog */}
        {selectedStation && (
          <BookingDialog
            open={bookingDialogOpen}
            onClose={() => {
              setBookingDialogOpen(false);
              setSelectedStation(null);
            }}
            station={selectedStation}
            onConfirm={handleBookingConfirm}
          />
        )}
      </Box>
    </Box>
  );
};

export default CustomerDashboard; 