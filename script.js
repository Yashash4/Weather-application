const apiKey = "2a4bd9b6d92a6c4214387203a52eec07"; // Your OpenWeather API Key
const baseUrl = "https://api.openweathermap.org/data/2.5/forecast";

// Get elements
const searchBtn = document.querySelector("#searchBtn");
const inputCity = document.querySelector("#cityInput");

const cityDiv = document.querySelector("#city");
const stateDiv = document.querySelector("#state"); // Not provided by API, kept as placeholder
const countryDiv = document.querySelector("#country");

const tempC = document.querySelector("#temperature-c");
const tempF = document.querySelector("#temperature-f");
const weatherDesc = document.querySelector("#weather-c");
const humidityDiv = document.querySelector("#humid");

const todayDay = document.querySelector("#today-day");
const todayNightTemp = document.querySelector("#today-night");
const todayDayTemp = document.querySelector("#today-day-temp");

const timeDiv = document.querySelector("#time");
const dateDiv = document.querySelector("#date");

// Forecast elements
const forecastDays = [
    "day1", "day2", "day3", "day4", "day5", "day6"
];

// Event Listener for Search Button
searchBtn.addEventListener("click", () => {
    const city = inputCity.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        alert("Please enter a city name.");
    }
});

// Fetch Weather Data
async function fetchWeather(city) {
    try {
        const response = await fetch(`${baseUrl}?q=${city}&units=metric&cnt=40&appid=${apiKey}`);
        if (!response.ok) {
            alert("City not found! Please enter a valid city name.");
            return;
        }
        const data = await response.json();
        updateWeather(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Something went wrong. Try again later.");
    }
}

// Update Weather Data
function updateWeather(data) {
    const cityName = data.city.name;
    const countryName = data.city.country;

    cityDiv.innerHTML = cityName;
    stateDiv.innerHTML = "-"; // API doesn't provide state
    countryDiv.innerHTML = countryName;

    // Get current date & time
    updateDateTime();

    // Current Weather (Taking first forecast entry as "current")
    const todayWeather = data.list[0];

    tempC.innerHTML = `${todayWeather.main.temp}°C`;
    tempF.innerHTML = `${(todayWeather.main.temp * 9/5 + 32).toFixed(1)}°F`;
    weatherDesc.innerHTML = todayWeather.weather[0].description;
    humidityDiv.innerHTML = `${todayWeather.main.humidity}%`;

    // Today's forecast
    todayDay.innerHTML = new Date(todayWeather.dt * 1000).toLocaleDateString("en-US", { weekday: "long" });
    todayNightTemp.innerHTML = `Night - ${todayWeather.main.temp_min}°C`;
    todayDayTemp.innerHTML = `Day - ${todayWeather.main.temp_max}°C`;

    // 6-day Forecast (Taking one data point per day)
    for (let i = 1; i <= 6; i++) {
        const forecast = data.list[i * 8 - 1]; // Each day has 8 entries (3-hour intervals)
        const dayElement = document.querySelector(`#${forecastDays[i - 1]}-day`);
        const nightTempElement = document.querySelector(`#${forecastDays[i - 1]}-night`);
        const dayTempElement = document.querySelector(`#${forecastDays[i - 1]}-day-temp`);

        dayElement.innerHTML = new Date(forecast.dt * 1000).toLocaleDateString("en-US", { weekday: "long" });
        nightTempElement.innerHTML = `Night - ${forecast.main.temp_min}°C`;
        dayTempElement.innerHTML = `Day - ${forecast.main.temp_max}°C`;
    }
}

// Function to update date and time
function updateDateTime() {
    const now = new Date();
    
    // Format time
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 24-hour format to 12-hour
    minutes = minutes < 10 ? "0" + minutes : minutes;
    
    timeDiv.innerHTML = `${hours}:${minutes} ${ampm}`;

    // Format date
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    dateDiv.innerHTML = now.toLocaleDateString("en-US", options);
}

// Update time every second
setInterval(updateDateTime, 1000);
