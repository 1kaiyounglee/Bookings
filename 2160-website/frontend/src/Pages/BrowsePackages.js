import React, { useState, useEffect } from 'react';
import { Box, Typography, Slider, TextField, MenuItem, Button } from '@mui/material';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import { getPackagesGeneral } from '../HelperFunctions/GetDatabaseModels';

function BrowsePackages() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    theme: '',
    location: '',
    duration: [1, 10],
    price: [100, 2000],
  });

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

  const handlePackageClick = (package_id) => {
    navigate(`/package/${package_id}`);
  };

  const applyFilters = async () => {
    let whereClause = '';
    if (filter.theme) whereClause += `c.name = '${filter.theme}' AND `;
    if (filter.location) whereClause += `l.city = '${filter.location}' AND `;
    if (whereClause.endsWith('AND ')) whereClause = whereClause.slice(0, -4);
    const filteredPackages = await getPackagesGeneral(whereClause);
    setPackages(filteredPackages);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, padding: '20px' }}>
      {/* Filter Sidebar */}
      <Box sx={{ minWidth: '250px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <Typography variant="h5" gutterBottom>
          Filter Packages
        </Typography>
        <TextField
          select
          label="Theme"
          value={filter.theme}
          onChange={(e) => setFilter({ ...filter, theme: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        >
          {/* Populate themes dynamically */}
          <MenuItem value="Adventure">Adventure</MenuItem>
          <MenuItem value="Cultural">Cultural</MenuItem>
          {/* Add more themes here */}
        </TextField>
        <TextField
          select
          label="Location"
          value={filter.location}
          onChange={(e) => setFilter({ ...filter, location: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        >
          {/* Populate locations dynamically */}
          <MenuItem value="New York">New York</MenuItem>
          <MenuItem value="Paris">Paris</MenuItem>
          {/* Add more locations here */}
        </TextField>
        <Typography gutterBottom>Duration (days)</Typography>
        <Slider
          value={filter.duration}
          onChange={(e, newValue) => setFilter({ ...filter, duration: newValue })}
          valueLabelDisplay="auto"
          min={1}
          max={10}
          sx={{ mb: 2 }}
        />
        <Typography gutterBottom>Price ($)</Typography>
        <Slider
          value={filter.price}
          onChange={(e, newValue) => setFilter({ ...filter, price: newValue })}
          valueLabelDisplay="auto"
          min={100}
          max={2000}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={applyFilters} fullWidth>
          Apply Filters
        </Button>
      </Box>

      {/* Package Slider */}
      <Box sx={{ flexGrow: 1, overflowX: 'scroll', display: 'flex', gap: 2 }}>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : packages.length > 0 ? (
          packages.map((pkg, index) => (
            <PackageItem key={index} pkg={pkg} handlePackageClick={handlePackageClick} />
          ))
        ) : (
          <Typography>No packages found.</Typography>
        )}
      </Box>
    </Box>
  );
}

// Package Item Component
const PackageItem = ({ pkg, handlePackageClick }) => (
  <Box sx={{ minWidth: '275px', border: '2px solid #ccc', borderRadius: '8px', padding: '15px', cursor: 'pointer' }} onClick={() => handlePackageClick(pkg.package_id)}>
    <Box sx={{ mb: 2 }}>
      {pkg.images && pkg.images.length > 0 ? (
        <img src={pkg.images[0]} alt={pkg.name} style={{ width: '100%', borderRadius: '8px' }} />
      ) : (
        <Typography>No Image</Typography>
      )}
    </Box>
    <Typography variant="h6" sx={{ mb: 1 }}>
      {pkg.name}
    </Typography>
    <Typography>Location: {pkg.location_city}, {pkg.location_country}</Typography>
    <Typography>Duration: {pkg.duration} days</Typography>
    <Typography>Price: ${pkg.price}</Typography>
  </Box>
);

export default BrowsePackages;
