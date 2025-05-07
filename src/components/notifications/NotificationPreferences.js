import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  Paper,
  Button,
  Divider,
  Alert,
  Snackbar,
  Grid
} from '@mui/material';
import { useNotifications } from './NotificationContext';

const NotificationPreferences = () => {
  const { preferences, updatePreferences, notificationTypes } = useNotifications();
  const [localPreferences, setLocalPreferences] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handleToggleChange = (type) => {
    setLocalPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSavePreferences = () => {
    updatePreferences(localPreferences);
    setSnackbarOpen(true);
  };

  const handleResetDefaults = () => {
    const defaultPreferences = Object.values(notificationTypes).reduce((acc, type) => {
      acc[type] = true; // Enable all by default
      return acc;
    }, {});
    
    setLocalPreferences(defaultPreferences);
  };

  const getNotificationTypeLabel = (type) => {
    switch (type) {
      case notificationTypes.GRADE_UPDATE:
        return 'Grade Updates';
      case notificationTypes.ATTENDANCE_ALERT:
        return 'Attendance Alerts';
      case notificationTypes.ASSIGNMENT_REMINDER:
        return 'Assignment Reminders';
      case notificationTypes.GENERAL_ANNOUNCEMENT:
        return 'General Announcements';
      case notificationTypes.PERFORMANCE_UPDATE:
        return 'Performance Updates';
      default:
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getNotificationTypeDescription = (type) => {
    switch (type) {
      case notificationTypes.GRADE_UPDATE:
        return 'Receive notifications when your grades are updated';
      case notificationTypes.ATTENDANCE_ALERT:
        return 'Get alerts when your attendance falls below a threshold';
      case notificationTypes.ASSIGNMENT_REMINDER:
        return 'Receive reminders about upcoming assignment deadlines';
      case notificationTypes.GENERAL_ANNOUNCEMENT:
        return 'Stay informed about general school announcements';
      case notificationTypes.PERFORMANCE_UPDATE:
        return 'Get updates about your overall academic performance';
      default:
        return '';
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Notification Preferences
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Choose which notifications you want to receive. You can change these settings at any time.
      </Typography>
      
      <FormGroup>
        <Grid container spacing={2}>
          {Object.values(notificationTypes).map((type) => (
            <Grid item xs={12} sm={6} key={type}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={localPreferences[type] === true}
                      onChange={() => handleToggleChange(type)}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle1">
                        {getNotificationTypeLabel(type)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getNotificationTypeDescription(type)}
                      </Typography>
                    </Box>
                  }
                  sx={{ 
                    m: 0, 
                    width: '100%',
                    alignItems: 'flex-start',
                    '.MuiFormControlLabel-label': { 
                      width: '100%',
                      ml: 1
                    }
                  }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </FormGroup>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          onClick={handleResetDefaults}
        >
          Reset to Defaults
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSavePreferences}
        >
          Save Preferences
        </Button>
      </Box>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Notification preferences saved successfully!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default NotificationPreferences;
