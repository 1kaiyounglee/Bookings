import React, { useState, useEffect } from 'react';
import { Box, Typography, Slider, Grid, TextField, FormControl, Checkbox, ListItemText, OutlinedInput, Select, MenuItem, Button, InputLabel } from '@mui/material';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { getPackagesGeneral, getDistinctLocations, getCategories } from '../HelperFunctions/GetDatabaseModels';

function BrowsePackages() {
  const [allPackages, setAllPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [locations, setLocations] = useState([]);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [minDuration, setMinDuration] = useState(0);
  const [maxDuration, setMaxDuration] = useState(10);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [packageData, locationData, categoryData] = await Promise.all([getPackagesGeneral(), getDistinctLocations(), getCategories()]);
        setAllPackages(packageData);
        setFilteredPackages(packageData);
        setLocations(locationData);
        setThemes(categoryData);
        console.log("THEMES", categoryData);
        console.log("locations", locations);


        // Get min/max for duration and price
        const durations = packageData.map(pkg => pkg.duration);
        const prices = packageData.map(pkg => pkg.price);

        setMinDuration(Math.min(...durations));
        setMaxDuration(Math.max(...durations));
        setMinPrice(Math.min(...prices));
        setMaxPrice(Math.max(...prices));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const applyFilters = (values) => {
    let filteredData = [...allPackages];

    // Apply theme filter
    if (values.theme.length > 0) {
      filteredData = filteredData.filter(pkg =>
        values.theme.some(theme => pkg.categories.includes(theme))
      );
    }

    // Apply location filter
    if (values.location.length > 0) {
      filteredData = filteredData.filter(pkg =>
        values.location.includes(pkg.location_city)
      );
    }

    // Apply duration filter
    filteredData = filteredData.filter(pkg => pkg.duration >= values.duration[0] && pkg.duration <= values.duration[1]);

    // Apply price filter
    filteredData = filteredData.filter(pkg => pkg.price >= values.price[0] && pkg.price <= values.price[1]);

    // Apply sort by duration and price in one box
    if (values.sort === 'ascDuration') {
      filteredData = filteredData.sort((a, b) => a.duration - b.duration);
    } else if (values.sort === 'descDuration') {
      filteredData = filteredData.sort((a, b) => b.duration - a.duration);
    } else if (values.sort === 'ascPrice') {
      filteredData = filteredData.sort((a, b) => a.price - b.price);
    } else if (values.sort === 'descPrice') {
      filteredData = filteredData.sort((a, b) => b.price - a.price);
    }

    setFilteredPackages(filteredData);
  };

  const resetFilters = (setFieldValue) => {
    setFieldValue('theme', []);
    setFieldValue('location', []);
    setFieldValue('duration', [minDuration, maxDuration]);
    setFieldValue('price', [minPrice, maxPrice]);
    setFieldValue('sort', '');
    setFilteredPackages(allPackages); // Reset to all packages
  };

  if (loading) {
    return <Typography>Loading packages...</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', padding: '20px', gap: '20px' }}>
      {/* Filter Section */}
      <Formik
        initialValues={{
          theme: [],
          location: [],
          duration: [minDuration, maxDuration], // Initialize dynamically based on package data
          price: [minPrice, maxPrice], // Initialize dynamically based on package data
          sort: '' // Single element for both duration and price sorting
        }}
        onSubmit={() => {}} // Filters will update dynamically
      >
        {({ values, handleChange, setFieldValue }) => (
          <Box sx={{ width: '300px', paddingRight: '20px', position: 'sticky', top: '20px', flexShrink: 0, borderRight: '1px solid #ccc' }}>
            <Typography variant="h5" sx={{ marginBottom: '20px' }}>
              Filter Packages
            </Typography>

            {/* Multi-select for Themes */}
            <TextField
              label="Theme"
              select
              name="theme"
              value={values.theme || []}
              onChange={(e) => {
                const selectedThemes = e.target.value || [];
                setFieldValue("theme", selectedThemes);
                applyFilters({ ...values, theme: selectedThemes });
              }}
              SelectProps={{ multiple: true, renderValue: (selected) => selected.join(', ') }}
              fullWidth
              variant="outlined"
              sx={{ marginBottom: '20px' }}
            >
              {themes.map((theme, index) => (
                <MenuItem key={index} value={theme.name}>
                  <Checkbox checked={values.theme.indexOf(theme.name) > -1} />
                  <ListItemText primary={theme.name} />
                </MenuItem>
              ))}
            </TextField>

            {/* Multi-select for Locations */}
            <TextField
              label="Location"
              select
              name="location"
              value={values.location || []}
              onChange={(e) => {
                const selectedLocations = e.target.value || [];
                setFieldValue("location", selectedLocations);
                applyFilters({ ...values, location: selectedLocations });
              }}
              SelectProps={{ multiple: true, renderValue: (selected) => selected.join(', ') }}
              fullWidth
              variant="outlined"
              sx={{ marginBottom: '20px' }}
            >
              {locations.map((location, index) => (
                <MenuItem key={index} value={location.city}>
                  <Checkbox checked={values.location.indexOf(location.city) > -1} />
                  <ListItemText primary={`${location.city}, ${location.country}`} />
                </MenuItem>
              ))}
            </TextField>

            <Typography gutterBottom>Duration (days)</Typography>
            <Slider
              value={values.duration}
              onChange={(e, newValue) => {
                setFieldValue("duration", newValue);
                applyFilters({ ...values, duration: newValue });
              }}
              valueLabelDisplay="auto"
              min={minDuration}
              max={maxDuration}
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
              min={minPrice}
              max={maxPrice}
              sx={{ marginBottom: '20px' }}
            />

            {/* Sort Box for Duration and Price */}
            <TextField
              label="Sort by"
              select
              name="sort"
              value={values.sort}
              onChange={(e) => {
                setFieldValue("sort", e.target.value);
                applyFilters({ ...values, sort: e.target.value });
              }}
              fullWidth
              variant="outlined"
              sx={{ marginBottom: '20px' }}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="ascDuration">Duration (Low to High)</MenuItem>
              <MenuItem value="descDuration">Duration (High to Low)</MenuItem>
              <MenuItem value="ascPrice">Price (Low to High)</MenuItem>
              <MenuItem value="descPrice">Price (High to Low)</MenuItem>
            </TextField>

            <Button
              variant="contained"
              fullWidth
              onClick={() => resetFilters(setFieldValue)}
            >
              Reset Filters
            </Button>
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
              <Grid item xs={12} md={6} key={index}>
                <Box
                  onClick={() => navigate(`/package/${pkg.package_id}`)}
                  sx={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '15px',
                    display: 'flex',
                    gap: '15px',
                    alignItems: 'center',
                  }}
                >
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

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ marginBottom: '5px' }}>{pkg.name}</Typography>
                    <Typography variant="body1" sx={{ marginBottom: '5px' }}>{pkg.location_city}, {pkg.location_country}</Typography>
                    <Typography variant="body1" sx={{ marginBottom: '5px' }}>{pkg.duration} days</Typography>
                    <Typography variant="body1" sx={{ marginBottom: '5px' }}>Price: ${pkg.price}</Typography>
                    <Typography variant="body1" sx={{ marginTop: '10px' }}>{pkg.categories.join(', ')}</Typography>
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
