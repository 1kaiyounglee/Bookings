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
        console.log(`\n\n\nERROR: ${response.status}, ${response.text}\n\n\n`)
        throw new Error("Network response was not ok:");
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

// Function to get the top 5 Packages data based on the number of orders
export async function getPackages(whereClause = "") {
  // Fetch the package data with the number of orders
  const query = `
    SELECT p.*, COUNT(o.order_id) AS order_count
    FROM Packages p
    LEFT JOIN Bookings b ON p.package_id = b.package_id
    LEFT JOIN Orders o ON b.booking_id = o.order_id
    GROUP BY p.package_id
    ORDER BY order_count DESC
    LIMIT 5
  `;
  
  const data = await getData(query, whereClause);

  if (!data) {
    console.log("\n\n\n DB RETURNED NOTHING!!!!!1 \n\n\n");
    throw new Error("Database returned nothing");
  }

  // Fetch the related data for images, categories, and locations
  const imagesData = (await getData("PackageImages")) || []; // Default to empty array if null/undefined
  const categoriesData = (await getData("PackageCategory")) || [];
  const locationsData = (await getData("Locations")) || [];

  // Transform the data into a dictionary-like object (JSON format)
  const packages = data.map((pkg) => {
    // Get related images and sort them by image_id (flag if no images)
    const relatedImages = imagesData
      .filter((img) => img.package_id === pkg.package_id)
      .sort((a, b) => a.image_id - b.image_id); // Sort by image_id (ascending)

    const hasImages = relatedImages.length > 0;
    const imagePaths = hasImages ? relatedImages.map((img) => img.image_path) : null; // Null if no images

    // Get related categories and location (handle missing values)
    const relatedCategories = categoriesData.filter((cat) => cat.package_id === pkg.package_id);
    const relatedLocation = locationsData.find((loc) => loc.location_id === pkg.location_id);

    return {
      package_id: pkg.package_id,
      description: pkg.description || "MISSING",  // Handle missing description
      duration: pkg.duration || "MISSING",  // Handle missing duration
      price: pkg.price || "MISSING",  // Handle missing price
      location: relatedLocation ? relatedLocation.location_name : "MISSING",  // Handle missing location
      images: imagePaths || [],  // Empty array for no images
      hasImages: hasImages,  // Flag to indicate whether images exist
      categories: relatedCategories.length > 0 ? relatedCategories.map((cat) => cat.category_id) : ["MISSING"]  // Handle missing categories
    };
  });

  return packages; // Return the array of package objects
}
