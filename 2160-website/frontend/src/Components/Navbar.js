import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Tooltip, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'; // Import the account icon
import { useNavigate } from 'react-router-dom';

function Navbar({ onLoginRegisterClick, isLoggedIn, handleLogout, user }) {
  const navigate = useNavigate();

  const handleBookingsClick = () => {
    navigate('/bookings');
  };

  const handleAdminPanelClick = () => {
    navigate('/admin');  // Navigate to the Admin Panel page
  };

  const handleHomeClick = () => {
    navigate('/');  // Navigate to the home page
  };

  const handleAccountClick = () => {
    navigate('/account'); // Add your account route if applicable
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Home button now smaller and aligned to the left */}
        <Button color="inherit" onClick={handleHomeClick} sx={{ fontSize: '1rem', textTransform: 'none' }}>
          <Typography variant="h6" component="div">
            Holiday Booking System
          </Typography>
        </Button>
        {user.isLoggedIn ? (
          <Box sx={{ display: 'flex', gap: '10px' }}> {/* Group buttons with spacing */}
            <Button color="inherit" onClick={handleBookingsClick}>
              My Bookings
            </Button>
            <Tooltip title="My Account">
              <IconButton color="inherit" onClick={handleAccountClick}>
                <AccountCircleRoundedIcon />
              </IconButton>
            </Tooltip>
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
