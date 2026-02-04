import { v4 as uuidv4 } from 'uuid';
import {
  ClothingItem,
  ClothingCategory,
  ClothingSubCategory,
  Color,
  Formality,
  PurchaseRecord,
} from '../types';
import { Wardrobe } from '../models/Wardrobe';

export interface ECPlatform {
  name: string;
  apiEndpoint?: string;
  supportedFeatures: ('purchase_history' | 'product_details' | 'images')[];
}

export interface ReceiptScanResult {
  items: ParsedReceiptItem[];
  storeName?: string;
  purchaseDate?: Date;
  totalAmount?: number;
}

export interface ParsedReceiptItem {
  name: string;
  brand?: string;
  price?: number;
  category?: ClothingCategory;
  subCategory?: ClothingSubCategory;
  confidence: number;
}

export interface AutoRegistrationResult {
  success: boolean;
  registeredItems: ClothingItem[];
  failedItems: string[];
  message: string;
}

/**
 * クローゼット登録の省力化サービス
 * ECサイトの購入履歴連携や、レシート写真からアイテムを自動特定
 * 「服を一枚ずつ撮る手間」を最小化
 */
export class WardrobeRegistrationService {
  private supportedPlatforms: ECPlatform[] = [
    {
      name: 'Amazon',
      supportedFeatures: ['purchase_history', 'product_details', 'images'],
    },
    {
      name: 'ZOZOTOWN',
      supportedFeatures: ['purchase_history', 'product_details', 'images'],
    },
    {
      name: 'UNIQLO',
      supportedFeatures: ['purchase_history', 'product_details'],
    },
    {
      name: 'GU',
      supportedFeatures: ['purchase_history', 'product_details'],
    },
    {
      name: 'Rakuten Fashion',
      supportedFeatures: ['purchase_history', 'product_details', 'images'],
    },
  ];

  /**
   * ECサイトの購入履歴から自動登録
   */
  async importFromECPlatform(
    wardrobe: Wardrobe,
    platformName: string,
    accessToken: string,
    options: {
      startDate?: Date;
      endDate?: Date;
      categoryFilter?: ClothingCategory[];
    } = {}
  ): Promise<AutoRegistrationResult> {
    const platform = this.supportedPlatforms.find(
      p => p.name.toLowerCase() === platformName.toLowerCase()
    );

    if (!platform) {
      return {
        success: false,
        registeredItems: [],
        failedItems: [],
        message: `${platformName}は現在サポートされていません。`,
      };
    }

    // Fetch purchase history (mock implementation)
    const purchaseRecords = await this.fetchPurchaseHistory(
      platform,
      accessToken,
      options
    );

    // Convert to clothing items
    const registeredItems: ClothingItem[] = [];
    const failedItems: string[] = [];

    for (const record of purchaseRecords) {
      try {
        const itemData = await this.convertToClothingItem(record);
        if (itemData) {
          const item = wardrobe.addItem(itemData);
          registeredItems.push(item);
        } else {
          failedItems.push(record.itemName);
        }
      } catch {
        failedItems.push(record.itemName);
      }
    }

    return {
      success: true,
      registeredItems,
      failedItems,
      message: `${registeredItems.length}件のアイテムを登録しました。${failedItems.length > 0 ? `${failedItems.length}件は自動認識できませんでした。` : ''}`,
    };
  }

  /**
   * レシート写真からアイテムを自動特定
   */
  async scanReceipt(imageData: string | Buffer): Promise<ReceiptScanResult> {
    // In real implementation, this would use OCR and ML models
    // to extract item information from receipt images

    // Mock implementation
    return {
      items: [],
      storeName: undefined,
      purchaseDate: undefined,
      totalAmount: undefined,
    };
  }

