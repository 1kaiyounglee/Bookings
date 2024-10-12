<<<<<<< HEAD
import React from 'react';

function BookingsPage() {
  return (
    <div>
      <h1>My Bookings</h1>
      {/* Add the content you want here */}
    </div>
  );
}

export default BookingsPage;
=======
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom'; // Ensure this import is here
import { getUserOrders } from '../HelperFunctions/GetDatabaseModels';

function MyBookings({ user }) {
  const navigate = useNavigate();
  const [Orders, setOrders] = useState([]); // Initialize Orders as an empty array
  const [loading, setLoading] = useState(true);

  const handlePackageClick = (package_id) => {
    navigate(`/package/${package_id}`);
  };

  useEffect(() => {
    async function fetchOrders() {
      try {
        const orders = await getUserOrders(user.email);
        console.log(orders);
        setOrders(orders || []); // Set the fetched orders into state
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    }

    fetchOrders(); // Call the function to fetch orders
  }, [user.email]);

  if (loading) {
    return <Typography>Loading...</Typography>; // Show loading indicator while fetching data
  }

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Back Arrow */}
      <ArrowBackIos onClick={() => window.history.back()} style={{ cursor: 'pointer' }} />

      {/* My Orders Header */}
      <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 3 }}>
        {user.firstName}'s Orders
      </Typography>

      {/* Check if Orders is empty */}
      {Orders.length > 0 ? (
        Orders.map((order, index) => (
          <OrderHistory key={index} order={order} handlePackageClick={handlePackageClick} />
        ))
      ) : (
        <Typography sx={{ textAlign: 'center'}}>No orders found.</Typography>
      )}
    </Box>
  );
}

// Component to render each order history
const OrderHistory = ({ order, handlePackageClick }) => (
  <Box sx={{ border: '4px solid #ccc', padding: '20px', borderRadius: '8px', mb: 5 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography variant="h4">Order on {formatDate(order.date)}</Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography sx={{ textTransform: 'capitalize' }}>Payment Status: {order.paymentStatus}</Typography>
        <Typography>Total Price: ${order.totalPrice}</Typography>
      </Box>
    </Box>

    {/* Render Ordered Items */}
    {order.items.map((booking, index) => (
      <OrderItem key={index} item={booking} handlePackageClick={handlePackageClick} />
    ))}
  </Box>
);

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const date = new Date(dateString);
  const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date); // 'en-GB' for dd/mm/yyyy format
  return formattedDate.replace(/\//g, ' / ');
};

// Component to render each item in an order history
const OrderItem = ({ item, handlePackageClick }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, padding: '10px', border: '2px solid #ccc', borderRadius: '8px' }}>
    {/* Package Image */}
    <Box sx={{ width: '275px', height: '150px', overflow: 'hidden', mr: 3 }}>
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
      {/* Pass handlePackageClick with the package_id */}
      <Typography variant="h4" sx={{cursor: 'pointer', color: 'inherit', '&:hover': {textDecoration: 'underline'}}}onClick={() => handlePackageClick(item.id)}>
        {item.packageName}
      </Typography>
      <Typography>{item.location}</Typography>
      <Typography>{item.duration} days</Typography>
    </Box>

    {/* Dates and Status */}
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
      <Typography>Start Date: {formatDate(item.startDate)}</Typography>
      <Typography>End Date: {formatDate(item.endDate)}</Typography>
      <Typography sx={{ textTransform: 'capitalize' }}>Status: {item.status}</Typography>
      <Typography>Price: ${item.price}</Typography>
    </Box>
  </Box>
);

export default MyBookings;
>>>>>>> main
