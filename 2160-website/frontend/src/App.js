import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import LoginRegisterModal from './Components/LoginRegisterModal';
import Navbar from './Components/Navbar';
import HomePage from './Pages/HomePage';
import { deepPurple } from '@mui/material/colors';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: deepPurple,
  },
});

function App() {
  const [modalOpen, setModalOpen] = useState(false); // Modal visibility
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwt_token')); // JWT token check

  // Watch for changes in `isLoggedIn` to close the modal and re-render navbar
  useEffect(() => {
    if (isLoggedIn) {
      setModalOpen(false); // Close the modal after login
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token'); // Remove token
    setIsLoggedIn(false); // Set logged out state
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ flexGrow: 1 }}>
        <Navbar onLoginRegisterClick={openModal} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <HomePage />
        <LoginRegisterModal open={modalOpen} onClose={closeModal} setIsLoggedIn={setIsLoggedIn} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
