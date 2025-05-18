import axios from 'axios';
import { LocationSuggestion, WeatherData } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/3.0';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Validate API key before making requests
const validateApiKey = () => {
  if (!API_KEY) {
    throw new Error('OpenWeatherMap API key is missing. Please add VITE_OPENWEATHER_API_KEY to your .env file.');
  }
};

// Function to transform the OpenWeatherMap API response into our app's format
const transformWeatherData = (data: any): WeatherData => {
  const current = {
    temperature: data.current.temp,
    feelsLike: data.current.feels_like,
    description: data.current.weather[0].description,
    icon: data.current.weather[0].icon,
    humidity: data.current.humidity,
    windSpeed: data.current.wind_speed,
    windDirection: data.current.wind_deg,
    pressure: data.current.pressure,
    uvIndex: data.current.uvi,
    visibility: data.current.visibility,
    sunrise: data.current.sunrise,
    sunset: data.current.sunset,
    timezone: data.timezone_offset
  };

  const daily = data.daily.slice(0, 7).map((day: any) => ({
    date: day.dt,
    sunrise: day.sunrise,
    sunset: day.sunset,
    temperature: {
      min: day.temp.min,
      max: day.temp.max,
    },
    feelsLike: {
      day: day.feels_like.day,
      night: day.feels_like.night,
    },
    humidity: day.humidity,
    windSpeed: day.wind_speed,
    windDirection: day.wind_deg,
    description: day.weather[0].description,
    icon: day.weather[0].icon,
    uvIndex: day.uvi,
    precipitation: {
      probability: day.pop,
      amount: day.rain || 0,
    },
  }));

  const hourly = data.hourly.slice(0, 24).map((hour: any) => ({
    time: hour.dt,
    temperature: hour.temp,
    feelsLike: hour.feels_like,
    humidity: hour.humidity,
    windSpeed: hour.wind_speed,
    windDirection: hour.wind_deg,
    description: hour.weather[0].description,
    icon: hour.weather[0].icon,
    precipitation: {
      probability: hour.pop,
      amount: hour.rain?.['1h'] || 0,
    },
  }));

  const alerts = data.alerts?.map((alert: any) => ({
    senderName: alert.sender_name,
    event: alert.event,
    start: alert.start,
    end: alert.end,
    description: alert.description,
    severity: determineSeverity(alert.tags),
  }));

  return {
    location: {
      name: data.name || '',
      country: data.country || '',
      lat: data.lat,
      lon: data.lon,
    },
    current,
    daily,
    hourly,
    alerts,
  };
};

const determineSeverity = (tags: string[]): 'minor' | 'moderate' | 'severe' | 'extreme' => {
  if (tags.includes('Extreme')) return 'extreme';
  if (tags.includes('Severe')) return 'severe';
  if (tags.includes('Moderate')) return 'moderate';
  return 'minor';
};

export const fetchWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    validateApiKey();
    
    const response = await axios.get(`${BASE_URL}/onecall`, {
      params: {
        lat,
        lon,
        exclude: 'minutely',
        appid: API_KEY,
        units: 'metric',
      },
    });

    // Get location name
    const geoResponse = await axios.get(`${GEO_URL}/reverse`, {
      params: {
        lat,
        lon,
        limit: 1,
        appid: API_KEY,
      },
    });

    const locationData = geoResponse.data[0] || {};
    
    const weatherData = {
      ...response.data,
      name: locationData.name,
      country: locationData.country,
    };

    return transformWeatherData(weatherData);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Invalid OpenWeatherMap API key. Please check your VITE_OPENWEATHER_API_KEY in the .env file.');
    }
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const searchLocations = async (query: string): Promise<LocationSuggestion[]> => {
  try {
    validateApiKey();
    
    const response = await axios.get(`${GEO_URL}/direct`, {
      params: {
        q: query,
        limit: 5,
        appid: API_KEY,
      },
    });

    return response.data.map((location: any) => ({
      name: location.name,
      country: location.country,
      lat: location.lat,
      lon: location.lon,
    }));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Invalid OpenWeatherMap API key. Please check your VITE_OPENWEATHER_API_KEY in the .env file.');
    }
    console.error('Error searching locations:', error);
    throw error;
  }
};

// Helper function to get user's current location
export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
};