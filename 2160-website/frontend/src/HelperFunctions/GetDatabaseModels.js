// GetDatabaseModels.js

// Function to perform the database request
async function fetchDatabaseData(query) {
    try {
      const response = await fetch("http://localhost:5000/api/database/fetch_query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query }),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }

// Generic function to get data from a specified table with optional conditions
export async function getData(tableName, whereClause = "") {
    // Build the base SQL query
    let query = `SELECT * FROM ${tableName}`;
  
    // Append the WHERE clause if provided
    if (whereClause) {
      query += ` WHERE ${whereClause}`;
    }
  
    // Fetch the data using the dynamic query
    const data = await fetchDatabaseData(query);
  
    if (!data) {
      return null; // Handle no data case
    }
  
    return data; // Return raw data for further processing
}
  
// Function to get all Users data and transform it into a JSON object
export async function getUsers(whereClause = "") {
    const data = await getData("Users", whereClause);
  
    if (!data) {
      return null; // If no data, return null or handle appropriately
    }
  
    // Transform data into a dictionary-like object (JSON format)
    const users = data.map((user) => ({
      email: user.email,
      password: user.password,
      isAdmin: user.is_admin
    }));
  
    return users; // Return the array of user objects
  }
  