import { v4 as uuidv4 } from 'uuid';
import {
  DailyRecommendation,
  OutfitRecommendation,
  ImpressionPreset,
  WearFeedback,
  ComfortFeedback,
  OutfitFeedback,
} from '../types';
import { User } from '../models/User';
import { RecommendationEngine } from '../engine/RecommendationEngine';
import { WeatherProvider } from '../providers/WeatherProvider';
import { CalendarProvider } from '../providers/CalendarProvider';

export interface ConfirmationResult {
  success: boolean;
  outfitId: string;
  message: string;
}

export interface AlternativeSelectionResult {
  success: boolean;
  selectedOutfit: OutfitRecommendation;
  message: string;
}

export class OutfitRecommendationService {
  private engine: RecommendationEngine;
  private weatherProvider: WeatherProvider;
  private calendarProvider: CalendarProvider;
  private currentRecommendation: DailyRecommendation | null = null;
  private selectedOutfitId: string | null = null;

  constructor(
    weatherProvider: WeatherProvider,
    calendarProvider: CalendarProvider
  ) {
    this.engine = new RecommendationEngine();
    this.weatherProvider = weatherProvider;
    this.calendarProvider = calendarProvider;
  }

  /**
   * メインの提案取得 - 朝1分で正解が決まるフロー
   * 最適な1案を提示し、理由を1行で明示
   */
  async getQuickRecommendation(
    user: User,
    date: Date = new Date(),
    impressionPreset?: ImpressionPreset
  ): Promise<DailyRecommendation> {
    // 自動条件取り込み
    const [weather, schedule] = await Promise.all([
      this.weatherProvider.getDailyForecast(date),
      this.calendarProvider.getDailySchedule(date),
    ]);

    // 最適な提案を生成
    const recommendation = await this.engine.generateDailyRecommendation(
      user,
      weather,
      schedule,
      {
        impressionPreset,
        excludeRecentlyWorn: true,
        prioritizeComfort: false,
      }
    );

    this.currentRecommendation = recommendation;
    return recommendation;
  }

  /**
   * ワンタップ確定 - 「このまま行く」で終了
   */
  confirmSelection(user: User, outfitId?: string): ConfirmationResult {
    if (!this.currentRecommendation) {
      return {
        success: false,
        outfitId: '',
        message: 'まずレコメンデーションを取得してください。',
      };
    }

    const id = outfitId || this.currentRecommendation.primary.outfit.id;
    this.selectedOutfitId = id;

    // 着用を記録
    const wardrobe = user.getWardrobe();
    const outfit =
      outfitId === this.currentRecommendation.primary.outfit.id
        ? this.currentRecommendation.primary.outfit
        : this.currentRecommendation.alternatives.find(a => a.outfit.id === outfitId)?.outfit;

    if (outfit) {
      wardrobe.recordWear(outfit.top.id);
      wardrobe.recordWear(outfit.bottom.id);
      wardrobe.recordWear(outfit.shoes.id);
      if (outfit.outerwear) {
        wardrobe.recordWear(outfit.outerwear.id);
      }
    }

    return {
      success: true,
      outfitId: id,
      message: '今日のコーディネートを確定しました。行ってらっしゃい！',
    };
  }

  /**
   * 代替案を選択 - スワイプで最大3案まで
   */
  selectAlternative(alternativeIndex: number): AlternativeSelectionResult {
    if (!this.currentRecommendation) {
      return {
        success: false,
        selectedOutfit: {} as OutfitRecommendation,
        message: 'まずレコメンデーションを取得してください。',
      };
    }

    if (
      alternativeIndex < 0 ||
      alternativeIndex >= this.currentRecommendation.alternatives.length
    ) {
      return {
        success: false,
        selectedOutfit: {} as OutfitRecommendation,
        message: '無効な代替案インデックスです。',
      };
    }

    const selected = this.currentRecommendation.alternatives[alternativeIndex];

    return {
      success: true,
      selectedOutfit: selected,
      message: `代替案${alternativeIndex + 1}を選択しました。`,
    };
  }

  /**
   * プライマリ提案を取得
   */
  getPrimaryRecommendation(): OutfitRecommendation | null {
    return this.currentRecommendation?.primary || null;
  }

  /**
   * 代替案一覧を取得
   */
  getAlternatives(): OutfitRecommendation[] {
    return this.currentRecommendation?.alternatives || [];
  }

  /**
   * 夕方通知を取得（寒暖差対応）
   */
  getEveningNotification(): string | null {
    if (this.currentRecommendation?.eveningNotification) {
      return this.currentRecommendation.eveningNotification.message;
    }
    return null;
  }

  /**
   * 印象プリセットの一覧を取得
   */
  getAvailableImpressionPresets(): { preset: ImpressionPreset; displayName: string; description: string }[] {
    return this.engine.getScorer().getAllImpressionConfigs().map(config => ({
      preset: config.preset,
      displayName: config.displayName,
      description: config.description,
    }));
  }

  /**
   * 現在の提案のサマリーを取得（1行表示用）
   */
  getRecommendationSummary(): string {
    if (!this.currentRecommendation) {
      return '';
    }

    const primary = this.currentRecommendation.primary;
    return primary.reason;
  }

  /**
   * 提案の詳細を整形して取得
   */
  formatRecommendationDetails(): string {
    if (!this.currentRecommendation) {
      return '提案がありません。';
    }

    const rec = this.currentRecommendation;
    const primary = rec.primary;
    const outfit = primary.outfit;

    let details = `【今日のコーディネート提案】\n`;
    details += `━━━━━━━━━━━━━━━━━━━━\n`;
    details += `📍 ${rec.primary.reason}\n\n`;

    details += `👔 トップス: ${outfit.top.name} (${outfit.top.color})\n`;
    details += `👖 ボトムス: ${outfit.bottom.name} (${outfit.bottom.color})\n`;
    if (outfit.outerwear) {
      details += `🧥 アウター: ${outfit.outerwear.name} (${outfit.outerwear.color})\n`;
    }
    details += `👞 シューズ: ${outfit.shoes.name} (${outfit.shoes.color})\n\n`;

    details += `🏷️ タグ: ${primary.tags.join(', ')}\n`;
    details += `⭐ スコア: ${Math.round(primary.score)}点\n`;

    if (rec.eveningNotification) {
      details += `\n⚠️ ${rec.eveningNotification.message}\n`;
    }

    if (rec.alternatives.length > 0) {
      details += `\n📦 代替案: ${rec.alternatives.length}件（スワイプで表示）`;
    }

    return details;
  }

  getCurrentRecommendation(): DailyRecommendation | null {
    return this.currentRecommendation;
  }

  getSelectedOutfitId(): string | null {
    return this.selectedOutfitId;
  }
}
