#!/usr/bin/env python3
"""
Script to generate Japan Population Dynamics Analysis Excel file
"""
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.chart import BarChart, LineChart, Reference
from datetime import datetime

def create_japan_population_excel():
    wb = Workbook()

    # Sheet 1: Overview & Summary
    ws1 = wb.active
    ws1.title = "概要サマリー"

    # Header
    ws1['A1'] = "日本の人口動態分析レポート"
    ws1['A1'].font = Font(size=16, bold=True)
    ws1['A2'] = f"作成日: {datetime.now().strftime('%Y年%m月%d日')}"

    # Key Statistics
    ws1['A4'] = "主要統計データ（2025-2026年）"
    ws1['A4'].font = Font(size=14, bold=True, color="FFFFFF")
    ws1['A4'].fill = PatternFill(start_color="4472C4", end_color="4472C4", fill_type="solid")

    headers = ["指標", "値", "備考"]
    for col, header in enumerate(headers, start=1):
        cell = ws1.cell(row=5, column=col, value=header)
        cell.font = Font(bold=True)
        cell.fill = PatternFill(start_color="D9E1F2", end_color="D9E1F2", fill_type="solid")

    data = [
        ["現在の総人口", "約123.4百万人", "2025年4月時点"],
        ["人口ピーク", "128.5百万人", "2010年"],
        ["中央年齢", "49.8歳", "世界第2位の高齢社会"],
        ["合計特殊出生率", "1.2", "人口置換水準2.1を大幅に下回る"],
        ["都市人口率", "93.13%", "114.6百万人"],
        ["人口密度", "338人/km²", ""],
        ["年間人口減少予測", "約100万人/年", "2026年は-148,412人"],
        ["2060年予測人口", "約70百万人", "現在から約45%減少"],
        ["2060年高齢化率予測", "40%以上", "65歳以上人口比率"],
    ]

    for row_idx, row_data in enumerate(data, start=6):
        for col_idx, value in enumerate(row_data, start=1):
            ws1.cell(row=row_idx, column=col_idx, value=value)

    # Column widths
    ws1.column_dimensions['A'].width = 25
    ws1.column_dimensions['B'].width = 20
    ws1.column_dimensions['C'].width = 35

    # Sheet 2: Historical Population Trends
    ws2 = wb.create_sheet("人口推移")
    ws2['A1'] = "日本の人口推移（1950-2060年）"
    ws2['A1'].font = Font(size=14, bold=True)

    headers2 = ["年", "総人口（百万人）", "出生数（千人）", "死亡数（千人）", "自然増減（千人）"]
    for col, header in enumerate(headers2, start=1):
        cell = ws2.cell(row=3, column=col, value=header)
        cell.font = Font(bold=True)
        cell.fill = PatternFill(start_color="D9E1F2", end_color="D9E1F2", fill_type="solid")

    # Historical and projected data
    population_data = [
        [1950, 83.2, 2337, 904, 1433],
        [1960, 93.4, 1606, 706, 900],
        [1970, 104.3, 1934, 713, 1221],
        [1980, 117.1, 1577, 722, 855],
        [1990, 123.6, 1222, 820, 402],
        [2000, 126.9, 1191, 962, 229],
        [2010, 128.5, 1071, 1197, -126],
        [2015, 127.1, 1005, 1290, -285],
        [2020, 125.8, 840, 1372, -532],
        [2025, 123.4, 750, 1450, -700],
        [2030, 120.7, 700, 1500, -800],
        [2040, 110.9, 650, 1550, -900],
        [2050, 97.1, 600, 1600, -1000],
        [2060, 86.7, 550, 1650, -1100],
    ]

    for row_idx, row_data in enumerate(population_data, start=4):
        for col_idx, value in enumerate(row_data, start=1):
            ws2.cell(row=row_idx, column=col_idx, value=value)

    ws2.column_dimensions['A'].width = 10
    for col in ['B', 'C', 'D', 'E']:
        ws2.column_dimensions[col].width = 18

    # Sheet 3: Age Demographics
    ws3 = wb.create_sheet("年齢別人口構成")
    ws3['A1'] = "年齢別人口構成の推移"
    ws3['A1'].font = Font(size=14, bold=True)

    headers3 = ["年", "0-14歳(%)", "15-64歳(%)", "65歳以上(%)", "75歳以上(%)", "中央年齢(歳)"]
    for col, header in enumerate(headers3, start=1):
        cell = ws3.cell(row=3, column=col, value=header)
        cell.font = Font(bold=True)
        cell.fill = PatternFill(start_color="D9E1F2", end_color="D9E1F2", fill_type="solid")

    age_data = [
        [1950, 35.4, 59.6, 5.0, 1.3, 22.0],
        [1960, 30.2, 64.2, 5.6, 1.7, 25.6],
        [1970, 24.0, 68.9, 7.1, 2.1, 29.0],
        [1980, 23.5, 67.3, 9.2, 3.1, 32.5],
        [1990, 18.2, 69.5, 12.3, 4.8, 37.4],
        [2000, 14.6, 68.0, 17.4, 7.1, 41.4],
        [2010, 13.2, 63.8, 23.0, 11.1, 44.7],
        [2015, 12.5, 60.7, 26.8, 12.8, 46.4],
        [2020, 11.9, 59.1, 29.0, 14.9, 48.6],
        [2025, 11.5, 58.5, 30.0, 16.5, 49.8],
        [2030, 10.8, 57.7, 31.5, 18.1, 51.4],
        [2040, 10.0, 53.3, 36.7, 20.2, 54.2],
        [2050, 9.5, 51.4, 39.1, 24.6, 56.7],
        [2060, 9.1, 50.4, 40.5, 26.9, 58.4],
    ]

    for row_idx, row_data in enumerate(age_data, start=4):
        for col_idx, value in enumerate(row_data, start=1):
            ws3.cell(row=row_idx, column=col_idx, value=value)

    for col in ['A', 'B', 'C', 'D', 'E', 'F']:
        ws3.column_dimensions[col].width = 15

    # Sheet 4: Regional Analysis
    ws4 = wb.create_sheet("都道府県別人口")
    ws4['A1'] = "主要都道府県の人口（2025年推定）"
    ws4['A1'].font = Font(size=14, bold=True)

    headers4 = ["都道府県", "人口（千人）", "人口密度（人/km²）", "高齢化率(%)", "増減率(%)"]
    for col, header in enumerate(headers4, start=1):
        cell = ws4.cell(row=3, column=col, value=header)
        cell.font = Font(bold=True)
        cell.fill = PatternFill(start_color="D9E1F2", end_color="D9E1F2", fill_type="solid")

    prefecture_data = [
        ["東京都", 14100, 6402, 23.5, 0.5],
        ["神奈川県", 9240, 3844, 26.2, 0.1],
        ["大阪府", 8800, 4639, 29.3, -0.3],
        ["愛知県", 7550, 1461, 26.8, 0.2],
        ["埼玉県", 7350, 1936, 28.1, 0.0],
        ["千葉県", 6280, 1218, 29.5, -0.1],
        ["兵庫県", 5470, 652, 30.7, -0.4],
        ["北海道", 5200, 62, 33.5, -0.8],
        ["福岡県", 5130, 1033, 29.2, -0.2],
        ["静岡県", 3630, 468, 32.1, -0.5],
        ["秋田県", 930, 79, 39.8, -1.5],
        ["青森県", 1200, 124, 35.2, -1.2],
    ]

    for row_idx, row_data in enumerate(prefecture_data, start=4):
        for col_idx, value in enumerate(row_data, start=1):
            ws4.cell(row=row_idx, column=col_idx, value=value)

    ws4.column_dimensions['A'].width = 15
    for col in ['B', 'C', 'D', 'E']:
        ws4.column_dimensions[col].width = 18

    # Sheet 5: International Comparison
    ws5 = wb.create_sheet("国際比較")
    ws5['A1'] = "主要国との人口動態比較（2025年）"
    ws5['A1'].font = Font(size=14, bold=True)

    headers5 = ["国名", "総人口（百万人）", "中央年齢（歳）", "合計特殊出生率", "65歳以上人口率(%)"]
    for col, header in enumerate(headers5, start=1):
        cell = ws5.cell(row=3, column=col, value=header)
        cell.font = Font(bold=True)
        cell.fill = PatternFill(start_color="D9E1F2", end_color="D9E1F2", fill_type="solid")

    comparison_data = [
        ["日本", 123.4, 49.8, 1.2, 30.0],
        ["中国", 1425.7, 39.0, 1.1, 14.9],
        ["アメリカ", 339.9, 38.5, 1.7, 17.0],
        ["ドイツ", 83.4, 47.8, 1.5, 22.1],
        ["イタリア", 58.9, 48.2, 1.2, 24.1],
        ["韓国", 51.7, 45.0, 0.7, 18.4],
        ["フランス", 68.0, 42.0, 1.8, 21.3],
        ["イギリス", 68.3, 40.6, 1.6, 19.2],
    ]

    for row_idx, row_data in enumerate(comparison_data, start=4):
        for col_idx, value in enumerate(row_data, start=1):
            ws5.cell(row=row_idx, column=col_idx, value=value)

    for col in ['A', 'B', 'C', 'D', 'E']:
        ws5.column_dimensions[col].width = 20

    # Sheet 6: Challenges and Future
    ws6 = wb.create_sheet("課題と展望")
    ws6['A1'] = "人口減少・高齢化の課題と対策"
    ws6['A1'].font = Font(size=14, bold=True)

    ws6['A3'] = "主要課題"
    ws6['A3'].font = Font(size=12, bold=True, color="FFFFFF")
    ws6['A3'].fill = PatternFill(start_color="C00000", end_color="C00000", fill_type="solid")

    challenges = [
        "1. 労働力人口の減少",
        "   - 生産年齢人口（15-64歳）の継続的な減少",
        "   - 2060年には総人口の約50%まで低下予測",
        "",
        "2. 社会保障費の増大",
        "   - 高齢者人口の増加による医療・介護費用の急増",
        "   - 現役世代の負担増加",
        "",
        "3. 地域の過疎化",
        "   - 地方部での人口減少の加速",
        "   - 限界集落の増加",
        "",
        "4. 経済成長の鈍化",
        "   - 内需の縮小",
        "   - イノベーション創出力の低下懸念",
    ]

    for idx, challenge in enumerate(challenges, start=4):
        ws6.cell(row=idx, column=1, value=challenge)

    ws6.cell(row=len(challenges)+5, column=1, value="対策・施策").font = Font(size=12, bold=True, color="FFFFFF")
    ws6.cell(row=len(challenges)+5, column=1).fill = PatternFill(start_color="70AD47", end_color="70AD47", fill_type="solid")

    solutions = [
        "1. 少子化対策",
        "   - 子育て支援の充実（保育所整備、育児休業制度拡充）",
        "   - 経済的支援（児童手当の増額、教育費負担軽減）",
        "",
        "2. 女性・高齢者の労働参加促進",
        "   - 働き方改革の推進",
        "   - 定年延長、再雇用制度の拡充",
        "",
        "3. 外国人材の受け入れ",
        "   - 技能実習制度の見直し",
        "   - 高度人材の誘致",
        "",
        "4. 生産性向上",
        "   - DX（デジタルトランスフォーメーション）の推進",
        "   - AI・ロボット活用による自動化",
        "",
        "5. 地方創生",
        "   - 地方移住促進",
        "   - リモートワークの普及支援",
    ]

    start_row = len(challenges) + 6
    for idx, solution in enumerate(solutions, start=start_row):
        ws6.cell(row=idx, column=1, value=solution)

    ws6.column_dimensions['A'].width = 60

    # Save the workbook
    output_file = "/home/user/0123_01/日本人口動態分析.xlsx"
    wb.save(output_file)
    print(f"Excel file created successfully: {output_file}")
    return output_file

if __name__ == "__main__":
    create_japan_population_excel()
