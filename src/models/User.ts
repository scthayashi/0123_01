import { v4 as uuidv4 } from 'uuid';
import {
  UserPreferences,
  OutfitFeedback,
  Color,
  Formality,
  TransportMethod,
  ImpressionPreset,
} from '../types';
import { Wardrobe } from './Wardrobe';

export class User {
  private id: string;
  private preferences: UserPreferences;
  private feedbackHistory: OutfitFeedback[] = [];
  private wardrobe: Wardrobe;
  private learningData: LearningData;

  constructor(id?: string) {
    this.id = id || uuidv4();
    this.preferences = this.getDefaultPreferences();
    this.wardrobe = new Wardrobe(this.id);
    this.learningData = new LearningData();
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      userId: this.id,
      temperatureSensitivity: 'normal',
      defaultFormality: 3,
      favoriteColors: [],
      avoidColors: [],
      preferredBrands: [],
      commuteMethod: 'train',
    };
  }

  getId(): string {
    return this.id;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<Omit<UserPreferences, 'userId'>>): void {
    this.preferences = {
      ...this.preferences,
      ...updates,
    };
  }

  setTemperatureSensitivity(sensitivity: UserPreferences['temperatureSensitivity']): void {
    this.preferences.temperatureSensitivity = sensitivity;
  }

  setDefaultFormality(formality: Formality): void {
    this.preferences.defaultFormality = formality;
  }

  addFavoriteColor(color: Color): void {
    if (!this.preferences.favoriteColors.includes(color)) {
      this.preferences.favoriteColors.push(color);
    }
  }

  addAvoidColor(color: Color): void {
    if (!this.preferences.avoidColors.includes(color)) {
      this.preferences.avoidColors.push(color);
    }
  }

  setCommuteMethod(method: TransportMethod): void {
    this.preferences.commuteMethod = method;
  }

  getWardrobe(): Wardrobe {
    return this.wardrobe;
  }

  setWardrobe(wardrobe: Wardrobe): void {
    this.wardrobe = wardrobe;
  }

  addFeedback(feedback: Omit<OutfitFeedback, 'id'>): OutfitFeedback {
    const newFeedback: OutfitFeedback = {
      ...feedback,
      id: uuidv4(),
    };
    this.feedbackHistory.push(newFeedback);
    this.learningData.processNewFeedback(newFeedback);
    return newFeedback;
  }

  getFeedbackHistory(): OutfitFeedback[] {
    return [...this.feedbackHistory];
  }

  getRecentFeedback(days: number = 30): OutfitFeedback[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return this.feedbackHistory.filter(fb => fb.date >= cutoff);
  }

  getLearningData(): LearningData {
    return this.learningData;
  }

  getTemperatureAdjustment(): number {
    return this.learningData.getTemperatureAdjustment();
  }

  toJSON(): object {
    return {
      id: this.id,
      preferences: this.preferences,
      feedbackHistory: this.feedbackHistory,
      wardrobe: this.wardrobe.toJSON(),
      learningData: this.learningData.toJSON(),
    };
  }

  static fromJSON(data: any): User {
    const user = new User(data.id);
    user.preferences = data.preferences;
    user.feedbackHistory = data.feedbackHistory || [];
    user.wardrobe = Wardrobe.fromJSON(data.wardrobe);
    if (data.learningData) {
      user.learningData = LearningData.fromJSON(data.learningData);
    }
    return user;
  }
}

export class LearningData {
  private temperatureAdjustments: number[] = [];
  private formalityPreferenceByEvent: Map<string, number[]> = new Map();
  private colorPreferenceScores: Map<Color, number> = new Map();
  private impressionSuccessRates: Map<ImpressionPreset, number[]> = new Map();

  processNewFeedback(feedback: OutfitFeedback): void {
    if (feedback.comfortFeedback) {
      const adjustment = this.calculateTemperatureAdjustment(feedback.comfortFeedback);
      this.temperatureAdjustments.push(adjustment);

      // Keep only last 30 feedback entries
      if (this.temperatureAdjustments.length > 30) {
        this.temperatureAdjustments.shift();
      }
    }
  }

  private calculateTemperatureAdjustment(comfort: 'too_hot' | 'comfortable' | 'too_cold'): number {
    switch (comfort) {
      case 'too_hot':
        return -1; // User runs hot, suggest lighter clothes
      case 'too_cold':
        return 1;  // User runs cold, suggest warmer clothes
      case 'comfortable':
        return 0;
    }
  }

  getTemperatureAdjustment(): number {
    if (this.temperatureAdjustments.length === 0) {
      return 0;
    }

    // Weight recent feedback more heavily
    const weights = this.temperatureAdjustments.map((_, i) => i + 1);
    const weightedSum = this.temperatureAdjustments.reduce(
      (sum, adj, i) => sum + adj * weights[i],
      0
    );
    const totalWeight = weights.reduce((a, b) => a + b, 0);

    return weightedSum / totalWeight;
  }

  updateColorPreference(color: Color, positive: boolean): void {
    const current = this.colorPreferenceScores.get(color) || 0;
    this.colorPreferenceScores.set(color, current + (positive ? 1 : -1));
  }

  getColorScore(color: Color): number {
    return this.colorPreferenceScores.get(color) || 0;
  }

  recordImpressionSuccess(preset: ImpressionPreset, success: boolean): void {
    const rates = this.impressionSuccessRates.get(preset) || [];
    rates.push(success ? 1 : 0);
    if (rates.length > 10) {
      rates.shift();
    }
    this.impressionSuccessRates.set(preset, rates);
  }

  getImpressionSuccessRate(preset: ImpressionPreset): number {
    const rates = this.impressionSuccessRates.get(preset) || [];
    if (rates.length === 0) return 0.5;
    return rates.reduce((a, b) => a + b, 0) / rates.length;
  }

  toJSON(): object {
    return {
      temperatureAdjustments: this.temperatureAdjustments,
      formalityPreferenceByEvent: Object.fromEntries(this.formalityPreferenceByEvent),
      colorPreferenceScores: Object.fromEntries(this.colorPreferenceScores),
      impressionSuccessRates: Object.fromEntries(this.impressionSuccessRates),
    };
  }

  static fromJSON(data: any): LearningData {
    const learning = new LearningData();
    learning.temperatureAdjustments = data.temperatureAdjustments || [];
    learning.formalityPreferenceByEvent = new Map(Object.entries(data.formalityPreferenceByEvent || {}));
    learning.colorPreferenceScores = new Map(Object.entries(data.colorPreferenceScores || {})) as Map<Color, number>;
    learning.impressionSuccessRates = new Map(Object.entries(data.impressionSuccessRates || {})) as Map<ImpressionPreset, number[]>;
    return learning;
  }
}
