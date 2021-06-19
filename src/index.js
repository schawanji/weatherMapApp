let map = L.map("mapid").setView([48, 15], 6);
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 7,
    minZoom: 4,
    id: "mapbox/streets-v8",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1Ijoic2NoYXdhbmppIiwiYSI6ImNqd2liNnkybjA3MzI0YXFnd3l4bnA4eDUifQ.RPNiQDsrEysuQpCg6FfzfQ",
  }
).addTo(map);

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
