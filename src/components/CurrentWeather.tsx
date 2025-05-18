import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  ArrowDown, 
  Sunrise, 
  Sunset, 
  Info,
  Eye
} from 'lucide-react';
import { 
  formatTemperature, 
  formatSpeed, 
  formatSunTime, 
  getWindDirection, 
  getUVIndexLevel,
  getVisibilityDescription
} from '../utils/formatters';

const CurrentWeather: React.FC = () => {
  const { weatherData, isLoading, temperatureUnit, speedUnit } = useWeather();
  
  if (isLoading || !weatherData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center animate-pulse">
        <div className="w-24 h-24 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
      </div>
    );
  }
  
  const { current, location } = weatherData;
  const uvInfo = getUVIndexLevel(current.uvIndex);
  const visibilityInfo = getVisibilityDescription(current.visibility);
  const windDirection = getWindDirection(current.windDirection);
  
  const iconUrl = `https://openweathermap.org/img/wn/${current.icon}@4x.png`;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-start">
              <img 
                src={iconUrl} 
                alt={current.description} 
                className="w-32 h-32 object-contain"
              />
              <div className="flex flex-col pl-2">
                <span className="text-5xl font-bold">
                  {formatTemperature(current.temperature, temperatureUnit)}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-lg mt-1">
                  Feels like {formatTemperature(current.feelsLike, temperatureUnit)}
                </span>
                <span className="capitalize text-lg mt-1">
                  {current.description}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0 text-center sm:text-right">
            <h2 className="text-2xl font-semibold">{location.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{location.country}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
        <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 mb-2">
            <Droplets size={20} className="text-blue-600 dark:text-blue-300" />
          </div>
          <span className="text-gray-500 dark:text-gray-400 text-sm">Humidity</span>
          <span className="font-bold text-lg">{current.humidity}%</span>
        </div>
        
        <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 mb-2">
            <Wind size={20} className="text-blue-600 dark:text-blue-300" />
          </div>
          <span className="text-gray-500 dark:text-gray-400 text-sm">Wind</span>
          <span className="font-bold text-lg">
            {formatSpeed(current.windSpeed, speedUnit)}
          </span>
          <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
            <ArrowDown 
              size={12} 
              className="mr-1 transform"
              style={{ transform: `rotate(${current.windDirection}deg)` }}
            />
            {windDirection}
          </div>
        </div>
        
        <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 mb-2">
            <Sunrise size={20} className="text-blue-600 dark:text-blue-300" />
          </div>
          <span className="text-gray-500 dark:text-gray-400 text-sm">Sunrise</span>
          <span className="font-bold text-lg">
            {formatSunTime(current.sunrise, current.timezone)}
          </span>
        </div>
        
        <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 mb-2">
            <Sunset size={20} className="text-blue-600 dark:text-blue-300" />
          </div>
          <span className="text-gray-500 dark:text-gray-400 text-sm">Sunset</span>
          <span className="font-bold text-lg">
            {formatSunTime(current.sunset, current.timezone)}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-6 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 mr-3">
            <Eye size={20} className="text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <span className="block text-gray-500 dark:text-gray-400 text-sm">Visibility</span>
            <span className="font-bold">{(current.visibility / 1000).toFixed(1)} km</span>
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({visibilityInfo})</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 mr-3">
            <Thermometer size={20} className="text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <span className="block text-gray-500 dark:text-gray-400 text-sm">Pressure</span>
            <span className="font-bold">{current.pressure} hPa</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 mr-3">
            <Info size={20} className="text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <span className="block text-gray-500 dark:text-gray-400 text-sm">UV Index</span>
            <span className="font-bold">{current.uvIndex}</span>
            <span className={`ml-2 px-2 py-1 text-xs text-white rounded ${uvInfo.color}`}>
              {uvInfo.level}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;