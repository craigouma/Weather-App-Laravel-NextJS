import React, { useRef } from 'react';
import { useWeather } from '../context/WeatherContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatTemperature, formatDate } from '../utils/formatters';

const HourlyForecast: React.FC = () => {
  const { weatherData, isLoading, temperatureUnit } = useWeather();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 200;
    const currentScroll = scrollContainerRef.current.scrollLeft;
    
    scrollContainerRef.current.scrollTo({
      left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: 'smooth'
    });
  };
  
  if (isLoading || !weatherData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4"></div>
        <div className="flex space-x-4 overflow-x-auto">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-24 p-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto mb-3"></div>
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 relative">
      <h2 className="text-xl font-bold mb-4">Hourly Forecast</h2>
      
      <div className="flex items-center">
        <button
          onClick={() => scroll('left')}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div 
          ref={scrollContainerRef}
          className="flex space-x-6 overflow-x-auto py-2 px-10 hide-scrollbar relative"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {weatherData.hourly.map((hour, index) => {
            const iconUrl = `https://openweathermap.org/img/wn/${hour.icon}@2x.png`;
            const isNow = index === 0;
            
            return (
              <div
                key={hour.time}
                className="flex-shrink-0 w-24 text-center py-2 transition-transform hover:scale-105"
              >
                <div className="text-sm font-medium mb-2">
                  {isNow ? 'Now' : formatDate(hour.time, weatherData.current.timezone, 'time')}
                </div>
                <img
                  src={iconUrl}
                  alt={hour.description}
                  className="w-12 h-12 mx-auto"
                />
                <div className="font-bold mt-1">
                  {formatTemperature(hour.temperature, temperatureUnit)}
                </div>
                {hour.precipitation.probability > 0 && (
                  <div className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                    {(hour.precipitation.probability * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <button
          onClick={() => scroll('right')}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default HourlyForecast;