  /**
   * レシートスキャン結果からアイテムを登録
   */
  async registerFromReceipt(
    wardrobe: Wardrobe,
    scanResult: ReceiptScanResult,
    confirmations: Map<string, boolean>
  ): Promise<AutoRegistrationResult> {
    const registeredItems: ClothingItem[] = [];
    const failedItems: string[] = [];

    for (const parsedItem of scanResult.items) {
      // Only register items that user confirmed
      if (!confirmations.get(parsedItem.name)) {
        continue;
      }

      if (parsedItem.confidence < 0.5) {
        failedItems.push(parsedItem.name);
        continue;
      }

      try {
        const itemData = this.createItemFromParsedReceipt(parsedItem, scanResult);
        if (itemData) {
          const item = wardrobe.addItem(itemData);
          registeredItems.push(item);
        }
      } catch {
        failedItems.push(parsedItem.name);
      }
    }

    return {
      success: true,
      registeredItems,
      failedItems,
      message: `${registeredItems.length}件のアイテムを登録しました。`,
    };
  }

  /**
   * 手動登録（簡易版）- 最小限の情報で登録
   */
  quickRegister(
    wardrobe: Wardrobe,
    name: string,
    category: ClothingCategory,
    subCategory: ClothingSubCategory,
    color: Color
  ): ClothingItem {
    const defaults = this.getDefaultsForCategory(category, subCategory);

    return wardrobe.addItem({
      name,
      category,
      subCategory,
      color,
      colors: [color],
      formality: defaults.formality,
      warmthLevel: defaults.warmthLevel,
      waterResistant: defaults.waterResistant,
      windResistant: defaults.windResistant,
      tags: [],
    });
  }

  /**
   * バッチ登録 - 複数アイテムを一括登録
   */
  batchRegister(
    wardrobe: Wardrobe,
    items: Array<{
      name: string;
      category: ClothingCategory;
      subCategory: ClothingSubCategory;
      color: Color;
      formality?: Formality;
      warmthLevel?: 1 | 2 | 3 | 4 | 5;
    }>
  ): ClothingItem[] {
    const registered: ClothingItem[] = [];

    for (const item of items) {
      const defaults = this.getDefaultsForCategory(item.category, item.subCategory);
      const clothingItem = wardrobe.addItem({
        name: item.name,
        category: item.category,
        subCategory: item.subCategory,
        color: item.color,
        colors: [item.color],
        formality: item.formality || defaults.formality,
        warmthLevel: item.warmthLevel || defaults.warmthLevel,
        waterResistant: defaults.waterResistant,
        windResistant: defaults.windResistant,
        tags: [],
      });
      registered.push(clothingItem);
    }

    return registered;
  }

  /**
   * サポートされているECプラットフォーム一覧を取得
   */
  getSupportedPlatforms(): ECPlatform[] {
    return [...this.supportedPlatforms];
  }

  private async fetchPurchaseHistory(
    platform: ECPlatform,
    accessToken: string,
    options: {
      startDate?: Date;
      endDate?: Date;
      categoryFilter?: ClothingCategory[];
    }
  ): Promise<PurchaseRecord[]> {
    // Mock implementation - would connect to actual EC APIs
    console.log(`Fetching from ${platform.name} with token...`);
    return [];
  }

  private async convertToClothingItem(
    record: PurchaseRecord
  ): Promise<Omit<ClothingItem, 'id' | 'wearCount'> | null> {
    // Parse item name to determine category and attributes
    const parsed = this.parseItemName(record.itemName);

    if (!parsed.category || !parsed.subCategory) {
      return null;
    }

    const defaults = this.getDefaultsForCategory(parsed.category, parsed.subCategory);

    return {
      name: record.itemName,
      category: parsed.category,
      subCategory: parsed.subCategory,
      color: parsed.color || 'black',
      colors: parsed.color ? [parsed.color] : ['black'],
      formality: defaults.formality,
      warmthLevel: defaults.warmthLevel,
      waterResistant: defaults.waterResistant,
      windResistant: defaults.windResistant,
      brand: record.brand,
      purchaseDate: record.purchaseDate,
      purchaseSource: record.source,
      imageUrl: record.imageUrl,
      tags: [],
    };
  }

