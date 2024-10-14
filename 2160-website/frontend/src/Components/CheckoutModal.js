import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Box, IconButton, Typography, Button, Modal, Alert } from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

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

function CheckoutModal({ open, onClose, cartItems, totalPrice, userData }) {
  const clientID = process.env.REACT_APP_PAYPAL_CLIENT_ID;
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // PayPal client ID and configuration
  const initialOptions = {
    "client-id": clientID,
    "enable-funding": "venmo",
    currency: "AUD", // Australian Dollars
    components: "buttons",
    "data-page-type": "product-details",
    "data-sdk-integration-source": "developer-studio",
  };

  // Function to update orders in the backend after successful payment
  const updateOrderInBackend = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders/update-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart_items: cartItems,
          user_email: userData.email,
          total_price: totalPrice,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Order updated successfully:', result.order_id);
        setSuccessMessage("Payment completed and order updated successfully!");
        setTimeout(() => {
          window.location.reload(); // Clear cart and reload page after success
        }, 1500);
      } else {
        setErrorMessage("Failed to update order: " + result.error);
        console.error('Failed to update order:', result.error);
      }
    } catch (error) {
      setErrorMessage("Error while updating order: " + error);
      console.error('Error while updating order:', error);
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
      aria-labelledby="checkout-modal"
      disableEscapeKeyDown={false} // Allows closing on ESC key press
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
          Checkout
        </Typography>

        {/* Display success or error messages */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

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
              <Typography>${(item.price * item.travellers).toFixed(2)}</Typography>
            </Box>
          ))}
          <Box
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
              Total:
            </Typography>
            <Typography>${totalPrice.toFixed(2)}</Typography>
          </Box>
        </Box>

        {/* PayPal Buttons for payment */}
        <PayPalScriptProvider options={initialOptions}>
          <PayPalButtons
            style={{ shape: "rect", layout: "vertical", color: "gold", label: "paypal" }}
            createOrder={async () => {
              try {
                // Create order request to your backend
                const response = await fetch("http://localhost:5000/api/orders/create", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    cart: cartItems.map(item => ({
                      id: item.packageId,
                      quantity: item.travellers,
                      price: item.price,
                    })),
                  }),
                });

                const orderData = await response.json();
                if (orderData.id) {
                  return orderData.id;
                } else {
                  const errorDetail = orderData?.details?.[0];
                  const errorMessage = errorDetail
                    ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                    : JSON.stringify(orderData);
                  throw new Error(errorMessage);
                }
              } catch (error) {
                console.error(error); // Log errors to console instead of showing in the UI
              }
            }}
            onApprove={async (data, actions) => {
              try {
                // Capture the order after approval
                const response = await fetch(`http://localhost:5000/api/orders/${data.orderID}/capture`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                });

                const orderData = await response.json();
                if (orderData.status === 'COMPLETED') {
                  // Call the backend to update orders
                  await updateOrderInBackend();
                } else {
                  throw new Error("Failed to complete payment.");
                }
              } catch (error) {
                console.error("Transaction could not be processed:", error);
              }
            }}
          />
        </PayPalScriptProvider>

        <Button onClick={onClose} color="primary" fullWidth sx={{ mt: 2 }}>
          Cancel
        </Button>
      </Box>
    </Modal>
  );
}

export default CheckoutModal;
