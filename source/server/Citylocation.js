const axios = require("axios"); 

// Asynchronous function to retrieve geographical location of a city using the GeoNames API
const fetchCityLocation = async (cityName, geoUser) => {
    try {
        // Construct the API endpoint for GeoNames search
        const apiUrl = "https://secure.geonames.org/searchJSON";
        
        // Send a GET request to the GeoNames API with the specified parameters
        const response = await axios.get(apiUrl, {
            params: {
                q: cityName,      // The name of the city to search for
                maxRows: 1,       // Limit the results to one entry
                username: geoUser  // Username for GeoNames API access
            }
        });

        // Check if the response contains valid geonames data
        if (!response.data.geonames || response.data.geonames.length === 0) {
            return createErrorResponse("No city found with that name. Please verify your input."); 
        }

        // Destructure the first result to get city details
        const { name, lat: latitude, lng: longitude } = response.data.geonames[0];
        return { name, latitude, longitude }; // Return city details in a structured format

    } catch (error) {
        // Log the error details for debugging purposes
        console.error('Failed to retrieve city location:', error);
        return createErrorResponse("An error occurred while retrieving the city location."); 
    }
};

// Helper function to standardize error responses
const createErrorResponse = (message) => {
    return {
        message, // Custom error message
        error: true // Flag indicating an error occurred
    };
};

// Export the fetchCityLocation function for external use
module.exports = { fetchCityLocation };
