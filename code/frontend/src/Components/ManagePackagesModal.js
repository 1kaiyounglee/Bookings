import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Button, Modal, TextField, MenuItem, FormControl, Snackbar, Alert, Chip, OutlinedInput } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { getPackagesGeneral, getLocations, getCategories } from '../HelperFunctions/GetDatabaseModels'; // Fetch packages, locations, and themes
import { upsertPackage, deletePackage } from '../HelperFunctions/SendData'; // Single upsert function and delete

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#2e2e2e',
  boxShadow: 24,
  p: 4,
  color: 'white',
};

function ManagePackagesModal({ open, onClose }) {
  const [packages, setPackages] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]); // Fetch categories for themes
  const [selectedThemes, setSelectedThemes] = useState([]); // Track selected themes (categories)
  const [selectedPackage, setSelectedPackage] = useState('new');
  const [newPackageId, setNewPackageId] = useState(null);
  const [packageDetails, setPackageDetails] = useState({
    name: '',
    description: '',
    location_id: '',
    duration: '',
    price: '',
  });
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Fetch the list of packages, locations, and categories when the modal opens
  useEffect(() => {
    if (open) {
      fetchPackagesAndLocations();
    }
  }, [open]);

  // Fetch packages, locations, and categories
  async function fetchPackagesAndLocations() {
    const packageData = await getPackagesGeneral();
    const locationData = await getLocations();
    const categoryData = await getCategories(); // Fetch themes (categories)
    setPackages([{ package_id: 'new', name: 'New Package' }, ...packageData]);
    setLocations(locationData);
    setCategories(categoryData); // Set available themes

    // Calculate the next auto-increment package_id
    if (packageData.length > 0) {
      const lastPackageId = Math.max(...packageData.map((p) => p.package_id));
      setNewPackageId(lastPackageId + 1);
    }
  }

  // Handle package selection and populate fields
  const handlePackageSelect = (packageId) => {
    if (packageId === 'new') {
      setPackageDetails({
        name: '',
        description: '',
        location_id: '',
        duration: '',
        price: '',
      });
      setSelectedThemes([]); // Clear selected themes for a new package
    } else {
      const selected = packages.find((p) => p.package_id === packageId);
      setPackageDetails({
        name: selected.name,
        description: selected.description,
        location_id: selected.location_id,
        duration: selected.duration,
        price: selected.price,
      });
      setSelectedThemes(selected.categories || []); // Load the selected themes for the package
    }
    setSelectedPackage(packageId);
  };
  console.log(packageDetails, "SLECTED PACKAGE D ET AILS");

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPackageDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle adding a theme from the dropdown
  const handleThemeAdd = (theme) => {
    if (!selectedThemes.includes(theme)) {
      setSelectedThemes([...selectedThemes, theme]);
    }
  };

  // Handle removing a theme from the Chip list
  const handleThemeRemove = (theme) => {
    setSelectedThemes(selectedThemes.filter((t) => t !== theme));
  };

  // Handle location selection from the dropdown
  const handleLocationSelect = (locationId) => {
    setPackageDetails((prevDetails) => ({
      ...prevDetails,
      location_id: locationId,
    }));
  };

  // Show a success message in the snackbar
  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  // Handle updating or adding a package
  const handleUpsertPackage = async () => {
    try {
      const packageData = {
        ...packageDetails,
        package_id: selectedPackage === 'new' ? newPackageId : selectedPackage,
        categories: selectedThemes, // Pass the selected themes to the package data
      };

      await upsertPackage(packageData);

      showSnackbar(selectedPackage === 'new' ? 'Package added successfully!' : 'Package updated successfully!');
      await fetchPackagesAndLocations(); // Refresh the list of packages
    } catch (error) {
      console.error('Error upserting package:', error);
    }
  };

  // Handle deleting the selected package
  const handleDeletePackage = async () => {
    try {
      await deletePackage(selectedPackage);
      showSnackbar('Package deleted successfully!');
      await fetchPackagesAndLocations();
      setSelectedPackage('new');
      setPackageDetails({
        name: '',
        description: '',
        location_id: '',
        duration: '',
        price: '',
      });
      setSelectedThemes([]); // Clear themes
    } catch (error) {
      console.error('Error deleting package:', error);
    }
  };

  // Clear data on modal close
  const handleModalClose = () => {
    setSelectedPackage('new');
    setPackageDetails({
      name: '',
      description: '',
      location_id: '',
      duration: '',
      price: '',
    });
    setSelectedThemes([]); // Clear themes on close
    onClose();
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={(_, reason) => {
          if (reason !== 'backdropClick') {
            handleModalClose();
          }
        }}
        aria-labelledby="manage-packages-modal"
      >
        <Box sx={modalStyle}>
          <IconButton
            aria-label="close"
            onClick={handleModalClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
          >
            <CloseRoundedIcon />
          </IconButton>

          <Typography variant="h6" component="h2" gutterBottom sx={{ color: 'white', mb: 2 }}>
            Manage Packages
          </Typography>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <TextField
              select
              label="Select Package"
              value={selectedPackage}
              onChange={(e) => handlePackageSelect(e.target.value)}
              variant="outlined"
              required
              sx={{
                color: 'white',
                '.MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                },
                '.MuiSvgIcon-root': { fill: 'white' },
                mt: 1,
                input: { color: 'white' },
                label: { color: 'white' },
              }}
            >
              {packages.map((pkg) => (
                <MenuItem key={pkg.package_id} value={pkg.package_id}>
                  {pkg.name}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>

          <TextField
            label="Name"
            name="name"
            value={packageDetails.name}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            name="description"
            value={packageDetails.description}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          {locations.length > 0 && (
            <TextField
              select
              label="Location"
              name="location_id"
              value={packageDetails.location_id || ''}  // Ensure the correct location_id is set from the selected package
              onChange={(e) => handleLocationSelect(e.target.value)}  // Updates location_id
              fullWidth
              required
              sx={{ mb: 2 }}
            >
              {locations.map((loc) => (
                <MenuItem key={loc.location_id} value={loc.location_id}>
                  {loc.city}, {loc.country}
                </MenuItem>
              ))}
            </TextField>
          )}
          <TextField
            label="Duration"
            name="duration"
            value={packageDetails.duration}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Price"
            name="price"
            value={packageDetails.price}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ color: 'white', mb: 1 }}>
              Themes (Categories)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedThemes.map((theme, index) => (
                <Chip
                  key={index}
                  label={theme}
                  onDelete={() => handleThemeRemove(theme)}
                  sx={{ backgroundColor: '#555', color: 'white' }}
                />
              ))}
            </Box>
          </Box>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <TextField
              select
              label="Add Theme"
              onChange={(e) => handleThemeAdd(e.target.value)}
              value="" // Reset value after selecting
              variant="outlined"
              sx={{
                color: 'white',
                '.MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                },
                '.MuiSvgIcon-root': { fill: 'white' },
                mt: 1,
                input: { color: 'white' },
                label: { color: 'white' },
              }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.category_id} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>

          <Button variant="contained" color="primary" fullWidth onClick={handleUpsertPackage} sx={{ mt: 1 }}>
            {selectedPackage === 'new' ? 'Add Package' : 'Update Package'}
          </Button>
          {selectedPackage !== 'new' && (
            <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }} onClick={handleDeletePackage}>
              Delete Package
            </Button>
          )}
        </Box>
      </Modal>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ManagePackagesModal;
