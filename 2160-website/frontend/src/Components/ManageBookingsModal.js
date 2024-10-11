import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Button, Modal, TextField, MenuItem, FormControl } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Formik, Form } from 'formik';
import { getBookings } from '../HelperFunctions/GetDatabaseModels';
import * as Yup from 'yup';

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

// Form validation schema for updating booking status
const validationSchema = Yup.object({
  bookingId: Yup.string().required('Booking is required'),
  status: Yup.string().oneOf(['confirmed', 'pending', 'cancelled']).required('Status is required'),
});

function ManageBookingsModal({ open, onClose, updateBooking }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    async function fetchBookings() {
      const bookingsData = await getBookings();
      setBookings(bookingsData);
    }

    if (open) {
      fetchBookings();
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={(_, reason) => {
        if (reason !== 'backdropClick') {
          onClose();
        }
      }}
      aria-labelledby="manage-bookings-modal"
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
          Manage Bookings
        </Typography>

        <Formik
          initialValues={{ bookingId: '', status: 'pending' }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            try {
              await updateBooking(values.bookingId, values.status);
              onClose(); // Close modal after successful update
            } catch (error) {
              console.error('Error updating booking status:', error);
            }
            setSubmitting(false);
          }}
        >
          {({ values, handleChange, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <TextField
                  select
                  label="Select Booking"
                  name="bookingId"
                  value={values.bookingId}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    color: 'white',
                    '.MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'white' },
                    },
                    '.MuiSvgIcon-root': { fill: 'white' },
                    mt: 1, // Ensure spacing between input and label
                    input: { color: 'white' },
                    label: { color: 'white' },
                  }}
                >
                  <MenuItem disabled value="">
                    <em>Select Booking</em>
                  </MenuItem>
                  {bookings && bookings.length > 0 ? (
                    bookings.map((booking, index) => (
                      <MenuItem
                        key={index}
                        value={booking.booking_id}
                        style={{
                          color:
                            booking.status === 'confirmed' ? 'green' :
                            booking.status === 'pending' ? 'yellow' : 'red',
                        }}
                      >
                        {booking.email}, {booking.start_date} - {booking.end_date}, {booking.package_name}, {booking.status}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No bookings available</MenuItem>
                  )}
                </TextField>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <TextField
                  select
                  label="Update Status"
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    color: 'white',
                    '.MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'white' },
                    },
                    '.MuiSvgIcon-root': { fill: 'white' },
                    mt: 1, // Ensure spacing between input and label
                    input: { color: 'white' },
                    label: { color: 'white' },
                  }}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </TextField>
              </FormControl>

              <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update'}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
}

export default ManageBookingsModal;
