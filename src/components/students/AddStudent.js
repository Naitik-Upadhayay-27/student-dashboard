import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import { Save, ArrowBack, AddAPhoto, Delete } from '@mui/icons-material';
import api from '../../services/mockApi';
import { useAuth } from '../auth/AuthContext';

const courses = ['Computer Science', 'Mathematics', 'Physics'];
const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: '',
    grade: '',
    avatar: 'https://mui.com/static/images/avatar/1.jpg' // Default avatar
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    // Validate course
    if (!formData.course) {
      newErrors.course = 'Course is required';
    }
    
    // Validate grade
    if (!formData.grade) {
      newErrors.grade = 'Grade is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await api.post('/api/students', formData);
      setSuccess(true);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        course: '',
        grade: '',
        avatar: 'https://mui.com/static/images/avatar/1.jpg'
      });
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error adding student:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      
      // Convert image to base64 string for storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          avatar: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setFormData({
      ...formData,
      avatar: 'https://mui.com/static/images/avatar/1.jpg' // Reset to default avatar
    });
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button 
        variant="outlined" 
        startIcon={<ArrowBack />} 
        onClick={handleBack}
        sx={{ mb: 4 }}
      >
        Back to Dashboard
      </Button>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Add New Student
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            {/* Image Upload Section */}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar 
                  src={previewImage || formData.avatar} 
                  alt="Student Avatar"
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={handleImageClick}
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                <Box sx={{ 
                  position: 'absolute', 
                  bottom: -10, 
                  right: -10, 
                  display: 'flex', 
                  gap: 1 
                }}>
                  <Tooltip title="Upload Photo">
                    <IconButton 
                      color="primary" 
                      size="small" 
                      onClick={handleImageClick}
                      sx={{ 
                        bgcolor: 'white', 
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                        '&:hover': { bgcolor: '#f5f5f5' } 
                      }}
                    >
                      <AddAPhoto fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {previewImage && (
                    <Tooltip title="Remove Photo">
                      <IconButton 
                        color="error" 
                        size="small" 
                        onClick={handleRemoveImage}
                        sx={{ 
                          bgcolor: 'white', 
                          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                          '&:hover': { bgcolor: '#f5f5f5' } 
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                error={!!errors.course}
                helperText={errors.course || 'Select the student\'s course'}
                required
              >
                {courses.map((course) => (
                  <MenuItem key={course} value={course}>
                    {course}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                error={!!errors.grade}
                helperText={errors.grade || 'Select the student\'s grade'}
                required
              >
                {grades.map((grade) => (
                  <MenuItem key={grade} value={grade}>
                    {grade}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={loading}
                  sx={{ py: 1.5, px: 3, borderRadius: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Student'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          Student added successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddStudent;
