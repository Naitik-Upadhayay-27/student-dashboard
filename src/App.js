import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './components/auth/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ThemeProvider } from './components/theme/ThemeContext';

// Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import StudentList from './components/students/StudentList';
import StudentDetail from './components/students/StudentDetail';
import AddStudent from './components/students/AddStudent';
import Navbar from './components/layout/Navbar';

// Theme is now managed by ThemeContext

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <CssBaseline />
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<StudentList />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/student/:id" element={<StudentDetail />} />
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
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