  private parseItemName(name: string): {
    category?: ClothingCategory;
    subCategory?: ClothingSubCategory;
    color?: Color;
  } {
    const nameLower = name.toLowerCase();
    const result: {
      category?: ClothingCategory;
      subCategory?: ClothingSubCategory;
      color?: Color;
    } = {};

    // Category detection patterns
    const patterns: Array<{
      keywords: string[];
      category: ClothingCategory;
      subCategory: ClothingSubCategory;
    }> = [
      { keywords: ['シャツ', 'shirt'], category: 'tops', subCategory: 'shirt' },
      { keywords: ['tシャツ', 't-shirt', 'tee'], category: 'tops', subCategory: 't-shirt' },
      { keywords: ['ブラウス', 'blouse'], category: 'tops', subCategory: 'blouse' },
      { keywords: ['セーター', 'sweater', 'ニット'], category: 'tops', subCategory: 'sweater' },
      { keywords: ['カーディガン', 'cardigan'], category: 'tops', subCategory: 'cardigan' },
      { keywords: ['ポロ', 'polo'], category: 'tops', subCategory: 'polo' },
      { keywords: ['スラックス', 'ドレスパンツ', 'dress pants'], category: 'bottoms', subCategory: 'dress_pants' },
      { keywords: ['チノ', 'chino'], category: 'bottoms', subCategory: 'chinos' },
      { keywords: ['ジーンズ', 'jeans', 'デニム'], category: 'bottoms', subCategory: 'jeans' },
      { keywords: ['スカート', 'skirt'], category: 'bottoms', subCategory: 'skirt' },
      { keywords: ['ジャケット', 'jacket'], category: 'outerwear', subCategory: 'jacket' },
      { keywords: ['ブレザー', 'blazer'], category: 'outerwear', subCategory: 'blazer' },
      { keywords: ['コート', 'coat'], category: 'outerwear', subCategory: 'coat' },
      { keywords: ['ダウン', 'down'], category: 'outerwear', subCategory: 'down_jacket' },
      { keywords: ['トレンチ', 'trench'], category: 'outerwear', subCategory: 'trench_coat' },
      { keywords: ['革靴', 'leather shoes'], category: 'shoes', subCategory: 'leather_shoes' },
      { keywords: ['スニーカー', 'sneaker'], category: 'shoes', subCategory: 'sneakers' },
      { keywords: ['ブーツ', 'boots'], category: 'shoes', subCategory: 'boots' },
      { keywords: ['ローファー', 'loafer'], category: 'shoes', subCategory: 'loafers' },
    ];

    for (const pattern of patterns) {
      if (pattern.keywords.some(kw => nameLower.includes(kw))) {
        result.category = pattern.category;
        result.subCategory = pattern.subCategory;
        break;
      }
    }

    // Color detection
    const colorPatterns: Array<{ keywords: string[]; color: Color }> = [
      { keywords: ['黒', 'ブラック', 'black'], color: 'black' },
      { keywords: ['白', 'ホワイト', 'white'], color: 'white' },
      { keywords: ['グレー', 'gray', 'grey'], color: 'gray' },
      { keywords: ['ネイビー', 'navy', '紺'], color: 'navy' },
      { keywords: ['青', 'ブルー', 'blue'], color: 'blue' },
      { keywords: ['赤', 'レッド', 'red'], color: 'red' },
      { keywords: ['ベージュ', 'beige'], color: 'beige' },
      { keywords: ['茶', 'ブラウン', 'brown'], color: 'brown' },
    ];

    for (const colorPattern of colorPatterns) {
      if (colorPattern.keywords.some(kw => nameLower.includes(kw))) {
        result.color = colorPattern.color;
        break;
      }
    }

    return result;
  }

