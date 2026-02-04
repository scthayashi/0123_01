import { v4 as uuidv4 } from 'uuid';
import {
  ClothingItem,
  Outfit,
  OutfitRecommendation,
  DailyRecommendation,
  DailyWeather,
  DailySchedule,
  ImpressionPreset,
  EveningNotification,
  UserPreferences,
} from '../types';
import { Wardrobe } from '../models/Wardrobe';
import { User } from '../models/User';
import { OutfitScorer } from './OutfitScorer';
import { needsWaterResistant, getTemperatureCategory } from '../providers/WeatherProvider';
import { getEventFormality, requiresExtraFormality } from '../providers/CalendarProvider';

interface RecommendationOptions {
  impressionPreset?: ImpressionPreset;
  excludeRecentlyWorn?: boolean;
  prioritizeComfort?: boolean;
}

export class RecommendationEngine {
  private scorer: OutfitScorer;

  constructor() {
    this.scorer = new OutfitScorer();
  }

  async generateDailyRecommendation(
    user: User,
    weather: DailyWeather,
    schedule: DailySchedule,
    options: RecommendationOptions = {}
  ): Promise<DailyRecommendation> {
    const wardrobe = user.getWardrobe();
    const preferences = user.getPreferences();
    const temperatureAdjustment = user.getTemperatureAdjustment();

    // Generate candidate outfits
    const candidates = this.generateCandidateOutfits(wardrobe, weather, schedule, options);

    // Score all candidates
    const scoredOutfits = candidates.map(outfit => {
      const scoreBreakdown = this.scorer.scoreOutfit(outfit, {
        weather,
        schedule,
        preferences,
        impressionPreset: options.impressionPreset,
        temperatureAdjustment,
      });

      return {
        outfit,
        score: scoreBreakdown.total,
        breakdown: scoreBreakdown,
      };
    });

    // Sort by score
    scoredOutfits.sort((a, b) => b.score - a.score);

    // Generate primary recommendation
    const primary = this.createRecommendation(
      scoredOutfits[0].outfit,
      scoredOutfits[0].score,
      weather,
      schedule,
      options.impressionPreset
    );

    // Generate alternatives (up to 3)
    const alternatives = scoredOutfits.slice(1, 4).map(scored =>
      this.createRecommendation(
        scored.outfit,
        scored.score,
        weather,
        schedule,
        options.impressionPreset
      )
    );

    // Check for evening notification
    const eveningNotification = this.checkEveningNotification(weather, wardrobe);

    return {
      date: weather.date,
      primary,
      alternatives,
      weather,
      schedule,
      eveningNotification,
    };
  }

  private generateCandidateOutfits(
    wardrobe: Wardrobe,
    weather: DailyWeather,
    schedule: DailySchedule,
    options: RecommendationOptions
  ): Outfit[] {
    const candidates: Outfit[] = [];

    const tops = this.filterTops(wardrobe, weather, schedule, options);
    const bottoms = this.filterBottoms(wardrobe, weather, schedule, options);
    const shoes = this.filterShoes(wardrobe, weather, schedule, options);
    const outerwearOptions = this.filterOuterwear(wardrobe, weather, schedule, options);

    // Generate combinations (limit to prevent explosion)
    const maxCombinations = 100;
    let count = 0;

    for (const top of tops) {
      for (const bottom of bottoms) {
        for (const shoe of shoes) {
          if (count >= maxCombinations) break;

          // Add outfit without outerwear
          const needsOuterwear = this.needsOuterwear(weather);

          if (!needsOuterwear) {
            candidates.push({
              id: uuidv4(),
              top,
              bottom,
              shoes: shoe,
              accessories: [],
            });
            count++;
          }

          // Add outfit with outerwear
          if (outerwearOptions.length > 0 && needsOuterwear) {
            for (const outerwear of outerwearOptions.slice(0, 3)) {
              if (count >= maxCombinations) break;
              candidates.push({
                id: uuidv4(),
                top,
                bottom,
                outerwear,
                shoes: shoe,
                accessories: [],
              });
              count++;
            }
          }
        }
      }
    }

    return candidates;
  }

