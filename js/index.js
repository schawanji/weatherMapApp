let map = L.map("mapid").setView([48, 15], 5);
let url =
  "https://api.mapbox.com/styles/v1/schawanji/ckq8ae8n71ugf17p8iyhc6lio/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2NoYXdhbmppIiwiYSI6ImNqd2liNnkybjA3MzI0YXFnd3l4bnA4eDUifQ.RPNiQDsrEysuQpCg6FfzfQ";
L.tileLayer(`${url}`, {
  attribution:
    'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 10,
  minZoom: 4,
  tileSize: 512,
  zoomOffset: -1,
}).addTo(map);

function displayWeatherOnMap(coordinates) {
  L.AwesomeMarkers.Icon.prototype.options.prefix = "wi";
  let redMarker = L.AwesomeMarkers.icon({
    icon: `	wi-owm-${coordinates.weather[0].id}`,
    markerColor: "red",
  });
  let marker = L.marker([coordinates.coord.lat, coordinates.coord.lon], {
    icon: redMarker,
  }).addTo(map);
  marker
    .bindPopup(
      `<div class="map-popup">
  <div class="container">
    <div class="row">
      <div class="col-12"><b> ${coordinates.name}</b></div>
      <div class="col-12">
        <div >
        <ul ><li class="map-popup"><i class="wi wi-owm-${
          coordinates.weather[0].id
        }"></i><strong> ${Math.round(coordinates.main.temp)}°C</strong></li>
        <li class="map-popup"><i class="wi wi-humidity "></i><strong> ${Math.round(
          coordinates.main.humidity
        )}%</strong></li>
        <li class="map-popup"><i class="fas fa-wind "></i><strong> ${Math.round(
          coordinates.wind.speed
        )} km/h</strong></li></ul>
        
            
            
        </div>
      </div>
    </div>
  </div>
</div>
`
    )
    .openPopup();
}

function formatDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = date.getDay();
  let hour = date.getHours();
  let min = date.getMinutes();
  let mon = date.getMonth();
  let year = date.getFullYear();
  let currentDate = date.getDate();
  if (hour < 10) {
    hour = `0${hour}`;
  }

  if (min < 10) {
    min = `0${min}`;
  }
  return `${days[day]} ${currentDate} ${months[mon]} ${year} ${hour}:${min}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = date.getDay();
  return days[day];
}

function displayWeatherForecast(response) {
  let forecastElement = document.querySelector(`#weather-forecast`);
  let forecastDays = response.data.daily;
  let forecastHTML = ``;
  forecastHTML = forecastHTML + `<div class="row">`;

  forecastDays.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `

  <div class="col-2">
    <div class="date">${formatDay(forecastDay.dt)}</div>
    <img
            src="https://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png"
            alt="${forecastDay.weather[0].main}"
          />
    <div class="temp">
      <span id="max-temp">${Math.round(forecastDay.temp.max)}°</span
      ><span class="min-temp">${Math.round(forecastDay.temp.min)}°</span>
    </div>
  </div>
`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;

  forecastElement.innerHTML = `${forecastHTML}`;
  formatDay(response.data.daily);
}

function getWeatherForecastData(response) {
  let lat = response.coord.lat;
  let lon = response.coord.lon;
  let apiKey = `e4dfdc1dfbd9af8701deee7d18b22e9b`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeatherForecast);
}

function displayWeatherData(response) {
  let cityElement = document.querySelector(`#city`);
  let tempElement = document.querySelector(`#temp`);
  let humidityElement = document.querySelector(`#humidity`);
  let descriptionElement = document.querySelector(`#description`);
  let windElement = document.querySelector(`#wind`);
  let weatherIconElement = document.querySelector(`#weather-icon`);
  let dateElement = document.querySelector(`.date`);
  dateElement.innerHTML = `${formatDate(response.data.dt)}`;

  weatherIconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherIconElement.setAttribute("alt", `${response.data.weather[0].main}`);
  cityElement.innerHTML = `${response.data.name}`;
  tempElement.innerHTML = `${Math.round(response.data.main.temp)}`;
  descriptionElement.innerHTML = `${response.data.weather[0].description}`;
  windElement.innerHTML = `${Math.round(response.data.wind.speed)} km/H`;
  humidityElement.innerHTML = `${response.data.main.humidity} %`;
  displayWeatherOnMap(response.data);
  getWeatherForecastData(response.data);
}

function searchCity(city) {
  let apiKey = `e4dfdc1dfbd9af8701deee7d18b22e9b`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeatherData);
}

function handleCityQuery(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector(`#city-input`);
  searchCity(cityInputElement.value);
}

searchCity(`Nottingham`);
let formElement = document.querySelector(`#search-form`);
formElement.addEventListener("submit", handleCityQuery);

/*function getData(response) {
  let index = 0;

  while (index < response.data.list.length) {
    index += 1;

    let marker = L.marker([
      response.data.list[index].coord.Lat,
      response.data.list[index].coord.Lon,
    ]).addTo(map);

    let weatherapp = `<b> Greetings 👋🏽 from ${
      response.data.list[index].name
    }!</b><div><p>The current weather</p><ul class = temp><li>Temp ${Math.round(
      response.data.list[index].main.temp
    )}°C</li><li>Humidity ${
      response.data.list[index].main.humidity
    }%</li></ul></div>`;

    //console.log(marker);

    marker.bindPopup(`${weatherapp}`).openPopup();

    let marker = L.marker([lat, lon]).addTo(map);
   

    marker
      .bindPopup(
        `<b> Greetings 👋🏽 from ${city}!</b><div><p>The current weather</p><ul class = temp><li>Temp ${temp}°C</li><li>Humidity ${humidity}%</li></ul></div>`
      )
      .openPopup();
  }
}
let bbox = [9.981079, 49.640203, 18.325195, 52.141203, 8];
let apiKey = `e4dfdc1dfbd9af8701deee7d18b22e9b`;
let weatherApiUrl = `https://api.openweathermap.org/data/2.5/box/city?bbox=${bbox}&appid=${apiKey}`;
//let url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=${limit}&appid=${apiKey}`;
axios.get(weatherApiUrl).then(getData);

L.Control.geocoder().addTo(map);*/
