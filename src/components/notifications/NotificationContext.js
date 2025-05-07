import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { 
  getNotificationHistory, 
  getNotificationPreferences, 
  saveNotificationPreferences,
  NOTIFICATION_TYPES
} from '../../services/notificationService';

const NotificationContext = createContext();

export const useNotifications = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notification history and preferences when user changes
  useEffect(() => {
    if (currentUser) {
      const history = getNotificationHistory();
      setNotifications(history);
      
      // Calculate unread count
      const unread = history.filter(notification => !notification.read).length;
      setUnreadCount(unread);
      
      // Load user preferences
      const userPreferences = getNotificationPreferences(currentUser.uid);
      setPreferences(userPreferences);
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setPreferences({});
    }
  }, [currentUser]);

  // Mark notification as read
  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === notificationId) {
        return { ...notification, read: true };
      }
      return notification;
    });
    
    setNotifications(updatedNotifications);
    localStorage.setItem('notificationHistory', JSON.stringify(updatedNotifications));
    
    // Update unread count
    const unread = updatedNotifications.filter(notification => !notification.read).length;
    setUnreadCount(unread);
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => {
      return { ...notification, read: true };
    });
    
    setNotifications(updatedNotifications);
    localStorage.setItem('notificationHistory', JSON.stringify(updatedNotifications));
    setUnreadCount(0);
  };

  // Update notification preferences
  const updatePreferences = (newPreferences) => {
    if (currentUser) {
      setPreferences(newPreferences);
      saveNotificationPreferences(currentUser.uid, newPreferences);
    }
  };

  // Check if a notification type is enabled
  const isNotificationEnabled = (type) => {
    return preferences[type] === true;
  };

  // Add a new notification (for demo purposes)
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem('notificationHistory', JSON.stringify(updatedNotifications));
    
    // Update unread count
    setUnreadCount(prevCount => prevCount + 1);
    
    return newNotification;
  };

  // Delete a notification
  const deleteNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(
      notification => notification.id !== notificationId
    );
    
    setNotifications(updatedNotifications);
    localStorage.setItem('notificationHistory', JSON.stringify(updatedNotifications));
    
    // Update unread count
    const unread = updatedNotifications.filter(notification => !notification.read).length;
    setUnreadCount(unread);
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.setItem('notificationHistory', JSON.stringify([]));
    setUnreadCount(0);
  };

  const value = {
    notifications,
    unreadCount,
    preferences,
    markAsRead,
    markAllAsRead,
    updatePreferences,
    isNotificationEnabled,
    addNotification,
    deleteNotification,
    clearAllNotifications,
    notificationTypes: NOTIFICATION_TYPES
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
