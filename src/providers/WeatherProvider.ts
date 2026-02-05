import { WeatherCondition, DailyWeather } from '../types';

export interface IWeatherProvider {
  getCurrentWeather(): Promise<WeatherCondition>;
  getDailyForecast(date: Date): Promise<DailyWeather>;
  getHourlyForecast(date: Date, hour: number): Promise<WeatherCondition>;
}

export class WeatherProvider implements IWeatherProvider {
  private apiKey?: string;
  private location: { lat: number; lon: number };
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheDuration = 30 * 60 * 1000; // 30 minutes

  constructor(location: { lat: number; lon: number }, apiKey?: string) {
    this.location = location;
    this.apiKey = apiKey;
  }

  async getCurrentWeather(): Promise<WeatherCondition> {
    // In a real implementation, this would call an actual weather API
    // For now, we return a mock implementation that can be replaced
    const cached = this.getFromCache<WeatherCondition>('current');
    if (cached) return cached;

    const weather = await this.fetchCurrentWeather();
    this.setCache('current', weather);
    return weather;
  }

  async getDailyForecast(date: Date): Promise<DailyWeather> {
    const dateKey = this.formatDateKey(date);
    const cached = this.getFromCache<DailyWeather>(`daily_${dateKey}`);
    if (cached) return cached;

    const forecast = await this.fetchDailyForecast(date);
    this.setCache(`daily_${dateKey}`, forecast);
    return forecast;
  }

  async getHourlyForecast(date: Date, hour: number): Promise<WeatherCondition> {
    const dateKey = this.formatDateKey(date);
    const cached = this.getFromCache<WeatherCondition>(`hourly_${dateKey}_${hour}`);
    if (cached) return cached;

    const forecast = await this.fetchHourlyForecast(date, hour);
    this.setCache(`hourly_${dateKey}_${hour}`, forecast);
    return forecast;
  }

  private async fetchCurrentWeather(): Promise<WeatherCondition> {
    // Mock implementation - replace with actual API call
    // Example: OpenWeatherMap, Weather.com, etc.
    return this.createMockWeather();
  }

  private async fetchDailyForecast(date: Date): Promise<DailyWeather> {
    // Mock implementation
    const morning = this.createMockWeather(8);
    const afternoon = this.createMockWeather(14);
    const evening = this.createMockWeather(19);

    return {
      date,
      morning,
      afternoon,
      evening,
      highTemp: Math.max(morning.temperature, afternoon.temperature, evening.temperature),
      lowTemp: Math.min(morning.temperature, afternoon.temperature, evening.temperature),
      temperatureDifference: Math.abs(
        Math.max(morning.temperature, afternoon.temperature, evening.temperature) -
        Math.min(morning.temperature, afternoon.temperature, evening.temperature)
      ),
    };
  }

  private async fetchHourlyForecast(date: Date, hour: number): Promise<WeatherCondition> {
    return this.createMockWeather(hour);
  }

  private createMockWeather(hour: number = 12): WeatherCondition {
    // Create realistic mock weather based on time of day
    const baseTemp = 20; // Base temperature
    const hourAdjustment = hour < 12 ? (hour - 6) * 0.8 : (18 - hour) * 0.5;

    return {
      temperature: Math.round(baseTemp + hourAdjustment),
      feelsLike: Math.round(baseTemp + hourAdjustment - 1),
      humidity: 60,
      precipitation: 20,
      precipitationType: 'none',
      windSpeed: 10,
      uvIndex: hour > 10 && hour < 16 ? 5 : 2,
    };
  }

  private formatDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data as T;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  setLocation(lat: number, lon: number): void {
    this.location = { lat, lon };
    this.cache.clear(); // Clear cache when location changes
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }
}

// Temperature utility functions
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

export function getTemperatureCategory(temp: number): 'cold' | 'cool' | 'mild' | 'warm' | 'hot' {
  if (temp < 5) return 'cold';
  if (temp < 15) return 'cool';
  if (temp < 22) return 'mild';
  if (temp < 28) return 'warm';
  return 'hot';
}

export function shouldBringUmbrella(precipitation: number): boolean {
  return precipitation >= 40;
}

export function needsWaterResistant(precipitation: number, precipType: string): boolean {
  return precipitation >= 50 && precipType !== 'none';
}
