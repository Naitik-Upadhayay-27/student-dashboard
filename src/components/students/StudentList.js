import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Avatar, 
  Chip,
  TextField,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Button,
  Paper,
  Divider,
  Tab,
  Tabs,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Search, 
  School, 
  FilterList, 
  ViewList, 
  CalendarMonth, 
  Menu as MenuIcon, 
  Close as CloseIcon,
  TuneOutlined as TuneIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/mockApi';
import ImportExport from './ImportExport';
import AdvancedFilters from './AdvancedFilters';
import AttendanceTracker from './AttendanceTracker';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [sortOption, setSortOption] = useState('name_asc');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Function to fetch students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      console.log('Fetching students...');
      const data = await api.getStudents();
      console.log('Fetched students:', data);
      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch students when component mounts or when location state changes
  useEffect(() => {
    fetchStudents();
    
    // Clear the refresh state from location if it exists
    if (location.state?.refreshData) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.refreshData]);

  useEffect(() => {
    // Filter students based on search term, course filter, and advanced filters
    let filtered = students.filter(student => {
      // Basic filters
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCourse = courseFilter === '' || student.course === courseFilter;
      
      // Advanced filters
      const matchesName = !advancedFilters.name || 
                         student.name.toLowerCase().includes(advancedFilters.name.toLowerCase());
      const matchesEmail = !advancedFilters.email || 
                          student.email.toLowerCase().includes(advancedFilters.email.toLowerCase());
      const matchesAdvancedCourse = !advancedFilters.course || 
                                   student.course === advancedFilters.course;
      const matchesGrade = !advancedFilters.grade || 
                          student.grade === advancedFilters.grade;
      
      // Date filters
      const enrollmentDate = new Date(student.enrollmentDate);
      const matchesStartDate = !advancedFilters.enrollmentDateStart || 
                              enrollmentDate >= new Date(advancedFilters.enrollmentDateStart);
      const matchesEndDate = !advancedFilters.enrollmentDateEnd || 
                            enrollmentDate <= new Date(advancedFilters.enrollmentDateEnd);
      
      // Performance range filter
      const performance = student.performance?.attendance || 0;
      const [minPerformance, maxPerformance] = advancedFilters.performanceRange || [0, 100];
      const matchesPerformance = performance >= minPerformance && performance <= maxPerformance;
      
      return matchesSearch && matchesCourse && 
             matchesName && matchesEmail && matchesAdvancedCourse && 
             matchesGrade && matchesStartDate && matchesEndDate && matchesPerformance;
    });
    
    // Apply sorting
    if (sortOption) {
      filtered = sortStudents(filtered, sortOption);
    }
    
    setFilteredStudents(filtered);
  }, [searchTerm, courseFilter, students, advancedFilters, sortOption]);
  
  // Function to sort students based on sort option
  const sortStudents = (studentsToSort, option) => {
    const sorted = [...studentsToSort];
    
    switch (option) {
      case 'name_asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'grade_asc':
        return sorted.sort((a, b) => {
          // Convert letter grades to numeric values for sorting
          const gradeValues = { 'A+': 12, 'A': 11, 'A-': 10, 'B+': 9, 'B': 8, 'B-': 7, 
                              'C+': 6, 'C': 5, 'C-': 4, 'D+': 3, 'D': 2, 'D-': 1, 'F': 0 };
          return (gradeValues[a.grade] || 0) - (gradeValues[b.grade] || 0);
        });
      case 'grade_desc':
        return sorted.sort((a, b) => {
          const gradeValues = { 'A+': 12, 'A': 11, 'A-': 10, 'B+': 9, 'B': 8, 'B-': 7, 
                              'C+': 6, 'C': 5, 'C-': 4, 'D+': 3, 'D': 2, 'D-': 1, 'F': 0 };
          return (gradeValues[b.grade] || 0) - (gradeValues[a.grade] || 0);
        });
      case 'date_asc':
        return sorted.sort((a, b) => new Date(a.enrollmentDate) - new Date(b.enrollmentDate));
      case 'date_desc':
        return sorted.sort((a, b) => new Date(b.enrollmentDate) - new Date(a.enrollmentDate));
      case 'performance_asc':
        return sorted.sort((a, b) => (a.performance?.attendance || 0) - (b.performance?.attendance || 0));
      case 'performance_desc':
        return sorted.sort((a, b) => (b.performance?.attendance || 0) - (a.performance?.attendance || 0));
      default:
        return sorted;
    }
  };

  // Get unique courses for the filter dropdown
  const courses = [...new Set(students.map(student => student.course))];

  const handleViewDetails = (studentId) => {
    navigate(`/student/${studentId}`);
  };

  const handleAddStudent = () => {
    navigate('/add-student');
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle advanced filter changes
  const handleAdvancedFilterChange = (filters) => {
    setAdvancedFilters(filters);
    setSortOption(filters.sortOption || 'name_asc');
  };
  
  // Handle sort changes
  const handleSortChange = (option) => {
    setSortOption(option);
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setAdvancedFilters({});
    setSearchTerm('');
    setCourseFilter('');
    setSortOption('name_asc');
  };
  
  // Toggle filter drawer
  const toggleFilterDrawer = () => {
    setFilterDrawerOpen(!filterDrawerOpen);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
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
          Student Dashboard
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddStudent}
          sx={{ 
            borderRadius: 2,
            alignSelf: { xs: 'stretch', sm: 'auto' }
          }}
          fullWidth={window.innerWidth < 600}
        >
          Add New Student
        </Button>
      </Box>
      
      {/* Tabs for different views */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            icon={<ViewList />} 
            label="Student List" 
            iconPosition="start"
          />
          <Tab 
            icon={<CalendarMonth />} 
            label="Attendance Tracker" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 ? (
        // Student List Tab
        <>
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 4, borderRadius: 2 }}>
            <ImportExport />
            <Divider sx={{ my: 2 }} />
            
            {/* Advanced Filters */}
            <AdvancedFilters 
              courses={courses}
              onFilterChange={handleAdvancedFilterChange}
              onSortChange={handleSortChange}
              onClearFilters={handleClearFilters}
              initialFilters={{
                sortOption,
                ...advancedFilters
              }}
            />
            
            <Divider sx={{ my: 2 }} />
            
            {/* Basic Search and Filter */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 2, 
                  flex: '1 1 auto',
                  alignItems: 'center'
                }}>
                  <TextField
                    label="Search Students"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                    size={window.innerWidth < 600 ? "small" : "medium"}
                    sx={{ 
                      flex: { xs: '1 1 100%', sm: '1 1 60%', md: '1 1 70%' },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    select
                    label="Filter by Course"
                    variant="outlined"
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    fullWidth
                    size={window.innerWidth < 600 ? "small" : "medium"}
                    sx={{ 
                      flex: { xs: '1 1 100%', sm: '1 1 30%', md: '1 1 20%' },
                      display: { xs: 'none', sm: 'flex' }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <School />
                        </InputAdornment>
                      ),
                    }}
                  >
                    <MenuItem value="">All Courses</MenuItem>
                    {courses.map((course) => (
                      <MenuItem key={course} value={course}>
                        {course}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
                
                {/* Filter Button for Mobile */}
                <IconButton 
                  color="primary" 
                  onClick={toggleFilterDrawer}
                  sx={{ 
                    display: { xs: 'flex', md: 'none' },
                    ml: 'auto'
                  }}
                  aria-label="Open filters"
                >
                  <TuneIcon />
                </IconButton>
                
                {/* Advanced Filters for Desktop */}
                <Box sx={{ 
                  display: { xs: 'none', md: 'flex' },
                  ml: 'auto',
                  gap: 1
                }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<FilterList />}
                    onClick={toggleFilterDrawer}
                    size={window.innerWidth < 600 ? "small" : "medium"}
                  >
                    Advanced Filters
                  </Button>
                </Box>
              </Box>
            </Paper>

            {/* Student Grid */}
            <Grid container spacing={2} sx={{ 
              justifyContent: 'center',
              mt: 2
            }}>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={student.id} sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 3
                  }}>
                    <Card 
                      sx={{ 
                        height: 260, // Fixed height for all cards
                        width: 280, // Fixed width for all cards
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        borderRadius: 2,
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                          cursor: 'pointer'
                        }
                      }}
                      onClick={() => handleViewDetails(student.id)}
                    >
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                        <Avatar 
                          src={student.avatar} 
                          alt={student.name}
                          sx={{ width: 80, height: 80, mb: 2 }}
                        />
                        <Typography variant="h6" component="h2" align="center" gutterBottom>
                          {student.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
                          {student.email}
                        </Typography>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Chip 
                            label={student.course} 
                            color="primary" 
                            size="small" 
                            icon={<School fontSize="small" />}
                          />
                          <Chip 
                            label={`Grade: ${student.grade}`} 
                            color="secondary" 
                            size="small" 
                            variant="outlined"
                          />
                          {student.performance && (
                            <Chip 
                              label={`Attendance: ${student.performance.attendance}%`} 
                              color={student.performance.attendance > 90 ? 'success' : 
                                    student.performance.attendance > 75 ? 'primary' : 
                                    student.performance.attendance > 60 ? 'warning' : 'error'} 
                              size="small" 
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6">No students found matching your criteria</Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Paper>
        </>
      ) : (
        // Attendance Tracker Tab
        <AttendanceTracker />
      )}
    </Box>
  );
};

export default StudentList;
