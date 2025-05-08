import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Tooltip
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  School, 
  Person, 
  ExitToApp, 
  PersonAdd,
  Settings,
  Notifications
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ThemeToggle from '../theme/ThemeToggle';
import { useAuth } from '../auth/AuthContext';
import { signOut, auth } from '../../firebase/config';
import NotificationBell from '../notifications/NotificationBell';

const Navbar = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
    handleClose();
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleClose();
  };

  return (
    <AppBar position="static" elevation={0} sx={{ mb: 2 }}>
      <Toolbar sx={{ 
        p: { xs: 0.5, sm: 1 }, // Reduce padding on small screens
        minHeight: { xs: '56px', sm: '64px' } // Adjust toolbar height
      }}>
        <IconButton
          size={isMobile ? "medium" : "large"}
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: { xs: 1, sm: 2 } }}
          onClick={() => navigate('/dashboard')}
        >
          <School />
        </IconButton>
        
        <Typography 
          variant={isMobile ? "subtitle1" : "h6"} 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 'bold',
            fontSize: { xs: '1rem', sm: '1.25rem' } // Responsive font size
          }}
          noWrap
        >
          Student Dashboard
        </Typography>
        
        {isAuthenticated ? (
          <>
            {isTablet ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ThemeToggle />
                  <NotificationBell />
                  <IconButton
                    size={isMobile ? "small" : "medium"}
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                    sx={{ ml: 0.5 }}
                  >
                    <MenuIcon />
                  </IconButton>
                </Box>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => handleNavigate('/dashboard')}>Dashboard</MenuItem>
                  <MenuItem onClick={() => handleNavigate('/add-student')}>Add Student</MenuItem>
                  <MenuItem onClick={() => handleNavigate('/notifications')}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Settings fontSize="small" sx={{ mr: 1 }} />
                      Notification Settings
                    </Box>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ExitToApp fontSize="small" sx={{ mr: 1 }} />
                      Logout
                    </Box>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ThemeToggle />
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/dashboard')}
                  size="small"
                >
                  Dashboard
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/add-student')}
                  size="small"
                >
                  Add Student
                </Button>
                <NotificationBell />
                <Tooltip title="Notification Settings">
                  <IconButton 
                    color="inherit" 
                    onClick={() => navigate('/notifications')}
                    size="small"
                  >
                    <Settings fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                  <Avatar 
                    sx={{ 
                      width: 28, 
                      height: 28, 
                      bgcolor: 'secondary.main',
                      mr: 1,
                      fontSize: '0.875rem'
                    }}
                  >
                    {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                  <Button 
                    color="inherit" 
                    onClick={handleLogout}
                    startIcon={<ExitToApp />}
                    size="small"
                  >
                    Logout
                  </Button>
                </Box>
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ThemeToggle />
            <Button 
              color="inherit" 
              onClick={() => navigate('/login')}
              startIcon={isMobile ? null : <Person />}
              size={isMobile ? "small" : "medium"}
              sx={{ 
                mr: { xs: 0.5, sm: 1 },
                px: { xs: 1, sm: 2 }
              }}
            >
              {isMobile ? "Login" : "Login"}
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/register')}
              startIcon={isMobile ? null : <PersonAdd />}
              variant={isMobile ? "text" : "outlined"}
              size={isMobile ? "small" : "medium"}
              sx={{ 
                borderColor: isMobile ? 'transparent' : 'white', 
                '&:hover': { 
                  borderColor: isMobile ? 'transparent' : 'rgba(255, 255, 255, 0.8)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                },
                px: { xs: 1, sm: 2 }
              }}
            >
              {"Register"}
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
