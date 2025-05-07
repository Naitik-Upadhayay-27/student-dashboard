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
  Avatar
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  School, 
  Person, 
  ExitToApp, 
  PersonAdd 
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ThemeToggle from '../theme/ThemeToggle';
import { useAuth } from '../auth/AuthContext';
import { signOut, auth } from '../../firebase/config';

const Navbar = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => navigate('/dashboard')}
        >
          <School />
        </IconButton>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Student Dashboard
        </Typography>
        
        {isAuthenticated ? (
          <>
            {isMobile ? (
              <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
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
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ThemeToggle />
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/dashboard')}
                  sx={{ mx: 1 }}
                >
                  Dashboard
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/add-student')}
                  sx={{ mx: 1 }}
                >
                  Add Student
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: 'secondary.main',
                      mr: 1
                    }}
                  >
                    {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                  <Button 
                    color="inherit" 
                    onClick={handleLogout}
                    startIcon={<ExitToApp />}
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
              startIcon={<Person />}
              sx={{ mr: 1 }}
            >
              Login
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/register')}
              startIcon={<PersonAdd />}
              variant="outlined"
              sx={{ 
                borderColor: 'white', 
                '&:hover': { 
                  borderColor: 'rgba(255, 255, 255, 0.8)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                } 
              }}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
