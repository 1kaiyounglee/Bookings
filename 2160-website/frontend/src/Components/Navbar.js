import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import { useNavigate } from 'react-router-dom';

function Navbar({ onLoginRegisterClick, isLoggedIn, handleLogout, user }) {
  const navigate = useNavigate();

  const handleBookingsClick = () => {
    navigate('/bookings');
  };

  const handleAdminPanelClick = () => {
    navigate('/admin');  // Navigate to the Admin Panel page
  };
  

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Holiday Booking System
        </Typography>
        {user.isLoggedIn ? (
          <Box sx={{ display: 'flex', gap: '10px' }}> {/* Group buttons with spacing */}
            <Button color="inherit" onClick={handleBookingsClick}>
              My Bookings
            </Button>
            <Button color="inherit" onClick={handleBookingsClick}>
              {user.firstName} {user.lastName}
            </Button>
            {user.isAdmin && (
              <Tooltip title="Admin Panel">
                <IconButton color="inherit" onClick={handleAdminPanelClick}>
                  <AdminPanelSettingsRoundedIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Logout">
              <IconButton color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Button color="inherit" onClick={onLoginRegisterClick}>
            Sign In / Register
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
