const API_KEY = "2a4bd9b6d92a6c4214387203a52eec07";
const currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather";
const forecastURL = "https://api.openweathermap.org/data/2.5/forecast";
const iconMapping = {
  "01d": "https://img.icons8.com/fluency/48/ffffff/sun.png",
  "01n": "https://img.icons8.com/fluency/48/ffffff/moon.png",
  "02d": "https://img.icons8.com/fluency/48/ffffff/partly-cloudy-day.png",
  "02n": "https://img.icons8.com/fluency/48/ffffff/partly-cloudy-night.png",
  "03d": "https://img.icons8.com/fluency/48/ffffff/cloud.png",
  "03n": "https://img.icons8.com/fluency/48/ffffff/cloud.png",
  "04d": "https://img.icons8.com/fluency/48/ffffff/cloud.png",
  "04n": "https://img.icons8.com/fluency/48/ffffff/cloud.png",
  "09d": "https://img.icons8.com/fluency/48/ffffff/rain.png",
  "09n": "https://img.icons8.com/fluency/48/ffffff/rain.png",
  "10d": "https://img.icons8.com/fluency/48/ffffff/rain.png",
  "10n": "https://img.icons8.com/fluency/48/ffffff/rain.png",
  "11d": "https://img.icons8.com/fluency/48/ffffff/storm.png",
  "11n": "https://img.icons8.com/fluency/48/ffffff/storm.png",
  "13d": "https://img.icons8.com/fluency/48/ffffff/snow.png",
  "13n": "https://img.icons8.com/fluency/48/ffffff/snow.png",
  "50d": "https://img.icons8.com/fluency/48/ffffff/fog.png",
  "50n": "https://img.icons8.com/fluency/48/ffffff/fog.png"
};
const currentCity = document.getElementById("city");
const currentTemp = document.getElementById("temperature-c");
const currentDesc = document.getElementById("weather-c");
const currentHumid = document.getElementById("humid");
const currentWind = document.getElementById("wind-speed");
const currentMinMax = document.getElementById("min-max");
const currentIcon = document.getElementById("weather-icon");
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
    currentHumid.textContent = `${data.main.humidity}%`;
    currentWind.textContent = `${data.wind.speed} km/h`;
    currentMinMax.textContent = `${data.main.temp_min}°C / ${data.main.temp_max}°C`;
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
      const timeText = dt.toLocaleString("en-US", { weekday: "short", hour: "2-digit", minute: "2-digit", hour12: true });
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
  dateEl.textContent = now.toLocaleDateString("en-US", options);
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
fetchCurrentWeather("London");
fetchHourlyForecast("London");
fetchFutureForecast("London");
updateTime();
setInterval(updateTime, 10000);
