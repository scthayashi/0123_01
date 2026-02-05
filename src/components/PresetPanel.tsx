import { ImpressionPreset, ImpressionConfig } from '../types';

interface PresetPanelProps {
  selectedPreset: ImpressionPreset | undefined;
  onSelectPreset: (preset: ImpressionPreset | undefined) => void;
  onGetRecommendation: () => void;
  isLoading: boolean;
  hasItems: boolean;
}

const PRESETS: { preset: ImpressionPreset; displayName: string; description: string; icon: string }[] = [
  {
    preset: 'trustworthy',
    displayName: '信頼感MAX（勝負服）',
    description: '大事な商談やプレゼンに最適',
    icon: '💼',
  },
  {
    preset: 'approachable',
    displayName: '親しみやすさ（後輩指導）',
    description: 'メンタリングや1on1に最適',
    icon: '🤝',
  },
  {
    preset: 'professional',
    displayName: 'プロフェッショナル',
    description: '標準的なビジネスシーン向け',
    icon: '👔',
  },
  {
    preset: 'creative',
    displayName: 'クリエイティブ',
    description: 'デザインやマーケティング向け',
    icon: '🎨',
  },
  {
    preset: 'casual',
    displayName: 'カジュアル',
    description: 'リモートワークや休日向け',
    icon: '😊',
  },
  {
    preset: 'elegant',
    displayName: 'エレガント',
    description: 'ディナーや会食向け',
    icon: '✨',
  },
  {
    preset: 'energetic',
    displayName: 'エネルギッシュ',
    description: 'アクティブな営業活動向け',
    icon: '⚡',
  },
];

export default function PresetPanel({
  selectedPreset,
  onSelectPreset,
  onGetRecommendation,
  isLoading,
  hasItems,
}: PresetPanelProps) {
  return (
    <div>
      <h2 style={{ marginBottom: 8 }}>印象プリセット</h2>
      <p style={{ color: '#666', marginBottom: 20 }}>
        今日の役割に応じた印象を選択できます。選択しなくても提案は受けられます。
      </p>

      <div className="preset-grid">
        {PRESETS.map(p => (
          <div
            key={p.preset}
            className={`preset-card ${selectedPreset === p.preset ? 'selected' : ''}`}
            onClick={() => onSelectPreset(selectedPreset === p.preset ? undefined : p.preset)}
          >
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>{p.icon}</div>
            <div className="preset-name">{p.displayName}</div>
            <div className="preset-description">{p.description}</div>
            {selectedPreset === p.preset && (
              <div style={{ marginTop: 8, color: '#667eea', fontWeight: 500 }}>
                ✓ 選択中
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <button
          className="btn btn-primary"
          onClick={onGetRecommendation}
          disabled={isLoading || !hasItems}
          style={{ padding: '16px 48px', fontSize: '1.1rem' }}
        >
          {isLoading ? '生成中...' : '🎯 この設定で提案を見る'}
        </button>
        {!hasItems && (
          <p style={{ marginTop: 12, color: '#e65100', fontSize: '0.9rem' }}>
            ※ まずクローゼットにアイテムを追加してください
          </p>
        )}
      </div>
    </div>
  );
}
