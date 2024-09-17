const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('dist'));
app.use(cors());

// Load environment variables
dotenv.config();

// Import functions
const { getCityLoc } = require("./getCityLoc");
const { weatherTemp } = require("./weatherTemp");
const { getCityPic } = require("./getCityPic");

// Set up constants for environment variables
const port = 8000;
const username = `${process.env.USERNAME}${process.env.USERNUMBER}`;
const WEATHER_KEY = process.env.WEATHER_KEY;
const PIXABAY_KEY = process.env.PIXABAY_KEY;

// Routes
app.get("/", (req, res) => {
  res.render("index.html");
});

app.post("/getCity", async (req, res) => {
  const city = req.body.city;
  const location = await getCityLoc(city, username);
  res.send(location);
});

app.post("/getWeather", async (req, res) => {
  const { lng, lat, remainingDays } = req.body;
  const weatherData = await weatherTemp(lng, lat, remainingDays, WEATHER_KEY);
  res.send(weatherData);
});

app.post("/getCityPic", async (req, res) => {
  const { city_name } = req.body;
  const cityPic = await getCityPic(city_name, PIXABAY_KEY);
  res.send(cityPic);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});