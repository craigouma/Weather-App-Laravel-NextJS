import { TemperatureUnit, SpeedUnit } from '../types/weather';

export const formatTemperature = (temp: number, unit: TemperatureUnit): string => {
  if (unit === 'fahrenheit') {
    return `${Math.round((temp * 9/5) + 32)}°F`;
  }
  return `${Math.round(temp)}°C`;
};

export const formatSpeed = (speed: number, unit: SpeedUnit): string => {
  if (unit === 'mph') {
    return `${Math.round(speed * 0.621371)} mph`;
  }
  return `${Math.round(speed)} km/h`;
};

export const formatDate = (timestamp: number, timezone: number = 0, format: 'full' | 'day' | 'time' = 'full'): string => {
  const date = new Date((timestamp + timezone) * 1000);
  
  if (format === 'day') {
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  }
  
  if (format === 'time') {
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(date);
  }
  
  return new Intl.DateTimeFormat('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

export const formatSunTime = (timestamp: number, timezone: number = 0): string => {
  const date = new Date((timestamp + timezone) * 1000);
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(date);
};

export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

export const getWeatherBackground = (icon: string): string => {
  // Weather icon codes: https://openweathermap.org/weather-conditions
  const time = icon.includes('d') ? 'day' : 'night';
  
  if (icon.startsWith('01')) { // clear sky
    return time === 'day' 
      ? 'bg-gradient-to-br from-blue-400 to-blue-600'
      : 'bg-gradient-to-br from-blue-900 to-blue-950';
  } 
  
  if (icon.startsWith('02') || icon.startsWith('03') || icon.startsWith('04')) { // clouds
    return time === 'day'
      ? 'bg-gradient-to-br from-blue-300 to-blue-500'
      : 'bg-gradient-to-br from-blue-800 to-blue-950';
  }
  
  if (icon.startsWith('09') || icon.startsWith('10')) { // rain
    return time === 'day'
      ? 'bg-gradient-to-br from-blue-400 to-blue-700'
      : 'bg-gradient-to-br from-blue-800 to-gray-900';
  }
  
  if (icon.startsWith('11')) { // thunderstorm
    return time === 'day'
      ? 'bg-gradient-to-br from-gray-600 to-blue-800'
      : 'bg-gradient-to-br from-gray-900 to-blue-950';
  }
  
  if (icon.startsWith('13')) { // snow
    return time === 'day'
      ? 'bg-gradient-to-br from-blue-100 to-blue-300'
      : 'bg-gradient-to-br from-blue-200 to-blue-600';
  }
  
  if (icon.startsWith('50')) { // mist/fog
    return time === 'day'
      ? 'bg-gradient-to-br from-gray-300 to-gray-500'
      : 'bg-gradient-to-br from-gray-700 to-gray-900';
  }
  
  return time === 'day'
    ? 'bg-gradient-to-br from-blue-400 to-blue-600'
    : 'bg-gradient-to-br from-blue-800 to-blue-950';
};

export const getUVIndexLevel = (uvi: number): { level: string; color: string } => {
  if (uvi <= 2) {
    return { level: 'Low', color: 'bg-green-500' };
  } else if (uvi <= 5) {
    return { level: 'Moderate', color: 'bg-yellow-500' };
  } else if (uvi <= 7) {
    return { level: 'High', color: 'bg-orange-500' };
  } else if (uvi <= 10) {
    return { level: 'Very High', color: 'bg-red-500' };
  } else {
    return { level: 'Extreme', color: 'bg-purple-700' };
  }
};

export const getVisibilityDescription = (visibility: number): string => {
  const visibilityInKm = visibility / 1000;
  
  if (visibilityInKm >= 10) {
    return 'Excellent';
  } else if (visibilityInKm >= 5) {
    return 'Good';
  } else if (visibilityInKm >= 2) {
    return 'Moderate';
  } else if (visibilityInKm >= 1) {
    return 'Poor';
  } else {
    return 'Very Poor';
  }
};