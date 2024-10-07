import React, { useState, useEffect } from 'react';
import { getUsers } from './HelperFunctions/GetDatabaseModels';
import loadingGif from './assets/Dancing Minion GIF - Dancing Minion - Discover & Share GIFs.gif';
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
      <h1>HAWK TUAH !!!!!!1</h1>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            Email: {user.email}, Admin: {user.isAdmin ? 'Yes' : 'No'}
          </li>
        ))}
      </ul>
      {/* Add a local GIF */}
      <img src={loadingGif} alt="Loading animation" />
    </div>
  );
}

export default App;
