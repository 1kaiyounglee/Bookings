import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPackagesGeneral } from '../HelperFunctions/GetDatabaseModels';  // Correct function import
import { Box, Typography, Button, IconButton, TextField } from '@mui/material';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';

function PackageDetails() {
  const { packageId } = useParams();
  const [packageData, setPackageData] = useState(null);

  useEffect(() => {
    // Fetch the package details based on packageId
    async function fetchPackage() {
      console.log(`Fetching data for packageId: ${packageId}`);
      const data = await getPackagesGeneral(`p.package_id = ${packageId}`);
      console.log("Queried package data from DB:", data);  // Log the fetched data

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
      <Box sx={{ padding: '20px' }}>
        <IconButton onClick={() => window.history.back()}>
          <ArrowBackIos />
        </IconButton>
        <Typography variant="h4">{packageData.name}</Typography>
        <Typography variant="h6">{packageData.location}</Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          {/* Use optional chaining to avoid errors if `images` is undefined */}
          {packageData?.images?.length > 0 ? (
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

        {/* Use optional chaining to avoid errors if `categories` is undefined */}
        <Typography>Themes: {packageData?.categories?.join(', ') || 'No themes available'}</Typography>

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
