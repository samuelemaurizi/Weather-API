// const btn = document.getElementById('submit');
// btn.addEventListener('click', async e => {
//   const data = { lat, lon, weather, air };
//   const options = {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data)
//   };
//   const response = await fetch('/api', options);
//   const json = await response.json();
//   console.log(json);
// });
let lat;
let lon;
if ('geolocation' in navigator) {
  console.log('geolocation available');
  navigator.geolocation.getCurrentPosition(async position => {
    // console.log(position);
    lat = position.coords.latitude;
    lon = position.coords.longitude;

    document.getElementById('latitude').textContent = lat.toFixed(2);
    document.getElementById('longitude').textContent = lon.toFixed(2);
    const api_url = `/weather/${lat},${lon}`;
    const api_response = await fetch(api_url);
    const api_json = await api_response.json();
    // console.log(api_json);

    const weather = api_json.weather.currently;

    const air_result = api_json.air_quality.results;
    const last_result = air_result.slice(-1);
    const air = last_result[0].measurements[0];
    const city = last_result[0].city;

    const lastUpdated = new Date(air.lastUpdated);
    const date = lastUpdated.toDateString();
    document.getElementById('summary').textContent = weather.summary;
    document.getElementById('temperature').textContent = weather.temperature;

    document.getElementById('aq_parameter').textContent = air.parameter;
    document.getElementById('aq_value').textContent = air.value;
    document.getElementById('aq_unit').textContent = air.unit;
    document.getElementById('aq_date').textContent = date;
    document.getElementById('aq_city').textContent = city;

    const data = { lat, lon, weather, air, city };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    const db_response = await fetch('/api', options);
    const db_json = await db_response.json();
    console.log(db_json);
  });
} else {
  console.log('geolocation not available');
}
