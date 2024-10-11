import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, Select, MenuItem, FormControl, InputLabel, TextField, Typography } from '@mui/material';
import { getBookings } from '../HelperFunctions/GetDatabaseModels';
import { updateBooking } from '../HelperFunctions/SendData.js';

function ManageBookingsModal({ open, onClose }) {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState('');
  const [bookingStatus, setBookingStatus] = useState('');

  useEffect(() => {
    async function fetchBookings() {
      const fetchedBookings = await getBookings();
      setBookings(fetchedBookings);
    }
    if (open) {
      fetchBookings();
    }
  }, [open]);

  const handleBookingChange = (event) => {
    const selected = event.target.value;
    const booking = bookings.find(b => b.booking_id === selected);
    setSelectedBooking(selected);
    setBookingStatus(booking.status); // Set booking status based on the booking
  };

  const handleBookingUpdate = async () => {
    await updateBooking(selectedBooking, bookingStatus);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ padding: '20px', backgroundColor: 'white', width: '500px', margin: '100px auto' }}>
        <Typography variant="h6" sx={{ marginBottom: '20px' }}>Manage Bookings</Typography>

        <FormControl fullWidth sx={{ marginBottom: '20px' }}>
          <InputLabel>Select Booking</InputLabel>
          <Select value={selectedBooking} onChange={handleBookingChange}>
            {bookings.map((booking) => (
              <MenuItem 
                key={booking.booking_id} 
                value={booking.booking_id}
                sx={{
                  color: booking.status === 'confirmed' ? 'green' : booking.status === 'pending' ? 'yellow' : 'red'
                }} // Color code based on booking status
              >
                {`${booking.email}, ${booking.start_date} - ${booking.end_date}, ${booking.package_name}, ${booking.status}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField 
          label="Update Status" 
          value={bookingStatus} 
          onChange={(e) => setBookingStatus(e.target.value)} 
          sx={{ marginBottom: '20px' }} 
          fullWidth
        />

        <Button variant="contained" onClick={handleBookingUpdate}>
          Update Booking
        </Button>
      </Box>
    </Modal>
  );
}

export default ManageBookingsModal;
