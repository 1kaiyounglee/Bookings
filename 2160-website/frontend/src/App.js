import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, Button, IconButton, Container, Box, Grid } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { deepPurple } from '@mui/material/colors';
import { useState } from 'react';

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: deepPurple,
  },
});

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = ['Popular Package 1', 'Popular Package 2', 'Popular Package 3', 'Popular Package 4'];

  // Function to handle slideshow slide change
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ flexGrow: 1 }}>
        {/* App Bar (Top Navigation) */}
        <AppBar position="static">
          <Toolbar>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Holiday Planner
            </Typography>
            <Button color="inherit">Sign In</Button>
            <Button color="inherit">Register</Button>
          </Toolbar>
        </AppBar>

        {/* Slideshow Section */}
        <Box
          sx={{
            height: '100vh',
            backgroundColor: '#212121',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ position: 'absolute', top: '40%', width: '100%' }}>
            <Typography variant="h3" sx={{ mb: 2 }}>
              {slides[currentSlide]}
            </Typography>
            <Button variant="outlined" color="inherit" onClick={nextSlide}>
              Next
            </Button>
          </Box>
        </Box>

        {/* Content after the slideshow */}
        <Container sx={{ mt: 5 }}>
          <Typography variant="h4" gutterBottom>
            Explore our services
          </Typography>
          <Typography paragraph>
            Scroll past the slideshow to view more options, manage bookings, make bookings, and more!
          </Typography>

          {/* Manage Bookings and other options */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Button variant="contained" fullWidth>
                Manage Bookings
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button variant="contained" fullWidth>
                Make a Booking
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button variant="contained" fullWidth>
                View Account
              </Button>
            </Grid>
          </Grid>

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
      </Box>
    </ThemeProvider>
  );
}

export default App;
