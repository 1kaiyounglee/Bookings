import { getData } from './GetDatabaseModels';  // Import the getData function

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
    const users = await getData("Users",`email = '${email}'`);
    if (!users || users.length === 0) {
      throw new Error('User not found');
    }
    
    const user = users[0];  
    const updatedUserData = {
      ...user,
      is_admin: isAdmin ? true : false,  
    };

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

    return await response.json(); 
  } catch (error) {
    console.error('Error updating admin status:', error);
    throw error;
  }
}

export async function updateBooking(bookingId, status) {
  const bookings = await getData("Bookings",`booking_id = '${bookingId}'`);
  if (!bookings || bookings.length === 0) {
    throw new Error('Booking not found');
  }
  
  const booking = bookings[0]; 
  const bookingData = {
    ...booking,
    status: status
  };

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

export async function updateCartItem(item, newStartDate, newEndDate, newTravellers) {
  try {
    const bookings = await getData("Bookings", `booking_id = ${item.bookingId}`);
    if (!bookings || bookings.length === 0) {
      throw new Error('Booking not found');
    }

    const booking = bookings[0];
    const updatedBookingData = {
      booking_id: item.bookingId,
      email: booking.email,
      package_id: item.packageId,
      start_date: newStartDate.toISOString().split('T')[0],
      end_date: newEndDate.toISOString().split('T')[0],
      number_of_travellers: newTravellers,
      price: item.price * newTravellers,
      status: 'in-cart',
    };

    const response = await fetch('http://localhost:5000/api/database/update_booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedBookingData),
    });

    if (!response.ok) {
      throw new Error('Failed to update cart item');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
}

export async function removeCartItem(item) {
  try {
    const bookings = await getData("Bookings", `booking_id = ${item.bookingId}`);
    if (!bookings || bookings.length === 0) {
      throw new Error('Booking not found');
    }

    const response = await fetch('http://localhost:5000/api/database/delete_entry', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        table: 'Bookings',
        id: item.bookingId
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete cart item');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting cart item:', error);
    throw error;
  }
}

/// Upsert a package (add or update)
export async function upsertPackage(packageData) {
  try {
    console.log(JSON.stringify(packageData));
    const response = await fetch('http://localhost:5000/api/database/upsert_package', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(packageData),
    });
    console.log("REPSONSE:", response);
    if (!response.ok) {
      throw new Error('Failed to upsert package');
    }

    return await response.json();
  } catch (error) {
    console.error('Error upserting package:', error);
    throw error;
  }
}


// Delete a package
export async function deletePackage(packageId) {
  try {
    const response = await fetch('http://localhost:5000/api/database/delete_package', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ package_id: packageId }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete package');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting package:', error);
    throw error;
  }
}

export async function changePassword({ email, currentPassword, newPassword }) {
  try {
    const response = await fetch('http://localhost:5000/api/database/change_password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Unknown error occurred');
    }

    return await response.json();
  } catch (error) {
    console.error('Error changing password:', error, error.message);
    return { error: error.message || 'Unknown error occurred' };
  }
}
