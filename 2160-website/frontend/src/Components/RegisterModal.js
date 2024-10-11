import React, { useState } from 'react';
import { Box, IconButton, Typography, TextField, Button, Modal } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../HelperFunctions/SendData';

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

const validationSchemaRegister = Yup.object({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
  phone_number: Yup.string().required('Required'),
});

function RegisterModal({ open, onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Modal
      open={open}
      onClose={(_, reason) => {
        // Prevent closing on backdrop click but allow ESC key and close button
        if (reason !== 'backdropClick') {
          onClose();
        }
      }}
      aria-labelledby="register-modal"
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
          Register
        </Typography>

        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone_number: '',
          }}
          validationSchema={validationSchemaRegister}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const result = await registerUser(values);
              if (!result.error) {
                console.log('User registered successfully:', result);
                onClose();  // Close modal after successful registration
              } else {
                console.error('Error:', result.error);
              }
            } catch (error) {
              console.error("Registration error:", error);
            }
            setSubmitting(false);
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
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{ style: { color: 'white' } }}
                error={touched.firstName && Boolean(errors.firstName)}
                helperText={touched.firstName && errors.firstName}
              />
              <Field
                as={TextField}
                name="lastName"
                label="Last Name"
                fullWidth
                margin="normal"
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{ style: { color: 'white' } }}
                error={touched.lastName && Boolean(errors.lastName)}
                helperText={touched.lastName && errors.lastName}
              />
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
              <Box sx={{ position: 'relative' }}>
                <Field
                  as={TextField}
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="Confirm Password"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ style: { color: 'white' } }}
                  InputProps={{ style: { color: 'white' } }}
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />
                <IconButton
                  onClick={toggleConfirmPasswordVisibility}
                  sx={{ position: 'absolute', right: 8, top: 32, color: 'white' }}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Box>
              <Field
                as={TextField}
                name="phone_number"
                label="Phone Number"
                fullWidth
                margin="normal"
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{ style: { color: 'white' } }}
                error={touched.phone_number && Boolean(errors.phone_number)}
                helperText={touched.phone_number && errors.phone_number}
              />
              <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>
              <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'white' }}>
                Already have an account?{' '}
                <span style={{ color: 'lightblue', cursor: 'pointer' }} onClick={onClose}>
                  Login here
                </span>
              </Typography>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
}

export default RegisterModal;
