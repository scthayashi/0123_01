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

const getColorLabel = (color: Color): string => {
  const labels: Record<Color, string> = {
    black: '黒',
    white: '白',
    gray: 'グレー',
    navy: 'ネイビー',
    blue: 'ブルー',
    light_blue: 'ライトブルー',
    beige: 'ベージュ',
    brown: 'ブラウン',
    cream: 'クリーム',
    charcoal: 'チャコール',
    burgundy: 'バーガンディ',
    olive: 'オリーブ',
    camel: 'キャメル',
    red: '赤',
    pink: 'ピンク',
    green: '緑',
  };
  return labels[color] || color;
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
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🤔</div>
        <p>最適なコーディネートを考え中...</p>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <p>まだ提案がありません。</p>
        <p style={{ marginTop: 8, color: '#666' }}>
          クローゼットにアイテムを追加して、<br />
          「提案を見る」ボタンを押してください。
        </p>
      </div>
    );
  }

  const { primary, alternatives, eveningNotification } = recommendation;
  const outfit = primary.outfit;
  const isConfirmed = confirmedOutfitId === outfit.id;

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>今日のコーディネート提案</h2>

      <div className="recommendation-card">
        <div className="recommendation-reason">
          📍 {primary.reason}
        </div>

        <div className="outfit-items">
          <div className="outfit-item">
            <div className="outfit-item-icon">{getCategoryIcon('tops')}</div>
            <div className="outfit-item-name">{outfit.top.name}</div>
            <div className="outfit-item-color">{getColorLabel(outfit.top.color)}</div>
          </div>

          <div className="outfit-item">
            <div className="outfit-item-icon">{getCategoryIcon('bottoms')}</div>
            <div className="outfit-item-name">{outfit.bottom.name}</div>
            <div className="outfit-item-color">{getColorLabel(outfit.bottom.color)}</div>
          </div>

          {outfit.outerwear && (
            <div className="outfit-item">
              <div className="outfit-item-icon">{getCategoryIcon('outerwear')}</div>
              <div className="outfit-item-name">{outfit.outerwear.name}</div>
              <div className="outfit-item-color">{getColorLabel(outfit.outerwear.color)}</div>
            </div>
          )}

          <div className="outfit-item">
            <div className="outfit-item-icon">{getCategoryIcon('shoes')}</div>
            <div className="outfit-item-name">{outfit.shoes.name}</div>
            <div className="outfit-item-color">{getColorLabel(outfit.shoes.color)}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="score-badge">⭐ {Math.round(primary.score)}点</span>
          {primary.tags.length > 0 && (
            <span style={{ color: '#666' }}>
              🏷️ {primary.tags.join(', ')}
            </span>
          )}
        </div>

        {eveningNotification && (
          <div style={{
            marginTop: 16,
            padding: 12,
            background: '#fff3e0',
            borderRadius: 8,
            color: '#e65100',
          }}>
            ⚠️ {eveningNotification.message}
          </div>
        )}

        <div className="action-buttons">
          {isConfirmed ? (
            <button className="btn btn-success" disabled>
              ✓ 確定済み
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => onConfirm(outfit.id)}
            >
              ✓ このまま行く
            </button>
          )}
        </div>
      </div>

      {alternatives.length > 0 && (
        <div className="alternatives">
          <h3>📦 代替案 ({alternatives.length}件)</h3>
          <div className="alternative-cards">
            {alternatives.map((alt, index) => (
              <div
                key={alt.outfit.id}
                className="alternative-card"
                onClick={() => onSelectAlternative(alt)}
              >
                <div style={{ fontWeight: 600, marginBottom: 8 }}>
                  代替案 {index + 1}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: 8 }}>
                  {alt.outfit.top.name} + {alt.outfit.bottom.name}
                </div>
                <div className="score-badge" style={{ fontSize: '0.85rem', padding: '4px 12px' }}>
                  {Math.round(alt.score)}点
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
