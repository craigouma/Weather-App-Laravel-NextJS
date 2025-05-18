import React from 'react';
import { WeatherProvider } from './context/WeatherContext';
import WeatherApp from './components/WeatherApp';

function App() {
  return (
    <WeatherProvider>
      <WeatherApp />
    </WeatherProvider>
  );
}

export default App;