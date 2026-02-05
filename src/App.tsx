import { useState, useEffect } from 'react';
import { Wardrobe } from './models/Wardrobe';
import { User } from './models/User';
import { OutfitScorer } from './engine/OutfitScorer';
import { RecommendationEngine } from './engine/RecommendationEngine';
import { WeatherProvider } from './providers/WeatherProvider';
import { CalendarProvider } from './providers/CalendarProvider';
import {
  ClothingItem,
  ClothingCategory,
  ClothingSubCategory,
  Color,
  Formality,
  ImpressionPreset,
  DailyRecommendation,
  OutfitRecommendation,
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

  useEffect(() => {
    // Initialize user with sample wardrobe
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
  }, []);

  const handleAddItem = (item: Omit<ClothingItem, 'id' | 'wearCount'>) => {
    if (!user) return;
    user.getWardrobe().addItem(item);
    setWardrobeVersion(v => v + 1);
    showSuccess('アイテムを追加しました！');
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

      const weather = await weatherProvider.getDailyForecast(new Date());
      const schedule = await calendarProvider.getDailySchedule(new Date());

      const rec = await engine.generateDailyRecommendation(
        user,
        weather,
        schedule,
        { impressionPreset: selectedPreset }
      );

      setRecommendation(rec);
      setActiveTab('recommendation');
    } catch (error) {
      console.error('Failed to get recommendation:', error);
      alert('提案の生成に失敗しました。クローゼットに十分なアイテムがあるか確認してください。');
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

  return (
    <div className="app">
      <header className="header">
        <h1>コーディネート提案アプリ</h1>
        <p>朝、1分で"正解"が決まる。迷いも、妥協も、場違いもゼロ。</p>
      </header>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
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
            hasItems={user ? user.getWardrobe().getItemCount() > 0 : false}
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
