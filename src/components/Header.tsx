import React from 'react';
import { CloudSun, Moon, Sun } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import UnitToggle from './UnitToggle';

interface HeaderProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, isDarkMode }) => {
  const { weatherData } = useWeather();
  const currentHour = new Date().getHours();
  const isNight = currentHour < 6 || currentHour > 18;
  
  return (
    <header className="py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center">
            <CloudSun size={32} className="mr-2 text-blue-500" />
            <h1 className="text-2xl font-bold">Weather Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <UnitToggle />
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} className="text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;