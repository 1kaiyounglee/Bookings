import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPackagesGeneral } from '../HelperFunctions/GetDatabaseModels';
import { Box, Typography, Button, TextField, IconButton, Modal, Snackbar, Alert } from '@mui/material';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enGB } from 'date-fns/locale';
import addDays from 'date-fns/addDays';
import { insertBooking } from '../HelperFunctions/SendData';

function PackageDetails({ user }) {
  const { packageId } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [numTravellers, setNumTravellers] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);  // State to manage modal open/close
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isAddedToCart, setisAddedToCart] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPackage() {
      const data = await getPackagesGeneral(`p.package_id = ${packageId}`);
      if (data && data.length > 0) {
        setPackageData(data[0]);
      }
    }
    fetchPackage();
  }, [packageId]);

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setOpenModal(true);  // Open the modal when image is clicked
  };

  const handleStartDateChange = (newStartDate) => {
    setStartDate(newStartDate);
    if (packageData && packageData.duration) {
      const calculatedEndDate = addDays(newStartDate, packageData.duration);
      setEndDate(calculatedEndDate);
    }
  };

  const handleEndDateChange = (newEndDate) => {
    setEndDate(newEndDate);
    if (packageData && packageData.duration) {
      const calculatedStartDate = addDays(newEndDate, -packageData.duration);
      setStartDate(calculatedStartDate);
    }
  };

  const handleTravellersChange = (event) => {
    const value = Math.max(1, parseInt(event.target.value)); // Prevent going below 1
    setNumTravellers(value);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % packageData.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + packageData.images.length) % packageData.images.length);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleAddToCartClick = async () => {
    try {
      if (!user.isLoggedIn) {
        showSnackbar('Please log in before adding a package to the cart.', 'warning')
        return;
      }
      if (!startDate || !endDate) {
        showSnackbar("Please select a start and end date.", 'warning')
        return;
      }
      const email = user.email;
      const bookingData = {
        packageId: packageId,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        numTravellers: numTravellers,
        price: (packageData.price * numTravellers).toFixed(2),
      }
      await insertBooking(email, bookingData);
      showSnackbar('Package added to cart!')
      setisAddedToCart(true);
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  };

  if (!packageData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Box sx={{ position: 'relative', padding: '20px' }}> {/* Ensure the parent Box has relative positioning */}
        <ArrowBackIos onClick={() => window.history.back()} style={{ cursor: 'pointer' }} />
        {user.isAdmin && (
          <Box sx={{ position: 'absolute', top: '20px', right: '20px' }}>  {/* Absolute position inside relatively positioned parent */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/edit-package/${packageId}`)}
            >
              Edit Package
            </Button>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>{packageData.name}</Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>
            {packageData.location_city}, {packageData.location_country}
          </Typography>

          {/* Display images in a row */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
            {packageData.images.length > 0 ? (
              packageData.images.map((img, index) => (
                <img
                  key={index}
                  src={`http://localhost:5000${img}`}
                  alt={`Package image ${index}`}
                  onClick={() => handleImageClick(index)}
                  style={{
                    width: '300px',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                />
              ))
            ) : (
              <Typography>No images available</Typography>
            )}
          </Box>

          {/* Separate layout for description and "Add to Cart" */}
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '40px' }}>
            {/* Description Box */}
            <Box sx={{ width: '60%', textAlign: 'left', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', }}>
              <Typography sx={{ mb: 3 }}>{packageData.description}</Typography>
              <Typography>Themes: {packageData.categories.join(', ')}</Typography>
            </Box>

            {/* "Add to Cart" Box moved outside of the description */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid #ccc',
                padding: '20px',
                borderRadius: '8px',
                maxWidth: '350px',
                marginLeft: '20px',  // Adds space between the boxes
              }}
            >
              <Typography>Price: ${packageData.price}</Typography>
              <Typography>Duration: {packageData.duration} days</Typography>

              {/* Booking Form */}
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                  <TextField
                    label="Number of Travellers"
                    type="number"
                    value={numTravellers}
                    onChange={handleTravellersChange}
                    sx={{ mb: 2 }}
                  />

                  {/* DatePicker for Start Date */}
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    renderInput={(params) => <TextField {...params} />}
                    disablePast
                  />

                  {/* DatePicker for End Date */}
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    renderInput={(params) => <TextField {...params} />}
                    disablePast
                  />

                  <Button 
                    variant="contained" 
                    color={isAddedToCart ? "success" : "primary"} 
                    onClick={isAddedToCart ? null : handleAddToCartClick}
                  >
                    {isAddedToCart ? "Added to Cart" : "Add to Cart"}
                  </Button>
                </Box>
              </LocalizationProvider>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Modal to enlarge image */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '80%',
            height: '80%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.01)', // Set to transparent black
          }}
        >
          <img
            src={`http://localhost:5000${packageData.images[currentImageIndex]}`}
            alt={`Enlarged package image ${currentImageIndex}`}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
          {/* Close button inside the modal */}
          <IconButton
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
            }}
            onClick={() => setOpenModal(false)} // Close the modal when clicked
          >
            <CloseRoundedIcon/>
          </IconButton>

          {/* Left Arrow */}
          {packageData.images.length > 1 && (
            <>
              <IconButton
                sx={{ position: 'absolute', left: 10, color: 'white' }}
                onClick={handlePrevImage}
              >
                <ArrowBackIos />
              </IconButton>

              {/* Right Arrow */}
              <IconButton
                sx={{ position: 'absolute', right: 10, color: 'white' }}
                onClick={handleNextImage}
              >
                <ArrowForwardIos />
              </IconButton>
            </>
          )}
        </Box>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default PackageDetails;
