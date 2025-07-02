import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Chip,
  Divider
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ElectricCarIcon from '@mui/icons-material/ElectricCar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BoltIcon from '@mui/icons-material/Bolt';
import EditIcon from '@mui/icons-material/Edit';

const StationList = ({ stations, onEdit, onUpdateStatus }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Box sx={{ flexGrow: 1, mt: 2 }}>
      <Grid container spacing={3}>
        {stations.map((station) => (
          <Grid item xs={12} sm={6} md={4} key={station._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {station.name}
                </Typography>
                
                <Chip
                  label={station.available ? 'Available' : 'Unavailable'}
                  color={station.available ? 'success' : 'error'}
                  size="small"
                  sx={{ mb: 2 }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {station.address}, {station.city}, {station.state} {station.zipCode}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ElectricCarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {station.connectorType}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <BoltIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {station.powerOutput} kW
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {station.operatingHours?.start} - {station.operatingHours?.end}
                  </Typography>
                </Box>

                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  {formatCurrency(station.pricePerHour)}/hr
                </Typography>
              </CardContent>

              <Divider />

              <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Button
                  size="small"
                  color={station.available ? 'error' : 'success'}
                  onClick={() => onUpdateStatus(station._id, !station.available)}
                >
                  Mark {station.available ? 'Unavailable' : 'Available'}
                </Button>
                <Button
                  size="small"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => onEdit(station)}
                >
                  Edit
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StationList; 