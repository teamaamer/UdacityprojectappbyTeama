const axios = require("axios");

// Function to fetch weather data based on geographic coordinates and days remaining
const fetchWeather = async (longitude, latitude, daysRemaining, apiKey) => {
  // Check if the input for remaining days is valid
  const isValidDays = (days) => days >= 0;

  if (!isValidDays(daysRemaining)) {
    return createErrorResponse("The date cannot be in the past.");
  }

  try {
    return daysRemaining <= 7 
      ? await getCurrentWeather(longitude, latitude, apiKey) 
      : await getDailyForecast(longitude, latitude, daysRemaining, apiKey);
  } catch (error) {
    return createErrorResponse("Error fetching weather data. Please try again later.");
  }
};

// Helper function to fetch current weather
const getCurrentWeather = async (longitude, latitude, apiKey) => {
  const response = await axios.get("https://api.weatherbit.io/v2.0/current", {
    params: {
      lat: latitude,
      lon: longitude,
      units: "M",
      key: apiKey,
    },
  });

  const { weather, temp } = response.data.data[0];
  return formatWeatherResponse(weather[0], temp);
};

// Helper function to fetch daily forecast
const getDailyForecast = async (longitude, latitude, daysRemaining, apiKey) => {
  const response = await axios.get("https://api.weatherbit.io/v2.0/forecast/daily", {
    params: {
      lat: latitude,
      lon: longitude,
      units: "M",
      days: daysRemaining,
      key: apiKey,
    },
  });

  const { weather, temp, app_max_temp, app_min_temp } = response.data.data[0];
  return formatForecastResponse(weather[0], temp, app_max_temp, app_min_temp);
};

// Function to format the current weather response
const formatWeatherResponse = (weather, temp) => {
  return {
    description: weather.description,
    temperature: temp,
  };
};

// Function to format the daily forecast response
const formatForecastResponse = (weather, temp, maxTemp, minTemp) => {
  return {
    description: weather.description,
    temperature: temp,
    maxTemperature: maxTemp,
    minTemperature: minTemp,
  };
};

// Helper function to create an error response
const createErrorResponse = (message) => {
  return {
    message,
    error: true,
  };
};

// Export the fetchWeather function for external use
module.exports = {
  fetchWeather,
};