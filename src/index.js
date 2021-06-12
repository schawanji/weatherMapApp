let mymap = L.map("mapid").setView([0, 0], 8);
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v8",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1Ijoic2NoYXdhbmppIiwiYSI6ImNqd2liNnkybjA3MzI0YXFnd3l4bnA4eDUifQ.RPNiQDsrEysuQpCg6FfzfQ",
  }
).addTo(mymap);

console.log(typeof mymap);

function getData(response) {
  let lat = response.data.list[0].coord.Lat;
  let lon = response.data.list[0].coord.Lon;
  let temp = Math.round(response.data.list[0].main.temp);
  let humidity = response.data.list[0].main.humidity;
  let city = response.data.list[0].name;

  let results = response.data.list;
  //console.log(results[0]);

  let index = 0;

  while (index < results.length) {
    let city = results[index].name;
    let lat = results[index].coord.Lat;
    let lon = results[index].coord.Lon;
    let temp = Math.round(results[index].main.temp);
    let humidity = results[index].main.humidity;

    index += 1;

    let marker = L.marker([lat, lon]).addTo(mymap);

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
