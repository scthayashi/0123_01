import {
  WearFeedback,
  ComfortFeedback,
  OutfitFeedback,
  WeatherCondition,
  ImpressionPreset,
} from '../types';
import { User } from '../models/User';

export interface QuickFeedbackInput {
  wearFeedback: WearFeedback;
  comfortFeedback?: ComfortFeedback;
}

export interface FeedbackResult {
  success: boolean;
  message: string;
  learningImpact: string;
}

/**
 * クイックフィードバックサービス
 * 「着た/着ない」「暑かった/寒かった」を2タップで学習
 * 明日の提案精度が即座に向上
 */
export class FeedbackService {
  /**
   * クイックフィードバック - 2タップで学習
   */
  submitQuickFeedback(
    user: User,
    outfitId: string,
    feedback: QuickFeedbackInput,
    actualWeather?: WeatherCondition
  ): FeedbackResult {
    const feedbackEntry: Omit<OutfitFeedback, 'id'> = {
      date: new Date(),
      outfitId,
      wearFeedback: feedback.wearFeedback,
      comfortFeedback: feedback.comfortFeedback,
      actualWeather,
    };

    user.addFeedback(feedbackEntry);

    const learningImpact = this.describeLearningImpact(feedback);

    return {
      success: true,
      message: 'フィードバックを記録しました。',
      learningImpact,
    };
  }

  /**
   * 着用フィードバック - 着た/着ない
   */
  submitWearFeedback(
    user: User,
    outfitId: string,
    wore: boolean
  ): FeedbackResult {
    return this.submitQuickFeedback(user, outfitId, {
      wearFeedback: wore ? 'wore' : 'did_not_wear',
    });
  }

  /**
   * 快適さフィードバック - 暑かった/寒かった/ちょうど良い
   */
  submitComfortFeedback(
    user: User,
    outfitId: string,
    comfort: ComfortFeedback
  ): FeedbackResult {
    return this.submitQuickFeedback(user, outfitId, {
      wearFeedback: 'wore',
      comfortFeedback: comfort,
    });
  }

  /**
   * 印象プリセットの成功/失敗をフィードバック
   */
  submitImpressionFeedback(
    user: User,
    preset: ImpressionPreset,
    wasSuccessful: boolean
  ): FeedbackResult {
    const learningData = user.getLearningData();
    learningData.recordImpressionSuccess(preset, wasSuccessful);

    const successRate = learningData.getImpressionSuccessRate(preset);

    return {
      success: true,
      message: wasSuccessful
        ? 'この印象スタイルが成功しました！'
        : 'この印象スタイルは改善の余地があります。',
      learningImpact: `「${preset}」の成功率: ${Math.round(successRate * 100)}%`,
    };
  }

  /**
   * フィードバック履歴を取得
   */
  getFeedbackHistory(user: User, days: number = 30): OutfitFeedback[] {
    return user.getRecentFeedback(days);
  }

  /**
   * 学習データのサマリーを取得
   */
  getLearningInsights(user: User): LearningInsights {
    const feedbackHistory = user.getFeedbackHistory();
    const learningData = user.getLearningData();

    const totalFeedback = feedbackHistory.length;
    const wearRate = this.calculateWearRate(feedbackHistory);
    const temperatureAdjustment = learningData.getTemperatureAdjustment();

    return {
      totalFeedback,
      wearRate,
      temperatureAdjustment,
      temperatureTendency: this.getTemperatureTendency(temperatureAdjustment),
      insights: this.generateInsights(feedbackHistory, temperatureAdjustment),
    };
  }

  private describeLearningImpact(feedback: QuickFeedbackInput): string {
    const impacts: string[] = [];

    if (feedback.wearFeedback === 'did_not_wear') {
      impacts.push('この組み合わせの提案頻度を調整します');
    }

    if (feedback.comfortFeedback) {
      switch (feedback.comfortFeedback) {
        case 'too_hot':
          impacts.push('今後は涼しめの服を優先します');
          break;
        case 'too_cold':
          impacts.push('今後は暖かめの服を優先します');
          break;
        case 'comfortable':
          impacts.push('体感温度の基準を学習しました');
          break;
      }
    }

    return impacts.length > 0
      ? impacts.join('。') + '。'
      : '明日の提案に反映します。';
  }

  private calculateWearRate(feedbackHistory: OutfitFeedback[]): number {
    if (feedbackHistory.length === 0) return 0;

    const woreCount = feedbackHistory.filter(
      fb => fb.wearFeedback === 'wore'
    ).length;

    return woreCount / feedbackHistory.length;
  }

  private getTemperatureTendency(adjustment: number): string {
    if (adjustment > 0.3) {
      return '寒がり傾向';
    } else if (adjustment < -0.3) {
      return '暑がり傾向';
    }
    return '標準';
  }

  private generateInsights(
    feedbackHistory: OutfitFeedback[],
    temperatureAdjustment: number
  ): string[] {
    const insights: string[] = [];

    if (feedbackHistory.length >= 5) {
      const recentComfort = feedbackHistory
        .slice(-5)
        .filter(fb => fb.comfortFeedback);

      const tooHotCount = recentComfort.filter(
        fb => fb.comfortFeedback === 'too_hot'
      ).length;
      const tooColdCount = recentComfort.filter(
        fb => fb.comfortFeedback === 'too_cold'
      ).length;

      if (tooHotCount >= 3) {
        insights.push('最近暑いと感じることが多いようです。薄着を優先します。');
      }
      if (tooColdCount >= 3) {
        insights.push('最近寒いと感じることが多いようです。暖かい服を優先します。');
      }
    }

    if (temperatureAdjustment > 0.5) {
      insights.push('体感温度が低めなので、一般的な気温より暖かめの服を提案します。');
    } else if (temperatureAdjustment < -0.5) {
      insights.push('体感温度が高めなので、一般的な気温より涼しめの服を提案します。');
    }

    return insights;
  }
}

export interface LearningInsights {
  totalFeedback: number;
  wearRate: number;
  temperatureAdjustment: number;
  temperatureTendency: string;
  insights: string[];
}
