import React, { useState } from 'react';
import { Box, IconButton, Typography, TextField, Button, Modal } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { handleLogin } from '../HelperFunctions/SendData';

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

const validationSchemaLogin = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

function LoginModal({ open, onClose, setIsLoggedIn, onRegisterClick, setLoading }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Modal
      open={open}  // Open state controlled by App.js
      onClose={(_, reason) => {  // Prevent closing on backdrop click, but allow ESC key and close button
        if (reason !== 'backdropClick') {
          onClose();
        }
      }}
      aria-labelledby="login-modal"
    >
      <Box sx={modalStyle}>
        <IconButton
          aria-label="close"
          onClick={onClose}  // Close modal when cancel button is clicked
          sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
        >
          <CloseRoundedIcon />
        </IconButton>

        <Typography variant="h6" component="h2" gutterBottom sx={{ color: 'white' }}>
          Login
        </Typography>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchemaLogin}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            setLoading(true);  // Start full-page loading
            try {
              const result = await handleLogin(values);
              console.log("RESULT:", result);
              if (!result.error) {
                localStorage.setItem('jwt_token', result.access_token);
                localStorage.setItem('email', result.user.email);
                localStorage.setItem('first_name', result.user.firstName);
                localStorage.setItem('last_name', result.user.lastName);
                localStorage.setItem('is_admin', result.user.isAdmin);

                setIsLoggedIn(true, {
                  email: result.user.email,
                  firstName: result.user.firstName,
                  lastName: result.user.lastName,
                  isAdmin: result.user.isAdmin,
                });
                
                onClose();  // Close modal after successful login
              } else {
                setErrors({ email: result.error || 'Invalid email or password' });
              }
            } catch (error) {
              console.error("Login error:", error);
              setErrors({ email: 'Failed to login. Please try again.' });
            }
            setSubmitting(false);
            setLoading(false);  // Stop full-page loading
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Box sx={{ position: 'relative' }}>
                <Field
                  as={TextField}
                  name="email"
                  label="Email"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ style: { color: 'white' } }}
                  InputProps={{ style: { color: 'white' } }}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
              </Box>
              <Box sx={{ position: 'relative' }}>
                <Field
                  as={TextField}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ style: { color: 'white' } }}
                  InputProps={{ style: { color: 'white' } }}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
                <IconButton
                  onClick={togglePasswordVisibility}
                  sx={{ position: 'absolute', right: 8, top: 32, color: 'white' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Box>
              <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
              <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'white' }}>
                Don't have an account?{' '}
                <span style={{ color: 'lightblue', cursor: 'pointer' }} onClick={onRegisterClick}>
                  Register here
                </span>
              </Typography>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
}

export default LoginModal;
