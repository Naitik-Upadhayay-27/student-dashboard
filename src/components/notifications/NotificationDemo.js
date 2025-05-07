import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Grid,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import { useNotifications } from './NotificationContext';

const NotificationDemo = () => {
  const { addNotification, notificationTypes } = useNotifications();
  const [notificationType, setNotificationType] = useState(notificationTypes.GRADE_UPDATE);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSendNotification = () => {
    if (!title.trim() || !message.trim()) {
      return;
    }

    addNotification({
      type: notificationType,
      title: title.trim(),
      message: message.trim()
    });

    // Reset form
    setTitle('');
    setMessage('');
    setSnackbarOpen(true);
  };

  const getDefaultTitle = (type) => {
    switch (type) {
      case notificationTypes.GRADE_UPDATE:
        return 'Your grade has been updated';
      case notificationTypes.ATTENDANCE_ALERT:
        return 'Attendance Alert';
      case notificationTypes.ASSIGNMENT_REMINDER:
        return 'Assignment Reminder';
      case notificationTypes.GENERAL_ANNOUNCEMENT:
        return 'Important Announcement';
      case notificationTypes.PERFORMANCE_UPDATE:
        return 'Performance Update';
      default:
        return '';
    }
  };

  const getDefaultMessage = (type) => {
    switch (type) {
      case notificationTypes.GRADE_UPDATE:
        return 'Your grade for Mathematics has been updated to A.';
      case notificationTypes.ATTENDANCE_ALERT:
        return 'Your attendance for Science has fallen below 80%.';
      case notificationTypes.ASSIGNMENT_REMINDER:
        return 'Your History assignment is due tomorrow.';
      case notificationTypes.GENERAL_ANNOUNCEMENT:
        return 'School will be closed on Monday for maintenance.';
      case notificationTypes.PERFORMANCE_UPDATE:
        return 'Your overall performance has improved by 15% this month.';
      default:
        return '';
    }
  };

  const handleTypeChange = (event) => {
    const newType = event.target.value;
    setNotificationType(newType);
    setTitle(getDefaultTitle(newType));
    setMessage(getDefaultMessage(newType));
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Test Notifications
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Use this form to test the notification system. Select a notification type and customize the message.
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Notification Type"
            value={notificationType}
            onChange={handleTypeChange}
            variant="outlined"
            margin="normal"
          >
            {Object.entries(notificationTypes).map(([key, value]) => (
              <MenuItem key={value} value={value}>
                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notification Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            margin="normal"
            placeholder="Enter notification title"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notification Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
            margin="normal"
            multiline
            rows={3}
            placeholder="Enter notification message"
          />
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSendNotification}
          disabled={!title.trim() || !message.trim()}
        >
          Send Test Notification
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
          Test notification sent successfully!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default NotificationDemo;
