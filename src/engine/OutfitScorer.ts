import {
  ClothingItem,
  Outfit,
  DailyWeather,
  DailySchedule,
  ImpressionPreset,
  ImpressionConfig,
  UserPreferences,
  Color,
  Formality,
} from '../types';
import { getEventFormality } from '../providers/CalendarProvider';
import { getTemperatureCategory, needsWaterResistant } from '../providers/WeatherProvider';

interface ScoringContext {
  weather: DailyWeather;
  schedule: DailySchedule;
  preferences: UserPreferences;
  impressionPreset?: ImpressionPreset;
  temperatureAdjustment: number;
}

interface ScoreBreakdown {
  weatherScore: number;
  formalityScore: number;
  colorHarmonyScore: number;
  functionalityScore: number;
  preferenceScore: number;
  freshnessScore: number;
  total: number;
}

export class OutfitScorer {
  private impressionConfigs: Map<ImpressionPreset, ImpressionConfig>;

  constructor() {
    this.impressionConfigs = this.initializeImpressionConfigs();
  }

  scoreOutfit(outfit: Outfit, context: ScoringContext): ScoreBreakdown {
    const weatherScore = this.calculateWeatherScore(outfit, context);
    const formalityScore = this.calculateFormalityScore(outfit, context);
    const colorHarmonyScore = this.calculateColorHarmonyScore(outfit, context);
    const functionalityScore = this.calculateFunctionalityScore(outfit, context);
    const preferenceScore = this.calculatePreferenceScore(outfit, context);
    const freshnessScore = this.calculateFreshnessScore(outfit);

    // Weighted total
    const weights = {
      weather: 0.25,
      formality: 0.25,
      colorHarmony: 0.15,
      functionality: 0.15,
      preference: 0.10,
      freshness: 0.10,
    };

    const total =
      weatherScore * weights.weather +
      formalityScore * weights.formality +
      colorHarmonyScore * weights.colorHarmony +
      functionalityScore * weights.functionality +
      preferenceScore * weights.preference +
      freshnessScore * weights.freshness;

    return {
      weatherScore,
      formalityScore,
      colorHarmonyScore,
      functionalityScore,
      preferenceScore,
      freshnessScore,
      total,
    };
  }

  private calculateWeatherScore(outfit: Outfit, context: ScoringContext): number {
    const { weather, preferences } = context;
    let score = 100;

    // Adjust for temperature
    const avgTemp = (weather.morning.temperature + weather.afternoon.temperature) / 2;
    const adjustedTemp = avgTemp + context.temperatureAdjustment;
    const tempCategory = getTemperatureCategory(adjustedTemp);

    const outfitWarmth = this.calculateOutfitWarmth(outfit);
    const idealWarmth = this.getIdealWarmthForTemperature(tempCategory, preferences.temperatureSensitivity);

    const warmthDiff = Math.abs(outfitWarmth - idealWarmth);
    score -= warmthDiff * 15;

    // Rain consideration
    if (needsWaterResistant(weather.afternoon.precipitation, weather.afternoon.precipitationType)) {
      if (!outfit.shoes.waterResistant) {
        score -= 30;
      }
      if (outfit.outerwear && !outfit.outerwear.waterResistant) {
        score -= 15;
      }
    }

    // Wind consideration
    if (weather.afternoon.windSpeed > 20) {
      if (!outfit.outerwear?.windResistant) {
        score -= 10;
      }
    }

    return Math.max(0, Math.min(100, score));
  }

  private calculateFormalityScore(outfit: Outfit, context: ScoringContext): number {
    const { schedule, impressionPreset } = context;
    let score = 100;

    const formalityRange = getEventFormality(schedule.primaryEventType);
    const outfitFormality = this.calculateAverageFormality(outfit);

    // Apply impression preset if specified
    if (impressionPreset) {
      const config = this.impressionConfigs.get(impressionPreset);
      if (config) {
        const presetRange = config.preferredFormality;
        if (outfitFormality < presetRange.min || outfitFormality > presetRange.max) {
          score -= 20;
        }
      }
    }

    // Check if outfit formality matches event requirements
    if (outfitFormality < formalityRange.min) {
      score -= (formalityRange.min - outfitFormality) * 20;
    } else if (outfitFormality > formalityRange.max) {
      score -= (outfitFormality - formalityRange.max) * 10; // Slightly overdressed is better than underdressed
    }

    return Math.max(0, Math.min(100, score));
  }

