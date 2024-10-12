import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enGB } from 'date-fns/locale';
import { getCartItems } from '../HelperFunctions/GetDatabaseModels';
import { updateCartItem, removeCartItem } from '../HelperFunctions/SendData'
import EditPackageModal from '../Components/EditCartModal';

function Cart({ user }) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null); // Track the selected item for editing
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const handlePackageClick = (packageId) => {
    navigate(`/package/${packageId}`);
  };

  const handleUpdateItem = async (item, newStartDate, newEndDate, newTravellers, ) => {
    // Update the cart item with the new details
    await updateCartItem(item, newStartDate, newEndDate, newTravellers);
    setEditModalOpen(false);
    showSnackbar('Package updated.')
    fetchCartItems();
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleRemoveItem = async (item) => {
    // Remove the cart item
    await removeCartItem(item);
    setEditModalOpen(false);
    showSnackbar('Package removed from cart.')
    // Refresh cart items after removal
    fetchCartItems();
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedItem(null); // Reset the selected item
  };

  const openEditModal = (item) => {
    setSelectedItem(item); // Set the item to be edited
    setEditModalOpen(true); // Open the modal
  };

  const fetchCartItems = useCallback(async () => {
    try {
      const items = await getCartItems(user.email);  // Call getCartItems function
      setCartItems(items || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);  // Stop loading after data is fetched
    }
  }, [user.email]);


  useEffect(() => {
    fetchCartItems();
  }, [user.email]);
  
  useEffect(() => {
    const calculateTotalPrice = () => {
      const total = cartItems.reduce((acc, item) => acc + item.price * item.travellers, 0);
      setTotalPrice(total);
    };
  
    calculateTotalPrice();
  }, [cartItems]);
  
  
  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>  {/* Wrap your component here */}
      <Box sx={{ padding: '20px' }}>
        {/* Back Arrow */}
        <ArrowBackIos onClick={() => window.history.back()} style={{ cursor: 'pointer' }} />

        {/* Cart Header */}
        <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 3 }}>
          {user.firstName}'s Cart
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between', // Align cart items and checkout box
            gap: 2,
          }}
        >
          {/* Cart Items Section */}
          <Box sx={{ flex: 3 }}>
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <CartItem key={index} item={item} handlePackageClick={handlePackageClick} openEditModal={openEditModal} handleRemoveItem={handleRemoveItem} />
              ))
            ) : (
              <Typography>No items in cart.</Typography>
            )}
          </Box>

          {/* Checkout Section */}
          <Box
            sx={{
              flex: 1,
              border: '2px solid #ccc',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'left',
              maxWidth: '375px',
              width: '100%',  // Ensure the width is set, but let the height grow
              alignSelf: 'flex-start',  // Make sure it aligns at the top and grows downwards
            }}
          >
            <Typography variant="h5" sx={{ mb: 3 }}>
              Total Price: ${totalPrice.toFixed(2)}
            </Typography>

            {/* Cart Summary */}
            <Box sx={{ mb: 3 }}>
              {cartItems.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  <Typography
                    sx={{
                      flex: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'block',
                      maxWidth: '250px',
                    }}
                  >
                    {item.travellers}x {item.packageName}
                  </Typography>
                  <Typography>
                    ${((item.price * item.travellers).toFixed(2))}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Button variant="contained" color="primary" fullWidth>
              CHECKOUT
            </Button>
          </Box>
        </Box>

        {/* Edit Modal */}
        {selectedItem && (
          <EditPackageModal
            open={editModalOpen}
            onClose={closeEditModal}
            item={selectedItem}
            handleUpdateItem={handleUpdateItem}
            handleRemoveItem={handleRemoveItem}
          />
        )}

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}  // Automatically hide after 3 seconds
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
}

// Component to render each cart item
const CartItem = ({ item, handlePackageClick, handleRemoveItem, openEditModal }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, padding: '10px', border: '2px solid #ccc', borderRadius: '8px' }}>
    {/* Package Image */}
    <Box sx={{ width: '355px', height: '200px', overflow: 'hidden', mr: 3 }}>
      {item.image ? (
        <img
          src={`http://localhost:5000${item.image}`}
          alt={item.packageName}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
        />
      ) : (
        <Typography>No Image</Typography>
      )}
    </Box>

    {/* Package Details */}
    <Box sx={{ flexGrow: 1 }}>
      <Typography
        variant="h4"
        sx={{ cursor: 'pointer', color: 'inherit', '&:hover': { textDecoration: 'underline' } }}
        onClick={() => handlePackageClick(item.packageId)}
      >
        {item.packageName}
      </Typography>
      <Typography>{item.location}</Typography>
      <Typography>{item.duration} days</Typography>
    </Box>

    {/* Dates and Price */}
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>Start:</Typography>
        <Typography sx={{ textAlign: 'right' }}>{formatDate(item.startDate)}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>End:</Typography>
        <Typography sx={{ textAlign: 'right' }}>{formatDate(item.endDate)}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>Price:</Typography>
        <Typography sx={{ textAlign: 'right' }}>${item.price}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>Travellers:</Typography>
        <Typography sx={{ textAlign: 'right' }}>{item.travellers}</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={() => openEditModal(item)} color="primary" sx={{ minWidth: '100px'}}>
          Edit
        </Button>
        <Button minWidth='200px'variant="contained" onClick={() => handleRemoveItem(item)} color="error" sx={{ minWidth: '100px'}}>
          Delete
        </Button>
      </Box>
    </Box>
  </Box>
);

// Date formatting function
const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', options).format(date).replace(/\//g, ' / ');
};

export default Cart;
