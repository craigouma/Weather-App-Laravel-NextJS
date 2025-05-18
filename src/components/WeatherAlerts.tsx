import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { AlertTriangle, X, Clock } from 'lucide-react';
import { formatDate } from '../utils/formatters';
import { WeatherAlert } from '../types/weather';

const getSeverityStyles = (severity: WeatherAlert['severity']) => {
  switch (severity) {
    case 'extreme':
      return {
        background: 'bg-red-100 dark:bg-red-900/30',
        border: 'border-red-500',
        icon: 'text-red-500',
        text: 'text-red-800 dark:text-red-200'
      };
    case 'severe':
      return {
        background: 'bg-orange-100 dark:bg-orange-900/30',
        border: 'border-orange-500',
        icon: 'text-orange-500',
        text: 'text-orange-800 dark:text-orange-200'
      };
    case 'moderate':
      return {
        background: 'bg-yellow-100 dark:bg-yellow-900/30',
        border: 'border-yellow-500',
        icon: 'text-yellow-500',
        text: 'text-yellow-800 dark:text-yellow-200'
      };
    case 'minor':
      return {
        background: 'bg-blue-100 dark:bg-blue-900/30',
        border: 'border-blue-500',
        icon: 'text-blue-500',
        text: 'text-blue-800 dark:text-blue-200'
      };
  }
};

const Alert: React.FC<{ alert: WeatherAlert; timezone: number }> = ({ alert, timezone }) => {
  const [expanded, setExpanded] = React.useState(false);
  const styles = getSeverityStyles(alert.severity);
  
  return (
    <div className={`${styles.background} ${styles.border} border-l-4 rounded-lg overflow-hidden mb-3`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <AlertTriangle className={`${styles.icon} h-5 w-5 mr-3 mt-0.5 flex-shrink-0`} />
            <div>
              <h3 className={`${styles.text} font-bold`}>{alert.event}</h3>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                <Clock size={14} className="mr-1" />
                {formatDate(alert.start, timezone, 'time')} - {formatDate(alert.end, timezone, 'time')}
              </div>
              
              {expanded ? (
                <div className={`mt-3 ${styles.text}`}>
                  <p className="text-sm whitespace-pre-line">{alert.description}</p>
                  <button
                    onClick={() => setExpanded(false)}
                    className="mt-2 text-sm font-medium hover:underline"
                  >
                    Show less
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setExpanded(true)}
                  className={`mt-1 text-sm font-medium ${styles.text} hover:underline`}
                >
                  Read more
                </button>
              )}
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              const alertElement = e.currentTarget.closest('div[role="alert"]');
              if (alertElement) {
                alertElement.classList.add('animate-fade-out');
                setTimeout(() => {
                  alertElement.classList.add('hidden');
                }, 300);
              }
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const WeatherAlerts: React.FC = () => {
  const { weatherData } = useWeather();
  
  if (!weatherData?.alerts || weatherData.alerts.length === 0) {
    return null;
  }
  
  return (
    <div role="alert" className="mb-6 transition-all duration-300">
      {weatherData.alerts.map((alert, index) => (
        <Alert 
          key={`${alert.event}-${index}`}
          alert={alert}
          timezone={weatherData.current.timezone}
        />
      ))}
    </div>
  );
};

export default WeatherAlerts;