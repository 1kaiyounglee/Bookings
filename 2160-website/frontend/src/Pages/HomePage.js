import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { getPackages } from '../HelperFunctions/GetDatabaseModels';  // Use the new top 5 packages function
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(1); // Start at the first cloned slide
  const [slides, setSlides] = useState([]);
  const defaultColor = '#2e2e2e';  // Default grey color for packages with no image
  const navigate = useNavigate();
  const transitionRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false); // Handle instant transitions

  // Only make the text area clickable
  const handleSlideClick = (packageId) => {
    navigate(`/package/${packageId}`);  // Navigate to the specific package based on packageId
  };

  // Fetch top 5 packages when the component mounts
  useEffect(() => {
    async function fetchPackages() {
      const packages = await getPackages();
      if (packages.length > 0) {
        // Add clones: clone the last slide to the front, and the first slide to the end
        const clonedSlides = [packages[packages.length - 1], ...packages, packages[0]];
        setSlides(clonedSlides);
      }
    }
    fetchPackages();
  }, []);

  // Automatically go to the next slide every 15 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      nextSlide();
    }, 15000);

    return () => clearInterval(slideInterval);
  }, [currentSlide]);

  // Function to handle seamless transitions
  const handleTransitionEnd = () => {
    if (currentSlide === slides.length - 1) {
      setIsTransitioning(true);
      setCurrentSlide(1);
    } else if (currentSlide === 0) {
      setIsTransitioning(true);
      setCurrentSlide(slides.length - 2);
    }
  };

  const nextSlide = () => {
    if (!isTransitioning) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (!isTransitioning) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (isTransitioning) {
      setTimeout(() => {
        setIsTransitioning(false);  // Re-enable transitions after jump
      }, 50);
    }
  }, [isTransitioning]);

  const getSlideContent = (slide) => {
    const image = slide.images && slide.images.length > 0 ? `http://localhost:5000${slide.images[0]}` : null;
    const backgroundImage = image ? `url(${image})` : defaultColor;
    console.log(slide.package_id);
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
          position: 'relative',
        }}
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
            cursor: 'pointer', // Make the grey background area clickable
            transition: 'background-color 0.3s', // Smooth transition for hover effect
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker background on hover
              transform: 'scale(1.05)', // Slight zoom effect on hover
            },
          }}
          onClick={() => handleSlideClick(slide.package_id)} // Only the grey background area is clickable
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
              transition: isTransitioning ? 'none' : 'transform 0.5s ease-in-out', // Slide effect
              transform: `translateX(-${currentSlide * 100}%)`, // Moves slides left or right
              width: `${slides.length * 100}%`, // Total width based on number of slides
            }}
            onTransitionEnd={handleTransitionEnd}
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
          {slides.slice(1, -1).map((_, index) => (
            <Box
              key={index}
              sx={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: currentSlide === index + 1 ? 'white' : 'grey',
                transition: 'background-color 0.3s',
              }}
            />
          ))}
        </Box>
      </Box>
    </>
  );
}

export default HomePage;
