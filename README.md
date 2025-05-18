# Weather Dashboard

A beautiful, responsive weather application built with React and TypeScript that provides real-time weather information, hourly forecasts, and 5-day predictions.

![Weather Dashboard](https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)

## Features

- 🌡️ Real-time weather data with detailed metrics
- 🕒 Hourly forecast with precipitation chances
- 📅 5-day weather forecast
- 🌍 Location search with autocomplete
- 📍 Geolocation support
- 🌓 Dark/Light mode toggle
- 🌡️ Temperature unit switching (°C/°F)
- 💨 Wind speed unit switching (km/h/mph)
- ⚡ Weather alerts and warnings
- 📱 Fully responsive design

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- OpenWeatherMap API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/craigouma/Weather-App-Laravel-NextJS.git
cd weather-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your OpenWeatherMap API key:

```
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

### Building for Production

To create a production build:

```bash
npm run build
```

## Technology Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios
- Lucide React (for icons)
- OpenWeatherMap API

## Project Structure

```
src/
├── components/        # React components
├── context/          # React context providers
├── services/         # API services
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Features in Detail

### Current Weather

- Temperature and "feels like" temperature
- Weather description with icon
- Humidity, wind speed, and direction
- UV index with severity level
- Visibility with description
- Sunrise and sunset times

### Hourly Forecast

- 24-hour forecast
- Temperature trends
- Precipitation probability
- Weather conditions

### 5-Day Forecast

- Daily high and low temperatures
- Weather conditions
- Precipitation probability
- Wind speed and direction
- Sunrise and sunset times

### Weather Alerts

- Severity-based color coding
- Detailed alert descriptions
- Time-based alerts
- Dismissible alerts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons by [Lucide](https://lucide.dev/)
