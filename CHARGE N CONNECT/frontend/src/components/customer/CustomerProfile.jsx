import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { Edit as EditIcon, Logout as LogoutIcon } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CustomerProfile = ({ onEditSuccess }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Fetching profile from:', `${API_URL}/customer/profile`);
      const response = await axios.get(`${API_URL}/customer/profile`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Profile data received:', response.data);
      setProfile(response.data);
      setFormData({
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        address: response.data.address || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error.response?.data?.message || 'Failed to load profile');
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Current profile state:', profile);
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/customer/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setIsEditing(false);
      fetchProfile();
      onEditSuccess?.();
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  console.log('Rendering with profile:', profile);

  return (
    <Box sx={{ 
      width: '100%',
      minHeight: 'calc(100vh - 64px)',
      p: { xs: 2, md: 4 },
      bgcolor: 'transparent',
    }}>
      {!isEditing ? (
        <Box sx={{ 
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center" 
            mb={4}
          >
            <Typography variant="h6" sx={{ 
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 500,
            }}>
              My Profile
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
                variant="contained"
                sx={{
                  bgcolor: '#1976d2',
                  '&:hover': {
                    bgcolor: '#1565c0'
                  },
                  textTransform: 'none',
                }}
              >
                Edit Profile
              </Button>
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
            </Box>
          </Box>
          <Grid container spacing={3}>
            {[
              { label: 'NAME', value: profile && `${profile.firstName || ''} ${profile.lastName || ''}` },
              { label: 'EMAIL', value: profile?.email || '' },
              { label: 'PHONE', value: profile?.phone || 'Not provided' },
              { label: 'ADDRESS', value: profile?.address || 'Not provided' }
            ].map((item, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box sx={{ 
                  p: 3,
                  borderRadius: '10px',
                  bgcolor: '#f5f5f5',
                  height: '100%',
                  border: '1px solid #eee'
                }}>
                  <Typography sx={{ 
                    color: '#1976d2',
                    mb: 1,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}>
                    {item.label}
                  </Typography>
                  <Typography sx={{ 
                    color: '#1A1F37',
                    fontSize: '1rem',
                    fontWeight: 400
                  }}>
                    {item.value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ 
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            p: 3,
            borderRadius: '10px',
            bgcolor: '#f5f5f5',
            border: '1px solid #eee'
          }}
        >
          <Typography variant="h6" mb={3} sx={{ 
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 500,
          }}>
            Edit Profile
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                multiline
                rows={2}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" gap={2} mt={2}>
                <Button 
                  type="submit" 
                  variant="contained"
                  sx={{
                    bgcolor: '#1976d2',
                    '&:hover': {
                      bgcolor: '#1565c0'
                    }
                  }}
                >
                  Save Changes
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => setIsEditing(false)}
                  sx={{
                    color: '#1976d2',
                    borderColor: '#1976d2',
                    '&:hover': {
                      borderColor: '#1565c0',
                      bgcolor: 'rgba(25, 118, 210, 0.04)'
                    }
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

const textFieldStyle = {
  '& .MuiOutlinedInput-root': {
    color: '#1A1F37',
    backgroundColor: 'white',
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.23)',
    },
    '&:hover fieldset': {
      borderColor: '#1976d2',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(0, 0, 0, 0.6)',
    '&.Mui-focused': {
      color: '#1976d2',
    },
  },
};

export default CustomerProfile; 