import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, CornerDownLeft, Compass } from 'lucide-react';
import { searchLocations } from '../services/api';
import { LocationSuggestion } from '../types/weather';
import { useWeather } from '../context/WeatherContext';

const SearchBar: React.FC = () => {
  const { fetchWeather, addRecentSearch, recentSearches } = useWeather();
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const handleSearch = async () => {
    if (query.trim() === '') return;
    
    setIsLoading(true);
    try {
      const results = await searchLocations(query);
      setSuggestions(results);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error searching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLocationSelect = async (location: LocationSuggestion) => {
    setQuery(location.name);
    setShowSuggestions(false);
    
    try {
      await fetchWeather(location.lat, location.lon);
      addRecentSearch({
        name: `${location.name}, ${location.country}`,
        lat: location.lat,
        lon: location.lon
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleRecentSearch = async (location: { name: string; lat: number; lon: number }) => {
    setQuery(location.name);
    setShowSuggestions(false);
    
    try {
      await fetchWeather(location.lat, location.lon);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };
  
  const handleUseCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await fetchWeather(latitude, longitude);
          setQuery("Current Location");
        } catch (error) {
          console.error('Error fetching weather:', error);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length > 2) {
        handleSearch();
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto mt-1">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length > 2 && setShowSuggestions(true)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search for a city..."
          className="w-full bg-white dark:bg-gray-800 p-3 pl-10 pr-10 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          aria-label="Search for a location"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label="Clear search"
          >
            <X size={18} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
          </button>
        )}
      </div>
      
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-2">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1 px-2">
              <CornerDownLeft size={14} className="mr-2" /> 
              {isLoading ? 'Searching...' : suggestions.length > 0 ? 'Search results' : 'No results found'}
            </div>
            
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {suggestions.map((location, index) => (
                <div
                  key={`${location.name}-${index}`}
                  onClick={() => handleLocationSelect(location)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded"
                >
                  <MapPin size={16} className="text-gray-400" />
                  <div>
                    <div className="font-medium">{location.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{location.country}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {recentSearches.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 px-2">Recent searches</div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {recentSearches.map((location, index) => (
                    <div
                      key={`recent-${index}`}
                      onClick={() => handleRecentSearch(location)}
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded"
                    >
                      <MapPin size={16} className="text-gray-400" />
                      <div className="font-medium">{location.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
              <div
                onClick={handleUseCurrentLocation}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded"
              >
                <Compass size={16} className="text-blue-500" />
                <div className="font-medium text-blue-500">Use current location</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;