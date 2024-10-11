export const registerUser = async (values) => {
    try {
      const response = await fetch('http://localhost:5000/api/database/create_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: values.email,
            password: values.password,
            first_name: values.firstName,
            last_name: values.lastName,
            phone_number: values.phone_number,
            is_admin: false,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error occurred');
      }
  
      return await response.json(); // Return the response data
    } catch (error) {
      console.error('Error creating user:', error.message);
      return { error: error.message || 'Unknown error occurred' };
    }
  };
  
export async function handleLogin(values) {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: values.email, password: values.password })
  });

  const data = await response.json();
  
  if (response.ok) {
    localStorage.setItem('jwt_token', data.access_token);  // Store the JWT token in LocalStorage
    console.log('User logged in successfully');
    return data;  // Return data for successful login
  } else {
    console.error('Login failed:', data.msg);
    return { error: data.msg };  // Return an error object for failed login
  }
}


export async function updateAdmin(email, isAdmin) {
  // Define the user data for UPSERT
  const userData = {
      email: email,
      is_admin: isAdmin ? 1 : 0
  };

  // Call the UPSERT endpoint for users
  const response = await fetch('http://localhost:5000/api/update_user', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
  });

  if (!response.ok) {
      throw new Error('Failed to update user admin status');
  }

  return await response.json();
}

export async function updateBooking(bookingId, status) {
  // Define the booking data for UPSERT
  const bookingData = {
      booking_id: bookingId,
      status: status
  };

  // Call the UPSERT endpoint for bookings
  const response = await fetch('http://localhost:5000/api/update_booking', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
      throw new Error('Failed to update booking status');
  }

  return await response.json();
}
