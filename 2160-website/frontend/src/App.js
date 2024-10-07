import React, { useState, useEffect } from 'react';

function App() {
  const [users, setUsers] = useState([]);

  // Fetch users from the Flask backend by sending a query
  useEffect(() => {
    // The SQL query to be executed
    const query = "SELECT * FROM Users WHERE email = 'kai'";

    fetch("http://localhost:5000/api/database/fetch_query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: query }), // Sending the query in the request body
    })
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        console.log("QUERY:", query);
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
            Email: {user.email}, Admin: {user.is_admin ? 'Yes' : 'No'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