  private calculateColorHarmonyScore(outfit: Outfit, context: ScoringContext): number {
    let score = 100;
    const colors: Color[] = [outfit.top.color, outfit.bottom.color];

    if (outfit.outerwear) {
      colors.push(outfit.outerwear.color);
    }
    colors.push(outfit.shoes.color);

    // Check for clashing colors
    if (this.hasClashingColors(colors)) {
      score -= 30;
    }

    // Reward complementary colors
    if (this.hasComplementaryColors(colors)) {
      score += 10;
    }

    // Check against user preferences
    const { preferences, impressionPreset } = context;

    for (const color of colors) {
      if (preferences.avoidColors.includes(color)) {
        score -= 15;
      }
      if (preferences.favoriteColors.includes(color)) {
        score += 5;
      }
    }

    // Apply impression preset color preferences
    if (impressionPreset) {
      const config = this.impressionConfigs.get(impressionPreset);
      if (config) {
        for (const color of colors) {
          if (config.preferredColors.includes(color)) {
            score += 10;
          }
          if (config.avoidColors.includes(color)) {
            score -= 15;
          }
        }
      }
    }

    return Math.max(0, Math.min(100, score));
  }

  private calculateFunctionalityScore(outfit: Outfit, context: ScoringContext): number {
    let score = 100;
    const { schedule } = context;

    // Check transport method compatibility
    for (const transport of schedule.transportMethods) {
      if (transport === 'walk' || transport === 'bicycle') {
        // Need comfortable shoes
        if (outfit.shoes.subCategory === 'leather_shoes' && outfit.shoes.formality >= 4) {
          score -= 10;
        }
      }
    }

    // Long day considerations
    const events = schedule.events;
    if (events.length > 3) {
      // Multiple events - prioritize comfort
      const allFormal = [outfit.top, outfit.bottom, outfit.shoes].every(
        item => item.formality >= 4
      );
      if (allFormal) {
        score -= 5; // Slight penalty for all-formal outfit on busy day
      }
    }

    return Math.max(0, Math.min(100, score));
  }

  private calculatePreferenceScore(outfit: Outfit, context: ScoringContext): number {
    let score = 50; // Start at neutral
    const { preferences } = context;

    // Brand preferences
    const items = [outfit.top, outfit.bottom, outfit.shoes];
    if (outfit.outerwear) items.push(outfit.outerwear);

    for (const item of items) {
      if (item.brand && preferences.preferredBrands.includes(item.brand)) {
        score += 15;
      }
    }

    return Math.max(0, Math.min(100, score));
  }

  private calculateFreshnessScore(outfit: Outfit): number {
    let score = 100;
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const items = [outfit.top, outfit.bottom];

    for (const item of items) {
      if (item.lastWorn) {
        if (item.lastWorn > threeDaysAgo) {
          score -= 25; // Recently worn
        } else if (item.lastWorn > oneWeekAgo) {
          score -= 10;
        }
      }
    }

    return Math.max(0, Math.min(100, score));
  }

  private calculateOutfitWarmth(outfit: Outfit): number {
    let warmth = outfit.top.warmthLevel + outfit.bottom.warmthLevel;
    if (outfit.outerwear) {
      warmth += outfit.outerwear.warmthLevel;
    }
    return warmth / (outfit.outerwear ? 3 : 2);
  }

  private getIdealWarmthForTemperature(
    category: 'cold' | 'cool' | 'mild' | 'warm' | 'hot',
    sensitivity: UserPreferences['temperatureSensitivity']
  ): number {
    const baseWarmth = {
      cold: 5,
      cool: 4,
      mild: 3,
      warm: 2,
      hot: 1,
    }[category];

    const adjustment = {
      cold_sensitive: 0.5,
      normal: 0,
      heat_sensitive: -0.5,
    }[sensitivity];

    return baseWarmth + adjustment;
  }

  private calculateAverageFormality(outfit: Outfit): number {
    const items = [outfit.top, outfit.bottom, outfit.shoes];
    if (outfit.outerwear) items.push(outfit.outerwear);

    const sum = items.reduce((total, item) => total + item.formality, 0);
    return sum / items.length;
  }

