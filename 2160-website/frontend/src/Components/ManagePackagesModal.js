import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Button, Modal, TextField, MenuItem, FormControl } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { getPackagesGeneral, getLocations } from '../HelperFunctions/GetDatabaseModels'; // Fetch packages and locations
import { updatePackage, addPackage, deletePackage } from '../HelperFunctions/SendData'; // Functions for managing packages

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
  const [selectedPackage, setSelectedPackage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [newPackageId, setNewPackageId] = useState(null);
  const [packageDetails, setPackageDetails] = useState({
    name: '',
    description: '',
    location_id: '',
    duration: '',
    price: '',
  });

  // Fetch the list of packages and locations when the modal opens
  useEffect(() => {
    async function fetchPackagesAndLocations() {
      const packageData = await getPackagesGeneral();
      const locationData = await getLocations(); // Fetch locations
      setPackages(packageData);
      setLocations(locationData);

      // Calculate the next auto-increment package_id
      if (packageData.length > 0) {
        const lastPackageId = Math.max(...packageData.map(p => p.package_id));
        setNewPackageId(lastPackageId + 1); // Increment from the last package ID
      }
    }

    if (open) {
      fetchPackagesAndLocations();
    }
  }, [open]);

  // Handle package selection and populate fields
  const handlePackageSelect = (packageId) => {
    const selected = packages.find(p => p.package_id === packageId);
    setSelectedPackage(packageId);
    setPackageDetails({
      name: selected.name,
      description: selected.description,
      location_id: selected.location_id,
      duration: selected.duration,
      price: selected.price,
    });
    setEditMode(false); // Disable editing by default
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

  // Enable editing mode
  const handleEditClick = () => {
    setEditMode(true);
  };

  // Handle updating the selected package
  const handleUpdatePackage = async () => {
    try {
      await updatePackage(selectedPackage, packageDetails);
      alert('Package updated successfully!');
    } catch (error) {
      console.error('Error updating package:', error);
    }
  };

  // Handle adding a new package
  const handleAddPackage = async () => {
    try {
      await addPackage({ ...packageDetails, package_id: newPackageId });
      alert('Package added successfully!');
    } catch (error) {
      console.error('Error adding package:', error);
    }
  };

  // Handle deleting the selected package
  const handleDeletePackage = async () => {
    try {
      await deletePackage(selectedPackage);
      alert('Package deleted successfully!');
    } catch (error) {
      console.error('Error deleting package:', error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={(_, reason) => {
        if (reason !== 'backdropClick') {
          onClose();
        }
      }}
      aria-labelledby="manage-packages-modal"
    >
      <Box sx={modalStyle}>
        <IconButton
          aria-label="close"
          onClick={onClose}
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

        {selectedPackage && !editMode && (
          <Button variant="contained" color="primary" fullWidth onClick={handleEditClick}>
            Edit Package
          </Button>
        )}

        {selectedPackage && editMode && (
          <>
            <TextField
              label="Name"
              name="name"
              value={packageDetails.name}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              disabled={!editMode}
            />
            <TextField
              label="Description"
              name="description"
              value={packageDetails.description}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              disabled={!editMode}
            />
            <TextField
              select
              label="Location"
              name="location_id"
              value={packageDetails.location_id}
              onChange={(e) => handleLocationSelect(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              disabled={!editMode}
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
              sx={{ mb: 2 }}
              disabled={!editMode}
            />
            <TextField
              label="Price"
              name="price"
              value={packageDetails.price}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              disabled={!editMode}
            />
            <Button variant="contained" color="primary" fullWidth onClick={handleUpdatePackage}>
              Update Package
            </Button>
            <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }} onClick={handleDeletePackage}>
              Delete Package
            </Button>
          </>
        )}

        {!selectedPackage && (
          <>
            <TextField
              label="Name"
              name="name"
              value={packageDetails.name}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              name="description"
              value={packageDetails.description}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              select
              label="Location"
              name="location_id"
              value={packageDetails.location_id}
              onChange={(e) => handleLocationSelect(e.target.value)}
              fullWidth
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
              sx={{ mb: 2 }}
            />
            <TextField
              label="Price"
              name="price"
              value={packageDetails.price}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" fullWidth onClick={handleAddPackage}>
              Add Package
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
}

export default ManagePackagesModal;
