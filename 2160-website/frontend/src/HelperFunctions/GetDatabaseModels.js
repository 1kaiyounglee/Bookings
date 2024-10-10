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

// Function to get all Packages data and transform it into a JSON object
export async function getPackages(whereClause = "") {
  // Fetch the package data from the Packages table with optional conditions
  const data = await getData("Packages", whereClause);

  if (!data) {
    return null; // Handle the case where no data is returned
  }

  // Fetch the related data for images, categories, and locations
  const imagesData = await getData("PackageImages");
  const categoriesData = await getData("PackageCategory");
  const locationsData = await getData("Locations");

  // Transform the data into a dictionary-like object (JSON format)
  const packages = data.map((pkg) => {
    const relatedImages = imagesData.filter((img) => img.package_id === pkg.package_id);
    const relatedCategories = categoriesData.filter((cat) => cat.package_id === pkg.package_id);
    const relatedLocation = locationsData.find((loc) => loc.location_id === pkg.location_id);

    return {
      package_id: pkg.package_id,
      description: pkg.description,
      duration: pkg.duration,
      price: pkg.price,
      location: relatedLocation ? relatedLocation.location_name : null, // Include location name if available
      images: relatedImages.map((img) => img.image_path), // Get paths of related images
      categories: relatedCategories.map((cat) => cat.category_id) // Get related category IDs
    };
  });

  return packages; // Return the array of package objects
}
