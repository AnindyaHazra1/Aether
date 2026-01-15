require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/weather_app', {
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema for Search History
const searchSchema = new mongoose.Schema({
  city: String,
  timestamp: { type: Date, default: Date.now }
});
const Search = mongoose.model('Search', searchSchema);

// Auth Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Routes
app.get('/', (req, res) => {
  res.send('Weather App Backend is running');
});

// Weather Proxy Route
app.get('/api/weather', async (req, res) => {
  const { city } = req.query;
  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    // Fetch data from OpenWeatherMap
    const response = await axios.get(url);

    // Save to history
    await Search.create({ city });

    res.json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Error fetching weather data' });
    }
  }
});

// Forecast Proxy Route
app.get('/api/forecast', async (req, res) => {
  const { city } = req.query;
  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Error fetching forecast data' });
    }
  }
});

// AQI Proxy Route
app.get('/api/aqi', async (req, res) => {
  const { lat, lon } = req.query;
  if (!req.query.lat || !req.query.lon) {
    return res.status(400).json({ error: 'Latitude and Longitude are required' });
  }

  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("AQI Fetch Error:", error.response ? error.response.data : error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Error fetching AQI data' });
    }
  }
});

// History Route
app.get('/api/history', async (req, res) => {
  try {
    const history = await Search.find().sort({ timestamp: -1 }).limit(10);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching history' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
