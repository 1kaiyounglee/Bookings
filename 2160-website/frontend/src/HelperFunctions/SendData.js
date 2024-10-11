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
