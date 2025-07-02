import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ProviderProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProviderDetails();
  }, []);

  const fetchProviderDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/provider/details`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProfile(response.data);
      setEditedProfile(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching provider details:', error);
      setError('Failed to load provider details');
      toast.error('Failed to load provider details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/provider/profile`,
        editedProfile,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setProfile(response.data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom>
          Provider Profile
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={isEditing ? editedProfile?.firstName : profile?.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={isEditing ? editedProfile?.lastName : profile?.lastName}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={isEditing ? editedProfile?.email : profile?.email}
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={isEditing ? editedProfile?.phone : profile?.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={isEditing ? editedProfile?.address : profile?.address}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={isEditing ? editedProfile?.city : profile?.city}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="State"
              name="state"
              value={isEditing ? editedProfile?.state : profile?.state}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="ZIP Code"
              name="zipCode"
              value={isEditing ? editedProfile?.zipCode : profile?.zipCode}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>

          {profile?.stationsCount !== undefined && (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary">
                Total Stations: {profile.stationsCount}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              {isEditing ? (
                <>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedProfile(profile);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ProviderProfile; 