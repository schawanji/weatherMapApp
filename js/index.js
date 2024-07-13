alert('Best viewed on a desktop')
let map = L.map("mapid").setView([48, 15], 7);
let url =
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}";

L.tileLayer(`${url}`, {
  attribution:
    ' &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Basemap © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 8,
  minZoom: 6,
  id: "mapbox/dark-v10",
  tileSize: 512,
  zoomOffset: -1,
  accessToken:
    "pk.eyJ1Ijoic2NoYXdhbmppIiwiYSI6ImNqd2liNnkybjA3MzI0YXFnd3l4bnA4eDUifQ.RPNiQDsrEysuQpCg6FfzfQ",
}).addTo(map);

function getMapMarkers(response) {
  let index = 0;
  let data = response.data.list;
  while (index < data.length) {
    index += 1;

    let fontAwesomeIcon = L.divIcon({
      html: `<i class="wi wi-owm-${data[index].weather[0].id} icon1"></i>`,
      iconSize: [20, 20],
      className: "myDivIcon",
      iconAnchor: [0, 0],
    });

    let marker = L.marker([data[index].coord.Lat, data[index].coord.Lon], {
      icon: fontAwesomeIcon,
    }).addTo(map);
    marker.bindPopup(
      `
    <div class="map-popup">
      <div class="container">
        <div class="row">
          <div class="col-12"><b> ${data[index].name}</b></div>
          <div class="col-12"><b>${data[index].weather[0].description}</b></div>
          <div class="col-12">
            <div >
            <ul >
            <li class="map-popup">
            <i class="wi wi-owm-${data[index].weather[0].id} icon">
            </i>
            ${Math.round(data[index].main.temp)}°C
            </li>
            <li class="map-popup">
            <i class="wi wi-humidity icon">
            </i> 
            ${Math.round(data[index].main.humidity)} %
            </li>
            <li class="map-popup">
            <i class="fas fa-wind icon">
            </i>
             ${Math.round(data[index].wind.speed)} km/h
            </li>
            </ul>    
            </div>
          </div>
        </div>
      </div>
    </div>
    `
    );

    marker.on("mouseover", function () {
      marker.openPopup();
    });
  }
}

map.on("moveend", function onMoveend() {
  let zoom = map.getZoom();
  let bbox = [
    map.getBounds().getWest(),
    map.getBounds().getNorth(),
    map.getBounds().getEast(),
    map.getBounds().getSouth(),
    8,
  ];

  let apiKey = `3838877787336447a436a48770270db1`;
  let weatherApiUrl = `https://api.openweathermap.org/data/2.5/box/city?bbox=${bbox}&appid=${apiKey}`;

  axios.get(weatherApiUrl).then(getMapMarkers);
});

function displayWeatherOnMap(coordinates) {
  let fontAwesomeIcon = L.divIcon({
    html: `<i class="wi wi-owm-${coordinates.weather[0].id} icon1"></i>`,
    iconSize: [20, 20],
    className: "myDivIcon",
    iconAnchor: [0, 0],
  });

  let marker = L.marker([coordinates.coord.lat, coordinates.coord.lon], {
    icon: fontAwesomeIcon,
  }).addTo(map);
  marker
    .bindPopup(
      `
<div class="map-popup">
  <div class="container">
    <div class="row">
      <div class="col-12"><b>${coordinates.name}</b></div>
      <div class="col-12"><b>${coordinates.weather[0].description}</b></div>
      <div class="col-12">
        <div >
        <ul >
         <li class="map-popup">
          <i class="wi wi-owm-${coordinates.weather[0].id} icon">
          </i>  ${Math.round(coordinates.main.temp)}°C
         </li>
         <li class="map-popup">
          <i class="wi wi-humidity icon">
          </i>  ${Math.round(coordinates.main.humidity)} %
        </li>
        <li class="map-popup">
        <i class="fas fa-wind icon">
        </i>  ${Math.round(coordinates.wind.speed)} km/h
        </li>
        </ul> 
        </div>
      </div>
    </div>
  </div>
</div>
`
    )
    .openPopup();
  let latLngs = [marker.getLatLng()];
  let markerBounds = L.latLngBounds(latLngs);
  map.fitBounds(markerBounds);
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
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `

  <div class="col-2 daily-forecast">
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
  let minTempElement = document.querySelector(`#min-temp`);
  let maxTempElement = document.querySelector(`#max-temp`);
  dateElement.innerHTML = `${formatDate(response.data.dt)}`;

  weatherIconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherIconElement.setAttribute("alt", `${response.data.weather[0].main}`);
  cityElement.innerHTML = `${response.data.name}, ${response.data.sys.country}`;
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

function getMyWeather(event) {
  event.preventDefault;
  function getMyCity(response) {
    searchCity(`${response.data.name}`);
  }
  function showPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let apiKey = `e4dfdc1dfbd9af8701deee7d18b22e9b`;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    axios.get(apiUrl).then(getMyCity);
  }

  navigator.geolocation.getCurrentPosition(showPosition);
}

searchCity(`Tokyo`);
let formElement = document.querySelector(`#search-form`);
formElement.addEventListener("submit", handleCityQuery);
let myLocationElement = document.querySelector(`#my-location`);
myLocationElement.addEventListener("click", getMyWeather);
