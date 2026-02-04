import { v4 as uuidv4 } from 'uuid';
import {
  ClothingItem,
  ClothingCategory,
  ClothingSubCategory,
  Color,
  Formality,
} from '../types';

export class Wardrobe {
  private items: Map<string, ClothingItem> = new Map();
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  addItem(item: Omit<ClothingItem, 'id' | 'wearCount'>): ClothingItem {
    const newItem: ClothingItem = {
      ...item,
      id: uuidv4(),
      wearCount: 0,
      colors: item.colors || [item.color],
    };
    this.items.set(newItem.id, newItem);
    return newItem;
  }

  removeItem(itemId: string): boolean {
    return this.items.delete(itemId);
  }

  getItem(itemId: string): ClothingItem | undefined {
    return this.items.get(itemId);
  }

  getAllItems(): ClothingItem[] {
    return Array.from(this.items.values());
  }

  getItemsByCategory(category: ClothingCategory): ClothingItem[] {
    return this.getAllItems().filter(item => item.category === category);
  }

  getItemsBySubCategory(subCategory: ClothingSubCategory): ClothingItem[] {
    return this.getAllItems().filter(item => item.subCategory === subCategory);
  }

  getItemsByFormality(minFormality: Formality, maxFormality: Formality): ClothingItem[] {
    return this.getAllItems().filter(
      item => item.formality >= minFormality && item.formality <= maxFormality
    );
  }

  getItemsByColor(color: Color): ClothingItem[] {
    return this.getAllItems().filter(
      item => item.color === color || item.colors.includes(color)
    );
  }

  getWaterResistantItems(): ClothingItem[] {
    return this.getAllItems().filter(item => item.waterResistant);
  }

  getItemsByWarmth(minWarmth: number, maxWarmth: number): ClothingItem[] {
    return this.getAllItems().filter(
      item => item.warmthLevel >= minWarmth && item.warmthLevel <= maxWarmth
    );
  }

  getTops(): ClothingItem[] {
    return this.getItemsByCategory('tops');
  }

  getBottoms(): ClothingItem[] {
    return this.getItemsByCategory('bottoms');
  }

  getOuterwear(): ClothingItem[] {
    return this.getItemsByCategory('outerwear');
  }

  getShoes(): ClothingItem[] {
    return this.getItemsByCategory('shoes');
  }

  getAccessories(): ClothingItem[] {
    return this.getItemsByCategory('accessories');
  }

  getBags(): ClothingItem[] {
    return this.getItemsByCategory('bags');
  }

  recordWear(itemId: string): void {
    const item = this.items.get(itemId);
    if (item) {
      item.lastWorn = new Date();
      item.wearCount += 1;
      this.items.set(itemId, item);
    }
  }

  getRecentlyWorn(days: number = 7): ClothingItem[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return this.getAllItems().filter(
      item => item.lastWorn && item.lastWorn >= cutoff
    );
  }

  getUnwornItems(days: number = 30): ClothingItem[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return this.getAllItems().filter(
      item => !item.lastWorn || item.lastWorn < cutoff
    );
  }

  searchByTags(tags: string[]): ClothingItem[] {
    return this.getAllItems().filter(
      item => tags.some(tag => item.tags.includes(tag))
    );
  }

  getItemCount(): number {
    return this.items.size;
  }

  getUserId(): string {
    return this.userId;
  }

  toJSON(): object {
    return {
      userId: this.userId,
      items: Array.from(this.items.values()),
    };
  }

  static fromJSON(data: { userId: string; items: ClothingItem[] }): Wardrobe {
    const wardrobe = new Wardrobe(data.userId);
    for (const item of data.items) {
      wardrobe.items.set(item.id, item);
    }
    return wardrobe;
  }
}
