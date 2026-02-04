// Outfit Recommendation System
// 「朝、1分で"正解"が決まる。迷いも、妥協も、場違いもゼロ。」

export * from './types';
export * from './models';
export * from './providers';
export * from './engine';
export * from './services';

import { User } from './models/User';
import { WeatherProvider } from './providers/WeatherProvider';
import { CalendarProvider } from './providers/CalendarProvider';
import { OutfitRecommendationService } from './services/OutfitRecommendationService';
import { FeedbackService } from './services/FeedbackService';
import { WardrobeRegistrationService } from './services/WardrobeRegistrationService';
import { ImpressionPreset } from './types';

/**
 * OutfitRecommendationApp - メインアプリケーションクラス
 * 全機能を統合したシンプルなインターフェース
 */
export class OutfitRecommendationApp {
  private user: User;
  private recommendationService: OutfitRecommendationService;
  private feedbackService: FeedbackService;
  private wardrobeService: WardrobeRegistrationService;

  constructor(
    user: User,
    location: { lat: number; lon: number } = { lat: 35.6762, lon: 139.6503 } // Tokyo
  ) {
    this.user = user;

    const weatherProvider = new WeatherProvider(location);
    const calendarProvider = new CalendarProvider(user.getPreferences().commuteMethod);

    this.recommendationService = new OutfitRecommendationService(
      weatherProvider,
      calendarProvider
    );
    this.feedbackService = new FeedbackService();
    this.wardrobeService = new WardrobeRegistrationService();
  }

  // ========================================
  // P0: 意思決定の完全自動化
  // ========================================

  /**
   * 今日のコーディネートを1分で提案
   * @param impressionPreset オプションの印象プリセット
   */
  async getQuickRecommendation(impressionPreset?: ImpressionPreset) {
    return this.recommendationService.getQuickRecommendation(
      this.user,
      new Date(),
      impressionPreset
    );
  }

  /**
   * 提案の1行サマリーを取得
   * 例: 「今日は午後から雨＋商談なので、撥水靴とジャケット」
   */
  getRecommendationSummary(): string {
    return this.recommendationService.getRecommendationSummary();
  }

  /**
   * 「このまま行く」- ワンタップ確定
   */
  confirmOutfit(outfitId?: string) {
    return this.recommendationService.confirmSelection(this.user, outfitId);
  }

  /**
   * 代替案を選択 (スワイプで最大3案)
   * @param index 0-2の代替案インデックス
   */
  selectAlternative(index: number) {
    return this.recommendationService.selectAlternative(index);
  }

  /**
   * 代替案一覧を取得
   */
  getAlternatives() {
    return this.recommendationService.getAlternatives();
  }

  // ========================================
  // P1: 継続的なパーソナライズ
  // ========================================

  /**
   * クイックフィードバック - 「着た/着ない」
   */
  feedbackWore(outfitId: string, wore: boolean) {
    return this.feedbackService.submitWearFeedback(this.user, outfitId, wore);
  }

  /**
   * クイックフィードバック - 「暑かった/寒かった」
   */
  feedbackComfort(outfitId: string, comfort: 'too_hot' | 'comfortable' | 'too_cold') {
    return this.feedbackService.submitComfortFeedback(this.user, outfitId, comfort);
  }

  /**
   * 印象プリセット一覧を取得
   * 例: 「信頼感MAX（勝負服）」「親しみやすさ（後輩指導）」
   */
  getImpressionPresets() {
    return this.recommendationService.getAvailableImpressionPresets();
  }

  /**
   * 夕方の寒暖差通知を取得
   * 例: 「夕方用にストールか羽織りを」
   */
  getEveningNotification(): string | null {
    return this.recommendationService.getEveningNotification();
  }

  /**
   * 学習データのインサイトを取得
   */
  getLearningInsights() {
    return this.feedbackService.getLearningInsights(this.user);
  }

  // ========================================
  // P2: 導入ハードルの撤廃
  // ========================================

  /**
   * ECサイトの購入履歴から自動登録
   */
  async importFromEC(platformName: string, accessToken: string) {
    return this.wardrobeService.importFromECPlatform(
      this.user.getWardrobe(),
      platformName,
      accessToken
    );
  }

  /**
   * レシート写真をスキャン
   */
  async scanReceipt(imageData: string | Buffer) {
    return this.wardrobeService.scanReceipt(imageData);
  }

  /**
   * 簡単登録 - 最小限の情報で登録
   */
  quickRegisterItem(
    name: string,
    category: Parameters<typeof this.wardrobeService.quickRegister>[2],
    subCategory: Parameters<typeof this.wardrobeService.quickRegister>[3],
    color: Parameters<typeof this.wardrobeService.quickRegister>[4]
  ) {
    return this.wardrobeService.quickRegister(
      this.user.getWardrobe(),
      name,
      category,
      subCategory,
      color
    );
  }

  /**
   * サポートされているECプラットフォーム一覧
   */
  getSupportedECPlatforms() {
    return this.wardrobeService.getSupportedPlatforms();
  }

  // ========================================
  // ユーティリティ
  // ========================================

  /**
   * ユーザー情報を取得
   */
  getUser(): User {
    return this.user;
  }

  /**
   * クローゼットのアイテム数を取得
   */
  getWardrobeItemCount(): number {
    return this.user.getWardrobe().getItemCount();
  }

  /**
   * 提案の詳細を整形して取得
   */
  formatRecommendationDetails(): string {
    return this.recommendationService.formatRecommendationDetails();
  }
}

// デフォルトエクスポート
export default OutfitRecommendationApp;