  private filterTops(
    wardrobe: Wardrobe,
    weather: DailyWeather,
    schedule: DailySchedule,
    options: RecommendationOptions
  ): ClothingItem[] {
    let tops = wardrobe.getTops();
    const formalityRange = getEventFormality(schedule.primaryEventType);
    const avgTemp = (weather.morning.temperature + weather.afternoon.temperature) / 2;

    // Filter by formality
    tops = tops.filter(
      item => item.formality >= formalityRange.min - 1 && item.formality <= formalityRange.max + 1
    );

    // Filter by warmth
    const tempCategory = getTemperatureCategory(avgTemp);
    tops = this.filterByTemperature(tops, tempCategory);

    // Exclude recently worn if requested
    if (options.excludeRecentlyWorn) {
      tops = this.excludeRecentlyWorn(tops, 3);
    }

    return tops.slice(0, 10); // Limit for performance
  }

  private filterBottoms(
    wardrobe: Wardrobe,
    weather: DailyWeather,
    schedule: DailySchedule,
    options: RecommendationOptions
  ): ClothingItem[] {
    let bottoms = wardrobe.getBottoms();
    const formalityRange = getEventFormality(schedule.primaryEventType);

    // Filter by formality
    bottoms = bottoms.filter(
      item => item.formality >= formalityRange.min - 1 && item.formality <= formalityRange.max + 1
    );

    // Exclude recently worn if requested
    if (options.excludeRecentlyWorn) {
      bottoms = this.excludeRecentlyWorn(bottoms, 3);
    }

    return bottoms.slice(0, 10);
  }

  private filterShoes(
    wardrobe: Wardrobe,
    weather: DailyWeather,
    schedule: DailySchedule,
    options: RecommendationOptions
  ): ClothingItem[] {
    let shoes = wardrobe.getShoes();
    const formalityRange = getEventFormality(schedule.primaryEventType);
    const needsWaterResistance = needsWaterResistant(
      weather.afternoon.precipitation,
      weather.afternoon.precipitationType
    );

    // Prioritize water-resistant shoes if rain expected
    if (needsWaterResistance) {
      const waterResistantShoes = shoes.filter(s => s.waterResistant);
      if (waterResistantShoes.length > 0) {
        shoes = waterResistantShoes;
      }
    }

    // Filter by formality
    shoes = shoes.filter(
      item => item.formality >= formalityRange.min - 1 && item.formality <= formalityRange.max + 1
    );

    return shoes.slice(0, 5);
  }

  private filterOuterwear(
    wardrobe: Wardrobe,
    weather: DailyWeather,
    schedule: DailySchedule,
    options: RecommendationOptions
  ): ClothingItem[] {
    let outerwear = wardrobe.getOuterwear();
    const avgTemp = (weather.morning.temperature + weather.afternoon.temperature) / 2;
    const tempCategory = getTemperatureCategory(avgTemp);
    const needsWaterResistance = needsWaterResistant(
      weather.afternoon.precipitation,
      weather.afternoon.precipitationType
    );

    // Prioritize water-resistant if rain expected
    if (needsWaterResistance) {
      const waterResistant = outerwear.filter(o => o.waterResistant);
      if (waterResistant.length > 0) {
        outerwear = waterResistant;
      }
    }

    // Filter by warmth
    outerwear = this.filterByTemperature(outerwear, tempCategory);

    return outerwear.slice(0, 5);
  }

  private filterByTemperature(
    items: ClothingItem[],
    tempCategory: 'cold' | 'cool' | 'mild' | 'warm' | 'hot'
  ): ClothingItem[] {
    const warmthRanges = {
      cold: { min: 4, max: 5 },
      cool: { min: 3, max: 5 },
      mild: { min: 2, max: 4 },
      warm: { min: 1, max: 3 },
      hot: { min: 1, max: 2 },
    };

    const range = warmthRanges[tempCategory];
    return items.filter(
      item => item.warmthLevel >= range.min && item.warmthLevel <= range.max
    );
  }

  private excludeRecentlyWorn(items: ClothingItem[], days: number): ClothingItem[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return items.filter(item => !item.lastWorn || item.lastWorn < cutoff);
  }

  private needsOuterwear(weather: DailyWeather): boolean {
    const avgTemp = (weather.morning.temperature + weather.afternoon.temperature) / 2;
    return avgTemp < 20 || weather.afternoon.precipitation > 30;
  }

  private createRecommendation(
    outfit: Outfit,
    score: number,
    weather: DailyWeather,
    schedule: DailySchedule,
    impressionPreset?: ImpressionPreset
  ): OutfitRecommendation {
    const reason = this.generateReasonText(outfit, weather, schedule, impressionPreset);
    const tags = this.generateTags(outfit, weather, schedule);

    return {
      outfit,
      reason,
      score,
      tags,
    };
  }

