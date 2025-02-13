const API_KEY = "2a4bd9b6d92a6c4214387203a52eec07";
const currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather";
const forecastURL = "https://api.openweathermap.org/data/2.5/forecast";

const iconMapping = {
  "01d": "images/Weather-icon/weather-icons-master/svg/wi-day-sunny.svg",
  "01n": "images/Weather-icon/weather-icons-master/svg/wi-night-clear.svg",
  "02d": "images/Weather-icon/weather-icons-master/svg/wi-day-cloudy.svg",
  "02n": "images/Weather-icon/weather-icons-master/svg/wi-night-alt-cloudy.svg",
  "03d": "images/Weather-icon/weather-icons-master/svg/wi-cloud.svg",
  "03n": "images/Weather-icon/weather-icons-master/svg/wi-cloud.svg",
  "04d": "images/Weather-icon/weather-icons-master/svg/wi-cloudy.svg",
  "04n": "images/Weather-icon/weather-icons-master/svg/wi-cloudy.svg",
  "09d": "images/Weather-icon/weather-icons-master/svg/wi-showers.svg",
  "09n": "images/Weather-icon/weather-icons-master/svg/wi-showers.svg",
  "10d": "images/Weather-icon/weather-icons-master/svg/wi-day-rain.svg",
  "10n": "images/Weather-icon/weather-icons-master/svg/wi-night-alt-rain.svg",
  "11d": "images/Weather-icon/weather-icons-master/svg/wi-thunderstorm.svg",
  "11n": "images/Weather-icon/weather-icons-master/svg/wi-thunderstorm.svg",
  "13d": "images/Weather-icon/weather-icons-master/svg/wi-snow.svg",
  "13n": "images/Weather-icon/weather-icons-master/svg/wi-snow.svg",
  "50d": "images/Weather-icon/weather-icons-master/svg/wi-fog.svg",
  "50n": "images/Weather-icon/weather-icons-master/svg/wi-fog.svg"
};

  

const currentCity = document.getElementById("city");
const currentTemp = document.getElementById("temperature-c");
const currentDesc = document.getElementById("weather-c");
const currentHumid = document.getElementById("humid");
const currentWind = document.getElementById("wind-speed");
const currentMinMax = document.getElementById("min-max");
const currentIcon = document.getElementById("temp-icon");
const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

async function fetchCurrentWeather(city) {
  try {
    const res = await fetch(`${currentWeatherURL}?q=${city}&appid=${API_KEY}&units=metric`);
    if (!res.ok) {
      alert("City not found!");
      return;
    }
    const data = await res.json();
    currentCity.textContent = `${data.name}, ${data.sys.country}`;
    currentTemp.textContent = `${data.main.temp}°C`;
    currentDesc.textContent = data.weather[0].description;
    currentHumid.textContent = `Humidity: ${data.main.humidity}%`;
    currentWind.textContent = `Wind: ${data.wind.speed} km/h`;
    currentMinMax.textContent = `Min: ${data.main.temp_min}°C Max: ${data.main.temp_max}°C`;
    const iconCode = data.weather[0].icon;
    const iconUrl = iconMapping[iconCode] || `https://openweathermap.org/img/wn/${iconCode}.png`;
    currentIcon.src = iconUrl;
  } catch (error) {
    console.error("Error fetching current weather:", error);
  }
}

async function fetchHourlyForecast(city) {
  try {
    const res = await fetch(`${forecastURL}?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await res.json();
    if (data.cod !== "200") {
      alert("Hourly forecast data not available!");
      return;
    }
    for (let i = 0; i < 12; i++) {
      const hourData = data.list[i];
      if (!hourData) break;
      const dt = new Date(hourData.dt * 1000);
      const timeText = dt.toLocaleString("en-US", {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
      document.getElementById(`${i + 1}hrs`).textContent = timeText;
      document.getElementById(`${i + 1}hrst`).textContent = `${hourData.main.temp}°C`;
      document.getElementById(`${i + 1}hrsh`).textContent = `${hourData.main.humidity}%`;
      document.getElementById(`${i + 1}hrsw`).textContent = `${hourData.wind.speed} km/h`;
      const iconCode = hourData.weather[0].icon;
      const iconUrl = iconMapping[iconCode] || `https://openweathermap.org/img/wn/${iconCode}.png`;
      document.getElementById(`${i + 1}hrsi`).innerHTML = `<img src="${iconUrl}" alt="${hourData.weather[0].description}"> ${hourData.weather[0].description}`;
    }
  } catch (error) {
    console.error("Error fetching hourly forecast:", error);
  }
}

async function fetchFutureForecast(city) {
  try {
    const res = await fetch(`${forecastURL}?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await res.json();
    if (data.cod !== "200") {
      alert("Future forecast data not available!");
      return;
    }
    const dailyForecasts = {};
    data.list.forEach(entry => {
      const [date, time] = entry.dt_txt.split(" ");
      if (time === "12:00:00" && !dailyForecasts[date]) {
        dailyForecasts[date] = entry;
      }
    });
    const dates = Object.keys(dailyForecasts).slice(0, 5);
    dates.forEach((date, index) => {
      const forecast = dailyForecasts[date];
      const dayName = new Date(forecast.dt * 1000).toLocaleDateString("en-US", { weekday: "long" });
      document.getElementById(`day${index + 1}-day`).textContent = dayName;
      document.getElementById(`day${index + 1}-night`).textContent = `Night - ${forecast.main.temp_min.toFixed(1)}°C`;
      document.getElementById(`day${index + 1}-day-temp`).textContent = `Day - ${forecast.main.temp_max.toFixed(1)}°C`;
      const iconCode = forecast.weather[0].icon;
      const iconUrl = iconMapping[iconCode] || `https://openweathermap.org/img/wn/${iconCode}.png`;
      document.querySelector(`#day${index + 1} .w-icon`).src = iconUrl;
    });
  } catch (error) {
    console.error("Error fetching future forecast:", error);
  }
}

function updateTime() {
  const now = new Date();
  let hrs = now.getHours();
  let mins = now.getMinutes();
  const ampm = hrs >= 12 ? "PM" : "AM";
  hrs = hrs % 12 || 12;
  mins = mins < 10 ? "0" + mins : mins;
  timeEl.textContent = `${hrs}:${mins} ${ampm}`;
  const options = { weekday: "long", month: "long", day: "numeric", year: "numeric" };
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchCurrentWeather(city);
    fetchHourlyForecast(city);
    fetchFutureForecast(city);
  } else {
    alert("Please enter a city name!");
  }
});

fetchCurrentWeather("Bengaluru");
fetchHourlyForecast("Bengaluru");
fetchFutureForecast("Bengaluru");
updateTime();
setInterval(updateTime, 10000);
