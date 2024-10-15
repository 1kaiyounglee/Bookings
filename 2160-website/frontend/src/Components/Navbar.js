import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Tooltip, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'; // Import the account icon
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import { useNavigate } from 'react-router-dom';

function Navbar({ onLoginRegisterClick, handleLogout, user }) {
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

  const handleCartClick = () => {
    navigate('/cart');
  }

  const handleLogOutClick = () => {
    navigate('/');
  }

  const handleBrowsePackagesClick = () => {
    navigate('/browse-packages'); // Add your account route if applicable
  };

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Button color="inherit" onClick={handleHomeClick} sx={{ fontSize: '1rem', textTransform: 'none' }}>
          <Typography variant="h6" component="div">
            Holiday Booking System
          </Typography>
        </Button>
        {user.isLoggedIn ? (
          <Box sx={{ display: 'flex', gap: '10px' }}> 
          <Tooltip title="Browse Packages">
              <IconButton color="inherit" onClick={handleBrowsePackagesClick}>
                <TravelExploreRoundedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="My Orders">
              <IconButton color="inherit" onClick={handleBookingsClick}>
                <AutoStoriesRoundedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cart">
              <IconButton color="inherit" onClick={handleCartClick}>
                <ShoppingCartRoundedIcon />
              </IconButton>
            </Tooltip>
            {user.isAdmin && (
              <Tooltip title="Admin Panel">
                <IconButton color="inherit" onClick={handleAdminPanelClick}>
                  <AdminPanelSettingsRoundedIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="My Account">
              <IconButton color="inherit" onClick={handleAccountClick}>
                <AccountCircleRoundedIcon />
              </IconButton>
            </Tooltip>            
            <Tooltip title="Logout">
              <IconButton color="inherit" onClick={() => {
                handleLogOutClick();  // Navigate to home
                handleLogout();       // Perform logout actions (e.g., clearing user data)
              }}>
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
