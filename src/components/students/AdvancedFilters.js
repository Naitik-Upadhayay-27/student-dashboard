import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  IconButton,
  Grid,
  Divider,
  Tooltip,
  Slider
} from '@mui/material';
import {
  FilterList,
  Sort,
  Clear,
  ExpandMore,
  Search,
  DateRange,
  Grade,
  School
} from '@mui/icons-material';

const AdvancedFilters = ({ 
  courses, 
  onFilterChange, 
  onSortChange, 
  onClearFilters,
  initialFilters = {}
}) => {
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState({
    name: initialFilters.name || '',
    email: initialFilters.email || '',
    course: initialFilters.course || '',
    grade: initialFilters.grade || '',
    enrollmentDateStart: initialFilters.enrollmentDateStart || '',
    enrollmentDateEnd: initialFilters.enrollmentDateEnd || '',
    performanceRange: initialFilters.performanceRange || [0, 100]
  });
  const [sortOption, setSortOption] = useState(initialFilters.sortOption || 'name_asc');
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Handle accordion expansion
  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

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
    // Count active filters
    let count = 0;
    if (filters.name) count++;
    if (filters.email) count++;
    if (filters.course) count++;
    if (filters.grade) count++;
    if (filters.enrollmentDateStart) count++;
    if (filters.enrollmentDateEnd) count++;
    if (filters.performanceRange[0] > 0 || filters.performanceRange[1] < 100) count++;
    
    setActiveFiltersCount(count);
    
    // Call parent filter handler
    onFilterChange({
      ...filters,
      sortOption
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
    setSortOption('name_asc');
    setActiveFiltersCount(0);
    onClearFilters();
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOption(value);
    onSortChange(value);
  };

  // Get grades for dropdown
  const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];

  return (
    <Paper elevation={0} variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
      <Accordion 
        expanded={expanded} 
        onChange={handleAccordionChange}
        disableGutters
        elevation={0}
        sx={{ 
          borderRadius: 2,
          '&:before': { display: 'none' }
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{ px: 3, py: 1 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterList sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Advanced Filters & Sorting</Typography>
              
              {activeFiltersCount > 0 && (
                <Chip 
                  label={`${activeFiltersCount} active`} 
                  size="small" 
                  color="primary" 
                  sx={{ ml: 2 }}
                />
              )}
            </Box>
            
            {!expanded && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControl sx={{ minWidth: 200, mr: 2 }} size="small">
                  <InputLabel id="sort-by-label">Sort By</InputLabel>
                  <Select
                    labelId="sort-by-label"
                    value={sortOption}
                    onChange={handleSortChange}
                    label="Sort By"
                  >
                    <MenuItem value="name_asc">Name (A-Z)</MenuItem>
                    <MenuItem value="name_desc">Name (Z-A)</MenuItem>
                    <MenuItem value="grade_asc">Grade (Low-High)</MenuItem>
                    <MenuItem value="grade_desc">Grade (High-Low)</MenuItem>
                    <MenuItem value="date_asc">Enrollment Date (Oldest)</MenuItem>
                    <MenuItem value="date_desc">Enrollment Date (Newest)</MenuItem>
                    <MenuItem value="performance_asc">Performance (Low-High)</MenuItem>
                    <MenuItem value="performance_desc">Performance (High-Low)</MenuItem>
                  </Select>
                </FormControl>
                
                {activeFiltersCount > 0 && (
                  <Tooltip title="Clear all filters">
                    <IconButton onClick={clearFilters} size="small">
                      <Clear />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )}
          </Box>
        </AccordionSummary>
        
        <AccordionDetails sx={{ px: 3, pb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Sort sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Sort Options</Typography>
              </Box>
              
              <FormControl fullWidth>
                <InputLabel id="sort-by-label-expanded">Sort By</InputLabel>
                <Select
                  labelId="sort-by-label-expanded"
                  value={sortOption}
                  onChange={handleSortChange}
                  label="Sort By"
                >
                  <MenuItem value="name_asc">Name (A-Z)</MenuItem>
                  <MenuItem value="name_desc">Name (Z-A)</MenuItem>
                  <MenuItem value="grade_asc">Grade (Low-High)</MenuItem>
                  <MenuItem value="grade_desc">Grade (High-Low)</MenuItem>
                  <MenuItem value="date_asc">Enrollment Date (Oldest)</MenuItem>
                  <MenuItem value="date_desc">Enrollment Date (Newest)</MenuItem>
                  <MenuItem value="performance_asc">Performance (Low-High)</MenuItem>
                  <MenuItem value="performance_desc">Performance (High-Low)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FilterList sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Filter Options</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Filter by Name"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Filter by Email"
                name="email"
                value={filters.email}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="course-filter-label">Filter by Course</InputLabel>
                <Select
                  labelId="course-filter-label"
                  name="course"
                  value={filters.course}
                  onChange={handleFilterChange}
                  label="Filter by Course"
                  startAdornment={<School sx={{ color: 'action.active', mr: 1 }} />}
                >
                  <MenuItem value="">All Courses</MenuItem>
                  {courses.map((course) => (
                    <MenuItem key={course} value={course}>
                      {course}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="grade-filter-label">Filter by Grade</InputLabel>
                <Select
                  labelId="grade-filter-label"
                  name="grade"
                  value={filters.grade}
                  onChange={handleFilterChange}
                  label="Filter by Grade"
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
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Enrollment Date (From)"
                name="enrollmentDateStart"
                type="date"
                value={filters.enrollmentDateStart}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <DateRange sx={{ color: 'action.active', mr: 1 }} />,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Enrollment Date (To)"
                name="enrollmentDateEnd"
                type="date"
                value={filters.enrollmentDateEnd}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <DateRange sx={{ color: 'action.active', mr: 1 }} />,
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Performance Range
              </Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={filters.performanceRange}
                  onChange={handlePerformanceRangeChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 25, label: '25%' },
                    { value: 50, label: '50%' },
                    { value: 75, label: '75%' },
                    { value: 100, label: '100%' }
                  ]}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={clearFilters}
                  startIcon={<Clear />}
                >
                  Clear Filters
                </Button>
                <Button
                  variant="contained"
                  onClick={applyFilters}
                  startIcon={<FilterList />}
                >
                  Apply Filters
                </Button>
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default AdvancedFilters;
