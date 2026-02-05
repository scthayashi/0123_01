import { useState } from 'react';
import { Wardrobe } from '../models/Wardrobe';
import {
  ClothingItem,
  ClothingCategory,
  ClothingSubCategory,
  Color,
  Formality,
} from '../types';

interface WardrobePanelProps {
  wardrobe: Wardrobe;
  onAddItem: (item: Omit<ClothingItem, 'id' | 'wearCount'>) => void;
  onLoadSampleData: () => void;
  onGetRecommendation: () => void;
  isLoading: boolean;
}

const CATEGORY_OPTIONS: { value: ClothingCategory; label: string; icon: string }[] = [
  { value: 'tops', label: 'トップス', icon: '👔' },
  { value: 'bottoms', label: 'ボトムス', icon: '👖' },
  { value: 'outerwear', label: 'アウター', icon: '🧥' },
  { value: 'shoes', label: '靴', icon: '👞' },
  { value: 'accessories', label: 'アクセサリー', icon: '⌚' },
  { value: 'bags', label: 'バッグ', icon: '👜' },
];

const SUBCATEGORY_OPTIONS: Record<ClothingCategory, { value: ClothingSubCategory; label: string }[]> = {
  tops: [
    { value: 'shirt', label: 'シャツ' },
    { value: 't-shirt', label: 'Tシャツ' },
    { value: 'blouse', label: 'ブラウス' },
    { value: 'sweater', label: 'セーター' },
    { value: 'cardigan', label: 'カーディガン' },
    { value: 'polo', label: 'ポロシャツ' },
  ],
  bottoms: [
    { value: 'dress_pants', label: 'スラックス' },
    { value: 'chinos', label: 'チノパン' },
    { value: 'jeans', label: 'ジーンズ' },
    { value: 'skirt', label: 'スカート' },
  ],
  outerwear: [
    { value: 'jacket', label: 'ジャケット' },
    { value: 'blazer', label: 'ブレザー' },
    { value: 'coat', label: 'コート' },
    { value: 'down_jacket', label: 'ダウンジャケット' },
    { value: 'trench_coat', label: 'トレンチコート' },
    { value: 'stole', label: 'ストール' },
    { value: 'cardigan_outer', label: 'カーディガン' },
  ],
  shoes: [
    { value: 'leather_shoes', label: '革靴' },
    { value: 'sneakers', label: 'スニーカー' },
    { value: 'boots', label: 'ブーツ' },
    { value: 'loafers', label: 'ローファー' },
    { value: 'water_resistant_shoes', label: '撥水シューズ' },
  ],
  accessories: [
    { value: 'tie', label: 'ネクタイ' },
    { value: 'watch', label: '腕時計' },
    { value: 'belt', label: 'ベルト' },
    { value: 'scarf', label: 'スカーフ' },
  ],
  bags: [
    { value: 'briefcase', label: 'ブリーフケース' },
    { value: 'backpack', label: 'リュック' },
    { value: 'tote', label: 'トートバッグ' },
  ],
};

const COLOR_OPTIONS: { value: Color; label: string; hex: string }[] = [
  { value: 'black', label: '黒', hex: '#000000' },
  { value: 'white', label: '白', hex: '#ffffff' },
  { value: 'gray', label: 'グレー', hex: '#808080' },
  { value: 'navy', label: 'ネイビー', hex: '#000080' },
  { value: 'blue', label: 'ブルー', hex: '#0066cc' },
  { value: 'light_blue', label: 'ライトブルー', hex: '#87ceeb' },
  { value: 'beige', label: 'ベージュ', hex: '#f5f5dc' },
  { value: 'brown', label: 'ブラウン', hex: '#8b4513' },
  { value: 'cream', label: 'クリーム', hex: '#fffdd0' },
  { value: 'charcoal', label: 'チャコール', hex: '#36454f' },
  { value: 'burgundy', label: 'バーガンディ', hex: '#800020' },
  { value: 'olive', label: 'オリーブ', hex: '#808000' },
  { value: 'camel', label: 'キャメル', hex: '#c19a6b' },
  { value: 'red', label: '赤', hex: '#cc0000' },
  { value: 'pink', label: 'ピンク', hex: '#ffc0cb' },
  { value: 'green', label: '緑', hex: '#228b22' },
];

const getCategoryIcon = (category: ClothingCategory): string => {
  return CATEGORY_OPTIONS.find(c => c.value === category)?.icon || '👕';
};

const getColorHex = (color: Color): string => {
  return COLOR_OPTIONS.find(c => c.value === color)?.hex || '#808080';
};

const getColorLabel = (color: Color): string => {
  return COLOR_OPTIONS.find(c => c.value === color)?.label || color;
};

