import React, { useState, useEffect } from 'react';
import { Modal, Box, IconButton, Typography, TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'; // Rounded close icon
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Icons for show/hide password
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { registerUser, handleLogin } from '../HelperFunctions/SendData'; // Import both register and login functions

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#2e2e2e', // Dark background for modal
  boxShadow: 24,
  p: 4,
  color: 'white', // Ensure default text is white
};

const validationSchemaLogin = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const validationSchemaRegister = Yup.object({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
  phone_number: Yup.string().required('Required'), // Note that we now refer to phone_number internally
});

function LoginRegisterModal({ open, onClose, setIsLoggedIn }) {
  const [isLogin, setIsLogin] = useState(true); // Manage whether it's login or register form
  const [showPassword, setShowPassword] = useState(false); // Manage password visibility

  // Close the modal on ESC key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Modal
      open={open}
      onClose={(_, reason) => {
        if (reason !== 'backdropClick') {
          onClose();
        }
      }} // Prevent closing when clicking outside
      aria-labelledby="login-register-modal"
    >
      <Box sx={modalStyle}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }} // White close button
        >
          <CloseRoundedIcon />
        </IconButton>

        <Typography variant="h6" component="h2" gutterBottom sx={{ color: 'white' }}>
          {isLogin ? 'Login' : 'Register'}
        </Typography>

        {isLogin ? (
          <Formik
            initialValues={{ email: '', password: '', rememberMe: false }}
            validationSchema={validationSchemaLogin}
            onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
              try {
                // Call the login function
                const result = await handleLogin(values);
                if (!result.error) {
                  // If login successful, close modal and set login state
                  setIsLoggedIn(true);
                  resetForm(); // Reset the form to remove validation errors
                  onClose();
                } else {
                  // Show login error on Formik form
                  setErrors({ email: result.error || 'Invalid email or password' });
                }
              } catch (error) {
                setErrors({ email: 'Failed to login. Please try again.' });
              }
              setSubmitting(false);
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Field
                  as={TextField}
                  name="email"
                  label="Email"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ style: { color: 'white' } }} // White label text
                  InputProps={{ style: { color: 'white' } }} // White input text
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />

                <Field
                  as={TextField}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ style: { color: 'white' } }} // White label text
                  InputProps={{
                    style: { color: 'white' },
                    endAdornment: (
                      <IconButton onClick={togglePasswordVisibility} sx={{ color: 'white' }}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />

                <FormControlLabel
                  control={<Field as={Checkbox} name="rememberMe" />}
                  label="Keep me logged in"
                  sx={{ color: 'white' }} // White checkbox label
                />

                <Typography variant="body2" sx={{ mb: 2, color: 'lightblue', cursor: 'pointer' }}>
                  Forgot Password?
                </Typography>

                <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>

                <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'white' }}>
                  Don't have an account?{' '}
                  <span style={{ color: 'lightblue', cursor: 'pointer' }} onClick={toggleForm}>
                    Register here
                  </span>
                </Typography>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              phone_number: '', // Corrected to phone_number for backend alignment
            }}
            validationSchema={validationSchemaRegister}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const result = await registerUser(values);

                if (result.error) {
                  console.error('Error:', result.error); // Log error in console only
                } else {
                  console.log('User registered successfully:', result);
                  onClose(); // Close modal after successful registration
                }
              } catch (error) {
                console.error('Unexpected error:', error); // Log unexpected errors
              }

              setSubmitting(false); // Stop the loading indicator after the submission
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Field
                  as={TextField}
                  name="firstName"
                  label="First Name"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ style: { color: 'white' } }} // White label text
                  InputProps={{ style: { color: 'white' } }} // White input text
                  error={touched.firstName && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                />
                <Field
                  as={TextField}
                  name="lastName"
                  label="Last Name"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ style: { color: 'white' } }} // White label text
                  InputProps={{ style: { color: 'white' } }} // White input text
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                />
                <Field
                  as={TextField}
                  name="email"
                  label="Email"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ style: { color: 'white' } }} // White label text
                  InputProps={{ style: { color: 'white' } }} // White input text
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                <Field
                  as={TextField}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ style: { color: 'white' } }} // White label text
                  InputProps={{
                    style: { color: 'white' },
                    endAdornment: (
                      <IconButton onClick={togglePasswordVisibility} sx={{ color: 'white' }}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
                <Field
                  as={TextField}
                  name="phone_number" // Internal name is aligned with backend
                  label="Phone Number" // Displayed label for user
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ style: { color: 'white' } }} // White label text
                  InputProps={{ style: { color: 'white' } }} // White input text
                  error={touched.phone_number && Boolean(errors.phone_number)}
                  helperText={touched.phone_number && errors.phone_number}
                />
                <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
                  {isSubmitting ? 'Registering...' : 'Register'}
                </Button>
                <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'white' }}>
                  Already have an account?{' '}
                  <span style={{ color: 'lightblue', cursor: 'pointer' }} onClick={toggleForm}>
                    Login here
                  </span>
                </Typography>
              </Form>
            )}
          </Formik>
        )}
      </Box>
    </Modal>
  );
}

export default LoginRegisterModal;