  private createItemFromParsedReceipt(
    parsed: ParsedReceiptItem,
    scanResult: ReceiptScanResult
  ): Omit<ClothingItem, 'id' | 'wearCount'> | null {
    if (!parsed.category || !parsed.subCategory) {
      return null;
    }

    const defaults = this.getDefaultsForCategory(parsed.category, parsed.subCategory);

    return {
      name: parsed.name,
      category: parsed.category,
      subCategory: parsed.subCategory,
      color: 'black', // Default, user can update
      colors: ['black'],
      formality: defaults.formality,
      warmthLevel: defaults.warmthLevel,
      waterResistant: defaults.waterResistant,
      windResistant: defaults.windResistant,
      brand: parsed.brand,
      purchaseDate: scanResult.purchaseDate,
      purchaseSource: scanResult.storeName,
      tags: [],
    };
  }

  private getDefaultsForCategory(
    category: ClothingCategory,
    subCategory: ClothingSubCategory
  ): {
    formality: Formality;
    warmthLevel: 1 | 2 | 3 | 4 | 5;
    waterResistant: boolean;
    windResistant: boolean;
  } {
    const defaults: Record<ClothingSubCategory, {
      formality: Formality;
      warmthLevel: 1 | 2 | 3 | 4 | 5;
      waterResistant: boolean;
      windResistant: boolean;
    }> = {
      // Tops
      shirt: { formality: 4, warmthLevel: 2, waterResistant: false, windResistant: false },
      't-shirt': { formality: 1, warmthLevel: 1, waterResistant: false, windResistant: false },
      blouse: { formality: 3, warmthLevel: 2, waterResistant: false, windResistant: false },
      sweater: { formality: 3, warmthLevel: 4, waterResistant: false, windResistant: false },
      cardigan: { formality: 2, warmthLevel: 3, waterResistant: false, windResistant: false },
      polo: { formality: 2, warmthLevel: 2, waterResistant: false, windResistant: false },
      // Bottoms
      dress_pants: { formality: 4, warmthLevel: 2, waterResistant: false, windResistant: false },
      chinos: { formality: 3, warmthLevel: 2, waterResistant: false, windResistant: false },
      jeans: { formality: 2, warmthLevel: 3, waterResistant: false, windResistant: false },
      skirt: { formality: 3, warmthLevel: 1, waterResistant: false, windResistant: false },
      // Outerwear
      jacket: { formality: 3, warmthLevel: 3, waterResistant: false, windResistant: true },
      blazer: { formality: 4, warmthLevel: 2, waterResistant: false, windResistant: false },
      coat: { formality: 4, warmthLevel: 4, waterResistant: false, windResistant: true },
      down_jacket: { formality: 2, warmthLevel: 5, waterResistant: true, windResistant: true },
      trench_coat: { formality: 4, warmthLevel: 3, waterResistant: true, windResistant: true },
      stole: { formality: 3, warmthLevel: 2, waterResistant: false, windResistant: false },
      cardigan_outer: { formality: 2, warmthLevel: 3, waterResistant: false, windResistant: false },
      // Shoes
      leather_shoes: { formality: 5, warmthLevel: 2, waterResistant: false, windResistant: false },
      sneakers: { formality: 1, warmthLevel: 2, waterResistant: false, windResistant: false },
      boots: { formality: 3, warmthLevel: 4, waterResistant: true, windResistant: true },
      loafers: { formality: 3, warmthLevel: 2, waterResistant: false, windResistant: false },
      water_resistant_shoes: { formality: 3, warmthLevel: 2, waterResistant: true, windResistant: false },
      // Accessories
      tie: { formality: 5, warmthLevel: 1, waterResistant: false, windResistant: false },
      watch: { formality: 3, warmthLevel: 1, waterResistant: true, windResistant: false },
      belt: { formality: 3, warmthLevel: 1, waterResistant: false, windResistant: false },
      scarf: { formality: 3, warmthLevel: 3, waterResistant: false, windResistant: true },
      // Bags
      briefcase: { formality: 5, warmthLevel: 1, waterResistant: false, windResistant: false },
      backpack: { formality: 1, warmthLevel: 1, waterResistant: false, windResistant: false },
      tote: { formality: 2, warmthLevel: 1, waterResistant: false, windResistant: false },
    };

    return defaults[subCategory] || {
      formality: 3,
      warmthLevel: 2,
      waterResistant: false,
      windResistant: false,
    };
  }
}
