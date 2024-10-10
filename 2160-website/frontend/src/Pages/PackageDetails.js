import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPackages } from '../HelperFunctions/GetDatabaseModels';
import Navbar from '../Components/Navbar';
import { Box, Typography, Button, IconButton, TextField } from '@mui/material';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';

function PackageDetails() {
  const { packageId } = useParams(); // Get the package ID from the route
  const [packageData, setPackageData] = useState(null);

  useEffect(() => {
    // Fetch the package details based on packageId
    async function fetchPackage() {
      const data = await getPackages(`package_id = ${packageId}`);
      if (data && data.length > 0) {
        setPackageData(data[0]); // Set the fetched package data
      }
    }
    fetchPackage();
  }, [packageId]);

  if (!packageData) {
    return <div>Loading...</div>; // Show loading state until package data is fetched
  }

  return (
    <>
      <Navbar />
      <Box sx={{ padding: '20px' }}>
        <IconButton onClick={() => window.history.back()}>
          <ArrowBackIos />
        </IconButton>
        <Typography variant="h4">{packageData.description}</Typography>
        <Typography variant="h6">{packageData.location}</Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          {/* Display package images with navigation */}
          {packageData.images.length > 0 ? (
            packageData.images.map((img, index) => (
              <img key={index} src={img} alt={`Package ${index}`} width="150px" height="150px" />
            ))
          ) : (
            <Typography>No images available</Typography>
          )}
        </Box>

        <Typography sx={{ mt: 3 }}>{packageData.description}</Typography>
        <Typography>Price: ${packageData.price}</Typography>
        <Typography>Duration: {packageData.duration} days</Typography>

        {/* Additional details */}
        <Typography>Themes: {packageData.categories.join(', ')}</Typography>

        {/* Add booking form */}
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 3 }}>
          <TextField label="Number of Travellers" type="number" sx={{ mb: 2 }} />
          <TextField label="Start Date" type="date" sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
          <TextField label="End Date" type="date" sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
          <Button variant="contained" color="primary">Add to Cart</Button>
        </Box>
      </Box>
    </>
  );
}

export default PackageDetails;
