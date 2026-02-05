import {
  DailyRecommendation,
  OutfitRecommendation,
  ClothingCategory,
  Color,
} from '../types';

interface RecommendationPanelProps {
  recommendation: DailyRecommendation | null;
  onConfirm: (outfitId: string) => void;
  onSelectAlternative: (alt: OutfitRecommendation) => void;
  confirmedOutfitId: string | null;
  isLoading: boolean;
}

const getCategoryIcon = (category: ClothingCategory): string => {
  const icons: Record<ClothingCategory, string> = {
    tops: '👔',
    bottoms: '👖',
    outerwear: '🧥',
    shoes: '👞',
    accessories: '⌚',
    bags: '👜',
  };
  return icons[category] || '👕';
};

const getColorInfo = (color: Color): { label: string; hex: string } => {
  const colors: Record<Color, { label: string; hex: string }> = {
    black: { label: '黒', hex: '#000000' },
    white: { label: '白', hex: '#ffffff' },
    gray: { label: 'グレー', hex: '#808080' },
    navy: { label: 'ネイビー', hex: '#000080' },
    blue: { label: 'ブルー', hex: '#0066cc' },
    light_blue: { label: 'ライトブルー', hex: '#87ceeb' },
    beige: { label: 'ベージュ', hex: '#f5f5dc' },
    brown: { label: 'ブラウン', hex: '#8b4513' },
    cream: { label: 'クリーム', hex: '#fffdd0' },
    charcoal: { label: 'チャコール', hex: '#36454f' },
    burgundy: { label: 'バーガンディ', hex: '#800020' },
    olive: { label: 'オリーブ', hex: '#808000' },
    camel: { label: 'キャメル', hex: '#c19a6b' },
    red: { label: '赤', hex: '#cc0000' },
    pink: { label: 'ピンク', hex: '#ffc0cb' },
    green: { label: '緑', hex: '#228b22' },
  };
  return colors[color] || { label: color, hex: '#808080' };
};

