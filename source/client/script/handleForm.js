import axios from "axios";

const form = document.querySelector("form");
const cityInp = document.querySelector("#city");
const dateInp = document.querySelector("#flightDate");
const cityError = document.querySelector("#city_error");
const dateError = document.querySelector("#date_error");

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("I am working fine");

  // Validate inputs before making API calls
  if (!validateInputs()) {
    return;
  }

  // Get location data
  const location = await getCityLoc();
  if (location && location.error) {
    cityError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${location.message}`;
    cityError.style.display = "block";
    return;
  }

  if (location) {
    const { lng, lat, name } = location;
    const date = dateInp.value;

    // Validate flight date
    if (!date) {
      dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Please enter the date`;
      dateError.style.display = "block";
      return;
    }

    if (lng && lat) {
      const remainingDays = getRemainingDays(date);
      const weather = await getWeather(lng, lat, remainingDays);

      if (weather && weather.error) {
        dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${weather.message}`;
        dateError.style.display = "block";
        return;
      }

      const pic = await getCityPic(name);
      updateUI(remainingDays, name, pic, weather);
    }
  }
};

const validateInputs = () => {
  cityError.style.display = "none";
  dateError.style.display = "none";

  if (!cityInp.value) {
    cityError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>You need to enter the city`;
    cityError.style.display = "block";
    return false;
  }

  if (!dateInp.value) {
    dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Please enter the date`;
    dateError.style.display = "block";
    return false;
  }

  if (getRemainingDays(dateInp.value) < 0) {
    dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Date cannot be in the past`;
    dateError.style.display = "block";
    return false;
  }

  return true;
};

const getCityLoc = async () => {
  if (!cityInp.value) {
    cityError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>This field cannot be left empty`;
    cityError.style.display = "block";
    return;
  }

  const { data } = await axios.post("http://localhost:8000/getCity", form, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
};

const getWeather = async (lng, lat, remainingDays) => {
  const { data } = await axios.post("http://localhost:8000/getWeather", {
    lng,
    lat,
    remainingDays,
  });
  return data;
};

const getRemainingDays = (date) => {
  const startDate = new Date();
  const endDate = new Date(date);
  const timeDiff = endDate.getTime() - startDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

const getCityPic = async (cityName) => {
  const { data } = await axios.post("http://localhost:8000/getCityPic", {
    city_name: cityName,
  });
  return data.image;
};

const updateUI = (remainingDays, city, pic, weather) => {
  document.querySelector("#Rdays").innerHTML = `Your trip starts in ${remainingDays} days from now`;
  document.querySelector(".cityName").innerHTML = `Location: ${city}`;
  document.querySelector(".weather").innerHTML =
    remainingDays > 7
      ? `Weather is: ${weather.description}`
      : `Weather is expected to be: ${weather.description}`;
  document.querySelector(".temp").innerHTML =
    remainingDays > 7
      ? `Forecast: ${weather.temp}°C`
      : `Temperature: ${weather.temp} °C`;
  document.querySelector(".max-temp").innerHTML =
    remainingDays > 7 ? `Max-Temp: ${weather.app_max_temp}°C` : "";
  document.querySelector(".min-temp").innerHTML =
    remainingDays > 7 ? `Min-Temp: ${weather.app_min_temp}°C` : "";
  document.querySelector(".cityPic").innerHTML = `
    <img src="${pic}" alt="An image of the city's nature">
  `;
  document.querySelector(".flight_data").style.display = "block";
};

export { handleSubmit };
