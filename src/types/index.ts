// Weather Types
export interface WeatherCondition {
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitation: number; // 0-100%
  precipitationType: 'none' | 'rain' | 'snow' | 'sleet';
  windSpeed: number;
  uvIndex: number;
}

export interface DailyWeather {
  date: Date;
  morning: WeatherCondition;
  afternoon: WeatherCondition;
  evening: WeatherCondition;
  highTemp: number;
  lowTemp: number;
  temperatureDifference: number;
}

// Calendar Types
export type EventType =
  | 'business_meeting'      // 商談
  | 'internal_meeting'      // 社内会議
  | 'dinner'                // 会食
  | 'presentation'          // プレゼン
  | 'casual_meeting'        // カジュアルミーティング
  | 'interview'             // 面接
  | 'client_visit'          // クライアント訪問
  | 'remote_work'           // リモートワーク
  | 'day_off'               // 休日
  | 'other';

export type TransportMethod =
  | 'walk'
  | 'bicycle'
  | 'train'
  | 'car'
  | 'taxi';

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  eventType: EventType;
  location?: string;
  importance: 'high' | 'medium' | 'low';
  dressCode?: string;
}

export interface DailySchedule {
  date: Date;
  events: CalendarEvent[];
  primaryEventType: EventType;
  transportMethods: TransportMethod[];
}

// Wardrobe Types
export type ClothingCategory =
  | 'tops'           // トップス
  | 'bottoms'        // ボトムス
  | 'outerwear'      // アウター
  | 'shoes'          // 靴
  | 'accessories'    // アクセサリー
  | 'bags';          // バッグ

export type ClothingSubCategory =
  // Tops
  | 'shirt'
  | 't-shirt'
  | 'blouse'
  | 'sweater'
  | 'cardigan'
  | 'polo'
  // Bottoms
  | 'dress_pants'
  | 'chinos'
  | 'jeans'
  | 'skirt'
  // Outerwear
  | 'jacket'
  | 'blazer'
  | 'coat'
  | 'down_jacket'
  | 'trench_coat'
  | 'stole'
  | 'cardigan_outer'
  // Shoes
  | 'leather_shoes'
  | 'sneakers'
  | 'boots'
  | 'loafers'
  | 'water_resistant_shoes'
  // Accessories
  | 'tie'
  | 'watch'
  | 'belt'
  | 'scarf'
  // Bags
  | 'briefcase'
  | 'backpack'
  | 'tote';

export type Color =
  | 'black' | 'white' | 'gray' | 'navy'
  | 'blue' | 'light_blue' | 'red' | 'pink'
  | 'green' | 'brown' | 'beige' | 'cream'
  | 'burgundy' | 'olive' | 'charcoal' | 'camel';

export type Formality = 1 | 2 | 3 | 4 | 5; // 1=カジュアル, 5=フォーマル

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  subCategory: ClothingSubCategory;
  color: Color;
  colors: Color[]; // for multi-color items
  formality: Formality;
  warmthLevel: 1 | 2 | 3 | 4 | 5; // 1=涼しい, 5=暖かい
  waterResistant: boolean;
  windResistant: boolean;
  imageUrl?: string;
  brand?: string;
  purchaseDate?: Date;
  purchaseSource?: string; // EC site name
  lastWorn?: Date;
  wearCount: number;
  tags: string[];
}

// Impression Presets
export type ImpressionPreset =
  | 'trustworthy'        // 信頼感MAX（勝負服）
  | 'approachable'       // 親しみやすさ（後輩指導）
  | 'professional'       // プロフェッショナル
  | 'creative'           // クリエイティブ
  | 'casual'             // カジュアル
  | 'elegant'            // エレガント
  | 'energetic';         // エネルギッシュ

export interface ImpressionConfig {
  preset: ImpressionPreset;
  displayName: string;
  description: string;
  preferredFormality: { min: Formality; max: Formality };
  preferredColors: Color[];
  avoidColors: Color[];
  prioritizeItems: ClothingSubCategory[];
}

// Outfit Types
export interface Outfit {
  id: string;
  top: ClothingItem;
  bottom: ClothingItem;
  outerwear?: ClothingItem;
  shoes: ClothingItem;
  accessories: ClothingItem[];
  bag?: ClothingItem;
}

export interface OutfitRecommendation {
  outfit: Outfit;
  reason: string;
  score: number;
  tags: string[];
}

export interface DailyRecommendation {
  date: Date;
  primary: OutfitRecommendation;
  alternatives: OutfitRecommendation[];
  weather: DailyWeather;
  schedule: DailySchedule;
  eveningNotification?: EveningNotification;
}

// Feedback Types
export type WearFeedback = 'wore' | 'did_not_wear';
export type ComfortFeedback = 'too_hot' | 'comfortable' | 'too_cold';

export interface OutfitFeedback {
  id: string;
  date: Date;
  outfitId: string;
  wearFeedback: WearFeedback;
  comfortFeedback?: ComfortFeedback;
  actualWeather?: WeatherCondition;
  notes?: string;
}

// User Preferences
export interface UserPreferences {
  userId: string;
  temperatureSensitivity: 'cold_sensitive' | 'normal' | 'heat_sensitive';
  defaultFormality: Formality;
  favoriteColors: Color[];
  avoidColors: Color[];
  preferredBrands: string[];
  commuteMethod: TransportMethod;
}

// Evening Notification
export interface EveningNotification {
  message: string;
  suggestedItems: ClothingItem[];
  reason: string;
}

// EC Integration
export interface PurchaseRecord {
  id: string;
  itemName: string;
  brand?: string;
  price?: number;
  purchaseDate: Date;
  source: string; // EC site name
  category?: ClothingCategory;
  imageUrl?: string;
  receiptUrl?: string;
}