export default function RecommendationPanel({
  recommendation,
  onConfirm,
  onSelectAlternative,
  confirmedOutfitId,
  isLoading,
}: RecommendationPanelProps) {
  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>最適なコーディネートを考え中...</p>
        <p style={{ fontSize: '0.9rem', color: '#888', marginTop: 8 }}>
          天気・予定・あなたの好みを分析しています
        </p>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>まだ提案がありません</p>
        <p style={{ marginTop: 8, color: '#666' }}>
          クローゼットにアイテムを追加して、<br />
          「今日の提案を見る」ボタンを押してください。
        </p>
      </div>
    );
  }

  const { primary, alternatives, weather, eveningNotification } = recommendation;
  const outfit = primary.outfit;
  const isConfirmed = confirmedOutfitId === outfit.id;

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">今日のコーディネート</h2>
        {isConfirmed && (
          <span style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            padding: '6px 16px',
            borderRadius: 20,
            fontSize: '0.9rem',
            fontWeight: 600,
          }}>
            ✓ 確定済み
          </span>
        )}
      </div>

      {/* Weather Info */}
      <div className="weather-info">
        <div className="weather-item">
          <span className="weather-icon">🌡️</span>
          <span>
            {weather.lowTemp}°C 〜 {weather.highTemp}°C
            {weather.temperatureDifference >= 10 && (
              <span style={{ color: '#e65100', marginLeft: 8 }}>寒暖差大</span>
            )}
          </span>
        </div>
        <div className="weather-item">
          <span className="weather-icon">
            {weather.afternoon.precipitationType !== 'none' ? '🌧️' : '☀️'}
          </span>
          <span>
            {weather.afternoon.precipitationType === 'none' ? '晴れ' :
             weather.afternoon.precipitationType === 'rain' ? '雨' :
             weather.afternoon.precipitationType === 'snow' ? '雪' : '天気'}
            {weather.afternoon.precipitation > 0 && ` (${weather.afternoon.precipitation}%)`}
          </span>
        </div>
        <div className="weather-item">
          <span className="weather-icon">💨</span>
          <span>風速 {weather.afternoon.windSpeed}m/s</span>
        </div>
      </div>

      <div className="recommendation-card">
        <div className="recommendation-reason">
          💡 {primary.reason}
        </div>

        <div className="outfit-items">
          <div className="outfit-item">
            <div className="outfit-item-icon">{getCategoryIcon('tops')}</div>
            <div className="outfit-item-name">{outfit.top.name}</div>
            <div className="outfit-item-color">
              <span
                className="color-swatch"
                style={{ backgroundColor: getColorInfo(outfit.top.color).hex }}
              />
              {getColorInfo(outfit.top.color).label}
            </div>
          </div>

          <div className="outfit-item">
            <div className="outfit-item-icon">{getCategoryIcon('bottoms')}</div>
            <div className="outfit-item-name">{outfit.bottom.name}</div>
            <div className="outfit-item-color">
              <span
                className="color-swatch"
                style={{ backgroundColor: getColorInfo(outfit.bottom.color).hex }}
              />
              {getColorInfo(outfit.bottom.color).label}
            </div>
          </div>

          {outfit.outerwear && (
            <div className="outfit-item">
              <div className="outfit-item-icon">{getCategoryIcon('outerwear')}</div>
              <div className="outfit-item-name">{outfit.outerwear.name}</div>
              <div className="outfit-item-color">
                <span
                  className="color-swatch"
                  style={{ backgroundColor: getColorInfo(outfit.outerwear.color).hex }}
                />
                {getColorInfo(outfit.outerwear.color).label}
              </div>
            </div>
          )}

          <div className="outfit-item">
            <div className="outfit-item-icon">{getCategoryIcon('shoes')}</div>
            <div className="outfit-item-name">{outfit.shoes.name}</div>
            <div className="outfit-item-color">
              <span
                className="color-swatch"
                style={{ backgroundColor: getColorInfo(outfit.shoes.color).hex }}
              />
              {getColorInfo(outfit.shoes.color).label}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span className="score-badge">⭐ {Math.round(primary.score)}点</span>
          {primary.tags.length > 0 && (
            <div className="tag-list">
              {primary.tags.map((tag, i) => (
                <span key={i} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </div>

        {eveningNotification && (
          <div style={{
            marginTop: 20,
            padding: 16,
            background: 'linear-gradient(135deg, #fff7ed, #ffedd5)',
            borderRadius: 12,
            borderLeft: '4px solid #f59e0b',
          }}>
            <div style={{ fontWeight: 600, color: '#b45309', marginBottom: 4 }}>
              ⚠️ 夕方のお知らせ
            </div>
            <div style={{ color: '#92400e' }}>
              {eveningNotification.message}
            </div>
          </div>
        )}

        <div className="action-buttons">
          {isConfirmed ? (
            <button className="btn btn-success btn-lg" disabled>
              ✓ 確定済み - 行ってらっしゃい！
            </button>
          ) : (
            <button
              className="btn btn-primary btn-lg"
              onClick={() => onConfirm(outfit.id)}
            >
              ✓ このコーデで行く！
            </button>
          )}
        </div>
      </div>

      {alternatives.length > 0 && !isConfirmed && (
        <div className="alternatives">
          <h3>🔄 他の候補 ({alternatives.length}件)</h3>
          <div className="alternative-cards">
            {alternatives.map((alt, index) => (
              <div
                key={alt.outfit.id}
                className="alternative-card"
                onClick={() => onSelectAlternative(alt)}
              >
                <div style={{ fontWeight: 700, color: '#374151', marginBottom: 8 }}>
                  候補 {index + 1}
                </div>
                <div className="outfit-preview">
                  <span>{getCategoryIcon('tops')}</span>
                  <span>{getCategoryIcon('bottoms')}</span>
                  {alt.outfit.outerwear && <span>{getCategoryIcon('outerwear')}</span>}
                  <span>{getCategoryIcon('shoes')}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: 12 }}>
                  {alt.outfit.top.name} + {alt.outfit.bottom.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="score-badge" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                    {Math.round(alt.score)}点
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 16, fontSize: '0.9rem', color: '#6b7280', textAlign: 'center' }}>
            👆 カードをクリックすると、その候補をメインに切り替えられます
          </p>
        </div>
      )}
    </div>
  );
}
