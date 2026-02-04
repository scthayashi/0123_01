import { RecommendationEngine } from './RecommendationEngine';
import { User } from '../models/User';
import { DailyWeather, DailySchedule, WeatherCondition } from '../types';

describe('RecommendationEngine', () => {
  let engine: RecommendationEngine;
  let user: User;

  beforeEach(() => {
    engine = new RecommendationEngine();
    user = new User('test-user');

    // Add some test items to wardrobe
    const wardrobe = user.getWardrobe();

    // Tops
    wardrobe.addItem({
      name: 'ホワイトシャツ',
      category: 'tops',
      subCategory: 'shirt',
      color: 'white',
      colors: ['white'],
      formality: 4,
      warmthLevel: 2,
      waterResistant: false,
      windResistant: false,
      tags: ['ビジネス'],
    });

    wardrobe.addItem({
      name: 'ネイビーポロシャツ',
      category: 'tops',
      subCategory: 'polo',
      color: 'navy',
      colors: ['navy'],
      formality: 2,
      warmthLevel: 2,
      waterResistant: false,
      windResistant: false,
      tags: ['カジュアル'],
    });

    // Bottoms
    wardrobe.addItem({
      name: 'チャコールスラックス',
      category: 'bottoms',
      subCategory: 'dress_pants',
      color: 'charcoal',
      colors: ['charcoal'],
      formality: 4,
      warmthLevel: 2,
      waterResistant: false,
      windResistant: false,
      tags: ['ビジネス'],
    });

    wardrobe.addItem({
      name: 'ベージュチノパン',
      category: 'bottoms',
      subCategory: 'chinos',
      color: 'beige',
      colors: ['beige'],
      formality: 3,
      warmthLevel: 2,
      waterResistant: false,
      windResistant: false,
      tags: ['カジュアル'],
    });

    // Shoes
    wardrobe.addItem({
      name: '黒革靴',
      category: 'shoes',
      subCategory: 'leather_shoes',
      color: 'black',
      colors: ['black'],
      formality: 5,
      warmthLevel: 2,
      waterResistant: false,
      windResistant: false,
      tags: ['ビジネス'],
    });

    wardrobe.addItem({
      name: '撥水レインシューズ',
      category: 'shoes',
      subCategory: 'water_resistant_shoes',
      color: 'black',
      colors: ['black'],
      formality: 3,
      warmthLevel: 2,
      waterResistant: true,
      windResistant: false,
      tags: ['雨用'],
    });

    // Outerwear
    wardrobe.addItem({
      name: 'ネイビーブレザー',
      category: 'outerwear',
      subCategory: 'blazer',
      color: 'navy',
      colors: ['navy'],
      formality: 4,
      warmthLevel: 2,
      waterResistant: false,
      windResistant: false,
      tags: ['ビジネス'],
    });
  });

  const createMockWeather = (
    temp: number = 20,
    precipitation: number = 0,
    tempDiff: number = 5
  ): DailyWeather => {
    const condition: WeatherCondition = {
      temperature: temp,
      feelsLike: temp - 1,
      humidity: 60,
      precipitation,
      precipitationType: precipitation > 50 ? 'rain' : 'none',
      windSpeed: 10,
      uvIndex: 3,
    };

    return {
      date: new Date(),
      morning: { ...condition, temperature: temp - 3 },
      afternoon: condition,
      evening: { ...condition, temperature: temp - tempDiff },
      highTemp: temp,
      lowTemp: temp - tempDiff,
      temperatureDifference: tempDiff,
    };
  };

  const createMockSchedule = (eventType: DailySchedule['primaryEventType'] = 'business_meeting'): DailySchedule => ({
    date: new Date(),
    events: [
      {
        id: 'event-1',
        title: 'テスト予定',
        startTime: new Date(),
        endTime: new Date(),
        eventType,
        importance: 'high',
      },
    ],
    primaryEventType: eventType,
    transportMethods: ['train'],
  });

  describe('generateDailyRecommendation', () => {
    it('should generate a recommendation with primary and alternatives', async () => {
      const weather = createMockWeather();
      const schedule = createMockSchedule();

      const result = await engine.generateDailyRecommendation(user, weather, schedule);

      expect(result).toBeDefined();
      expect(result.primary).toBeDefined();
      expect(result.primary.outfit).toBeDefined();
      expect(result.primary.reason).toBeTruthy();
      expect(result.primary.score).toBeGreaterThan(0);
      expect(result.alternatives).toBeDefined();
    });

    it('should prioritize water-resistant shoes when rain is expected', async () => {
      const weather = createMockWeather(20, 70); // 70% rain
      const schedule = createMockSchedule();

      const result = await engine.generateDailyRecommendation(user, weather, schedule);

      // At least one recommendation should have water-resistant shoes
      const hasWaterResistantOption =
        result.primary.outfit.shoes.waterResistant ||
        result.alternatives.some(alt => alt.outfit.shoes.waterResistant);

      expect(hasWaterResistantOption).toBe(true);
    });

    it('should generate evening notification for large temperature differences', async () => {
      const weather = createMockWeather(25, 0, 12); // 12 degree difference
      const schedule = createMockSchedule();

      // Add a stole for evening notification
      user.getWardrobe().addItem({
        name: 'ベージュストール',
        category: 'outerwear',
        subCategory: 'stole',
        color: 'beige',
        colors: ['beige'],
        formality: 3,
        warmthLevel: 2,
        waterResistant: false,
        windResistant: false,
        tags: ['羽織り'],
      });

      const result = await engine.generateDailyRecommendation(user, weather, schedule);

      expect(result.eveningNotification).toBeDefined();
      expect(result.eveningNotification?.message).toContain('夕方');
    });

    it('should respect impression presets', async () => {
      const weather = createMockWeather();
      const schedule = createMockSchedule();

      const trustworthyResult = await engine.generateDailyRecommendation(
        user,
        weather,
        schedule,
        { impressionPreset: 'trustworthy' }
      );

      expect(trustworthyResult.primary).toBeDefined();
      // Trustworthy preset should favor formal items
      expect(trustworthyResult.primary.outfit.top.formality).toBeGreaterThanOrEqual(3);
    });

    it('should adjust for casual events', async () => {
      const weather = createMockWeather();
      const schedule = createMockSchedule('remote_work');

      const result = await engine.generateDailyRecommendation(user, weather, schedule);

      // Remote work should allow less formal items
      expect(result.primary).toBeDefined();
    });
  });

  describe('OutfitScorer', () => {
    it('should be accessible from engine', () => {
      const scorer = engine.getScorer();
      expect(scorer).toBeDefined();
    });

    it('should have all impression configs', () => {
      const scorer = engine.getScorer();
      const configs = scorer.getAllImpressionConfigs();

      expect(configs.length).toBeGreaterThan(0);
      expect(configs.some(c => c.preset === 'trustworthy')).toBe(true);
      expect(configs.some(c => c.preset === 'approachable')).toBe(true);
      expect(configs.some(c => c.preset === 'professional')).toBe(true);
    });
  });
});
