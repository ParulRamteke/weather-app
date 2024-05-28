const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); // Using version 2.6.1 for CommonJS compatibility
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

async function getWeatherData(city) {
  const apiKey = 'cb3f0e2001871f2d87622264ca8774d3';
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`;
  try {
    const response = await fetch(weatherURL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const weatherData = await response.json();
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    throw error;
  }
}

app.get('/', (req, res) => {
  res.render('index', { weather: null, error: null });
});

app.get('/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) {
    res.render('index', { weather: null, error: 'Please provide a city name.' });
    return;
  }

  try {
    const weatherData = await getWeatherData(city);
    res.render('index', { weather: weatherData, error: null });
  } catch (error) {
    res.render('index', { weather: null, error: 'Error fetching weather data.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Weather app is running on port ${PORT}`);
});
