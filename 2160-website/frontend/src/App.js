import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, CircularProgress, Backdrop } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginModal from './Components/LoginModal';
import RegisterModal from './Components/RegisterModal';
import Navbar from './Components/Navbar';
import HomePage from './Pages/HomePage';
import MyBookings from './Pages/MyBookings';
import PackageDetails from './Pages/PackageDetails';
import AdminPanel from './Pages/AdminPanel';  // Import AdminPanel page
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
  });

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user.isLoggedIn) {
      setIsLoginOpen(false);  
      setIsRegisterOpen(false);
    }
  }, [user.isLoggedIn]);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      setUser({
        isLoggedIn: true,
        isAdmin: localStorage.getItem('is_admin') === 'true',
        firstName: localStorage.getItem('first_name'),
        lastName: localStorage.getItem('last_name'),
        email: localStorage.getItem('email'),
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setUser({ isLoggedIn: false, isAdmin: false, firstName: '', lastName: '', email: '' });
  };

  const openLoginModal = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false);
  };

  const closeLoginModal = () => {
    setIsLoginOpen(false);
  };

  const openRegisterModal = () => {
    setIsRegisterOpen(true);
    setIsLoginOpen(false);
  };

  const closeRegisterModal = () => {
    setIsRegisterOpen(false);
  };

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
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <Backdrop open={loading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <CircularProgress color="inherit" />
          </Backdrop>

          <Navbar
            onLoginRegisterClick={openLoginModal}
            handleLogout={handleLogout}
            user={user}
          />

          {/* Define the Routes */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/package/:packageId" element={<PackageDetails />} />
            <Route path="/bookings" element={<MyBookings user={user}/>} />
            {user.isAdmin && <Route path="/admin" element={<AdminPanel user={user}/>} />}  {/* Admin route */}
          </Routes>

          <LoginModal
            open={isLoginOpen}
            onClose={closeLoginModal}
            setIsLoggedIn={handleLoginSuccess}
            onRegisterClick={openRegisterModal}
            setLoading={handleSetLoading}
          />

          <RegisterModal
            open={isRegisterOpen}
            onClose={closeRegisterModal}
          />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
