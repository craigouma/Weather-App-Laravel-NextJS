import React, { useState, useEffect } from 'react';
import Header from './Header';
import SearchBar from './SearchBar';
import CurrentWeather from './CurrentWeather';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';
import WeatherAlerts from './WeatherAlerts';
import { useWeather } from '../context/WeatherContext';
import { getWeatherBackground } from '../utils/formatters';

const WeatherApp: React.FC = () => {
  const { weatherData, error } = useWeather();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };
  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  // Determine background gradient based on current weather
  const backgroundClass = weatherData 
    ? getWeatherBackground(weatherData.current.icon)
    : 'bg-gradient-to-br from-blue-400 to-blue-600';
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        
        <main className="container mx-auto px-4 pb-20">
          <div className="max-w-5xl mx-auto">
            <div className={`${backgroundClass} rounded-xl p-6 mb-8 shadow-lg`}>
              <div className="flex flex-col items-center">
                <SearchBar />
                
                {error && (
                  <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg border border-red-200 max-w-md">
                    {error}
                  </div>
                )}
              </div>
            </div>
            
            {weatherData && (
              <>
                <WeatherAlerts />
                
                <div className="grid grid-cols-1 gap-8 mb-8">
                  <CurrentWeather />
                </div>
                
                <div className="grid grid-cols-1 gap-8 mb-8">
                  <HourlyForecast />
                </div>
                
                <div className="grid grid-cols-1 gap-8">
                  <DailyForecast />
                </div>
              </>
            )}
          </div>
        </main>
        
        <footer className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4">
            <p>
              Weather data provided by <a href="https://openweathermap.org/api" className="text-blue-500 hover:underline">OpenWeatherMap</a>
            </p>
            <p className="mt-2">
              Built with <a href="http://ripple-ui.com" className="text-blue-500 hover:underline">React</a> & Tailwind CSS
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default WeatherApp;