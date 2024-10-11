import { getData } from './GetDatabaseModels';  // Import the getUsers function




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
    localStorage.setItem('email', data.user.email);
    localStorage.setItem('first_name', data.user.firstName);
    localStorage.setItem('last_name', data.user.lastName);
    localStorage.setItem('is_admin', data.user.isAdmin);
    console.log('User logged in successfully');
    return data;  // Return data for successful login
  } else {
    console.error('Login failed:', data.msg);
    return { error: data.msg };  // Return an error object for failed login
  }
}


export async function updateAdmin(email, isAdmin) {
  try {
    // Fetch all users using the getUsers function and find the specific user by email
    const users = await getData("Users",`email = '${email}'`);
    if (!users || users.length === 0) {
      throw new Error('User not found');
    }
    
    const user = users[0];  // Get the first user (assuming there's only one with the given email)
    console.log("askldsakldlaskdjklsa", user);
    // Update the isAdmin field while keeping other fields intact
    const updatedUserData = {
      ...user,
      is_admin: isAdmin ? true : false,  // Update the isAdmin field to match the new value
    };

    console.log('Sending updated user data:', updatedUserData);  // Log the data being sent to the backend

    // Call the UPSERT endpoint for users
    const response = await fetch('http://localhost:5000/api/database/update_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUserData),
    });

    if (!response.ok) {
      throw new Error('Failed to update user admin status');
    }

    return await response.json();  // Return the response data
  } catch (error) {
    console.error('Error updating admin status:', error);
    throw error;
  }
}

export async function updateBooking(bookingId, status) {
  const bookings = await getData("Bookings",`booking_id = '${bookingId}'`);
    if (!bookings || bookings.length === 0) {
      throw new Error('User not found');
    }
    
  const booking = bookings[0]; 
  // Define the booking data for UPSERT
  const bookingData = {
      ...booking,
      status: status
  };

  // Call the UPSERT endpoint for bookings
  const response = await fetch('http://localhost:5000/api/database/update_booking', {
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
