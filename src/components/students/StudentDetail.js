import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentPerformance from './StudentPerformance';
import StudentNotes from './StudentNotes';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Grid,
  Button,
  CircularProgress,
  LinearProgress,
  Divider,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert
} from '@mui/material';
import {
  School,
  CalendarToday,
  ArrowBack,
  Grade,
  Delete
} from '@mui/icons-material';
import api from '../../services/mockApi';

const StudentDetail = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await api.get(`/api/students/${id}`);
        setStudent(response.data.student);
      } catch (error) {
        console.error('Error fetching student details:', error);
        setError('Failed to load student details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [id]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteStudent = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/api/students/${id}`);
      setDeleteSuccess(true);
      handleCloseDeleteDialog();
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error deleting student:', error);
      setError('Failed to delete student. Please try again.');
      handleCloseDeleteDialog();
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error">{error}</Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBack />} 
            onClick={handleBack}
            sx={{ mt: 2 }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Box>
    );
  }

  if (!student) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">Student not found</Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBack />} 
            onClick={handleBack}
            sx={{ mt: 2 }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Navigation Buttons */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between', 
          gap: { xs: 2, sm: 0 },
          mb: 4 
        }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBack />} 
            onClick={handleBack}
            fullWidth={window.innerWidth < 600}
            sx={{ mb: { xs: 1, sm: 0 } }}
          >
            Back to Dashboard
          </Button>
          
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<Delete />} 
            onClick={handleOpenDeleteDialog}
            fullWidth={window.innerWidth < 600}
          >
            Remove Student
          </Button>
        </Box>

        {/* Student Header */}
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
          <Box 
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white', 
              p: { xs: 2, sm: 3 },
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: { xs: 2, sm: 3 },
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            <Avatar 
              src={student.avatar} 
              alt={student.name}
              sx={{ 
                width: { xs: 100, sm: 120 }, 
                height: { xs: 100, sm: 120 }, 
                border: '4px solid white',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }}
            />
            <Box>
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
                  fontWeight: 'bold'
                }}
              >
                {student.name}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  opacity: 0.8,
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' }
                }}
              >
                {student.email}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Main Content - Side by Side Layout */}
        <Grid container spacing={3}>
          {/* Left Column - Student Info */}
          <Grid item xs={12} md={2.4}>
            <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <School sx={{ mr: 1 }} /> Academic Information
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Course</Typography>
                    <Typography variant="body1">{student.course}</Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Grade</Typography>
                    <Chip 
                      icon={<Grade />} 
                      label={student.grade} 
                      color={student.grade.startsWith('A') ? 'success' : student.grade.startsWith('B') ? 'primary' : student.grade.startsWith('C') ? 'warning' : 'error'}
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Enrollment Date</Typography>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarToday fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                      {student.enrollmentDate}
                    </Typography>
                  </Box>
                  
                  {student.performance && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Attendance Rate</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={student.performance.attendance} 
                          sx={{ 
                            flexGrow: 1,
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: 'rgba(0,0,0,0.05)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: student.performance.attendance > 90 ? '#4caf50' : 
                                      student.performance.attendance > 75 ? '#ff9800' : '#f44336',
                              borderRadius: 4
                            }
                          }} 
                        />
                        <Typography variant="body2" fontWeight="bold">
                          {student.performance.attendance}%
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Right Column - Performance Charts */}
          <Grid item xs={12} md={9.6}>
            {student.performance ? (
              <StudentPerformance student={student} />
            ) : (
              <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Performance Data
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No performance data available for this student.
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>

        {/* Student Notes */}
        <Box sx={{ mt: 3 }}>
          <StudentNotes studentId={student.id} studentName={student.name} />
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
          PaperProps={{
            sx: {
              borderRadius: 2,
              width: { xs: '90%', sm: 'auto' },
              maxWidth: { xs: '100%', sm: 500 },
              m: { xs: 2, sm: 'auto' }
            }
          }}
        >
          <DialogTitle id="delete-dialog-title" sx={{ pb: 1 }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
              Remove Student
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: { xs: 1, sm: 2 }, pb: { xs: 2, sm: 3 } }}>
            <DialogContentText id="delete-dialog-description" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              Are you sure you want to remove <strong>{student?.name}</strong> from the system? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 }, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 0 } }}>
            <Button 
              onClick={handleCloseDeleteDialog} 
              color="primary"
              fullWidth={window.innerWidth < 600}
              variant="outlined"
              sx={{ order: { xs: 2, sm: 1 } }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteStudent} 
              color="error" 
              variant="contained"
              disabled={deleteLoading}
              startIcon={deleteLoading ? <CircularProgress size={20} /> : <Delete />}
              fullWidth={window.innerWidth < 600}
              sx={{ order: { xs: 1, sm: 2 }, ml: { xs: 0, sm: 1 } }}
            >
              {deleteLoading ? 'Removing...' : 'Remove'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Notification */}
        <Snackbar
          open={deleteSuccess}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" variant="filled">
            Student removed successfully!
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default StudentDetail;
