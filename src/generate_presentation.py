#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
政令指定都市プレゼンテーション生成スクリプト
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from cities_data import DESIGNATED_CITIES


def create_title_slide(prs):
    """タイトルスライドを作成"""
    slide = prs.slides.add_slide(prs.slide_layouts[0])
    title = slide.shapes.title
    subtitle = slide.placeholders[1]

    title.text = "全国政令指定都市の魅力"
    subtitle.text = "住みたくなる20都市の完全ガイド"

    # タイトルのフォーマット
    title.text_frame.paragraphs[0].font.size = Pt(44)
    title.text_frame.paragraphs[0].font.bold = True
    title.text_frame.paragraphs[0].font.color.rgb = RGBColor(0, 51, 102)

    # サブタイトルのフォーマット
    subtitle.text_frame.paragraphs[0].font.size = Pt(28)
    subtitle.text_frame.paragraphs[0].font.color.rgb = RGBColor(102, 102, 102)


def create_overview_slide(prs):
    """概要スライドを作成"""
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    title = slide.shapes.title
    title.text = "政令指定都市とは？"

    # 本文テキストボックス
    left = Inches(1)
    top = Inches(2)
    width = Inches(8)
    height = Inches(4)

    textbox = slide.shapes.add_textbox(left, top, width, height)
    text_frame = textbox.text_frame
    text_frame.word_wrap = True

    content = """
政令指定都市は、日本の大都市制度の一つで、人口50万人以上の市が政令で指定されます。

【特徴】
• 通常の市より多くの権限を持つ
• 区を設置できる（行政区）
• 都道府県の仕事の一部を実施可能

【全国に20市が指定】
北海道・東北：札幌市、仙台市
関東：さいたま市、千葉市、横浜市、川崎市、相模原市
中部：新潟市、静岡市、浜松市、名古屋市
近畿：京都市、大阪市、堺市、神戸市
中国・四国：岡山市、広島市
九州：北九州市、福岡市、熊本市
    """

    p = text_frame.paragraphs[0]
    p.text = content.strip()
    p.font.size = Pt(16)
    p.line_spacing = 1.3


def create_city_slide(prs, city_data):
    """各都市のスライドを作成"""
    slide = prs.slides.add_slide(prs.slide_layouts[5])  # 空白レイアウト

    # タイトル（都市名）
    left = Inches(0.5)
    top = Inches(0.3)
    width = Inches(9)
    height = Inches(0.8)

    title_box = slide.shapes.add_textbox(left, top, width, height)
    title_frame = title_box.text_frame
    title_p = title_frame.paragraphs[0]
    title_p.text = f"{city_data['name']} ({city_data['region']})"
    title_p.font.size = Pt(36)
    title_p.font.bold = True
    title_p.font.color.rgb = RGBColor(0, 51, 102)
    title_p.alignment = PP_ALIGN.CENTER

    # 推奨度
    rec_left = Inches(0.5)
    rec_top = Inches(1.2)
    rec_width = Inches(9)
    rec_height = Inches(0.6)

    rec_box = slide.shapes.add_textbox(rec_left, rec_top, rec_width, rec_height)
    rec_frame = rec_box.text_frame
    rec_p = rec_frame.paragraphs[0]
    rec_p.text = f"推奨度：{city_data['recommendation']}"
    rec_p.font.size = Pt(24)
    rec_p.font.bold = True
    rec_p.font.color.rgb = RGBColor(255, 102, 0)
    rec_p.alignment = PP_ALIGN.CENTER

    # 基本情報ボックス
    info_left = Inches(0.5)
    info_top = Inches(2.0)
    info_width = Inches(4)
    info_height = Inches(2.5)

    info_box = slide.shapes.add_textbox(info_left, info_top, info_width, info_height)
    info_frame = info_box.text_frame
    info_frame.word_wrap = True

    info_text = f"""【基本情報】
人口：{city_data['population']}
生活コスト：{city_data['living_cost']}
気候：{city_data['climate']}

【魅力ポイント】
{city_data['appeal']}
"""

    info_p = info_frame.paragraphs[0]
    info_p.text = info_text
    info_p.font.size = Pt(14)
    info_p.line_spacing = 1.4

    # 特徴リスト
    highlights_left = Inches(5)
    highlights_top = Inches(2.0)
    highlights_width = Inches(4.5)
    highlights_height = Inches(3.5)

    highlights_box = slide.shapes.add_textbox(highlights_left, highlights_top, highlights_width, highlights_height)
    highlights_frame = highlights_box.text_frame
    highlights_frame.word_wrap = True

    highlights_title = highlights_frame.paragraphs[0]
    highlights_title.text = "【主な特徴】"
    highlights_title.font.size = Pt(16)
    highlights_title.font.bold = True
    highlights_title.font.color.rgb = RGBColor(0, 102, 51)

    for highlight in city_data['highlights']:
        p = highlights_frame.add_paragraph()
        p.text = f"• {highlight}"
        p.font.size = Pt(13)
        p.space_before = Pt(8)
        p.line_spacing = 1.3

    # 装飾用の図形（都市イメージカラー）
    shape_left = Inches(0.5)
    shape_top = Inches(4.8)
    shape_width = Inches(9)
    shape_height = Inches(0.3)

    shape = slide.shapes.add_shape(
        1,  # Rectangle
        shape_left, shape_top, shape_width, shape_height
    )

    # 地域ごとに色分け
    region_colors = {
        "北海道": RGBColor(100, 149, 237),  # コーンフラワーブルー
        "宮城県": RGBColor(34, 139, 34),     # フォレストグリーン
        "埼玉県": RGBColor(255, 140, 0),     # ダークオレンジ
        "千葉県": RGBColor(70, 130, 180),    # スチールブルー
        "神奈川県": RGBColor(30, 144, 255),  # ドジャーブルー
        "新潟県": RGBColor(100, 149, 237),   # コーンフラワーブルー
        "静岡県": RGBColor(255, 165, 0),     # オレンジ
        "愛知県": RGBColor(220, 20, 60),     # クリムゾン
        "京都府": RGBColor(138, 43, 226),    # ブルーバイオレット
        "大阪府": RGBColor(255, 69, 0),      # レッドオレンジ
        "兵庫県": RGBColor(123, 104, 238),   # ミディアムスレートブルー
        "岡山県": RGBColor(255, 215, 0),     # ゴールド
        "広島県": RGBColor(220, 20, 60),     # クリムゾン
        "福岡県": RGBColor(255, 99, 71),     # トマト
        "熊本県": RGBColor(255, 69, 0)       # レッドオレンジ
    }

    color = region_colors.get(city_data['region'], RGBColor(128, 128, 128))
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    shape.line.color.rgb = color


