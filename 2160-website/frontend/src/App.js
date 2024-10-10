import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid2 from '@mui/material/Grid2'; // Grid2 is still in an unstable state
import { AppBar, Toolbar, Typography, Button, IconButton, Container, Box } from '@mui/material';
import { Menu as MenuIcon, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { deepPurple } from '@mui/material/colors';
import LoginRegisterModal from './Modals/LoginRegisterModal'; // Import the modal

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: deepPurple,
  },
});

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalOpen, setModalOpen] = useState(false); // Manage modal visibility

  const slides = ['Popular Package 1', 'Popular Package 2', 'Popular Package 3', 'Popular Package 4'];
  const colors = ['#1abc9c', '#3498db', '#9b59b6', '#e74c3c']; // Background colors for each slide

  // Automatically go to the next slide every 7.5 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      nextSlide();
    }, 7500);

    return () => clearInterval(slideInterval); // Cleanup the interval on component unmount
  }, [currentSlide]);

  // Function to handle slideshow slide change
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Function to open modal
  const openModal = () => {
    setModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Holiday Booking System
            </Typography>
            <Button color="inherit" onClick={openModal}>Sign In / Register</Button>
          </Toolbar>
        </AppBar>

        {/* Slideshow Section */}
        <Box
          sx={{
            height: '100vh',
            backgroundColor: colors[currentSlide],
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            transition: 'background-color 0.5s ease-in-out', // Smooth background color transition
          }}
        >
          {/* Left Arrow */}
          <IconButton
            onClick={prevSlide}
            sx={{
              position: 'absolute',
              left: 0,
              color: 'white',
              fontSize: '3rem',
              zIndex: 10,
              opacity: 0.5,
              '&:hover': { opacity: 1 },
            }}
          >
            <ArrowBackIos fontSize="large" />
          </IconButton>

          {/* Current Slide */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                transition: 'transform 0.5s ease-in-out', // Slide effect
                transform: `translateX(-${currentSlide * 100}%)`, // Moves slides left or right
                width: `${slides.length * 100}%`,
              }}
            >
              {slides.map((slide, index) => (
                <Box
                  key={index}
                  sx={{
                    minWidth: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                  }}
                >
                  <Typography variant="h3" sx={{ mb: 2 }}>
                    {slide}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Right Arrow */}
          <IconButton
            onClick={nextSlide}
            sx={{
              position: 'absolute',
              right: 0,
              color: 'white',
              fontSize: '3rem',
              zIndex: 10,
              opacity: 0.5,
              '&:hover': { opacity: 1 },
            }}
          >
            <ArrowForwardIos fontSize="large" />
          </IconButton>

          {/* Dots Indicator */}
          <Box sx={{ position: 'absolute', bottom: '20px', display: 'flex', gap: '8px' }}>
            {slides.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: currentSlide === index ? 'white' : 'grey',
                  transition: 'background-color 0.3s',
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Content after the slideshow */}
        <Container sx={{ mt: 5 }}>
          <Typography variant="h4" gutterBottom>
            Explore our services
          </Typography>

          {/* Manage Bookings and other options */}
          <Grid2 container spacing={2}>
            <Grid2 item xs={12} sm={6} md={4}>
              <Button variant="contained" fullWidth>
                Manage Bookings
              </Button>
            </Grid2>
            <Grid2 item xs={12} sm={6} md={4}>
              <Button variant="contained" fullWidth>
                Make a Booking
              </Button>
            </Grid2>
            <Grid2 item xs={12} sm={6} md={4}>
              <Button variant="contained" fullWidth>
                View Account
              </Button>
            </Grid2>
          </Grid2>

          {/* Bottom Buttons for Contact and FAQs */}
          <Box sx={{ mt: 5, textAlign: 'center' }}>
            <Button variant="outlined" sx={{ m: 2 }}>
              Contact Us
            </Button>
            <Button variant="outlined" sx={{ m: 2 }}>
              FAQs
            </Button>
          </Box>
        </Container>

        {/* Login/Register Modal */}
        <LoginRegisterModal open={modalOpen} onClose={closeModal} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
