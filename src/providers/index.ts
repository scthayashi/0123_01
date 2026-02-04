export {
  WeatherProvider,
  IWeatherProvider,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  getTemperatureCategory,
  shouldBringUmbrella,
  needsWaterResistant,
} from './WeatherProvider';

export {
  CalendarProvider,
  ICalendarProvider,
  getEventFormality,
  isBusinessEvent,
  requiresExtraFormality,
} from './CalendarProvider';
