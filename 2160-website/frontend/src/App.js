import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, CircularProgress, Backdrop } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Import necessary components for routing
import LoginModal from './Components/LoginModal';
import RegisterModal from './Components/RegisterModal';
import Navbar from './Components/Navbar';
import HomePage from './Pages/HomePage';
import PackageDetails from './Pages/PackageDetails';  // Import PackageDetails page
import { deepPurple } from '@mui/material/colors';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: deepPurple,
  },
});

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);  // Initially modals are closed
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwt_token'));
  const [loading, setLoading] = useState(false); // Loading state for the whole page

  useEffect(() => {
    if (isLoggedIn) {
      setIsLoginOpen(false);  // Ensure modals close after login
      setIsRegisterOpen(false);
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setIsLoggedIn(false);
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

  return (
    <ThemeProvider theme={darkTheme}>
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          {/* Loading overlay for the whole page */}
          <Backdrop open={loading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <CircularProgress color="inherit" />
          </Backdrop>

          <Navbar
            onLoginRegisterClick={openLoginModal}  // Open login modal when button clicked
            isLoggedIn={isLoggedIn}
            handleLogout={handleLogout}
          />

          {/* Define Routes */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/package/:packageId" element={<PackageDetails />} />  {/* Route for package details */}
          </Routes>

          {/* Modal for login */}
          <LoginModal
            open={isLoginOpen}  // Modal is closed by default
            onClose={closeLoginModal}  // Close login modal
            setIsLoggedIn={setIsLoggedIn}
            onRegisterClick={openRegisterModal}  // Open register modal from login
            setLoading={handleSetLoading}  // Set loading state for the entire page during login
          />
          
          {/* Modal for register */}
          <RegisterModal
            open={isRegisterOpen}  // Modal is closed by default
            onClose={closeRegisterModal}  // Close register modal
          />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
