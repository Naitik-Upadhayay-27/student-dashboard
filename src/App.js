import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './components/auth/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ThemeProvider } from './components/theme/ThemeContext';
import { NotificationProvider } from './components/notifications/NotificationContext';

// Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import StudentList from './components/students/StudentList';
import StudentDetail from './components/students/StudentDetail';
import AddStudent from './components/students/AddStudent';
import Navbar from './components/layout/Navbar';
import NotificationSettings from './components/notifications/NotificationSettings';

// Theme is now managed by ThemeContext

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <CssBaseline />
            <Navbar />
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <StudentList />
                </ProtectedRoute>
              } />
              <Route path="/students" element={
                <ProtectedRoute>
                  <StudentList />
                </ProtectedRoute>
              } />
              <Route path="/student/:id" element={
                <ProtectedRoute>
                  <StudentDetail />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/add-student" 
                element={
                  <ProtectedRoute>
                    <AddStudent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/notifications" 
                element={
                  <ProtectedRoute>
                    <NotificationSettings />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