export default function WardrobePanel({
  wardrobe,
  onAddItem,
  onLoadSampleData,
  onGetRecommendation,
  isLoading,
}: WardrobePanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory | 'all'>('all');
  const [formData, setFormData] = useState({
    name: '',
    category: 'tops' as ClothingCategory,
    subCategory: 'shirt' as ClothingSubCategory,
    color: 'white' as Color,
    formality: 3 as Formality,
    warmthLevel: 2 as 1 | 2 | 3 | 4 | 5,
    waterResistant: false,
    windResistant: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('アイテム名を入力してください');
      return;
    }

    onAddItem({
      ...formData,
      colors: [formData.color],
      tags: [],
    });

    setFormData({
      name: '',
      category: 'tops',
      subCategory: 'shirt',
      color: 'white',
      formality: 3,
      warmthLevel: 2,
      waterResistant: false,
      windResistant: false,
    });
    setShowForm(false);
  };

  const handleCategoryChange = (category: ClothingCategory) => {
    setFormData({
      ...formData,
      category,
      subCategory: SUBCATEGORY_OPTIONS[category][0].value,
    });
  };

  const items = wardrobe.getAllItems();
  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(item => item.category === selectedCategory);

  const categoryCounts = CATEGORY_OPTIONS.reduce((acc, cat) => {
    acc[cat.value] = items.filter(item => item.category === cat.value).length;
    return acc;
  }, {} as Record<ClothingCategory, number>);

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">クローゼット ({items.length}点)</h2>
        <div className="section-actions">
          {items.length === 0 && (
            <button className="btn btn-outline btn-sm" onClick={onLoadSampleData}>
              📦 サンプルデータを追加
            </button>
          )}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '✕ 閉じる' : '+ アイテム追加'}
          </button>
          <button
            className="btn btn-primary"
            onClick={onGetRecommendation}
            disabled={isLoading || items.length === 0}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner" style={{ width: 16, height: 16, marginRight: 8 }}></span>
                生成中...
              </>
            ) : (
              '🎯 今日の提案を見る'
            )}
          </button>
        </div>
      </div>

      {showForm && (
        <form className="add-item-form" onSubmit={handleSubmit}>
          <h3 className="form-title">✨ 新しいアイテムを追加</h3>
          <div className="form-row">
            <div className="form-group">
              <label>アイテム名 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="例: 白シャツ"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>カテゴリ</label>
              <select
                value={formData.category}
                onChange={e => handleCategoryChange(e.target.value as ClothingCategory)}
              >
                {CATEGORY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.icon} {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>種類</label>
              <select
                value={formData.subCategory}
                onChange={e => setFormData({ ...formData, subCategory: e.target.value as ClothingSubCategory })}
              >
                {SUBCATEGORY_OPTIONS[formData.category].map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>色</label>
              <select
                value={formData.color}
                onChange={e => setFormData({ ...formData, color: e.target.value as Color })}
              >
                {COLOR_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>フォーマル度</label>
              <select
                value={formData.formality}
                onChange={e => setFormData({ ...formData, formality: Number(e.target.value) as Formality })}
              >
                <option value={1}>1 - カジュアル</option>
                <option value={2}>2 - ややカジュアル</option>
                <option value={3}>3 - 標準</option>
                <option value={4}>4 - ややフォーマル</option>
                <option value={5}>5 - フォーマル</option>
              </select>
            </div>
            <div className="form-group">
              <label>暖かさ</label>
              <select
                value={formData.warmthLevel}
                onChange={e => setFormData({ ...formData, warmthLevel: Number(e.target.value) as 1 | 2 | 3 | 4 | 5 })}
              >
                <option value={1}>1 - とても涼しい</option>
                <option value={2}>2 - 涼しい</option>
                <option value={3}>3 - 普通</option>
                <option value={4}>4 - 暖かい</option>
                <option value={5}>5 - とても暖かい</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.waterResistant}
                  onChange={e => setFormData({ ...formData, waterResistant: e.target.checked })}
                />
                💧 撥水加工
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.windResistant}
                  onChange={e => setFormData({ ...formData, windResistant: e.target.checked })}
                />
                🌬️ 防風加工
              </label>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <button type="submit" className="btn btn-success">
              ✓ 追加する
            </button>
          </div>
        </form>
      )}

      <div className="category-filter">
        <button
          className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          すべて ({items.length})
        </button>
        {CATEGORY_OPTIONS.map(cat => (
          <button
            key={cat.value}
            className={`filter-btn ${selectedCategory === cat.value ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.icon} {cat.label} ({categoryCounts[cat.value]})
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👕</div>
          <p>アイテムがありません。</p>
          <p style={{ color: '#666', marginTop: 8 }}>
            「+ アイテム追加」ボタンで服を登録するか、<br />
            「サンプルデータを追加」で試してみましょう。
          </p>
          {items.length === 0 && (
            <button
              className="btn btn-primary"
              style={{ marginTop: 20 }}
              onClick={onLoadSampleData}
            >
              📦 サンプルデータを追加
            </button>
          )}
        </div>
      ) : (
        <div className="wardrobe-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="wardrobe-item">
              <div className="wardrobe-item-icon">{getCategoryIcon(item.category)}</div>
              <div className="wardrobe-item-name">{item.name}</div>
              <div className="wardrobe-item-meta">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                  <span
                    className="color-swatch"
                    style={{ backgroundColor: getColorHex(item.color) }}
                  />
                  {getColorLabel(item.color)}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#999' }}>
                  着用: {item.wearCount}回
                  {item.waterResistant && ' 💧'}
                  {item.windResistant && ' 🌬️'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className="quick-actions">
          <span style={{ color: '#666', fontSize: '0.9rem' }}>
            💡 ヒント: トップス・ボトムス・靴を各1点以上登録すると提案が受けられます
          </span>
        </div>
      )}
    </div>
  );
}
