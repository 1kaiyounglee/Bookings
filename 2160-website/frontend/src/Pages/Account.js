import React, { useState } from 'react';
import { Box, Button, TextField, Typography, IconButton, InputAdornment, Alert } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { changePassword } from '../HelperFunctions/SendData'; // Import changePassword function
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Account({ user }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [passwordFieldsEnabled, setPasswordFieldsEnabled] = useState(false);
  const [formSuccess, setFormSuccess] = useState(null);
  const [formError, setFormError] = useState(null);

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowCurrentPassword = () => setShowCurrentPassword(!showCurrentPassword);

  return (
    <Formik
      initialValues={{
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }}
      validate={(values) => {
        const errors = {};
        if (!values.currentPassword) {
          errors.currentPassword = 'Current password is required';
        }
        if (!values.newPassword) {
          errors.newPassword = 'New password is required';
        } else if (values.newPassword !== values.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
        }
        return errors;
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        setFormSuccess(null); // Reset success message
        setFormError(null);   // Reset error message

        try {
          const response = await changePassword({
            email: user.email,
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          });

          if (response.error) {
            setFormError(response.error);
          } else {
            setFormSuccess('Password changed successfully!');
            resetForm(); // Clear the form after successful submission
            setPasswordFieldsEnabled(false);
          }
        } catch (error) {
          setFormError('Failed to change password');
        }
        setSubmitting(false);
      }}
    >
      {({ values, errors, touched, handleChange, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
            <Typography variant="h6">My Profile</Typography>
            <Typography>Name: {user.firstName} {user.lastName}</Typography>
            <Typography>Email: {user.email}</Typography>

            {/* Current Password */}
            <Field
              as={TextField}
              label="Current Password"
              type={showCurrentPassword ? 'text' : 'password'}
              name="currentPassword"
              onChange={(e) => {
                handleChange(e);
                setPasswordFieldsEnabled(e.target.value.length > 0); // Enable fields if current password is entered
              }}
              fullWidth
              margin="normal"
              error={touched.currentPassword && Boolean(errors.currentPassword)}
              helperText={<ErrorMessage name="currentPassword" />}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleShowCurrentPassword}>
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* New Password */}
            <Field
              as={TextField}
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              name="newPassword"
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={touched.newPassword && Boolean(errors.newPassword)}
              helperText={<ErrorMessage name="newPassword" />}
              disabled={!passwordFieldsEnabled}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Confirm New Password */}
            <Field
              as={TextField}
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={touched.confirmPassword && Boolean(errors.confirmPassword)}
              helperText={<ErrorMessage name="confirmPassword" />}
              disabled={!passwordFieldsEnabled}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {formError && <Alert severity="error">{formError}</Alert>}
            {formSuccess && <Alert severity="success">{formSuccess}</Alert>}

            <Button type="submit" variant="contained" color="primary" fullWidth disabled={!passwordFieldsEnabled}>
              Change Password
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
}

export default Account;
