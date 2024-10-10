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
  