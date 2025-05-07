// This is a mock email notification service
// In a real application, you would integrate with an email service like SendGrid, Mailgun, etc.

// Sample notification types
export const NOTIFICATION_TYPES = {
  GRADE_UPDATE: 'grade_update',
  ATTENDANCE_ALERT: 'attendance_alert',
  ASSIGNMENT_REMINDER: 'assignment_reminder',
  GENERAL_ANNOUNCEMENT: 'general_announcement',
  PERFORMANCE_UPDATE: 'performance_update'
};

// Sample notification templates
const notificationTemplates = {
  [NOTIFICATION_TYPES.GRADE_UPDATE]: {
    subject: 'Grade Update for {courseName}',
    body: 'Hello {studentName},\n\nYour grade for {courseName} has been updated to {grade}.\n\nBest regards,\nStudent Dashboard Team'
  },
  [NOTIFICATION_TYPES.ATTENDANCE_ALERT]: {
    subject: 'Attendance Alert for {courseName}',
    body: 'Hello {studentName},\n\nYour attendance for {courseName} has fallen below {threshold}%. Please improve your attendance.\n\nBest regards,\nStudent Dashboard Team'
  },
  [NOTIFICATION_TYPES.ASSIGNMENT_REMINDER]: {
    subject: 'Assignment Reminder for {courseName}',
    body: 'Hello {studentName},\n\nThis is a reminder that your assignment for {courseName} is due on {dueDate}.\n\nBest regards,\nStudent Dashboard Team'
  },
  [NOTIFICATION_TYPES.GENERAL_ANNOUNCEMENT]: {
    subject: '{announcementTitle}',
    body: 'Hello {studentName},\n\n{announcementBody}\n\nBest regards,\nStudent Dashboard Team'
  },
  [NOTIFICATION_TYPES.PERFORMANCE_UPDATE]: {
    subject: 'Performance Update',
    body: 'Hello {studentName},\n\nYour overall performance has been updated. Your current average is {averageGrade}.\n\nBest regards,\nStudent Dashboard Team'
  }
};

// Replace template placeholders with actual values
const formatTemplate = (template, data) => {
  let result = template;
  Object.keys(data).forEach(key => {
    const placeholder = `{${key}}`;
    result = result.replace(new RegExp(placeholder, 'g'), data[key]);
  });
  return result;
};

// Mock function to send email
export const sendEmail = async (to, notificationType, data) => {
  // In a real application, you would call an email service API here
  try {
    const template = notificationTemplates[notificationType];
    if (!template) {
      throw new Error(`Template not found for notification type: ${notificationType}`);
    }

    const subject = formatTemplate(template.subject, data);
    const body = formatTemplate(template.body, data);

    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demo purposes, we'll just return success
    return {
      success: true,
      message: 'Email sent successfully',
      details: { to, subject, body }
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      message: 'Failed to send email',
      error: error.message
    };
  }
};

// Function to send batch notifications
export const sendBatchNotifications = async (recipients, notificationType, commonData = {}) => {
  const results = [];
  for (const recipient of recipients) {
    const data = { ...commonData, ...recipient.data };
    const result = await sendEmail(recipient.email, notificationType, data);
    results.push({
      recipient: recipient.email,
      result
    });
  }
  return results;
};

// Store notification history in localStorage
export const saveNotificationToHistory = (notification) => {
  try {
    const history = JSON.parse(localStorage.getItem('notificationHistory') || '[]');
    history.push({
      ...notification,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('notificationHistory', JSON.stringify(history));
  } catch (error) {
    console.error('Error saving notification to history:', error);
  }
};

// Get notification history from localStorage
export const getNotificationHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('notificationHistory') || '[]');
  } catch (error) {
    console.error('Error getting notification history:', error);
    return [];
  }
};

// Save user notification preferences
export const saveNotificationPreferences = (userId, preferences) => {
  try {
    localStorage.setItem(`notificationPreferences_${userId}`, JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error('Error saving notification preferences:', error);
    return false;
  }
};

// Get user notification preferences
export const getNotificationPreferences = (userId) => {
  try {
    const preferences = JSON.parse(localStorage.getItem(`notificationPreferences_${userId}`) || 'null');
    if (!preferences) {
      // Default preferences if none are set
      const defaultPreferences = Object.values(NOTIFICATION_TYPES).reduce((acc, type) => {
        acc[type] = true; // Enable all by default
        return acc;
      }, {});
      return defaultPreferences;
    }
    return preferences;
  } catch (error) {
    console.error('Error getting notification preferences:', error);
    return {};
  }
};
