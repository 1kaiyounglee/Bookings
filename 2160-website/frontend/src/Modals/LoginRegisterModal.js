import React, { useState } from 'react';
import { Modal, Box, IconButton, Typography, TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'; // Rounded close icon
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../HelperFunctions/SendData'; // Import the registerUser function


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
  phone_number: Yup.string().required('Required'),
});

function LoginRegisterModal({ open, onClose }) {
  const [isLogin, setIsLogin] = useState(true); // Manage whether it's login or register form

  // Close the modal on ESC key press
  React.useEffect(() => {
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
            onSubmit={(values) => {
              // Handle login logic
              console.log('Login form values:', values);
            }}
          >
            {({ errors, touched }) => (
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
                  type="password"
                  label="Password"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ style: { color: 'white' } }} // White label text
                  InputProps={{ style: { color: 'white' } }} // White input text
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
                <Button type="submit" variant="contained" fullWidth>
                  Login
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
            initialValues={{ firstName: '', lastName: '', email: '', password: '', phone_number: '' }}
            validationSchema={validationSchemaRegister}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
              // Handle registration logic
              const result = await registerUser(values);
              if (result.error) {
                setErrors({ email: result.error }); // Assuming error is related to email, can be adjusted based on backend response
              } else {
                console.log('User registered successfully:', result);
                onClose(); // Close modal after successful registration
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
                  type="password"
                  label="Password"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ style: { color: 'white' } }} // White label text
                  InputProps={{ style: { color: 'white' } }} // White input text
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
                <Field
                  as={TextField}
                  name="Phone"
                  label="Phone Number"
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
