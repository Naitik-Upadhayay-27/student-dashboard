import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  LinearProgress,
  Divider,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Fade
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
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
  Cell,
  AreaChart,
  Area
} from 'recharts';

// Modern color palette
const COLORS = {
  attendance: '#3f51b5', // Blue
  assignments: '#4caf50', // Green
  exams: '#f44336',      // Red
  progress: '#e91e63',   // Pink
  background: '#f5f7fa', // Light background
  cardBg: '#ffffff',     // Card background
  text: '#2d3748',       // Dark text
  textSecondary: '#718096', // Secondary text
  shadow: 'rgba(0, 0, 0, 0.08)' // Shadow color
};

const StudentPerformance = ({ student }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [animate, setAnimate] = useState(false);
  
  // Animation effect
  useEffect(() => {
    setAnimate(true);
  }, []);
  
  // If no performance data is available
  if (!student.performance) {
    return (
      <Fade in={animate} timeout={800}>
        <Paper sx={{ 
          p: 4, 
          borderRadius: '12px', 
          mt: 4,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          bgcolor: COLORS.cardBg
        }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: COLORS.text }}>
            Performance Data
          </Typography>
          <Typography variant="body1" sx={{ color: COLORS.textSecondary }}>
            No performance data available for this student.
          </Typography>
        </Paper>
      </Fade>
    );
  }

  const { attendance, assignments, exams, monthlyProgress } = student.performance;
  
  // Calculate average assignment score
  const avgAssignmentScore = assignments.reduce((sum, item) => sum + (item.score / item.maxScore) * 100, 0) / assignments.length;
  
  // Calculate average exam score
  const avgExamScore = exams.reduce((sum, item) => sum + (item.score / item.maxScore) * 100, 0) / exams.length;
  
  // Prepare data for pie chart with modern colors
  const pieData = [
    { name: 'Attendance', value: attendance, color: COLORS.attendance },
    { name: 'Assignments', value: avgAssignmentScore, color: COLORS.assignments },
    { name: 'Exams', value: avgExamScore, color: COLORS.exams }
  ];
  
  // Prepare data for area chart (monthly progress)
  const areaChartData = monthlyProgress.map(item => ({
    ...item,
    score: item.score,
    average: avgAssignmentScore
  }));

  // Enhanced custom tooltip for charts
  const CustomTooltip = ({ active, payload, label, type }) => {
    if (active && payload && payload.length) {
      const dataType = type || '';
      const value = payload[0].value;
      const color = payload[0].color || COLORS.progress;
      
      return (
        <Paper sx={{ 
          p: 2, 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', 
          bgcolor: COLORS.cardBg,
          borderRadius: '8px',
          border: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
          <Typography variant="subtitle2" sx={{ color: COLORS.text, fontWeight: 600, mb: 0.5 }}>
            {label}
          </Typography>
          <Typography variant="body2" sx={{ color: color, fontWeight: 700 }}>
            {`${value}${payload[0].unit || '%'}`}
          </Typography>
          {dataType && (
            <Typography variant="caption" sx={{ color: COLORS.textSecondary, display: 'block', mt: 0.5 }}>
              {dataType}
            </Typography>
          )}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Fade in={animate} timeout={800}>
      <Card sx={{ 
        height: '100%', 
        borderRadius: 2, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <AssessmentIcon sx={{ mr: 1 }} /> Performance Dashboard
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          {/* All performance metrics in a single row */}
          <Grid container spacing={2}>
            
            {/* Overall Performance Pie Chart */}
            <Grid item xs={12} md={3}>
              <Card sx={{ 
                borderRadius: '12px', 
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                height: '100%',
                width: '25.5vh',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.09)'
                }
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: COLORS.text, textAlign: 'center' }}>
                    Overall
                  </Typography>
                  <Box sx={{ height: 150, display: 'flex', justifyContent: 'center' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={40}
                          paddingAngle={5}
                          dataKey="value"
                          label={false}
                          labelLine={false}
                        >
                          {pieData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color} 
                              stroke="#fff"
                              strokeWidth={1}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            {/* Assignment Scores */}
            <Grid item xs={12} md={3}>
              <Card sx={{ 
                borderRadius: '12px', 
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                height: '100%',
                width: '25vh',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.09)'
                }
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: COLORS.assignments, textAlign: 'center' }}>
                    Assignments
                  </Typography>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={assignments} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                      <XAxis dataKey="name" tick={{ fontSize: 8, fill: COLORS.textSecondary }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 8, fill: COLORS.textSecondary }} />
                      <Tooltip content={<CustomTooltip type="Assignment" />} />
                      <Bar 
                        dataKey="score" 
                        radius={[4, 4, 0, 0]}
                      >
                        {assignments.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS.assignments} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Exam Performance */}
            <Grid item xs={12} md={3}>
              <Card sx={{ 
                borderRadius: '12px', 
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                height: '100%',
                width: '25vh',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.09)'
                }
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: COLORS.exams, textAlign: 'center' }}>
                    Exams
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, height: 150, overflow: 'auto' }}>
                    {exams.slice(0, 3).map((exam, index) => (
                      <Box key={index}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" sx={{ color: COLORS.text }}>{exam.name}</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.exams }}>
                            {Math.round((exam.score / exam.maxScore) * 100)}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={(exam.score / exam.maxScore) * 100} 
                          sx={{ 
                            height: 6, 
                            borderRadius: 3,
                            bgcolor: 'rgba(244, 67, 54, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              background: `linear-gradient(90deg, ${COLORS.exams}99 0%, ${COLORS.exams} 100%)`,
                              borderRadius: 3
                            }
                          }} 
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Monthly Progress */}
            <Grid item xs={12} md={3}>
              <Card sx={{ 
                borderRadius: '12px', 
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                height: '100%',
                width: '24vh',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.09)'
                }
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: COLORS.progress, textAlign: 'center' }}>
                    Monthly
                  </Typography>
                  <ResponsiveContainer width="100%" height={150}>
                    <AreaChart data={areaChartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                      <XAxis dataKey="month" tick={{ fontSize: 8, fill: COLORS.textSecondary }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 8, fill: COLORS.textSecondary }} />
                      <Tooltip content={<CustomTooltip type="Monthly Score" />} />
                      <defs>
                        <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={COLORS.progress} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={COLORS.progress} stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke={COLORS.progress} 
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#progressGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default StudentPerformance;
