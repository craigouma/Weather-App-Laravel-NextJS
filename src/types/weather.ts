export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  uvIndex: number;
  visibility: number;
  sunrise: number;
  sunset: number;
  timezone: number;
}

export interface DailyForecast {
  date: number;
  sunrise: number;
  sunset: number;
  temperature: {
    min: number;
    max: number;
  };
  feelsLike: {
    day: number;
    night: number;
  };
  humidity: number;
  windSpeed: number;
  windDirection: number;
  description: string;
  icon: string;
  uvIndex: number;
  precipitation: {
    probability: number;
    amount: number;
  };
}

export interface HourlyForecast {
  time: number;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  description: string;
  icon: string;
  precipitation: {
    probability: number;
    amount: number;
  };
}

export interface WeatherAlert {
  senderName: string;
  event: string;
  start: number;
  end: number;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
}

export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: CurrentWeather;
  daily: DailyForecast[];
  hourly: HourlyForecast[];
  alerts?: WeatherAlert[];
}

export interface LocationSuggestion {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type SpeedUnit = 'kph' | 'mph';