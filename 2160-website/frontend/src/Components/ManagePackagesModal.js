import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Button, Modal, TextField, MenuItem, FormControl, Snackbar, Alert } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { getPackagesGeneral, getLocations } from '../HelperFunctions/GetDatabaseModels'; // Fetch packages and locations
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

  // Fetch the list of packages and locations when the modal opens
  useEffect(() => {
    if (open) {
      fetchPackagesAndLocations();
    }
  }, [open]);

  // Fetch packages and locations
  async function fetchPackagesAndLocations() {
    const packageData = await getPackagesGeneral();
    const locationData = await getLocations(); // Fetch locations
    setPackages([{ package_id: 'new', name: 'New Package' }, ...packageData]); // Add 'new package' as the first item
    setLocations(locationData);

    // Calculate the next auto-increment package_id
    if (packageData.length > 0) {
      const lastPackageId = Math.max(...packageData.map(p => p.package_id));
      setNewPackageId(lastPackageId + 1); // Increment from the last package ID
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
    } else {
      const selected = packages.find(p => p.package_id === packageId);
      setPackageDetails({
        name: selected.name,
        description: selected.description,
        location_id: selected.location_id,
        duration: selected.duration,
        price: selected.price,
      });
    }
    setSelectedPackage(packageId);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPackageDetails((prevDetails) => ({
      ...prevDetails, [name]: value,
    }));
  };

  // Handle location selection from the dropdown
  const handleLocationSelect = (locationId) => {
    setPackageDetails((prevDetails) => ({
      ...prevDetails, location_id: locationId,
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
      if (selectedPackage === 'new') {
        await upsertPackage({ ...packageDetails, package_id: newPackageId });
        showSnackbar('Package added successfully!');
      } else {
        await upsertPackage({ package_id: selectedPackage, ...packageDetails });
        showSnackbar('Package updated successfully!');
      }
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
      await fetchPackagesAndLocations(); // Refresh the list of packages
      setSelectedPackage('new'); // Reset to 'new package' after deletion
      setPackageDetails({
        name: '',
        description: '',
        location_id: '',
        duration: '',
        price: '',
      });
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
          <TextField
            select
            label="Location"
            name="location_id"
            value={packageDetails.location_id}
            onChange={(e) => handleLocationSelect(e.target.value)}
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ManagePackagesModal;