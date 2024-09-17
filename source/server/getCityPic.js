const axios = require("axios");

// Asynchronous function to retrieve a city image from Pixabay
const fetchCityImage = async (cityName, apiKey) => {
  const defaultImage = "https://source.unsplash.com/random/640x480?city,morning,night?sig=1"; // Default image URL

  try {
    // Construct the API request to Pixabay
    const apiUrl = "https://pixabay.com/api/";
    const response = await axios.get(apiUrl, {
      params: {
        key: apiKey, // API key for access
        q: cityName, // City name for the image search
        image_type: "photo", // Specify that we want photos
      },
    });

    // Determine the image URL to return
    const imageUrl = response.data.hits.length > 0 
      ? response.data.hits[0].webformatURL // Use the first image found
      : defaultImage; // Fall back to a default image if none are found

    return { image: imageUrl }; // Return the image URL in an object
  } catch (error) {
    // Return an error message if the request fails
    return {
      message: "Unable to fetch city image. Please try again later.", // User-friendly error message
      error: true, // Indicate that an error occurred
    };
  }
};

// Export the fetchCityImage function for external use
module.exports = {
  fetchCityImage,
};