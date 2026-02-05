import { useState, useEffect } from 'react';
import { Wardrobe } from './models/Wardrobe';
import { User } from './models/User';
import { RecommendationEngine } from './engine/RecommendationEngine';
import { WeatherProvider } from './providers/WeatherProvider';
import { CalendarProvider } from './providers/CalendarProvider';
import {
  ClothingItem,
  ImpressionPreset,
  DailyRecommendation,
  OutfitRecommendation,
  DailyWeather,
} from './types';
import WardrobePanel from './components/WardrobePanel';
import RecommendationPanel from './components/RecommendationPanel';
import PresetPanel from './components/PresetPanel';
import FeedbackPanel from './components/FeedbackPanel';

type TabType = 'recommendation' | 'wardrobe' | 'preset' | 'feedback';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('wardrobe');
  const [user, setUser] = useState<User | null>(null);
  const [wardrobeVersion, setWardrobeVersion] = useState(0);
  const [recommendation, setRecommendation] = useState<DailyRecommendation | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<ImpressionPreset | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmedOutfitId, setConfirmedOutfitId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [weather, setWeather] = useState<DailyWeather | null>(null);

  useEffect(() => {
    const wardrobe = new Wardrobe('user-1');
    const newUser = User.createWithWardrobe('user-1', wardrobe, {
      temperatureSensitivity: 'normal',
      defaultFormality: 3,
      favoriteColors: ['navy', 'white', 'gray'],
      avoidColors: [],
      preferredBrands: [],
      commuteMethod: 'train',
    });
    setUser(newUser);

    // Fetch weather
    const weatherProvider = new WeatherProvider({ lat: 35.6762, lon: 139.6503 });
    weatherProvider.getDailyForecast(new Date()).then(setWeather);
  }, []);

  const handleAddItem = (item: Omit<ClothingItem, 'id' | 'wearCount'>) => {
    if (!user) return;
    user.getWardrobe().addItem(item);
    setWardrobeVersion(v => v + 1);
    showSuccess('アイテムを追加しました！');
  };

  const handleLoadSampleData = () => {
    if (!user) return;
    const wardrobe = user.getWardrobe();

    const sampleItems: Omit<ClothingItem, 'id' | 'wearCount'>[] = [
      { name: '白シャツ', category: 'tops', subCategory: 'shirt', color: 'white', colors: ['white'], formality: 4, warmthLevel: 2, waterResistant: false, windResistant: false, tags: ['ビジネス'] },
      { name: 'ライトブルーシャツ', category: 'tops', subCategory: 'shirt', color: 'light_blue', colors: ['light_blue'], formality: 3, warmthLevel: 2, waterResistant: false, windResistant: false, tags: ['ビジカジ'] },
      { name: 'ネイビーセーター', category: 'tops', subCategory: 'sweater', color: 'navy', colors: ['navy'], formality: 3, warmthLevel: 4, waterResistant: false, windResistant: false, tags: ['秋冬'] },
      { name: 'グレーTシャツ', category: 'tops', subCategory: 't-shirt', color: 'gray', colors: ['gray'], formality: 1, warmthLevel: 1, waterResistant: false, windResistant: false, tags: ['カジュアル'] },
      { name: 'グレースラックス', category: 'bottoms', subCategory: 'dress_pants', color: 'gray', colors: ['gray'], formality: 4, warmthLevel: 3, waterResistant: false, windResistant: false, tags: ['ビジネス'] },
      { name: 'ネイビーチノパン', category: 'bottoms', subCategory: 'chinos', color: 'navy', colors: ['navy'], formality: 2, warmthLevel: 2, waterResistant: false, windResistant: false, tags: ['ビジカジ'] },
      { name: 'ベージュチノパン', category: 'bottoms', subCategory: 'chinos', color: 'beige', colors: ['beige'], formality: 2, warmthLevel: 2, waterResistant: false, windResistant: false, tags: ['カジュアル'] },
      { name: 'ネイビーブレザー', category: 'outerwear', subCategory: 'blazer', color: 'navy', colors: ['navy'], formality: 4, warmthLevel: 3, waterResistant: false, windResistant: true, tags: ['勝負服'] },
      { name: 'ベージュトレンチ', category: 'outerwear', subCategory: 'trench_coat', color: 'beige', colors: ['beige'], formality: 4, warmthLevel: 3, waterResistant: true, windResistant: true, tags: ['雨の日'] },
      { name: 'グレーカーディガン', category: 'outerwear', subCategory: 'cardigan_outer', color: 'gray', colors: ['gray'], formality: 2, warmthLevel: 3, waterResistant: false, windResistant: false, tags: ['オフィス'] },
      { name: '黒革靴', category: 'shoes', subCategory: 'leather_shoes', color: 'black', colors: ['black'], formality: 5, warmthLevel: 2, waterResistant: false, windResistant: false, tags: ['フォーマル'] },
      { name: '撥水ビジネスシューズ', category: 'shoes', subCategory: 'water_resistant_shoes', color: 'black', colors: ['black'], formality: 4, warmthLevel: 2, waterResistant: true, windResistant: false, tags: ['雨の日'] },
      { name: 'ブラウンローファー', category: 'shoes', subCategory: 'loafers', color: 'brown', colors: ['brown'], formality: 3, warmthLevel: 2, waterResistant: false, windResistant: false, tags: ['ビジカジ'] },
      { name: '白スニーカー', category: 'shoes', subCategory: 'sneakers', color: 'white', colors: ['white'], formality: 1, warmthLevel: 1, waterResistant: false, windResistant: false, tags: ['カジュアル'] },
    ];

    sampleItems.forEach(item => wardrobe.addItem(item));
    setWardrobeVersion(v => v + 1);
    showSuccess(`サンプルデータ ${sampleItems.length}点 を追加しました！`);
  };

  const handleGetRecommendation = async () => {
    if (!user || user.getWardrobe().getItemCount() === 0) {
      alert('まずクローゼットにアイテムを追加してください。');
      return;
    }

    setIsLoading(true);
    setConfirmedOutfitId(null);

    try {
      const weatherProvider = new WeatherProvider({ lat: 35.6762, lon: 139.6503 });
      const calendarProvider = new CalendarProvider('train');
      const engine = new RecommendationEngine();

      const weatherData = await weatherProvider.getDailyForecast(new Date());
      const schedule = await calendarProvider.getDailySchedule(new Date());

      setWeather(weatherData);

      const rec = await engine.generateDailyRecommendation(
        user,
        weatherData,
        schedule,
        { impressionPreset: selectedPreset }
      );

      setRecommendation(rec);
      setActiveTab('recommendation');
    } catch (error) {
      console.error('Failed to get recommendation:', error);
      alert('提案の生成に失敗しました。クローゼットに十分なアイテム（トップス・ボトムス・靴）があるか確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmOutfit = (outfitId: string) => {
    if (!user || !recommendation) return;

    const wardrobe = user.getWardrobe();
    const outfit =
      recommendation.primary.outfit.id === outfitId
        ? recommendation.primary.outfit
        : recommendation.alternatives.find(a => a.outfit.id === outfitId)?.outfit;

    if (outfit) {
      wardrobe.recordWear(outfit.top.id);
      wardrobe.recordWear(outfit.bottom.id);
      wardrobe.recordWear(outfit.shoes.id);
      if (outfit.outerwear) {
        wardrobe.recordWear(outfit.outerwear.id);
      }
    }

    setConfirmedOutfitId(outfitId);
    setWardrobeVersion(v => v + 1);
    showSuccess('今日のコーディネートを確定しました。行ってらっしゃい！');
  };

  const handleSelectAlternative = (alt: OutfitRecommendation) => {
    if (!recommendation) return;
    setRecommendation({
      ...recommendation,
      primary: alt,
    });
  };

  const handleFeedback = (type: 'wore' | 'did_not_wear', comfort?: 'too_hot' | 'comfortable' | 'too_cold') => {
    if (!user || !confirmedOutfitId) return;

    user.addFeedback({
      date: new Date(),
      outfitId: confirmedOutfitId,
      wearFeedback: type,
      comfortFeedback: comfort,
    });

    showSuccess('フィードバックを記録しました。明日の提案に反映されます！');
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'wardrobe', label: '👕 クローゼット' },
    { id: 'preset', label: '✨ 印象設定' },
    { id: 'recommendation', label: '📋 今日の提案' },
    { id: 'feedback', label: '📝 フィードバック' },
  ];

  const itemCount = user?.getWardrobe().getItemCount() || 0;

  return (
    <div className="app">
      <header className="header">
        <h1>コーディネート提案アプリ</h1>
        <p>朝、1分で"正解"が決まる。迷いも、妥協も、場違いもゼロ。</p>
      </header>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-icon wardrobe">👕</div>
          <div className="stat-content">
            <div className="stat-label">クローゼット</div>
            <div className="stat-value">{itemCount}点</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon weather">
            {weather?.afternoon.precipitationType !== 'none' ? '🌧️' : '☀️'}
          </div>
          <div className="stat-content">
            <div className="stat-label">今日の天気</div>
            <div className="stat-value">
              {weather ? `${weather.afternoon.temperature}°C` : '--°C'}
              {weather?.afternoon.precipitationType !== 'none' && ' 雨'}
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon score">⭐</div>
          <div className="stat-content">
            <div className="stat-label">今日のスコア</div>
            <div className="stat-value">
              {recommendation ? `${Math.round(recommendation.primary.score)}点` : '--'}
            </div>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="success-message">
          <span>✓</span>
          {successMessage}
        </div>
      )}

      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="panel">
        {activeTab === 'wardrobe' && user && (
          <WardrobePanel
            key={wardrobeVersion}
            wardrobe={user.getWardrobe()}
            onAddItem={handleAddItem}
            onLoadSampleData={handleLoadSampleData}
            onGetRecommendation={handleGetRecommendation}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'preset' && (
          <PresetPanel
            selectedPreset={selectedPreset}
            onSelectPreset={setSelectedPreset}
            onGetRecommendation={handleGetRecommendation}
            isLoading={isLoading}
            hasItems={itemCount > 0}
          />
        )}

        {activeTab === 'recommendation' && (
          <RecommendationPanel
            recommendation={recommendation}
            onConfirm={handleConfirmOutfit}
            onSelectAlternative={handleSelectAlternative}
            confirmedOutfitId={confirmedOutfitId}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'feedback' && (
          <FeedbackPanel
            confirmedOutfitId={confirmedOutfitId}
            onFeedback={handleFeedback}
            user={user}
          />
        )}
      </div>
    </div>
  );
}

export default App;
