import { Wardrobe } from './Wardrobe';
import { ClothingItem } from '../types';

describe('Wardrobe', () => {
  let wardrobe: Wardrobe;

  beforeEach(() => {
    wardrobe = new Wardrobe('test-user');
  });

  describe('addItem', () => {
    it('should add an item and return it with an id', () => {
      const item = wardrobe.addItem({
        name: 'テストシャツ',
        category: 'tops',
        subCategory: 'shirt',
        color: 'white',
        colors: ['white'],
        formality: 3,
        warmthLevel: 2,
        waterResistant: false,
        windResistant: false,
        tags: ['テスト'],
      });

      expect(item.id).toBeDefined();
      expect(item.name).toBe('テストシャツ');
      expect(item.wearCount).toBe(0);
    });

    it('should increment item count', () => {
      expect(wardrobe.getItemCount()).toBe(0);

      wardrobe.addItem({
        name: 'シャツ1',
        category: 'tops',
        subCategory: 'shirt',
        color: 'white',
        colors: ['white'],
        formality: 3,
        warmthLevel: 2,
        waterResistant: false,
        windResistant: false,
        tags: [],
      });

      expect(wardrobe.getItemCount()).toBe(1);
    });
  });

  describe('getItemsByCategory', () => {
    beforeEach(() => {
      wardrobe.addItem({
        name: 'シャツ',
        category: 'tops',
        subCategory: 'shirt',
        color: 'white',
        colors: ['white'],
        formality: 3,
        warmthLevel: 2,
        waterResistant: false,
        windResistant: false,
        tags: [],
      });
      wardrobe.addItem({
        name: 'Tシャツ',
        category: 'tops',
        subCategory: 't-shirt',
        color: 'blue',
        colors: ['blue'],
        formality: 1,
        warmthLevel: 1,
        waterResistant: false,
        windResistant: false,
        tags: [],
      });
      wardrobe.addItem({
        name: 'パンツ',
        category: 'bottoms',
        subCategory: 'chinos',
        color: 'beige',
        colors: ['beige'],
        formality: 3,
        warmthLevel: 2,
        waterResistant: false,
        windResistant: false,
        tags: [],
      });
    });

    it('should return items by category', () => {
      const tops = wardrobe.getItemsByCategory('tops');
      expect(tops.length).toBe(2);

      const bottoms = wardrobe.getItemsByCategory('bottoms');
      expect(bottoms.length).toBe(1);
    });

    it('should return empty array for empty category', () => {
      const shoes = wardrobe.getItemsByCategory('shoes');
      expect(shoes.length).toBe(0);
    });
  });

  describe('getItemsByFormality', () => {
    beforeEach(() => {
      wardrobe.addItem({
        name: 'フォーマルシャツ',
        category: 'tops',
        subCategory: 'shirt',
        color: 'white',
        colors: ['white'],
        formality: 5,
        warmthLevel: 2,
        waterResistant: false,
        windResistant: false,
        tags: [],
      });
      wardrobe.addItem({
        name: 'カジュアルTシャツ',
        category: 'tops',
        subCategory: 't-shirt',
        color: 'blue',
        colors: ['blue'],
        formality: 1,
        warmthLevel: 1,
        waterResistant: false,
        windResistant: false,
        tags: [],
      });
      wardrobe.addItem({
        name: 'ビジカジシャツ',
        category: 'tops',
        subCategory: 'shirt',
        color: 'light_blue',
        colors: ['light_blue'],
        formality: 3,
        warmthLevel: 2,
        waterResistant: false,
        windResistant: false,
        tags: [],
      });
    });

    it('should return items within formality range', () => {
      const formalItems = wardrobe.getItemsByFormality(4, 5);
      expect(formalItems.length).toBe(1);
      expect(formalItems[0].name).toBe('フォーマルシャツ');

      const casualItems = wardrobe.getItemsByFormality(1, 2);
      expect(casualItems.length).toBe(1);

      const businessCasual = wardrobe.getItemsByFormality(2, 4);
      expect(businessCasual.length).toBe(1);
    });
  });

  describe('recordWear', () => {
    it('should update lastWorn and wearCount', () => {
      const item = wardrobe.addItem({
        name: 'シャツ',
        category: 'tops',
        subCategory: 'shirt',
        color: 'white',
        colors: ['white'],
        formality: 3,
        warmthLevel: 2,
        waterResistant: false,
        windResistant: false,
        tags: [],
      });

      expect(item.wearCount).toBe(0);
      expect(item.lastWorn).toBeUndefined();

      wardrobe.recordWear(item.id);

      const updatedItem = wardrobe.getItem(item.id);
      expect(updatedItem?.wearCount).toBe(1);
      expect(updatedItem?.lastWorn).toBeDefined();
    });
  });

  describe('getRecentlyWorn', () => {
    it('should return items worn within specified days', () => {
      const item1 = wardrobe.addItem({
        name: 'シャツ1',
        category: 'tops',
        subCategory: 'shirt',
        color: 'white',
        colors: ['white'],
        formality: 3,
        warmthLevel: 2,
        waterResistant: false,
        windResistant: false,
        tags: [],
      });

      const item2 = wardrobe.addItem({
        name: 'シャツ2',
        category: 'tops',
        subCategory: 'shirt',
        color: 'blue',
        colors: ['blue'],
        formality: 3,
        warmthLevel: 2,
        waterResistant: false,
        windResistant: false,
        tags: [],
      });

      wardrobe.recordWear(item1.id);
      // item2 not worn

      const recentlyWorn = wardrobe.getRecentlyWorn(7);
      expect(recentlyWorn.length).toBe(1);
      expect(recentlyWorn[0].id).toBe(item1.id);
    });
  });

  describe('getWaterResistantItems', () => {
    it('should return only water resistant items', () => {
      wardrobe.addItem({
        name: '普通の靴',
        category: 'shoes',
        subCategory: 'leather_shoes',
        color: 'black',
        colors: ['black'],
        formality: 4,
        warmthLevel: 2,
        waterResistant: false,
        windResistant: false,
        tags: [],
      });

      wardrobe.addItem({
        name: '撥水靴',
        category: 'shoes',
        subCategory: 'water_resistant_shoes',
        color: 'black',
        colors: ['black'],
        formality: 3,
        warmthLevel: 2,
        waterResistant: true,
        windResistant: false,
        tags: [],
      });

      const waterResistant = wardrobe.getWaterResistantItems();
      expect(waterResistant.length).toBe(1);
      expect(waterResistant[0].name).toBe('撥水靴');
    });
  });

  describe('serialization', () => {
    it('should serialize and deserialize correctly', () => {
      wardrobe.addItem({
        name: 'テストアイテム',
        category: 'tops',
        subCategory: 'shirt',
        color: 'white',
        colors: ['white'],
        formality: 3,
        warmthLevel: 2,
        waterResistant: false,
        windResistant: false,
        tags: ['テスト'],
      });

      const json = wardrobe.toJSON() as { userId: string; items: ClothingItem[] };
      const restored = Wardrobe.fromJSON(json);

      expect(restored.getUserId()).toBe('test-user');
      expect(restored.getItemCount()).toBe(1);
      expect(restored.getAllItems()[0].name).toBe('テストアイテム');
    });
  });
});
