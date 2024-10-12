import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, MenuItem, Slider, Button, Grid } from '@mui/material';
import { getPackagesGeneral } from '../HelperFunctions/GetDatabaseModels';

function BrowsePackages() {
  const [packages, setPackages] = useState([]);
  const [filters, setFilters] = useState({
    theme: '',
    location: '',
    duration: [0, 10],
    price: [0, 2000],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const packageData = await getPackagesGeneral();
        setPackages(packageData);
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPackages();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleDurationChange = (event, newValue) => {
    setFilters((prev) => ({ ...prev, duration: newValue }));
  };

  const handlePriceChange = (event, newValue) => {
    setFilters((prev) => ({ ...prev, price: newValue }));
  };

  const applyFilters = () => {
    console.log('Apply filters with: ', filters);
    // You can build a whereClause from the filters and fetch filtered data if needed.
  };

  if (loading) {
    return <Typography>Loading packages...</Typography>;
  }

  if (packages.length === 0) {
    return <Typography>No packages found.</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', padding: '20px' }}>
      {/* Filter Section */}
      <Box sx={{ width: '300px', paddingRight: '20px', position: 'sticky', top: '20px' }}>
        <Typography variant="h5" sx={{ marginBottom: '20px' }}>
          Filter Packages
        </Typography>
        <TextField
          label="Theme"
          name="theme"
          select
          fullWidth
          value={filters.theme}
          onChange={handleFilterChange}
          sx={{ marginBottom: '20px' }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Adventure">Adventure</MenuItem>
          <MenuItem value="Cultural">Cultural</MenuItem>
        </TextField>
        <TextField
          label="Location"
          name="location"
          select
          fullWidth
          value={filters.location}
          onChange={handleFilterChange}
          sx={{ marginBottom: '20px' }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="New York">New York</MenuItem>
          <MenuItem value="Tokyo">Tokyo</MenuItem>
        </TextField>
        <Typography gutterBottom>Duration (days)</Typography>
        <Slider
          value={filters.duration}
          onChange={handleDurationChange}
          valueLabelDisplay="auto"
          min={0}
          max={10}
          sx={{ marginBottom: '20px' }}
        />
        <Typography gutterBottom>Price ($)</Typography>
        <Slider
          value={filters.price}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={2000}
          sx={{ marginBottom: '20px' }}
        />
        <Button variant="contained" fullWidth onClick={applyFilters}>
          Apply Filters
        </Button>
      </Box>

      {/* Packages Section */}
      <Box sx={{ flex: 1, paddingLeft: '20px' }}>
        <Grid container spacing={3}>
          {packages.map((pkg, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box
                sx={{
                  border: '2px solid #ccc',
                  borderRadius: '8px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  height: '150px',
                }}
              >
                {/* Package Image */}
                <Box sx={{ width: '150px', height: '100%', marginRight: '20px', overflow: 'hidden', borderRadius: '8px' }}>
                  {pkg.images && pkg.images.length > 0 ? (
                    <img
                      src={`http://localhost:5000${pkg.images[0]}`}
                      alt={pkg.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  ) : (
                    <Typography>No Image Available</Typography>
                  )}
                </Box>

                {/* Package Details */}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ marginBottom: '5px' }}>
                    {pkg.name}
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: '5px' }}>
                    {pkg.location_city}, {pkg.location_country}
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: '5px' }}>
                    {pkg.duration} days
                  </Typography>
                  <Typography variant="body1">Price: ${pkg.price}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default BrowsePackages;
