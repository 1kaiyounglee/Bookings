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

  // Function to get the top 5 Packages data for the homepage
export async function getPackages() {
  // Query to get the top 5 packages based on the number of orders
  const query = `
    SELECT p.package_id, p.name, p.description, p.duration, p.price, l.city AS location, COUNT(o.order_id) AS order_count
    FROM Packages p
    LEFT JOIN Bookings b ON p.package_id = b.package_id
    LEFT JOIN OrderItems oi ON b.booking_id = oi.booking_id
    LEFT JOIN Orders o ON oi.order_id = o.order_id
    LEFT JOIN Locations l ON p.location_id = l.location_id  -- Corrected the join with Locations
    GROUP BY p.package_id, p.name, p.description, p.duration, p.price, l.city
    ORDER BY order_count DESC
    LIMIT 5;
  `;
  
  const data = await fetchDatabaseData(query);

  if (!data) {
    console.log("\n\n\n DB RETURNED NOTHING!!!!!1 \n\n\n");
    throw new Error("Database returned nothing");
  }

  // Fetch the related data for images and categories
  const imagesData = (await getData("PackageImages")) || [];
  const categoriesData = (await getData("PackageCategory")) || [];

  // Transform the data into a dictionary-like object (JSON format)
  const packages = data.map((pkg) => {
    const relatedImages = imagesData
      .filter((img) => img.package_id === pkg.package_id)
      .sort((a, b) => a.image_id - b.image_id);

    const hasImages = relatedImages.length > 0;
    const imagePaths = hasImages 
      ? relatedImages.map((img) => `/backend/images/${img.image_path}`)  // Corrected the image path
      : null;

    const relatedCategories = categoriesData.filter((cat) => cat.package_id === pkg.package_id);

    return {
      package_id: pkg.package_id,
      name: pkg.name, // Package name
      description: pkg.description || "MISSING",
      duration: pkg.duration || "MISSING",
      price: pkg.price || "MISSING",
      location: pkg.location || "MISSING", // Ensure the location is included
      images: imagePaths || [],
      hasImages: hasImages,
      categories: relatedCategories.length > 0 ? relatedCategories.map((cat) => cat.category_id) : ["MISSING"]
    };
  });

  return packages;
}

// General-purpose function to get packages based on a whereClause
export async function getPackagesGeneral(whereClause = "") {
  // Build the base query with a dynamic WHERE clause
  const query = `
    SELECT p.package_id, p.name, p.description, p.duration, p.price, l.city AS location_city, l.country AS location_country
    FROM Packages p
    LEFT JOIN Locations l ON p.location_id = l.location_id
    ${whereClause ? `WHERE ${whereClause}` : ''}
  `;
  
  const data = await fetchDatabaseData(query);

  if (!data) {
    console.log("\n\n\n DB RETURNED NOTHING!!!!!1 \n\n\n");
    throw new Error("Database returned nothing");
  }

  // Fetch the related data for images and categories
  const imagesData = (await getData("PackageImages")) || [];
  const categoriesData = (await getData("PackageCategory")) || [];

  // Transform the data into a dictionary-like object (JSON format)
  const packages = data.map((pkg) => {
    const relatedImages = imagesData
      .filter((img) => img.package_id === pkg.package_id)
      .sort((a, b) => a.image_id - b.image_id);

    const hasImages = relatedImages.length > 0;
    const imagePaths = hasImages 
      ? relatedImages.map((img) => `/backend/images/${img.image_path}`)  // Corrected the image path
      : null;

    const relatedCategories = categoriesData.filter((cat) => cat.package_id === pkg.package_id);

    return {
      package_id: pkg.package_id,
      name: pkg.name, // Package name
      description: pkg.description || "MISSING",
      duration: pkg.duration || "MISSING",
      price: pkg.price || "MISSING",
      location_city: pkg.location_city || "MISSING",
      location_country: pkg.location_country || "MISSING",
      images: imagePaths || [],
      hasImages: hasImages,
      categories: relatedCategories.length > 0 ? relatedCategories.map((cat) => cat.category_id) : ["MISSING"]
    };
  });

  return packages;
}
