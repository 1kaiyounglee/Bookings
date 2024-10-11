import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, CircularProgress, Backdrop } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Import necessary components for routing
import LoginModal from './Components/LoginModal';
import RegisterModal from './Components/RegisterModal';
import Navbar from './Components/Navbar';
import HomePage from './Pages/HomePage';
import MyBookings from './Pages/MyBookings'
import PackageDetails from './Pages/PackageDetails';  // Import PackageDetails page
import { deepPurple } from '@mui/material/colors';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: deepPurple,
  },
});

function App() {
  const [user, setUser] = useState({
    isLoggedIn : !!localStorage.getItem('jwt_token'),
    isAdmin    : false,
    email      : '',
    firstName  : '',
    lastName   : ''
  })

  const [isLoginOpen, setIsLoginOpen] = useState(false);  // Initially modals are closed
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for the whole page

  useEffect(() => {
    if (user.isLoggedIn) {
      setIsLoginOpen(false);  // Ensure modals close after login
      setIsRegisterOpen(false);
    }
  }, [user.isLoggedIn]);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      setUser({
        isLoggedIn: true,
        isAdmin: localStorage.getItem('is_admin') === 'true',  // Stored as a string in localStorage
        firstName: localStorage.getItem('first_name'),
        lastName: localStorage.getItem('last_name'),
        email: localStorage.getItem('email'),
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setUser({ isLoggedIn: false, isAdmin: false, firstName: '', lastName: '', email: ''});
  };

  const openLoginModal = () => {
    setIsLoginOpen(true);  // Open login modal
    setIsRegisterOpen(false);  // Ensure register modal is closed
  };

  const closeLoginModal = () => {
    setIsLoginOpen(false);  // Close login modal
  };

  const openRegisterModal = () => {
    setIsRegisterOpen(true);  // Open register modal
    setIsLoginOpen(false);  // Close login modal
  };

  const closeRegisterModal = () => {
    setIsRegisterOpen(false);  // Close register modal
  };

  // Function to handle setting loading state for the entire page during login
  const handleSetLoading = (isLoading) => {
    setLoading(isLoading);
  };

  const handleLoginSuccess = (isLoggedIn, userData) => {
    setUser({
      isLoggedIn,
      isAdmin: userData.isAdmin,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
    });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Router>  {/* Wrap the entire app in a Router component */}
        <Box sx={{ flexGrow: 1 }}>
          {/* Loading overlay for the whole page */}
          <Backdrop open={loading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <CircularProgress color="inherit" />
          </Backdrop>

          <Navbar
            onLoginRegisterClick={openLoginModal}  // Open login modal when button clicked
            handleLogout={handleLogout}
            user={user}
          />

          {/* Define the Routes to different pages */}
          <Routes>
            <Route path="/" element={<HomePage />} />  {/* Default Home Page */}
            <Route path="/package/:packageId" element={<PackageDetails />} />  {/* Route for package details */}
            <Route path="/bookings" element={<MyBookings />} />  {/* Bookings Page */}
          </Routes>

          {/* Modal for login */}
          <LoginModal
            open={isLoginOpen}  // Modal is closed by default
            onClose={closeLoginModal}  // Close login modal
            setIsLoggedIn={handleLoginSuccess}
            onRegisterClick={openRegisterModal}  // Open register modal from login
            setLoading={handleSetLoading}  // Set loading state for the entire page during login
          />

          {/* Modal for register */}
          <RegisterModal
            open={isRegisterOpen}  // Modal is closed by default
            onClose={closeRegisterModal}  // Close register modal
          />
        </Box>
      </Router>  {/* Close the Router component */}
    </ThemeProvider>
  );
}

export default App;
