import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'; // Import logout icon

function Navbar({ onLoginRegisterClick, isLoggedIn, handleLogout }) {
  return (
    <AppBar position="fixed"> {/* Changed position to fixed to keep it pinned */}
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Holiday Booking System
        </Typography>
        {isLoggedIn ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="logout"
              onClick={handleLogout}
              sx={{ mr: 2 }} // Margin to the right of the logout button
            >
              <LogoutRoundedIcon />
            </IconButton>
            <Button color="inherit">My Account</Button>
          </>
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
