import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { TemperatureUnit, SpeedUnit } from '../types/weather';

const UnitToggle: React.FC = () => {
  const { temperatureUnit, speedUnit, setTemperatureUnit, setSpeedUnit } = useWeather();
  
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center">
        <span className="text-sm mr-2">Temperature:</span>
        <div className="flex rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
          <button
            onClick={() => setTemperatureUnit('celsius')}
            className={`py-1 px-3 text-sm font-medium ${
              temperatureUnit === 'celsius'
                ? 'bg-blue-500 text-white'
                : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            °C
          </button>
          <button
            onClick={() => setTemperatureUnit('fahrenheit')}
            className={`py-1 px-3 text-sm font-medium ${
              temperatureUnit === 'fahrenheit'
                ? 'bg-blue-500 text-white'
                : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            °F
          </button>
        </div>
      </div>
      
      <div className="flex items-center">
        <span className="text-sm mr-2">Wind:</span>
        <div className="flex rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
          <button
            onClick={() => setSpeedUnit('kph')}
            className={`py-1 px-3 text-sm font-medium ${
              speedUnit === 'kph'
                ? 'bg-blue-500 text-white'
                : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            km/h
          </button>
          <button
            onClick={() => setSpeedUnit('mph')}
            className={`py-1 px-3 text-sm font-medium ${
              speedUnit === 'mph'
                ? 'bg-blue-500 text-white'
                : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            mph
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnitToggle;