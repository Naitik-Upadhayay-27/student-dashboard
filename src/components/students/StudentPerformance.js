import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  LinearProgress,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const StudentPerformance = ({ student }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // If no performance data is available
  if (!student.performance) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Performance Data
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No performance data available for this student.
        </Typography>
      </Paper>
    );
  }

  const { attendance, assignments, exams, monthlyProgress } = student.performance;
  
  // Calculate average assignment score
  const avgAssignmentScore = assignments.reduce((sum, item) => sum + (item.score / item.maxScore) * 100, 0) / assignments.length;
  
  // Calculate average exam score
  const avgExamScore = exams.reduce((sum, item) => sum + (item.score / item.maxScore) * 100, 0) / exams.length;
  
  // Prepare data for pie chart
  const pieData = [
    { name: 'Attendance', value: attendance, color: '#2196f3' },
    { name: 'Assignments', value: avgAssignmentScore, color: '#4caf50' },
    { name: 'Exams', value: avgExamScore, color: '#f44336' }
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1.5, boxShadow: 2, bgcolor: 'background.paper' }}>
          <Typography variant="body2" color="text.primary">
            {`${label}: ${payload[0].value}${payload[0].unit || ''}`}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, mt: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.primary.main }}>
        Performance Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Attendance Section */}
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
              Attendance Rate
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                {attendance}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={attendance} 
              sx={{ 
                height: 10, 
                borderRadius: 5,
                bgcolor: 'rgba(0,0,0,0.05)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: attendance > 90 ? '#4caf50' : attendance > 75 ? '#ff9800' : '#f44336',
                  borderRadius: 5
                }
              }} 
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {attendance >= 90 ? 'Excellent attendance!' : 
               attendance >= 75 ? 'Good attendance' : 'Needs improvement'}
            </Typography>
          </Box>
        </Grid>

        {/* Assignment Scores */}
        <Grid item xs={12} md={8}>
          <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
              Assignment Scores
            </Typography>
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 180}>
              <BarChart data={assignments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        {/* Monthly Progress */}
        <Grid item xs={12} md={8}>
          <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
              Monthly Progress
            </Typography>
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 180}>
              <LineChart data={monthlyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke={theme.palette.secondary.main} 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        {/* Overall Performance */}
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
              Overall Performance
            </Typography>
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 180}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        {/* Exam Performance */}
        <Grid item xs={12}>
          <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
              Exam Performance
            </Typography>
            <Grid container spacing={2}>
              {exams.map((exam, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{exam.name}</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {exam.score}/{exam.maxScore} ({Math.round((exam.score / exam.maxScore) * 100)}%)
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(exam.score / exam.maxScore) * 100} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: 'rgba(0,0,0,0.05)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: (exam.score / exam.maxScore) * 100 > 90 ? '#4caf50' : 
                                  (exam.score / exam.maxScore) * 100 > 75 ? '#ff9800' : '#f44336',
                          borderRadius: 4
                        }
                      }} 
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default StudentPerformance;
