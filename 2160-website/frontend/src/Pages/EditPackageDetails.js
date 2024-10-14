import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Snackbar, Alert, MenuItem, Typography, Chip, Modal, IconButton } from '@mui/material';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import { getPackagesGeneral, getLocations, getCategories } from '../HelperFunctions/GetDatabaseModels'; // Fetching data
import { upsertPackage, deletePackage, insertPackageImages } from '../HelperFunctions/SendData'; // CRUD operations
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

function EditPackageDetails() {
  const { packageId } = useParams(); // Extract package ID from URL
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]); // Fetch categories for themes
  const [selectedThemes, setSelectedThemes] = useState([]); // Track selected themes (categories)
  const [packageDetails, setPackageDetails] = useState({
    name: '',
    description: '',
    location_id: '',
    duration: '',
    price: '',
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Fetch the list of locations and categories when the component mounts
  useEffect(() => {
    fetchPackageAndLocations();
    if (packageId !== 'new') {
      fetchPackageDetails(packageId);
    }
  }, [packageId]);

  // Fetch locations and categories (themes)
  async function fetchPackageAndLocations() {
    const locationData = await getLocations();
    const categoryData = await getCategories();
    setLocations(locationData);
    setCategories(categoryData); // Set available themes
  }

  // Fetch specific package details when editing an existing package
  async function fetchPackageDetails(packageId) {
    const packageData = await getPackagesGeneral(`p.package_id = ${packageId}`);
    if (packageData && packageData.length > 0) {
      const selectedPackage = packageData[0];
      setPackageDetails({
        name: selectedPackage.name,
        description: selectedPackage.description,
        location_id: selectedPackage.location_id,
        duration: selectedPackage.duration,
        price: selectedPackage.price,
        imageUrl: selectedPackage.image_url,  // Add the image URL field here
        images: selectedPackage.images || [],  // For multiple images
      });
      setSelectedThemes(selectedPackage.categories || []);
    }
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPackageDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle adding a theme (category)
  const handleThemeAdd = (theme) => {
    if (!selectedThemes.includes(theme)) {
      setSelectedThemes([...selectedThemes, theme]);
    }
  };

  // Handle removing a theme
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

  const handleNextImage = () => {
    if (packageDetails.images && packageDetails.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % packageDetails.images.length);
    }
  };
  
  const handlePrevImage = () => {
    if (packageDetails.images && packageDetails.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + packageDetails.images.length) % packageDetails.images.length);
    }
  };
  
  const handleImageClick = (index) => {
    if (packageDetails.images && packageDetails.images.length > 0) {
      setCurrentImageIndex(index);
      setOpenPreviewModal(true);
    }
  };

  const VisuallyHiddenInput = ({ onChange, multiple }) => (
    <input
      type="file"
      style={{ display: 'none' }} // Hides the input element visually
      onChange={onChange}
      multiple={multiple}
      accept="image/jpeg"
    />
  );

  const handleFileChange = (event) => {
    console.log("file input triggered")
    const files = Array.from(event.target.files);
    const imagePreviews = files.map((file) => ({
      file, 
      preview: URL.createObjectURL(file), // Create object URLs for preview
    }));

    setNewImages((prevImages) => [...prevImages, ...imagePreviews]); // Add to newImages array
  };

  // Handle submitting the package (either update or create new)
  const handleUpsertPackage = async () => {
    try {
      const packageData = {
        ...packageDetails,
        package_id: packageId,
        categories: selectedThemes,
      };
      await upsertPackage(packageData);
      const imageFiles = newImages.map((image) => image.file);
      await insertPackageImages(packageId, imageFiles);
      navigate(`/package/${packageId}`); // Redirect to packages list or a success page

    } catch (error) {
      console.error('Error upserting package:', error);
      showSnackbar('Failed to update package.');
    }
  };

  // Handle deleting the package
  const handleDeletePackage = async () => {
    try {
      await deletePackage(packageId);
      showSnackbar('Package deleted successfully!');
      navigate('/browse-packages'); // Redirect to packages list after deletion
    } catch (error) {
      console.error('Error deleting package:', error);
      showSnackbar('Failed to delete package.');
    }
  };

  // Show a success message in the snackbar
  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <ArrowBackIos sx={{ }} onClick={() => window.history.back()} style={{ cursor: 'pointer' }} />
      <Box sx={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          {packageId === 'new' ? 'Add New Package' : 'Edit Package'}
        </Typography>
        <TextField
          label="Name"
          name="name"
          value={packageDetails.name}
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
            value={packageDetails.location_id || ''}
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
        )}
        <TextField
          label="Duration (days)"
          name="duration"
          value={packageDetails.duration}
          onChange={handleInputChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        {/* Display existing and new images */}
        {packageDetails.images && packageDetails.images.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Package Images:</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {[...packageDetails.images, ...newImages].map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl.preview ? imageUrl.preview : `http://localhost:5000${imageUrl}`}
                  alt={`Package image ${index}`}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                  onClick={() => handleImageClick(index)}
                />
              ))}
            </Box>
          </Box>
        )}
        {/* Upload Button */}
        <Button
          component="label"
          role={undefined}
          variant="contained"
          startIcon={<CloudUploadIcon />}
          sx={{ mb: 2 }}
        >
          Upload Image
          <VisuallyHiddenInput
            type="file"
            onChange={handleFileChange}
            multiple
          />
        </Button>
        
        <TextField
          label="Description"
          name="description"
          value={packageDetails.description}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={7}  // Minimum number of rows to display
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

        {/* Manage Themes */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Themes:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedThemes.map((theme, index) => (
              <Chip key={index} label={theme} onDelete={() => handleThemeRemove(theme)} />
            ))}
          </Box>
          <TextField
            select
            label="Add Theme"
            onChange={(e) => handleThemeAdd(e.target.value)}
            value="" // Reset value after selecting
            fullWidth
            sx={{ mt: 2 }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.category_id} value={cat.name}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Save or Delete Buttons */}
        <Button variant="contained" color="primary" fullWidth onClick={handleUpsertPackage} sx={{ mt: 1 }}>
          {packageId === 'new' ? 'Add Package' : 'Update Package'}
        </Button>
        {packageId !== 'new' && (
          <Button variant="contained" color="error" fullWidth sx={{ mt: 2 }} onClick={handleDeletePackage}>
            Delete Package
          </Button>
        )}

        {/* Modal to enlarge image */}
        <Modal
          open={openPreviewModal && packageDetails.images && packageDetails.images.length > 0}
          onClose={() => setOpenPreviewModal(false)}
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
              backgroundColor: 'rgba(0, 0, 0, 0.01)',
            }}
          >
            {packageDetails.images && packageDetails.images.length > 0 && (
              <img
                src={`http://localhost:5000${packageDetails.images[currentImageIndex]}`}
                alt={`Enlarged package image ${currentImageIndex}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            )}
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
              onClick={() => setOpenPreviewModal(false)} // Close the modal when clicked
            >
              <CloseRoundedIcon />
            </IconButton>

            {/* Left Arrow and Right Arrow */}
            {packageDetails.images && packageDetails.images.length > 1 && (
              <>
                <IconButton
                  sx={{ position: 'absolute', left: 10, color: 'white' }}
                  onClick={handlePrevImage}
                >
                  <ArrowBackIos />
                </IconButton>

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

        {/* Snackbar for feedback messages */}
        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default EditPackageDetails;