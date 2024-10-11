import React, { useState, useEffect } from 'react';
import { Container, Box, IconButton, Typography, Button } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { getPackages } from '../HelperFunctions/GetDatabaseModels';  // Import the function that fetches packages

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);  // Store package data
  const defaultColor = '#2e2e2e';  // Default grey color for packages with no image
  
  // Fetch packages when the component mounts
  useEffect(() => {
    async function fetchPackages() {
      const packages = await getPackages();
      console.log(packages);
      setSlides(packages || []);  // Set the slides to be the packages or an empty array if none
    }
    fetchPackages();
  }, []);

  // Automatically go to the next slide every 15 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      nextSlide();
    }, 15000);  // Interval changed to 15 seconds

    return () => clearInterval(slideInterval);  // Cleanup the interval on component unmount
  }, [currentSlide]);

  // Function to handle slideshow slide change
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Handle the slide click (you can implement the redirect logic here)
  const handleSlideClick = (packageId) => {
    console.log(`Package clicked: ${packageId}`);
    // Handle the click event, e.g., redirect to a package detail page
  };

  const getSlideContent = (slide) => {
    const image = slide.images && slide.images.length > 0 ? `http://localhost:5000${slide.images[0]}` : null;
    const backgroundImage = image ? `url(${image})` : defaultColor;
    
    return (
      <Box
        key={slide.package_id}
        sx={{
          minWidth: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: backgroundImage === defaultColor ? 'none' : backgroundImage,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          cursor: 'pointer',
          position: 'relative',
        }}
        onClick={() => handleSlideClick(slide.package_id)}
      >
        {/* Text Box with Background */}
        <Box
          sx={{
            position: 'absolute',
            left: '60px',
            display: 'flex',
            flexDirection: 'column', // Stack title and details vertically
            justifyContent: 'center',
            color: 'white',
            padding: '10px', // Add padding for spacing
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent grey background
            borderRadius: '8px', // Slightly rounded corners
            textAlign: 'left',
          }}
        >
          {/* Package Title */}
          <Typography variant="h4" sx={{ marginBottom: '8px', fontWeight: 'bold' }}>
            {slide.name}
          </Typography>
          {/* Package Location and Duration */}
          <Typography variant="body1">Location: {slide.location || 'Unknown'}</Typography>
          <Typography variant="body1">Duration: {slide.duration} days</Typography>
        </Box>
      </Box>
    );
};

  
  

  return (
    <>
      {/* Slideshow Section */}
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
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
            {slides.map((slide) => getSlideContent(slide))}
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
        <Box sx={{ position: 'absolute', bottom: '80px', display: 'flex', gap: '8px' }}>
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

      {/* Bottom Buttons for Contact and FAQs */}
      <Container sx={{ mt: 5, textAlign: 'center' }}>
        <Box
          sx={{
            backgroundColor: '#2e2e2e',
            padding: '10px',
            margin: 'auto',
            width: 'fit-content',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <Button variant="outlined" sx={{ m: 2, color: 'white', borderColor: 'white' }}>
            Contact Us
          </Button>
          <Button variant="outlined" sx={{ m: 2, color: 'white', borderColor: 'white' }}>
            FAQs
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default HomePage;
