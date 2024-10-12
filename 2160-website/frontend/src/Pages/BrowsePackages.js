import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, MenuItem, Slider, Grid } from '@mui/material';
import { Formik, Field } from 'formik';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { getPackagesGeneral, getDistinctLocations, getCategories } from '../HelperFunctions/GetDatabaseModels';

function BrowsePackages() {
  const [allPackages, setAllPackages] = useState([]); // Store the original package data
  const [filteredPackages, setFilteredPackages] = useState([]); // Store the filtered data to display
  const [locations, setLocations] = useState([]);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch the packages, themes, and locations when the component loads
  useEffect(() => {
    async function fetchData() {
      try {
        const [packageData, locationData, categoryData] = await Promise.all([getPackagesGeneral(), getDistinctLocations(), getCategories()]);
        setAllPackages(packageData);
        setFilteredPackages(packageData); // Initially, filtered packages will be the same as all packages
        setLocations(locationData);
        setThemes(categoryData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // JavaScript function to apply the filters
  const applyFilters = (values) => {
    let filteredData = [...allPackages]; // Start with all the packages

    // Apply theme filter
    if (values.theme) {
      filteredData = filteredData.filter(pkg => pkg.categories.includes(values.theme));
    }

    // Apply location filter
    if (values.location) {
      filteredData = filteredData.filter(pkg => pkg.location_city === values.location);
    }

    // Apply duration filter
    filteredData = filteredData.filter(pkg => pkg.duration >= values.duration[0] && pkg.duration <= values.duration[1]);

    // Apply price filter
    filteredData = filteredData.filter(pkg => pkg.price >= values.price[0] && pkg.price <= values.price[1]);

    // Update the filtered packages to be rendered
    setFilteredPackages(filteredData);
  };

  if (loading) {
    return <Typography>Loading packages...</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', padding: '20px', gap: '20px' }}>
      {/* Filter Section */}
      <Formik
        initialValues={{
          theme: '',
          location: '',
          duration: [0, 10],
          price: [0, 2000],
        }}
        onSubmit={() => {}} // We no longer need the submit button, filters will update dynamically
      >
        {({ values, handleChange, setFieldValue }) => (
          <Box sx={{ width: '300px', paddingRight: '20px', position: 'sticky', top: '20px', flexShrink: 0, borderRight: '1px solid #ccc' }}>
            <Typography variant="h5" sx={{ marginBottom: '20px' }}>
              Filter Packages
            </Typography>
            <Field
              as={TextField}
              label="Theme"
              name="theme"
              select
              fullWidth
              value={values.theme}
              onChange={(e) => {
                handleChange(e);
                applyFilters({ ...values, theme: e.target.value });
              }}
              sx={{ marginBottom: '20px' }}
            >
              <MenuItem value="">All</MenuItem>
              {themes.map((theme, index) => (
                <MenuItem key={index} value={theme}>
                  {theme}
                </MenuItem>
              ))}
            </Field>
            <Field
              as={TextField}
              label="Location"
              name="location"
              select
              fullWidth
              value={values.location}
              onChange={(e) => {
                handleChange(e);
                applyFilters({ ...values, location: e.target.value });
              }}
              sx={{ marginBottom: '20px' }}
            >
              <MenuItem value="">All</MenuItem>
              {locations.map((location, index) => (
                <MenuItem key={index} value={location.city}>
                  {location.city}, {location.country}
                </MenuItem>
              ))}
            </Field>

            <Typography gutterBottom>Duration (days)</Typography>
            <Slider
              value={values.duration}
              onChange={(e, newValue) => {
                setFieldValue("duration", newValue);
                applyFilters({ ...values, duration: newValue });
              }}
              valueLabelDisplay="auto"
              min={0}
              max={10}
              sx={{ marginBottom: '20px' }}
            />
            <Typography gutterBottom>Price ($)</Typography>
            <Slider
              value={values.price}
              onChange={(e, newValue) => {
                setFieldValue("price", newValue);
                applyFilters({ ...values, price: newValue });
              }}
              valueLabelDisplay="auto"
              min={0}
              max={2000}
              sx={{ marginBottom: '20px' }}
            />
          </Box>
        )}
      </Formik>

      {/* Packages Section */}
      <Box sx={{ flex: 1 }}>
        {filteredPackages.length === 0 ? (
          <Typography>No packages found with these filters</Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredPackages.map((pkg, index) => (
              <Grid
                item
                xs={12}
                md={6}
                key={index}
                onClick={() => navigate(`/package/${pkg.package_id}`)} // Add click event to navigate
                sx={{ cursor: 'pointer' }} // Make it look clickable
              >
                <Box
                  sx={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '15px',
                    display: 'flex',
                    gap: '15px',
                    alignItems: 'center',
                  }}
                >
                  {/* Package Image */}
                  <Box sx={{ width: '120px', height: '120px', overflow: 'hidden', borderRadius: '8px' }}>
                    {pkg.images && pkg.images.length > 0 ? (
                      <img
                        src={`http://localhost:5000${pkg.images[0]}`}
                        alt={pkg.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
        )}
      </Box>
    </Box>
  );
}

export default BrowsePackages;
