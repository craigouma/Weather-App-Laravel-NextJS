import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchWeatherByCoords, getCurrentLocation } from '../services/api';
import { WeatherData, TemperatureUnit, SpeedUnit } from '../types/weather';

interface WeatherContextType {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  temperatureUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setSpeedUnit: (unit: SpeedUnit) => void;
  fetchWeather: (lat: number, lon: number) => Promise<void>;
  recentSearches: Array<{ name: string; lat: number; lon: number }>;
  addRecentSearch: (location: { name: string; lat: number; lon: number }) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

interface WeatherProviderProps {
  children: React.ReactNode;
}

export const WeatherProvider: React.FC<WeatherProviderProps> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('celsius');
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>('kph');
  const [recentSearches, setRecentSearches] = useState<Array<{ name: string; lat: number; lon: number }>>([]);

  const fetchWeather = async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherByCoords(lat, lon);
      setWeatherData(data);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const addRecentSearch = (location: { name: string; lat: number; lon: number }) => {
    setRecentSearches(prevSearches => {
      // Remove existing location with the same name if present
      const filteredSearches = prevSearches.filter(search => search.name !== location.name);
      // Add new location to the start of the array and limit to 5 items
      return [location, ...filteredSearches].slice(0, 5);
    });
  };

  useEffect(() => {
    const loadInitialWeather = async () => {
      try {
        const position = await getCurrentLocation();
        const { latitude, longitude } = position.coords;
        await fetchWeather(latitude, longitude);
      } catch (err) {
        // Default to Kisumu, Kenya if geolocation fails
        await fetchWeather(-0.1022, 34.7617);
        setError('Unable to get your location. Showing default location (Kisumu, Kenya).');
      }
    };

    loadInitialWeather();
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Save recent searches to localStorage when updated
  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  return (
    <WeatherContext.Provider value={{
      weatherData,
      isLoading,
      error,
      temperatureUnit,
      speedUnit,
      setTemperatureUnit,
      setSpeedUnit,
      fetchWeather,
      recentSearches,
      addRecentSearch,
    }}>
      {children}
    </WeatherContext.Provider>
  );
};