import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Chip,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  CalendarMonth,
  Check,
  Close,
  Add as AddIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack,
  ArrowForward,
  Today
} from '@mui/icons-material';
// Using native JavaScript Date methods instead of date-fns
import mockApi from '../../services/mockApi';

const AttendanceTracker = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [saveLoading, setSaveLoading] = useState(false);

  // Fetch students when component mounts
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await mockApi.getStudents();
        setStudents(response);
        
        // Initialize attendance data
        const initialAttendance = {};
        response.forEach(student => {
          if (student.performance && student.performance.attendanceRecords) {
            initialAttendance[student.id] = student.performance.attendanceRecords;
          } else {
            initialAttendance[student.id] = [];
          }
        });
        
        setAttendanceData(initialAttendance);
      } catch (error) {
        console.error('Error fetching students:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load students. Please try again.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Get days of current month using native JavaScript
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    
    return days;
  };
  
  const daysInMonth = getDaysInMonth(currentMonth);

  // Handle previous month
  const handlePreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  // Handle next month
  const handleNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  // Handle opening the attendance dialog
  const handleOpenDialog = (date) => {
    setSelectedDate(date);
    setOpenDialog(true);
  };

  // Handle closing the attendance dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Helper function to check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  // Check if a student was present on a specific date
  const isPresent = (studentId, date) => {
    if (!attendanceData[studentId]) return false;
    
    return attendanceData[studentId].some(record => 
      isSameDay(new Date(record.date), date) && record.status === 'present'
    );
  };

  // Check if a student was absent on a specific date
  const isAbsent = (studentId, date) => {
    if (!attendanceData[studentId]) return false;
    
    return attendanceData[studentId].some(record => 
      isSameDay(new Date(record.date), date) && record.status === 'absent'
    );
  };

  // Helper function to format dates
  const formatDate = (date, formatStr) => {
    const options = {};
    
    if (formatStr.includes('MMMM')) {
      options.month = 'long';
    } else if (formatStr.includes('MMM')) {
      options.month = 'short';
    } else if (formatStr.includes('MM')) {
      options.month = '2-digit';
    }
    
    if (formatStr.includes('yyyy')) {
      options.year = 'numeric';
    }
    
    if (formatStr.includes('d')) {
      options.day = 'numeric';
    }
    
    if (formatStr.includes('EEE')) {
      options.weekday = 'short';
    } else if (formatStr.includes('EEEE')) {
      options.weekday = 'long';
    }
    
    if (formatStr.includes('h')) {
      options.hour = 'numeric';
      options.hour12 = true;
    }
    
    if (formatStr.includes('mm')) {
      options.minute = '2-digit';
    }
    
    if (formatStr.includes('a')) {
      options.hour12 = true;
    }
    
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };
  
  // Helper function to check if a date is a weekend
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };
  
  // Handle toggling attendance status
  const handleToggleAttendance = (studentId, date, status) => {
    setAttendanceData(prevData => {
      const newData = { ...prevData };
      
      if (!newData[studentId]) {
        newData[studentId] = [];
      }
      
      // Remove any existing record for this date
      newData[studentId] = newData[studentId].filter(record => 
        !isSameDay(new Date(record.date), date)
      );
      
      // Add the new record
      newData[studentId].push({
        date: date.toISOString(),
        status
      });
      
      return newData;
    });
  };

  // Calculate attendance percentage for a student
  const calculateAttendancePercentage = (studentId) => {
    if (!attendanceData[studentId] || attendanceData[studentId].length === 0) {
      return 0;
    }
    
    const totalRecords = attendanceData[studentId].length;
    const presentRecords = attendanceData[studentId].filter(record => record.status === 'present').length;
    
    return Math.round((presentRecords / totalRecords) * 100);
  };

  // Save attendance data
  const handleSaveAttendance = async () => {
    setSaveLoading(true);
    
    try {
      // Update each student's performance data with attendance records
      for (const studentId in attendanceData) {
        const student = students.find(s => s.id === studentId);
        
        if (student) {
          const attendancePercentage = calculateAttendancePercentage(studentId);
          
          // Create or update performance data
          const performanceData = student.performance || {};
          performanceData.attendance = attendancePercentage;
          performanceData.attendanceRecords = attendanceData[studentId];
          
          // Update student with new performance data
          await mockApi.updateStudentPerformance(studentId, performanceData);
        }
      }
      
      setSnackbar({
        open: true,
        message: 'Attendance data saved successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving attendance data:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save attendance data. Please try again.',
        severity: 'error'
      });
    } finally {
      setSaveLoading(false);
    }
  };

  // Handle closing the snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
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

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        gap: { xs: 2, sm: 0 },
        mb: 4 
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold', 
            color: '#1976d2',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }
          }}
        >
          Attendance Tracker
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSaveAttendance}
          disabled={saveLoading}
          startIcon={saveLoading ? <CircularProgress size={20} /> : <SaveIcon />}
          sx={{ 
            borderRadius: 2,
            alignSelf: { xs: 'stretch', sm: 'auto' }
          }}
        >
          Save Attendance Data
        </Button>
      </Box>

      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 4, borderRadius: 2 }}>
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <IconButton onClick={handlePreviousMonth}>
            <ArrowBack />
          </IconButton>
          
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarMonth sx={{ mr: 1 }} />
            {formatDate(currentMonth, 'MMMM yyyy')}
          </Typography>
          
          <IconButton onClick={handleNextMonth}>
            <ArrowForward />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 600, overflow: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', minWidth: 180 }}>Student</TableCell>
                {daysInMonth.map(day => (
                  <TableCell 
                    key={day.toString()} 
                    align="center"
                    sx={{ 
                      minWidth: 50,
                      bgcolor: isWeekend(day) ? 'rgba(0,0,0,0.04)' : 'inherit',
                      fontWeight: isWeekend(day) ? 'bold' : 'normal',
                      color: isWeekend(day) ? 'text.secondary' : 'inherit'
                    }}
                  >
                    <Tooltip title={formatDate(day, 'EEEE, MMMM d')}>
                      <Box 
                        sx={{ 
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}
                        onClick={() => handleOpenDialog(day)}
                      >
                        <Typography variant="caption" display="block">
                          {formatDate(day, 'EEE')}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {formatDate(day, 'd')}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: 100 }}>Attendance %</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map(student => (
                <TableRow key={student.id} hover>
                  <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      component="img"
                      src={student.avatar}
                      alt={student.name}
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                    <Typography variant="body2" noWrap>
                      {student.name}
                    </Typography>
                  </TableCell>
                  {daysInMonth.map(day => (
                    <TableCell 
                      key={`${student.id}-${day.toString()}`} 
                      align="center"
                      sx={{ 
                        bgcolor: isWeekend(day) ? 'rgba(0,0,0,0.04)' : 'inherit',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        {isPresent(student.id, day) ? (
                          <Chip 
                            icon={<Check />} 
                            label="P" 
                            size="small" 
                            color="success" 
                            sx={{ minWidth: 60 }}
                            onClick={() => handleToggleAttendance(student.id, day, 'absent')}
                          />
                        ) : isAbsent(student.id, day) ? (
                          <Chip 
                            icon={<Close />} 
                            label="A" 
                            size="small" 
                            color="error" 
                            sx={{ minWidth: 60 }}
                            onClick={() => handleToggleAttendance(student.id, day, 'present')}
                          />
                        ) : (
                          <IconButton 
                            size="small" 
                            onClick={() => handleOpenDialog(day)}
                            sx={{ color: 'text.disabled' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    <Chip 
                      label={`${calculateAttendancePercentage(student.id)}%`}
                      color={
                        calculateAttendancePercentage(student.id) > 90 ? 'success' :
                        calculateAttendancePercentage(student.id) > 75 ? 'primary' :
                        calculateAttendancePercentage(student.id) > 60 ? 'warning' : 'error'
                      }
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Attendance Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Today sx={{ mr: 1 }} />
            Mark Attendance for {selectedDate && formatDate(selectedDate, 'EEEE, MMMM d, yyyy')}
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" gutterBottom>
            Quick Actions:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Button 
              variant="outlined" 
              color="success" 
              startIcon={<Check />}
              onClick={() => {
                students.forEach(student => {
                  handleToggleAttendance(student.id, selectedDate, 'present');
                });
              }}
            >
              Mark All Present
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<Close />}
              onClick={() => {
                students.forEach(student => {
                  handleToggleAttendance(student.id, selectedDate, 'absent');
                });
              }}
            >
              Mark All Absent
            </Button>
          </Box>

          <Typography variant="subtitle2" gutterBottom>
            Individual Attendance:
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell align="center">Present</TableCell>
                  <TableCell align="center">Absent</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map(student => (
                  <TableRow key={student.id} hover>
                    <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        component="img"
                        src={student.avatar}
                        alt={student.name}
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                      <Typography variant="body2">{student.name}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox 
                        checked={isPresent(student.id, selectedDate)}
                        onChange={() => handleToggleAttendance(student.id, selectedDate, 'present')}
                        color="success"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox 
                        checked={isAbsent(student.id, selectedDate)}
                        onChange={() => handleToggleAttendance(student.id, selectedDate, 'absent')}
                        color="error"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      </Box>
    </Box>
  );
};

export default AttendanceTracker;
