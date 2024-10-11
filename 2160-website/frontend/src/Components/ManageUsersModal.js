import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Button, Modal, TextField, MenuItem, FormControl, Alert } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import VpnKeyOffRoundedIcon from '@mui/icons-material/VpnKeyOffRounded';
import { Formik, Form } from 'formik';
import { getUsers } from '../HelperFunctions/GetDatabaseModels';
import { updateAdmin } from '../HelperFunctions/SendData';
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

// Form validation schema for updating admin status
const validationSchema = Yup.object({
  email: Yup.string().required('User is required'),
});

function ManageUsersModal({ open, onClose }) {
  const [users, setUsers] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  async function fetchUsers() {
    const usersData = await getUsers();
    setUsers(usersData);
  }

  useEffect(() => {
    if (open) {
      fetchUsers();
      setSuccessMessage(''); // Clear success message when modal is opened
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={(_, reason) => {
        if (reason !== 'backdropClick') {
          onClose();
          setSuccessMessage(''); // Clear success message when modal is closed
        }
      }}
      aria-labelledby="manage-users-modal"
    >
      <Box sx={modalStyle}>
        <IconButton
          aria-label="close"
          onClick={() => {
            onClose();
            setSuccessMessage(''); // Clear success message when modal is closed via close button
          }}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
        >
          <CloseRoundedIcon />
        </IconButton>

        <Typography variant="h6" component="h2" gutterBottom sx={{ color: 'white', mb: 2 }}>
          Manage Users
        </Typography>

        {/* Display success message if present */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Formik
          initialValues={{ email: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setFieldError, resetForm }) => {
            setSubmitting(true);
            setSuccessMessage(''); // Clear any previous success messages
            try {
              // Update admin status based on the clicked button (set in handleSubmit)
              await updateAdmin(values.email, values.isAdmin);

              // Set the success message based on the admin status
              const action = values.isAdmin ? 'Granted' : 'Removed';
              setSuccessMessage(`${action} admin permission ${values.isAdmin ? 'to' : 'from'} ${values.email}`);

              // Refetch users to update the dropdown
              await fetchUsers();

              // Optionally reset the form if needed
              resetForm();
            } catch (error) {
              console.error('Error updating admin status:', error);
              setFieldError('email', 'Failed to update admin status');
            }
            setSubmitting(false);
          }}
        >
          {({ values, handleChange, handleSubmit, setFieldValue, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <TextField
                  select
                  label="Select User"
                  name="email"
                  value={values.email}
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
                >
                  {users && users.length > 0 ? (
                    users.map((user, index) => (
                      <MenuItem key={index} value={user.email}>
                        {user.isAdmin ? (
                          <VpnKeyRoundedIcon sx={{ color: 'lightgreen', marginRight: '8px' }} />
                        ) : (
                          <VpnKeyOffRoundedIcon sx={{ color: 'lightcoral', marginRight: '8px' }} />
                        )}
                        {user.email}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No users available</MenuItem>
                  )}
                </TextField>
              </FormControl>

              <Box mt={2} mb={3} display="flex" justifyContent="space-between">
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    setFieldValue('isAdmin', true);
                    handleSubmit();
                  }}
                  sx={{
                    mr: 2,
                    bgcolor: '#3a3a3a',
                    ':hover': {
                      bgcolor: '#5a5a5a',
                    },
                  }}
                  disabled={isSubmitting}
                >
                  Give Admin
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    setFieldValue('isAdmin', false);
                    handleSubmit();
                  }}
                  sx={{
                    bgcolor: '#3a3a3a',
                    ':hover': {
                      bgcolor: '#5a5a5a',
                    },
                  }}
                  disabled={isSubmitting}
                >
                  Remove Admin
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
}

export default ManageUsersModal;
