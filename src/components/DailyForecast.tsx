import React, { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { Droplets, Wind, ArrowDown, Sunrise, Sunset, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  formatTemperature, 
  formatDate, 
  formatSpeed, 
  getWindDirection,
  formatSunTime
} from '../utils/formatters';
import { DailyForecast as DailyForecastType } from '../types/weather';

const DailyForecastItem: React.FC<{ 
  day: DailyForecastType; 
  isFirst: boolean;
  timezone: number;
}> = ({ day, isFirst, timezone }) => {
  const { temperatureUnit, speedUnit } = useWeather();
  const [expanded, setExpanded] = useState<boolean>(isFirst);
  
  const iconUrl = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;
  const isToday = isFirst;
  const windDirection = getWindDirection(day.windDirection);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-all">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 flex items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <div className="w-14 text-center">
            <div className="font-semibold">
              {isToday ? 'Today' : formatDate(day.date, timezone, 'day')}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(day.date, timezone, 'day') === formatDate(new Date().getTime() / 1000, timezone, 'day') 
                ? 'Today' 
                : formatDate(day.date, timezone, 'day')}
            </div>
          </div>
          
          <div className="flex items-center mx-4">
            <img
              src={iconUrl}
              alt={day.description}
              className="w-12 h-12 object-contain"
            />
            <div className="ml-2 capitalize text-sm">{day.description}</div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="text-right mr-4">
            <div className="font-bold">{formatTemperature(day.temperature.max, temperatureUnit)}</div>
            <div className="text-gray-500 dark:text-gray-400">
              {formatTemperature(day.temperature.min, temperatureUnit)}
            </div>
          </div>
          {expanded ? (
            <ChevronUp size={20} className="text-gray-400" />
          ) : (
            <ChevronDown size={20} className="text-gray-400" />
          )}
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-1">
                <Droplets size={16} className="mr-2" />
                Humidity
              </div>
              <div className="font-semibold">{day.humidity}%</div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-1">
                <Wind size={16} className="mr-2" />
                Wind
              </div>
              <div className="font-semibold">
                {formatSpeed(day.windSpeed, speedUnit)}
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  {windDirection}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-1">
                <Sunrise size={16} className="mr-2" />
                Sunrise
              </div>
              <div className="font-semibold">{formatSunTime(day.sunrise, timezone)}</div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-1">
                <Sunset size={16} className="mr-2" />
                Sunset
              </div>
              <div className="font-semibold">{formatSunTime(day.sunset, timezone)}</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">
              Precipitation Chance
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-blue-500 h-2.5 rounded-full" 
                style={{ width: `${day.precipitation.probability * 100}%` }}
              ></div>
            </div>
            <div className="mt-1 text-sm text-right">
              {(day.precipitation.probability * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DailyForecast: React.FC = () => {
  const { weatherData, isLoading } = useWeather();
  
  if (isLoading || !weatherData) {
    return (
      <div className="space-y-2 animate-pulse">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="flex space-x-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-8"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold mb-4">5-Day Forecast</h2>
      {weatherData.daily.map((day, index) => (
        <DailyForecastItem 
          key={day.date}
          day={day}
          isFirst={index === 0}
          timezone={weatherData.current.timezone}
        />
      ))}
    </div>
  );
};

export default DailyForecast;