  private generateReasonText(
    outfit: Outfit,
    weather: DailyWeather,
    schedule: DailySchedule,
    impressionPreset?: ImpressionPreset
  ): string {
    const parts: string[] = [];

    // Weather-related reason
    if (weather.afternoon.precipitation >= 50) {
      parts.push(`午後から${weather.afternoon.precipitationType === 'rain' ? '雨' : '雪'}予報`);
      if (outfit.shoes.waterResistant) {
        parts.push('撥水靴をセレクト');
      }
    }

    // Temperature-related
    const avgTemp = (weather.morning.temperature + weather.afternoon.temperature) / 2;
    if (avgTemp < 10) {
      parts.push('冷え込みに備えて');
      if (outfit.outerwear) {
        parts.push(`${outfit.outerwear.subCategory}で防寒`);
      }
    } else if (avgTemp > 25) {
      parts.push('暑さ対策を重視');
    }

    // Temperature difference
    if (weather.temperatureDifference >= 10) {
      parts.push('寒暖差が大きい日');
    }

    // Schedule-related reason
    if (schedule.primaryEventType === 'business_meeting') {
      parts.push('商談向けにフォーマルめに');
    } else if (schedule.primaryEventType === 'presentation') {
      parts.push('プレゼンに好印象な組み合わせ');
    } else if (schedule.primaryEventType === 'dinner') {
      parts.push('会食にふさわしい装い');
    } else if (schedule.primaryEventType === 'remote_work') {
      parts.push('リモートワークで快適に');
    }

    // Impression preset
    if (impressionPreset) {
      const impressionText: Record<ImpressionPreset, string> = {
        trustworthy: '信頼感を演出',
        approachable: '親しみやすさ重視',
        professional: 'プロフェッショナルな印象',
        creative: 'クリエイティブな雰囲気',
        casual: 'リラックス感を大切に',
        elegant: 'エレガントに決めて',
        energetic: 'エネルギッシュな印象',
      };
      parts.push(impressionText[impressionPreset]);
    }

    return parts.length > 0
      ? parts.join('、') + '。'
      : 'バランスの取れた組み合わせです。';
  }

  private generateTags(
    outfit: Outfit,
    weather: DailyWeather,
    schedule: DailySchedule
  ): string[] {
    const tags: string[] = [];

    // Weather tags
    if (weather.afternoon.precipitation >= 50) {
      tags.push('雨対策');
    }
    if (weather.temperatureDifference >= 10) {
      tags.push('寒暖差対応');
    }

    // Formality tags
    const avgFormality = (outfit.top.formality + outfit.bottom.formality) / 2;
    if (avgFormality >= 4) {
      tags.push('フォーマル');
    } else if (avgFormality <= 2) {
      tags.push('カジュアル');
    } else {
      tags.push('ビジネスカジュアル');
    }

    // Event tags
    if (requiresExtraFormality(schedule.primaryEventType)) {
      tags.push('大事な予定');
    }

    return tags;
  }

  private checkEveningNotification(
    weather: DailyWeather,
    wardrobe: Wardrobe
  ): EveningNotification | undefined {
    // Check for significant temperature drop
    if (weather.temperatureDifference >= 10) {
      const suggestedItems: ClothingItem[] = [];

      // Find stoles or light outerwear
      const stoles = wardrobe.getItemsBySubCategory('stole');
      const cardigans = wardrobe.getItemsBySubCategory('cardigan_outer');

      suggestedItems.push(...stoles.slice(0, 1));
      suggestedItems.push(...cardigans.slice(0, 1));

      if (suggestedItems.length > 0) {
        return {
          message: '夕方から冷え込みます。羽織りものをお忘れなく！',
          suggestedItems,
          reason: `今日の寒暖差は${weather.temperatureDifference}度。夕方以降は${weather.evening.temperature}度まで下がる予報です。`,
        };
      }
    }

    // Check for evening rain
    if (
      weather.evening.precipitation >= 50 &&
      weather.afternoon.precipitation < 50
    ) {
      return {
        message: '夕方から雨予報。折りたたみ傘をお忘れなく！',
        suggestedItems: [],
        reason: `${weather.evening.precipitation}%の確率で雨が降る予報です。`,
      };
    }

    return undefined;
  }

  getScorer(): OutfitScorer {
    return this.scorer;
  }
}
