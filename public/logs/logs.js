const myMap = L.map('data-map').setView([0, 0], 1);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(myMap);

async function getData() {
  const response = await fetch('/api');
  const data = await response.json();

  for (item of data) {
    const marker = L.marker([item.lat, item.lon]).addTo(myMap);

    const txt = `The weather here Lat: ${item.lat}, Lon: ${item.lon} in ${
      item.city
    } is ${item.weather.summary} with a temperature of ${
      item.weather.temperature
    }&deg C. The concentration of particular matter (${
      item.air.parameter
    }) is ${item.air.value} ${item.air.unit} last read on ${
      item.air.lastUpdated
    }.`;

    marker.bindPopup(txt);

    // const wrap = document.createElement('div');
    // wrap.classList.add('card');
    // const geo = document.createElement('p');
    // const date = document.createElement('p');
    // date.classList.add('date');

    // geo.textContent = `Lat: ${item.lat.toFixed(2)}°, Lon: ${item.lon.toFixed(
    //   2
    // )}°`;
    // const dateStr = new Date(item.timestamp).toLocaleString();
    // date.textContent = dateStr;

    // wrap.append(geo, date);
    // document.body.append(wrap);
  }

  console.log(data);
}

getData();
