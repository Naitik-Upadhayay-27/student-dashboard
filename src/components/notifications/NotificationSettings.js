import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  Grid
} from '@mui/material';
import NotificationPreferences from './NotificationPreferences';
import NotificationDemo from './NotificationDemo';

const NotificationSettings = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Notification Settings
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            About Notifications
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" paragraph>
            Stay informed about important updates to your academic progress, attendance, and assignments.
            Customize your notification preferences below to receive only the information that matters to you.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Note: Email notifications will be sent to the email address associated with your account.
          </Typography>
        </Paper>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <NotificationPreferences />
        </Grid>
        
        <Grid item xs={12}>
          <NotificationDemo />
        </Grid>
      </Grid>
    </Container>
  );
};

export default NotificationSettings;
