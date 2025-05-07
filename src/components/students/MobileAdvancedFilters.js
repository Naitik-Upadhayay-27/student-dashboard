import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
  Divider,
  Slider
} from '@mui/material';
import {
  FilterList,
  Clear,
  Search,
  DateRange,
  Grade,
  School
} from '@mui/icons-material';

const MobileAdvancedFilters = ({ 
  courses = [], 
  onFilterChange, 
  onClearFilters,
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState({
    name: initialFilters.name || '',
    email: initialFilters.email || '',
    course: initialFilters.course || '',
    grade: initialFilters.grade || '',
    enrollmentDateStart: initialFilters.enrollmentDateStart || '',
    enrollmentDateEnd: initialFilters.enrollmentDateEnd || '',
    performanceRange: initialFilters.performanceRange || [0, 100]
  });

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handle performance range change
  const handlePerformanceRangeChange = (event, newValue) => {
    setFilters(prev => ({ ...prev, performanceRange: newValue }));
  };

  // Apply filters
  const applyFilters = () => {
    // Call parent filter handler
    onFilterChange({
      ...filters,
      sortOption: initialFilters.sortOption || 'name_asc' // Preserve existing sort option
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      name: '',
      email: '',
      course: '',
      grade: '',
      enrollmentDateStart: '',
      enrollmentDateEnd: '',
      performanceRange: [0, 100]
    });
    onClearFilters();
  };

  // Get grades for dropdown
  const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];

  return (
    <Box>
      {/* Group filters into logical sections */}
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium', color: 'primary.main' }}>
        Basic Information
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Search by Name"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            InputProps={{
              startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
            }}
            size="small"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Search by Email"
            name="email"
            value={filters.email}
            onChange={handleFilterChange}
            InputProps={{
              startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
            }}
            size="small"
          />
        </Grid>
      </Grid>
      
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium', color: 'primary.main' }}>
        Academic Information
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel id="course-filter-label">Course</InputLabel>
            <Select
              labelId="course-filter-label"
              name="course"
              value={filters.course}
              onChange={handleFilterChange}
              label="Course"
              startAdornment={<School sx={{ color: 'action.active', mr: 1 }} />}
            >
              <MenuItem value="">All Courses</MenuItem>
              {(courses || []).map((course) => (
                <MenuItem key={course} value={course}>
                  {course}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel id="grade-filter-label">Grade</InputLabel>
            <Select
              labelId="grade-filter-label"
              name="grade"
              value={filters.grade}
              onChange={handleFilterChange}
              label="Grade"
              startAdornment={<Grade sx={{ color: 'action.active', mr: 1 }} />}
            >
              <MenuItem value="">All Grades</MenuItem>
              {grades.map((grade) => (
                <MenuItem key={grade} value={grade}>
                  {grade}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="body2" gutterBottom>
            Performance Range
          </Typography>
          <Box sx={{ px: 1, mb: 1 }}>
            <Slider
              value={filters.performanceRange}
              onChange={handlePerformanceRangeChange}
              valueLabelDisplay="auto"
              min={0}
              max={100}
              marks={[
                { value: 0, label: '0%' },
                { value: 50, label: '50%' },
                { value: 100, label: '100%' }
              ]}
              sx={{
                color: 'secondary.main',
                '& .MuiSlider-valueLabel': {
                  backgroundColor: 'secondary.main',
                }
              }}
            />
          </Box>
        </Grid>
      </Grid>
      
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium', color: 'primary.main' }}>
        Enrollment Date
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="From"
            name="enrollmentDateStart"
            type="date"
            value={filters.enrollmentDateStart}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: <DateRange sx={{ color: 'action.active', mr: 1 }} />,
            }}
            size="small"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="To"
            name="enrollmentDateEnd"
            type="date"
            value={filters.enrollmentDateEnd}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: <DateRange sx={{ color: 'action.active', mr: 1 }} />,
            }}
            size="small"
          />
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 3 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={clearFilters}
          startIcon={<Clear />}
          fullWidth
        >
          Clear
        </Button>
        <Button
          variant="contained"
          onClick={applyFilters}
          startIcon={<FilterList />}
          fullWidth
        >
          Apply
        </Button>
      </Box>
    </Box>
  );
};

export default MobileAdvancedFilters;
