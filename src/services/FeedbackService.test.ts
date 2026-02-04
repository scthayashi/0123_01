import { FeedbackService } from './FeedbackService';
import { User } from '../models/User';

describe('FeedbackService', () => {
  let feedbackService: FeedbackService;
  let user: User;

  beforeEach(() => {
    feedbackService = new FeedbackService();
    user = new User('test-user');
  });

  describe('submitQuickFeedback', () => {
    it('should record wear feedback successfully', () => {
      const result = feedbackService.submitQuickFeedback(user, 'outfit-1', {
        wearFeedback: 'wore',
      });

      expect(result.success).toBe(true);
      expect(result.message).toBeTruthy();
    });

    it('should record comfort feedback and adjust temperature preference', () => {
      // Submit "too cold" feedback multiple times
      for (let i = 0; i < 5; i++) {
        feedbackService.submitQuickFeedback(user, `outfit-${i}`, {
          wearFeedback: 'wore',
          comfortFeedback: 'too_cold',
        });
      }

      const insights = feedbackService.getLearningInsights(user);
      expect(insights.temperatureAdjustment).toBeGreaterThan(0);
      expect(insights.temperatureTendency).toBe('寒がり傾向');
    });

    it('should record comfort feedback for heat sensitivity', () => {
      // Submit "too hot" feedback multiple times
      for (let i = 0; i < 5; i++) {
        feedbackService.submitQuickFeedback(user, `outfit-${i}`, {
          wearFeedback: 'wore',
          comfortFeedback: 'too_hot',
        });
      }

      const insights = feedbackService.getLearningInsights(user);
      expect(insights.temperatureAdjustment).toBeLessThan(0);
      expect(insights.temperatureTendency).toBe('暑がり傾向');
    });
  });

  describe('submitWearFeedback', () => {
    it('should record when user wore the outfit', () => {
      const result = feedbackService.submitWearFeedback(user, 'outfit-1', true);

      expect(result.success).toBe(true);

      const history = feedbackService.getFeedbackHistory(user);
      expect(history.length).toBe(1);
      expect(history[0].wearFeedback).toBe('wore');
    });

    it('should record when user did not wear the outfit', () => {
      const result = feedbackService.submitWearFeedback(user, 'outfit-1', false);

      expect(result.success).toBe(true);
      expect(result.learningImpact).toContain('頻度');

      const history = feedbackService.getFeedbackHistory(user);
      expect(history[0].wearFeedback).toBe('did_not_wear');
    });
  });

  describe('submitComfortFeedback', () => {
    it('should record comfortable feedback', () => {
      const result = feedbackService.submitComfortFeedback(
        user,
        'outfit-1',
        'comfortable'
      );

      expect(result.success).toBe(true);
      expect(result.learningImpact).toContain('学習');
    });

    it('should record too hot feedback', () => {
      const result = feedbackService.submitComfortFeedback(
        user,
        'outfit-1',
        'too_hot'
      );

      expect(result.success).toBe(true);
      expect(result.learningImpact).toContain('涼しめ');
    });

    it('should record too cold feedback', () => {
      const result = feedbackService.submitComfortFeedback(
        user,
        'outfit-1',
        'too_cold'
      );

      expect(result.success).toBe(true);
      expect(result.learningImpact).toContain('暖かめ');
    });
  });

  describe('submitImpressionFeedback', () => {
    it('should record successful impression', () => {
      const result = feedbackService.submitImpressionFeedback(
        user,
        'trustworthy',
        true
      );

      expect(result.success).toBe(true);
      expect(result.learningImpact).toContain('成功率');
    });

    it('should track impression success rate over time', () => {
      // Submit mixed results
      feedbackService.submitImpressionFeedback(user, 'trustworthy', true);
      feedbackService.submitImpressionFeedback(user, 'trustworthy', true);
      feedbackService.submitImpressionFeedback(user, 'trustworthy', false);

      const learningData = user.getLearningData();
      const successRate = learningData.getImpressionSuccessRate('trustworthy');

      // Should be around 66%
      expect(successRate).toBeGreaterThan(0.6);
      expect(successRate).toBeLessThan(0.7);
    });
  });

  describe('getLearningInsights', () => {
    it('should return insights with no feedback', () => {
      const insights = feedbackService.getLearningInsights(user);

      expect(insights.totalFeedback).toBe(0);
      expect(insights.wearRate).toBe(0);
      expect(insights.temperatureAdjustment).toBe(0);
      expect(insights.temperatureTendency).toBe('標準');
    });

    it('should calculate wear rate correctly', () => {
      feedbackService.submitWearFeedback(user, 'outfit-1', true);
      feedbackService.submitWearFeedback(user, 'outfit-2', true);
      feedbackService.submitWearFeedback(user, 'outfit-3', false);
      feedbackService.submitWearFeedback(user, 'outfit-4', true);

      const insights = feedbackService.getLearningInsights(user);

      expect(insights.totalFeedback).toBe(4);
      expect(insights.wearRate).toBe(0.75);
    });

    it('should generate insights for frequent cold feedback', () => {
      for (let i = 0; i < 5; i++) {
        feedbackService.submitComfortFeedback(user, `outfit-${i}`, 'too_cold');
      }

      const insights = feedbackService.getLearningInsights(user);

      expect(insights.insights.some(i => i.includes('寒い'))).toBe(true);
    });
  });
});
