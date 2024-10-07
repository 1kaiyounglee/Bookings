import React, { useState, useEffect } from 'react';
import { getUsers } from './HelperFunctions/GetDatabaseModels';
function App() {
  const [users, setUsers] = useState([]);

  // Fetch users from the Flask backend by sending a query
  useEffect(() => {
    // The SQL query to be executed
    getUsers()
      .then(data => {
        setUsers(data);
        console.log("Users data fetched from backend:", data);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  return (
    <div className="App">
      <h1>Users List</h1>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            Email: {user.email}, Admin: {user.isAdmin ? 'Yes' : 'No'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