def create_comparison_slide(prs):
    """比較スライドを作成"""
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    title = slide.shapes.title
    title.text = "推奨度別一覧"

    left = Inches(0.8)
    top = Inches(1.8)
    width = Inches(8.5)
    height = Inches(4)

    textbox = slide.shapes.add_textbox(left, top, width, height)
    text_frame = textbox.text_frame
    text_frame.word_wrap = True

    # 推奨度別にグループ化
    five_star = [c['name'] for c in DESIGNATED_CITIES if c['recommendation'] == '★★★★★']
    four_star = [c['name'] for c in DESIGNATED_CITIES if c['recommendation'] == '★★★★☆']
    three_star = [c['name'] for c in DESIGNATED_CITIES if c['recommendation'] == '★★★☆☆']

    content = f"""
【★★★★★ 最高評価】
{', '.join(five_star)}

【★★★★☆ 高評価】
{', '.join(four_star)}

【★★★☆☆ 標準評価】
{', '.join(three_star)}

※推奨度は、都市の規模、利便性、文化、自然環境、
　経済力などを総合的に評価したものです。
    """

    p = text_frame.paragraphs[0]
    p.text = content.strip()
    p.font.size = Pt(16)
    p.line_spacing = 1.4


def create_conclusion_slide(prs):
    """結論スライドを作成"""
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    title = slide.shapes.title
    title.text = "あなたに合った都市を見つけよう"

    left = Inches(1)
    top = Inches(1.8)
    width = Inches(8)
    height = Inches(4)

    textbox = slide.shapes.add_textbox(left, top, width, height)
    text_frame = textbox.text_frame
    text_frame.word_wrap = True

    content = """
【選び方のポイント】

1. 仕事・キャリア重視 → 大都市圏（横浜、大阪、名古屋、福岡など）

2. 自然環境重視 → 札幌、新潟、静岡、熊本など

3. 歴史・文化重視 → 京都、広島、金沢（※政令市ではない）

4. コストパフォーマンス → 岡山、北九州、新潟など

5. バランス型 → 仙台、さいたま、神戸など


日本の政令指定都市は、それぞれ独自の魅力を持っています。
あなたのライフスタイルや価値観に合った都市を見つけて、
新しい生活をスタートさせてみませんか？
    """

    p = text_frame.paragraphs[0]
    p.text = content.strip()
    p.font.size = Pt(15)
    p.line_spacing = 1.4


def generate_presentation():
    """プレゼンテーション全体を生成"""
    prs = Presentation()
    prs.slide_width = Inches(10)
    prs.slide_height = Inches(7.5)

    print("プレゼンテーション生成開始...")

    # タイトルスライド
    print("- タイトルスライド作成")
    create_title_slide(prs)

    # 概要スライド
    print("- 概要スライド作成")
    create_overview_slide(prs)

    # 各都市のスライド
    for i, city in enumerate(DESIGNATED_CITIES, 1):
        print(f"- {city['name']}スライド作成 ({i}/{len(DESIGNATED_CITIES)})")
        create_city_slide(prs, city)

    # 比較スライド
    print("- 比較スライド作成")
    create_comparison_slide(prs)

    # 結論スライド
    print("- 結論スライド作成")
    create_conclusion_slide(prs)

    # 保存
    output_path = '/home/user/0123_01/output/政令指定都市の魅力.pptx'
    prs.save(output_path)
    print(f"\n完成！ファイルを保存しました: {output_path}")
    print(f"総スライド数: {len(prs.slides)}枚")

    return output_path


if __name__ == '__main__':
    generate_presentation()
