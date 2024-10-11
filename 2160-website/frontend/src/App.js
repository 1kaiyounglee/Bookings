import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, CircularProgress, Backdrop } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Import necessary components for routing
import LoginModal from './Components/LoginModal';
import RegisterModal from './Components/RegisterModal';
import Navbar from './Components/Navbar';
import HomePage from './Pages/HomePage';
import PackageDetails from './Pages/PackageDetails';  // Import PackageDetails page
import AdminPanel from './Pages/AdminPanel';  // Import AdminPanel page
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
  const [isAdmin, setIsAdmin] = useState(false); // State to track if the user is admin
  const [loading, setLoading] = useState(false); // Loading state for the whole page

  useEffect(() => {
    // Fetch user data from localStorage or make an API call to check admin status
    const fetchUserData = async () => {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        // Normally, you would make an API call to check if the user is admin
        // Here we're simulating it by checking localStorage
        const response = await fetch('/api/check_admin', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const userData = await response.json();
        setIsAdmin(userData.is_admin);  // Set admin status based on user data
        setIsLoggedIn(true);
      }
    };
    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setIsLoggedIn(false);
    setIsAdmin(false); // Reset admin status on logout
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
            isAdmin={isAdmin}  // Pass admin status to Navbar
            handleLogout={handleLogout}
          />

          {/* Define Routes */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/package/:packageId" element={<PackageDetails />} />  {/* Route for package details */}
            {isAdmin && <Route path="/admin" element={<AdminPanel />} />} {/* Admin panel route */}
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
