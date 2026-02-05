import { useState } from 'react';
import { User } from '../models/User';

interface FeedbackPanelProps {
  confirmedOutfitId: string | null;
  onFeedback: (type: 'wore' | 'did_not_wear', comfort?: 'too_hot' | 'comfortable' | 'too_cold') => void;
  user: User | null;
}

export default function FeedbackPanel({
  confirmedOutfitId,
  onFeedback,
  user,
}: FeedbackPanelProps) {
  const [wearFeedback, setWearFeedback] = useState<'wore' | 'did_not_wear' | null>(null);
  const [comfortFeedback, setComfortFeedback] = useState<'too_hot' | 'comfortable' | 'too_cold' | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!wearFeedback) return;
    onFeedback(wearFeedback, comfortFeedback || undefined);
    setSubmitted(true);
  };

  if (!confirmedOutfitId) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📝</div>
        <p>まだ確定したコーディネートがありません。</p>
        <p style={{ marginTop: 8, color: '#666' }}>
          提案を確定してから、<br />
          帰宅後にフィードバックを送信してください。
        </p>
      </div>
    );
  }

  if (submitted) {
    const learningData = user?.getLearningData();
    const tempAdj = learningData?.getTemperatureAdjustment() || 0;

    return (
      <div>
        <div className="success-message" style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎉</div>
          <h3>フィードバックを送信しました！</h3>
          <p style={{ marginTop: 8 }}>明日の提案に反映されます。</p>
        </div>

        {user && (
          <div style={{ marginTop: 24 }}>
            <h3 style={{ marginBottom: 16 }}>📊 学習データ</h3>
            <div style={{
              background: '#f8f8f8',
              padding: 20,
              borderRadius: 12,
            }}>
              <div style={{ marginBottom: 12 }}>
                <strong>フィードバック数:</strong> {user.getFeedbackHistory().length}件
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>体感温度調整:</strong>{' '}
                {tempAdj > 0.3 ? '寒がり傾向（暖かめを提案）' :
                 tempAdj < -0.3 ? '暑がり傾向（涼しめを提案）' :
                 '標準'}
              </div>
              <p style={{ fontSize: '0.9rem', color: '#666', marginTop: 16 }}>
                フィードバックを重ねることで、あなた専用の提案精度が向上します。
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: 8 }}>今日のフィードバック</h2>
      <p style={{ color: '#666', marginBottom: 24 }}>
        2タップで簡単フィードバック。明日の提案精度が向上します。
      </p>

      <div style={{ marginBottom: 32 }}>
        <h3 style={{ marginBottom: 16 }}>👕 着用しましたか？</h3>
        <div className="feedback-buttons">
          <button
            className={`feedback-btn ${wearFeedback === 'wore' ? 'selected' : ''}`}
            onClick={() => setWearFeedback('wore')}
          >
            <span className="feedback-icon">✓</span>
            <span>着た</span>
          </button>
          <button
            className={`feedback-btn ${wearFeedback === 'did_not_wear' ? 'selected' : ''}`}
            onClick={() => setWearFeedback('did_not_wear')}
          >
            <span className="feedback-icon">✕</span>
            <span>着なかった</span>
          </button>
        </div>
      </div>

      {wearFeedback === 'wore' && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ marginBottom: 16 }}>🌡️ 体感はどうでしたか？</h3>
          <div className="feedback-buttons">
            <button
              className={`feedback-btn ${comfortFeedback === 'too_hot' ? 'selected' : ''}`}
              onClick={() => setComfortFeedback('too_hot')}
            >
              <span className="feedback-icon">🥵</span>
              <span>暑かった</span>
            </button>
            <button
              className={`feedback-btn ${comfortFeedback === 'comfortable' ? 'selected' : ''}`}
              onClick={() => setComfortFeedback('comfortable')}
            >
              <span className="feedback-icon">😊</span>
              <span>ちょうど良い</span>
            </button>
            <button
              className={`feedback-btn ${comfortFeedback === 'too_cold' ? 'selected' : ''}`}
              onClick={() => setComfortFeedback('too_cold')}
            >
              <span className="feedback-icon">🥶</span>
              <span>寒かった</span>
            </button>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!wearFeedback}
          style={{ padding: '16px 48px', fontSize: '1.1rem' }}
        >
          📤 フィードバックを送信
        </button>
      </div>
    </div>
  );
}
