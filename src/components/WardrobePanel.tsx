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
  { value: 'blue', label: 'ブルー', hex: '#0000ff' },
  { value: 'light_blue', label: 'ライトブルー', hex: '#87ceeb' },
  { value: 'beige', label: 'ベージュ', hex: '#f5f5dc' },
  { value: 'brown', label: 'ブラウン', hex: '#8b4513' },
  { value: 'cream', label: 'クリーム', hex: '#fffdd0' },
  { value: 'charcoal', label: 'チャコール', hex: '#36454f' },
  { value: 'burgundy', label: 'バーガンディ', hex: '#800020' },
  { value: 'olive', label: 'オリーブ', hex: '#808000' },
  { value: 'camel', label: 'キャメル', hex: '#c19a6b' },
  { value: 'red', label: '赤', hex: '#ff0000' },
  { value: 'pink', label: 'ピンク', hex: '#ffc0cb' },
  { value: 'green', label: '緑', hex: '#008000' },
];

const getCategoryIcon = (category: ClothingCategory): string => {
  return CATEGORY_OPTIONS.find(c => c.value === category)?.icon || '👕';
};

export default function WardrobePanel({
  wardrobe,
  onAddItem,
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>クローゼット ({items.length}点)</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ 閉じる' : '+ アイテム追加'}
          </button>
          <button
            className="btn btn-primary"
            onClick={onGetRecommendation}
            disabled={isLoading || items.length === 0}
          >
            {isLoading ? '生成中...' : '🎯 提案を見る'}
          </button>
        </div>
      </div>

      {showForm && (
        <form className="add-item-form" onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: 16 }}>新しいアイテムを追加</h3>
          <div className="form-row">
            <div className="form-group">
              <label>アイテム名 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="例: 白シャツ"
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
              <label>フォーマル度 (1=カジュアル, 5=フォーマル)</label>
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
              <label>暖かさ (1=涼しい, 5=暖かい)</label>
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
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.waterResistant}
                  onChange={e => setFormData({ ...formData, waterResistant: e.target.checked })}
                />
                {' '}撥水加工
              </label>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.windResistant}
                  onChange={e => setFormData({ ...formData, windResistant: e.target.checked })}
                />
                {' '}防風加工
              </label>
            </div>
          </div>
          <button type="submit" className="btn btn-success">
            追加する
          </button>
        </form>
      )}

      <div className="category-filter">
        <button
          className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          すべて
        </button>
        {CATEGORY_OPTIONS.map(cat => (
          <button
            key={cat.value}
            className={`filter-btn ${selectedCategory === cat.value ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👕</div>
          <p>アイテムがありません。<br />「+ アイテム追加」ボタンで服を登録しましょう。</p>
        </div>
      ) : (
        <div className="wardrobe-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="wardrobe-item">
              <div className="wardrobe-item-icon">{getCategoryIcon(item.category)}</div>
              <div className="outfit-item-name">{item.name}</div>
              <div className="outfit-item-color">
                {COLOR_OPTIONS.find(c => c.value === item.color)?.label || item.color}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#999', marginTop: 4 }}>
                着用回数: {item.wearCount}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
