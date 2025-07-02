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
  Add as AddIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ProviderProfile from '../components/provider/ProviderProfile';
import StationDialog from '../components/provider/StationDialog';

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

const ProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stationDialogOpen, setStationDialogOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchStations();
    fetchBookings();
  }, []);

  const fetchStations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/stations/provider`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Fetched stations:', response.data); // Debug log
      setStations(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching stations:', error);
      setError('Failed to load stations');
      toast.error('Failed to load stations');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/bookings/provider`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Fetched bookings:', response.data); // Debug log
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    }
  };

  const handleStationSubmit = async (stationData) => {
    try {
      const token = localStorage.getItem('token');
      const url = selectedStation 
        ? `${API_URL}/stations/${selectedStation._id}`
        : `${API_URL}/stations`;
      const method = selectedStation ? 'put' : 'post';

      await axios[method](url, stationData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success(`Station ${selectedStation ? 'updated' : 'created'} successfully`);
      setStationDialogOpen(false);
      setSelectedStation(null);
      fetchStations();
    } catch (error) {
      console.error('Error with station:', error);
      toast.error(error.response?.data?.message || 'Failed to process station');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, index: 0 },
    { text: 'My Stations', icon: <StationIcon />, index: 1 },
    { text: 'Booking History', icon: <HistoryIcon />, index: 2 },
    { text: 'Profile', icon: <AccountIcon />, index: 3 },
  ];

  const filteredStations = stations.filter(station => 
    station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            E-Charge Provider
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
                  <Typography variant="h6" color={theme.text.secondary}>Total Stations</Typography>
                  <Typography variant="h4" color={theme.text.primary}>{stations.length}</Typography>
                </Card>
              </Grid>
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
                Manage your charging stations and view booking statistics.
              </Typography>
            </Card>
          </Box>
        )}

        {/* Stations Management */}
        {activeTab === 1 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5" color={theme.text.primary}>
                My Stations ({stations.length})
              </Typography>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={() => {
                  setSelectedStation(null);
                  setStationDialogOpen(true);
                }}
                sx={{ 
                  bgcolor: theme.accent,
                  '&:hover': {
                    bgcolor: '#0052CC'
                  }
                }}
              >
                Add Station
              </Button>
            </Box>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
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
                        <Typography variant="h6" color={theme.text.primary}>
                          {station.name}
                        </Typography>
                        <Typography color={theme.text.secondary}>
                          Location: {typeof station.location === 'object' 
                            ? `${station.location.address || ''} ${station.location.city || ''} ${station.location.state || ''}`
                            : station.location}
                        </Typography>
                        <Typography color={theme.text.secondary}>
                          Connector: {station.connectorType}
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
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setSelectedStation(station);
                            setStationDialogOpen(true);
                          }}
                          sx={{ 
                            mt: 2,
                            color: theme.accent,
                            borderColor: theme.accent,
                            '&:hover': {
                              borderColor: '#0052CC',
                              color: '#0052CC'
                            }
                          }}
                        >
                          Edit
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {/* Booking History */}
        {activeTab === 2 && (
          <>
            <Typography variant="h5" color={theme.text.primary} gutterBottom>
              Booking History
            </Typography>
            <Grid container spacing={3}>
              {bookings.map((booking) => (
                <Grid item xs={12} sm={6} md={4} key={booking._id}>
                  <Card sx={{ 
                    bgcolor: theme.secondary,
                    boxShadow: 'none',
                    borderRadius: 2
                  }}>
                    <CardContent>
                      <Typography variant="h6" color={theme.text.primary}>
                        {booking.station?.name || 'Station'}
                      </Typography>
                      <Typography color={theme.text.secondary}>
                        Location: {typeof booking.station?.location === 'object'
                          ? `${booking.station.location.address || ''} ${booking.station.location.city || ''} ${booking.station.location.state || ''}`
                          : booking.station?.location || 'N/A'}
                      </Typography>
                      <Typography color={theme.text.secondary}>
                        Customer: {booking.user?.name || 'Anonymous'}
                      </Typography>
                      <Typography color={theme.text.secondary}>
                        Start: {new Date(booking.startTime).toLocaleString()}
                      </Typography>
                      <Typography color={theme.text.secondary}>
                        Duration: {booking.duration} hours
                      </Typography>
                      <Typography color={theme.text.primary}>
                        Price: ${booking.totalPrice?.toFixed(2)}
                      </Typography>
                      <Typography 
                        sx={{ 
                          color: booking.status === 'completed' ? '#4CAF50' : '#f44336',
                          mt: 1 
                        }}
                      >
                        Status: {booking.status}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Profile */}
        {activeTab === 3 && (
          <Box>
            <Typography variant="h4" gutterBottom color={theme.text.primary}>
              My Profile
            </Typography>
            <Card sx={{ 
              maxWidth: 600, 
              mx: 'auto', 
              mt: 2,
              bgcolor: theme.secondary,
              boxShadow: 'none',
              borderRadius: 2
            }}>
              <CardContent>
                <ProviderProfile 
                  onEditSuccess={() => {
                    toast.success('Profile updated successfully');
                  }}
                />
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Station Dialog */}
        <StationDialog
          open={stationDialogOpen}
          onClose={() => {
            setStationDialogOpen(false);
            setSelectedStation(null);
          }}
          station={selectedStation}
          onSubmit={handleStationSubmit}
        />
      </Box>
    </Box>
  );
};

export default ProviderDashboard; 