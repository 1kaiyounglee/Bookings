import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Button, Modal, TextField, MenuItem, FormControl, Alert } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { getBookings } from '../HelperFunctions/GetDatabaseModels'; // Fetches booking data
import { updateBooking } from '../HelperFunctions/SendData'; // Updates booking

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

// Validation schema for the form
const validationSchema = Yup.object({
  email: Yup.string().required('Email is required'),
  package_name: Yup.string().required('Package is required'),
  date: Yup.string().required('Date is required'),
  status: Yup.string().required('Status is required'),
});

function ManageBookingsModal({ open, onClose }) {
  const [bookings, setBookings] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [filteredDates, setFilteredDates] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch all bookings and update state
  async function fetchBookings() {
    const bookingsData = await getBookings();
    console.log("BOOKINGS DATA", bookingsData);
    setBookings(bookingsData);
  }

  useEffect(() => {
    if (open) {
      fetchBookings();
      setSuccessMessage(''); // Clear success message when the modal is opened
    }
  }, [open]);

  // Update filtered packages when email changes
  const handleEmailChange = (email, setFieldValue) => {
    const userBookings = bookings.filter((booking) => booking.email === email);
    setFilteredPackages([...new Set(userBookings.map((booking) => ({
      package_id: booking.package_id,
      package_name: booking.package_name,
    })))]);
    setFieldValue('package_name', '');
    setFieldValue('date', '');
    setFieldValue('status', '');
  };

  // Update filtered dates when package changes
  const handlePackageChange = (packageName, setFieldValue) => {
    const packageBookings = bookings.filter((booking) => booking.package_name === packageName);
    setFilteredDates(packageBookings.map((booking) => `${booking.start_date} - ${booking.end_date}`));
    setFieldValue('date', '');
    setFieldValue('status', '');
  };

  // Update status when date changes
  const handleDateChange = (date, setFieldValue) => {
    const [startDate] = date.split(' - ');
    const booking = bookings.find((booking) => booking.start_date === startDate);
    setSelectedBooking(booking);
    setFieldValue('status', booking?.status || '');
  };

  return (
    <Modal
      open={open}
      onClose={(_, reason) => {
        if (reason !== 'backdropClick') {
          onClose();
          setSuccessMessage(''); // Clear success message when the modal is closed
        }
      }}
      aria-labelledby="manage-bookings-modal"
    >
      <Box sx={modalStyle}>
        <IconButton
          aria-label="close"
          onClick={() => {
            onClose();
            setSuccessMessage(''); // Clear success message when the modal is closed via close button
          }}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
        >
          <CloseRoundedIcon />
        </IconButton>

        <Typography variant="h6" component="h2" gutterBottom sx={{ color: 'white', mb: 2 }}>
          Manage Bookings
        </Typography>

        {/* Display success message if present */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Formik
          initialValues={{ email: '', package_name: '', date: '', status: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setFieldError, resetForm }) => {
            setSubmitting(true);
            setSuccessMessage(''); // Clear any previous success messages
            try {
              // Update the booking and get the updated booking data
              const updatedBooking = await updateBooking(selectedBooking.booking_id, values.status);

              // Refetch bookings after update to reload dropdown values
              await fetchBookings();
              setSelectedBooking(updatedBooking); // Reflect updated booking in the modal

              // Set the success message with the updated status
              setSuccessMessage(`Updated the status to ${values.status}`);

              // Optionally reset the form
              resetForm();
            } catch (error) {
              console.error('Error updating booking status:', error);
              setFieldError('email', 'Failed to update booking status');
            }
            setSubmitting(false);
          }}
        >
          {({ values, handleChange, setFieldValue, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              {/* Email Dropdown */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <TextField
                  select
                  label="Select Email"
                  name="email"
                  value={values.email}
                  onChange={(e) => {
                    handleChange(e);
                    handleEmailChange(e.target.value, setFieldValue);
                  }}
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
                  {bookings.map((booking, index) => (
                    <MenuItem key={index} value={booking.email}>
                      {booking.email}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>

              {/* Package Dropdown */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <TextField
                  select
                  label="Select Package"
                  name="package_name"
                  value={values.package_name}
                  onChange={(e) => {
                    handleChange(e);
                    handlePackageChange(e.target.value, setFieldValue);
                  }}
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
                  disabled={!values.email}
                >
                  {filteredPackages.map((pkg, index) => (
                    <MenuItem key={index} value={pkg.package_name}>
                      {pkg.package_name} {/* Display package name here */}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>

              {/* Date Dropdown */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <TextField
                  select
                  label="Select Date"
                  name="date"
                  value={values.date}
                  onChange={(e) => {
                    handleChange(e);
                    handleDateChange(e.target.value, setFieldValue);
                  }}
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
                  disabled={!values.package_name}
                >
                  {filteredDates.map((date, index) => (
                    <MenuItem key={index} value={date}>
                      {date}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>

              {/* Status Dropdown */}
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
                    mt: 1,
                    input: { color: 'white' },
                    label: { color: 'white' },
                  }}
                  disabled={!values.date}
                >
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
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
