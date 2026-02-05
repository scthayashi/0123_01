/**
 * コーディネート提案アプリ デモスクリプト
 *
 * 実行方法:
 *   npx ts-node examples/demo.ts
 */

import { OutfitRecommendationApp } from '../src';
import { User } from '../src/models/User';
import { Wardrobe } from '../src/models/Wardrobe';

async function main() {
  console.log('========================================');
  console.log('コーディネート提案アプリ デモ');
  console.log('========================================\n');

  // 1. ユーザーとワードローブの作成
  console.log('【STEP 1】ワードローブを作成中...\n');

  const wardrobe = new Wardrobe('demo-user');

  // サンプルアイテムを追加
  const shirt = wardrobe.addItem({
    name: '白シャツ',
    category: 'tops',
    subCategory: 'shirt',
    color: 'white',
    colors: ['white'],
    formality: 4,
    warmthLevel: 2,
    waterResistant: false,
    windResistant: false,
    tags: ['ビジネス', '定番'],
  });

  const blueShirt = wardrobe.addItem({
    name: 'ライトブルーシャツ',
    category: 'tops',
    subCategory: 'shirt',
    color: 'light_blue',
    colors: ['light_blue'],
    formality: 3,
    warmthLevel: 2,
    waterResistant: false,
    windResistant: false,
    tags: ['ビジカジ'],
  });

  const sweater = wardrobe.addItem({
    name: 'ネイビーセーター',
    category: 'tops',
    subCategory: 'sweater',
    color: 'navy',
    colors: ['navy'],
    formality: 3,
    warmthLevel: 4,
    waterResistant: false,
    windResistant: false,
    tags: ['秋冬'],
  });

  const pants = wardrobe.addItem({
    name: 'グレースラックス',
    category: 'bottoms',
    subCategory: 'dress_pants',
    color: 'gray',
    colors: ['gray'],
    formality: 4,
    warmthLevel: 3,
    waterResistant: false,
    windResistant: false,
    tags: ['ビジネス'],
  });

  const chinos = wardrobe.addItem({
    name: 'ベージュチノ',
    category: 'bottoms',
    subCategory: 'chinos',
    color: 'beige',
    colors: ['beige'],
    formality: 2,
    warmthLevel: 2,
    waterResistant: false,
    windResistant: false,
    tags: ['カジュアル'],
  });

  const blazer = wardrobe.addItem({
    name: 'ネイビーブレザー',
    category: 'outerwear',
    subCategory: 'blazer',
    color: 'navy',
    colors: ['navy'],
    formality: 4,
    warmthLevel: 3,
    waterResistant: false,
    windResistant: true,
    tags: ['勝負服'],
  });

  const trenchCoat = wardrobe.addItem({
    name: 'ベージュトレンチ',
    category: 'outerwear',
    subCategory: 'trench_coat',
    color: 'beige',
    colors: ['beige'],
    formality: 4,
    warmthLevel: 3,
    waterResistant: true,
    windResistant: true,
    tags: ['雨の日OK'],
  });

  const leatherShoes = wardrobe.addItem({
    name: '黒革靴',
    category: 'shoes',
    subCategory: 'leather_shoes',
    color: 'black',
    colors: ['black'],
    formality: 5,
    warmthLevel: 2,
    waterResistant: false,
    windResistant: false,
    tags: ['フォーマル'],
  });

  const waterResistantShoes = wardrobe.addItem({
    name: '撥水ビジネスシューズ',
    category: 'shoes',
    subCategory: 'water_resistant_shoes',
    color: 'black',
    colors: ['black'],
    formality: 4,
    warmthLevel: 2,
    waterResistant: true,
    windResistant: false,
    tags: ['雨の日'],
  });

  const loafers = wardrobe.addItem({
    name: 'ブラウンローファー',
    category: 'shoes',
    subCategory: 'loafers',
    color: 'brown',
    colors: ['brown'],
    formality: 3,
    warmthLevel: 2,
    waterResistant: false,
    windResistant: false,
    tags: ['ビジカジ'],
  });

  console.log(`✓ ${wardrobe.getItemCount()}点のアイテムを登録しました\n`);

  // 2. ユーザー作成
  const user = User.createWithWardrobe('demo-user', wardrobe, {
    temperatureSensitivity: 'normal',
    defaultFormality: 3,
    favoriteColors: ['navy', 'white', 'gray'],
    avoidColors: ['pink'],
    preferredBrands: [],
    commuteMethod: 'train',
  });

  // 3. アプリ初期化
  const app = new OutfitRecommendationApp(user);

  // 4. 印象プリセット一覧を表示
  console.log('【STEP 2】利用可能な印象プリセット:\n');
  const presets = app.getImpressionPresets();
  presets.forEach((preset, i) => {
    console.log(`  ${i + 1}. ${preset.displayName}`);
    console.log(`     ${preset.description}\n`);
  });

  // 5. 提案を取得
  console.log('【STEP 3】今日のコーディネートを提案中...\n');

  try {
    const recommendation = await app.getQuickRecommendation('trustworthy');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(app.formatRecommendationDetails());
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 6. 代替案を表示
    const alternatives = app.getAlternatives();
    if (alternatives.length > 0) {
      console.log(`【代替案】${alternatives.length}件\n`);
      alternatives.forEach((alt, i) => {
        console.log(`  代替案${i + 1}: ${alt.reason}`);
        console.log(`    スコア: ${Math.round(alt.score)}点\n`);
      });
    }

    // 7. ワンタップ確定
    console.log('【STEP 4】「このまま行く」を選択...\n');
    const result = app.confirmOutfit();
    console.log(`✓ ${result.message}\n`);

    // 8. フィードバック
    console.log('【STEP 5】帰宅後のフィードバック...\n');
    const feedbackResult = app.feedbackComfort(result.outfitId, 'comfortable');
    console.log(`✓ ${feedbackResult.message}`);
    console.log(`  学習効果: ${feedbackResult.learningImpact}\n`);

    // 9. 学習インサイト
    console.log('【学習データ】');
    const insights = app.getLearningInsights();
    console.log(`  フィードバック数: ${insights.totalFeedback}`);
    console.log(`  着用率: ${Math.round(insights.wearRate * 100)}%`);
    console.log(`  体感傾向: ${insights.temperatureTendency}`);
    if (insights.insights.length > 0) {
      console.log(`  インサイト:`);
      insights.insights.forEach(insight => console.log(`    - ${insight}`));
    }

  } catch (error) {
    console.error('エラーが発生しました:', error);
  }

  console.log('\n========================================');
  console.log('デモ完了');
  console.log('========================================');
}

main().catch(console.error);
