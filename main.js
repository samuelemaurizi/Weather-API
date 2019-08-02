const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on PORT ${port}`));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

let database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (req, res) => {
  database.find({}, (err, data) => {
    if (err) {
      res.end();
      return;
    }
    res.json(data);
  });
});

app.post('/api', (req, res) => {
  // console.log(req.body);
  const data = req.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;

  database.insert(data);
  // console.log(database);
  res.json({
    response: 'success',
    latitude: data.lat,
    longitude: data.lon,
    timestamp: timestamp
  });
});

app.get('/weather/:latlon', async (req, res) => {
  console.log(req.params);
  const latlon = req.params.latlon.split(',');
  console.log(latlon);
  const lat = latlon[0];
  const lon = latlon[1];
  console.log(lat, lon);

  const api_key = process.env.API_KEY;
  const weather_url = `https://api.darksky.net/forecast/${api_key}/${lat},${lon}/?units=si`;
  const weather_res = await fetch(weather_url);
  const weather_data = await weather_res.json();

  const airq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
  const airq_res = await fetch(airq_url);
  const airq_data = await airq_res.json();

  const data = {
    weather: weather_data,
    air_quality: airq_data
  };
  res.json(data);
});