  private hasClashingColors(colors: Color[]): boolean {
    const clashingPairs: [Color, Color][] = [
      ['red', 'pink'],
      ['red', 'burgundy'],
      ['green', 'red'],
      ['brown', 'black'],
    ];

    for (const [c1, c2] of clashingPairs) {
      if (colors.includes(c1) && colors.includes(c2)) {
        return true;
      }
    }
    return false;
  }

  private hasComplementaryColors(colors: Color[]): boolean {
    const complementaryPairs: [Color, Color][] = [
      ['navy', 'white'],
      ['navy', 'cream'],
      ['charcoal', 'light_blue'],
      ['brown', 'cream'],
      ['black', 'white'],
      ['burgundy', 'gray'],
    ];

    for (const [c1, c2] of complementaryPairs) {
      if (colors.includes(c1) && colors.includes(c2)) {
        return true;
      }
    }
    return false;
  }

  private initializeImpressionConfigs(): Map<ImpressionPreset, ImpressionConfig> {
    const configs: Map<ImpressionPreset, ImpressionConfig> = new Map();

    configs.set('trustworthy', {
      preset: 'trustworthy',
      displayName: '信頼感MAX（勝負服）',
      description: '大事な商談やプレゼンに最適',
      preferredFormality: { min: 4 as Formality, max: 5 as Formality },
      preferredColors: ['navy', 'charcoal', 'white', 'gray'],
      avoidColors: ['pink', 'red', 'green'],
      prioritizeItems: ['blazer', 'dress_pants', 'leather_shoes'],
    });

    configs.set('approachable', {
      preset: 'approachable',
      displayName: '親しみやすさ（後輩指導）',
      description: 'メンタリングや1on1に最適',
      preferredFormality: { min: 2 as Formality, max: 3 as Formality },
      preferredColors: ['light_blue', 'beige', 'cream', 'gray'],
      avoidColors: ['black'],
      prioritizeItems: ['cardigan', 'chinos', 'loafers'],
    });

    configs.set('professional', {
      preset: 'professional',
      displayName: 'プロフェッショナル',
      description: '標準的なビジネスシーン向け',
      preferredFormality: { min: 3 as Formality, max: 4 as Formality },
      preferredColors: ['navy', 'gray', 'white', 'charcoal'],
      avoidColors: [],
      prioritizeItems: ['shirt', 'dress_pants', 'leather_shoes'],
    });

    configs.set('creative', {
      preset: 'creative',
      displayName: 'クリエイティブ',
      description: 'デザインやマーケティング向け',
      preferredFormality: { min: 2 as Formality, max: 4 as Formality },
      preferredColors: ['burgundy', 'olive', 'camel', 'navy'],
      avoidColors: [],
      prioritizeItems: ['sweater', 'chinos', 'loafers'],
    });

    configs.set('casual', {
      preset: 'casual',
      displayName: 'カジュアル',
      description: 'リモートワークや休日向け',
      preferredFormality: { min: 1 as Formality, max: 2 as Formality },
      preferredColors: ['blue', 'gray', 'beige', 'cream'],
      avoidColors: [],
      prioritizeItems: ['t-shirt', 'jeans', 'sneakers'],
    });

    configs.set('elegant', {
      preset: 'elegant',
      displayName: 'エレガント',
      description: 'ディナーや会食向け',
      preferredFormality: { min: 4 as Formality, max: 5 as Formality },
      preferredColors: ['black', 'navy', 'burgundy', 'charcoal'],
      avoidColors: ['beige', 'cream'],
      prioritizeItems: ['blazer', 'dress_pants', 'leather_shoes'],
    });

    configs.set('energetic', {
      preset: 'energetic',
      displayName: 'エネルギッシュ',
      description: 'アクティブな営業活動向け',
      preferredFormality: { min: 2 as Formality, max: 3 as Formality },
      preferredColors: ['light_blue', 'white', 'blue', 'cream'],
      avoidColors: ['black', 'charcoal'],
      prioritizeItems: ['polo', 'chinos', 'loafers'],
    });

    return configs;
  }

  getImpressionConfig(preset: ImpressionPreset): ImpressionConfig | undefined {
    return this.impressionConfigs.get(preset);
  }

  getAllImpressionConfigs(): ImpressionConfig[] {
    return Array.from(this.impressionConfigs.values());
  }
}
