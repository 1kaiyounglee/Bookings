import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import LoginRegisterModal from './Components/LoginRegisterModal'; // Import the modal
import Navbar from './Components/Navbar'; // Import the Navbar
import HomePage from './Pages/HomePage'; // Import the HomePage component
import { deepPurple } from '@mui/material/colors';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: deepPurple,
  },
});

function App() {
  const [modalOpen, setModalOpen] = useState(false); // Manage modal visibility
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if the user is logged in

  // Function to open modal
  const openModal = () => {
    setModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setModalOpen(false);
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('jwt_token'); // Clear the JWT token
    setIsLoggedIn(false); // Set logged in state to false
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ flexGrow: 1 }}>
        {/* Use the Navbar component */}
        <Navbar onLoginRegisterClick={openModal} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

        {/* Routes */}
        <HomePage /> {/* Show HomePage content */}
        
        {/* Login/Register Modal */}
        <LoginRegisterModal open={modalOpen} onClose={closeModal} setIsLoggedIn={setIsLoggedIn} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
