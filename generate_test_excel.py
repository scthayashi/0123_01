"""
総合テスト用Excelテンプレート生成スクリプト
大手生命保険会社 CSM AIエージェント構築プロジェクト
"""

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter


# --- Style definitions ---
HEADER_FILL = PatternFill(start_color="00B0F0", end_color="00B0F0", fill_type="solid")
SUB_HEADER_FILL = PatternFill(start_color="00B0F0", end_color="00B0F0", fill_type="solid")
HEADER_FONT = Font(name="Meiryo", bold=True, color="FFFFFF", size=10)
NORMAL_FONT = Font(name="Meiryo", size=10)
BOLD_FONT = Font(name="Meiryo", bold=True, size=10)

THIN_BORDER = Border(
    left=Side(style="thin"),
    right=Side(style="thin"),
    top=Side(style="thin"),
    bottom=Side(style="thin"),
)

CENTER_ALIGN = Alignment(horizontal="center", vertical="center", wrap_text=True)
LEFT_ALIGN = Alignment(horizontal="left", vertical="center", wrap_text=True)


def apply_header_style(ws, row, col_start, col_end):
    """Apply header styling to a range of cells."""
    for col in range(col_start, col_end + 1):
        cell = ws.cell(row=row, column=col)
        cell.fill = HEADER_FILL
        cell.font = HEADER_FONT
        cell.alignment = CENTER_ALIGN
        cell.border = THIN_BORDER


def apply_cell_style(ws, row, col_start, col_end, font=None):
    """Apply normal cell styling."""
    for col in range(col_start, col_end + 1):
        cell = ws.cell(row=row, column=col)
        cell.font = font or NORMAL_FONT
        cell.alignment = LEFT_ALIGN
        cell.border = THIN_BORDER


def set_column_widths(ws, widths):
    """Set column widths from a dict of {col_index: width}."""
    for col_idx, width in widths.items():
        ws.column_dimensions[get_column_letter(col_idx)].width = width


# ============================================================
# Sheet 1: 【管理用】要件定義一覧
# ============================================================
def create_requirements_sheet(wb):
    ws = wb.active
    ws.title = "【管理用】要件定義一覧"

    # Merged header row 1 - "テスト" spans columns 4-5
    ws.merge_cells("D1:E1")
    ws.cell(row=1, column=4, value="テスト")
    apply_header_style(ws, 1, 1, 5)
    # Leave A1-C1 with header fill but empty (they merge visually with row 2)

    # Header row 2
    headers = ["No.", "分類", "要件", "シナリオID", "ケースID"]
    for col, h in enumerate(headers, 1):
        ws.cell(row=2, column=col, value=h)
    apply_header_style(ws, 2, 1, 5)

    # Merge row 1 cells for No., 分類, 要件 vertically
    ws.merge_cells("A1:A2")
    ws.merge_cells("B1:B2")
    ws.merge_cells("C1:C2")
    ws.cell(row=1, column=1, value="No.")
    ws.cell(row=1, column=2, value="分類")
    ws.cell(row=1, column=3, value="要件")
    apply_header_style(ws, 1, 1, 5)

    # Sample data
    sample_data = [
        [1, "機能要件", "通話要約", "IT-SN-01", "IT-CS-01, IT-CS-02"],
        [2, "機能要件", "顧客要約", "IT-SN-02", "IT-CS-03, IT-CS-04"],
        [3, "機能要件", "商品提案", "IT-SN-03", "IT-CS-05, IT-CS-06"],
        [4, "機能要件", "ナレッジ作成", "IT-SN-04", "IT-CS-07, IT-CS-08"],
        [5, "非機能要件", "セキュリティ（閉域網）", "IT-SN-05", "IT-CS-09"],
        [6, "非機能要件", "パフォーマンス", "IT-SN-06", "IT-CS-10"],
        [7, "非機能要件", "可用性", "IT-SN-07", "IT-CS-11"],
    ]

    for row_idx, row_data in enumerate(sample_data, 3):
        for col_idx, value in enumerate(row_data, 1):
            ws.cell(row=row_idx, column=col_idx, value=value)
        apply_cell_style(ws, row_idx, 1, 5)

    set_column_widths(ws, {1: 8, 2: 20, 3: 40, 4: 30, 5: 30})
    ws.sheet_properties.tabColor = "00B0F0"


# ============================================================
# Sheet 2: 【管理用】シナリオ-ケース一覧
# ============================================================
def create_scenario_case_list_sheet(wb):
    ws = wb.create_sheet("【管理用】シナリオ-ケース一覧")

    headers = [
        "シナリオID", "シナリオ名", "ケースID", "ケース名",
        "重要度/優先度", "ステータス", "最終結果"
    ]
    for col, h in enumerate(headers, 1):
        ws.cell(row=1, column=col, value=h)
    apply_header_style(ws, 1, 1, len(headers))

    sample_data = [
        ["IT-SN-01", "通話要約の自動生成検証", "IT-CS-01",
         "録音テキスト入力時のSFDC項目への自動マッピング検証",
         "高（必須）", "未着手", ""],
        ["IT-SN-01", "通話要約の自動生成検証", "IT-CS-02",
         "通話要約の正確性・網羅性検証",
         "高（必須）", "未着手", ""],
        ["IT-SN-02", "顧客要約の自動生成検証", "IT-CS-03",
         "顧客情報からの要約生成精度検証",
         "高（必須）", "未着手", ""],
        ["IT-SN-02", "顧客要約の自動生成検証", "IT-CS-04",
         "複数通話履歴を統合した顧客要約検証",
         "中", "未着手", ""],
        ["IT-SN-03", "商品提案支援の検証", "IT-CS-05",
         "顧客ニーズに基づく商品提案精度検証",
         "高（必須）", "未着手", ""],
        ["IT-SN-03", "商品提案支援の検証", "IT-CS-06",
         "提案理由の説明妥当性検証",
         "中", "未着手", ""],
        ["IT-SN-04", "ナレッジ作成の検証", "IT-CS-07",
         "ケース情報からのナレッジ自動生成検証",
         "高（必須）", "未着手", ""],
        ["IT-SN-04", "ナレッジ作成の検証", "IT-CS-08",
         "ナレッジの検索性・再利用性検証",
         "中", "未着手", ""],
        ["IT-SN-05", "セキュリティ検証", "IT-CS-09",
         "閉域網環境でのAPI通信検証",
         "高（必須）", "未着手", ""],
        ["IT-SN-06", "パフォーマンス検証", "IT-CS-10",
         "AI応答時間・スループット検証",
         "中", "未着手", ""],
        ["IT-SN-07", "可用性検証", "IT-CS-11",
         "障害時のフェイルオーバー・リカバリ検証",
         "中", "未着手", ""],
    ]

    for row_idx, row_data in enumerate(sample_data, 2):
        for col_idx, value in enumerate(row_data, 1):
            ws.cell(row=row_idx, column=col_idx, value=value)
        apply_cell_style(ws, row_idx, 1, len(headers))

    set_column_widths(ws, {1: 15, 2: 30, 3: 15, 4: 45, 5: 18, 6: 20, 7: 15})
    ws.sheet_properties.tabColor = "00B0F0"


# ============================================================
# Sheet 3: 総合テストシナリオ・ケース定義書
# ============================================================
def create_test_case_definition_sheet(wb):
    ws = wb.create_sheet("総合テストケース定義書")

    headers = [
        "ケースID", "テストシナリオ", "テスト環境", "要件",
        "テストステップ", "入力データ", "期待値（システム挙動）",
        "判定", "テスト予定日", "テスト実行者", "テスト実行日",
        "テスト実施結果", "証跡No/リンク", "備考"
    ]
    for col, h in enumerate(headers, 1):
        ws.cell(row=1, column=col, value=h)
    apply_header_style(ws, 1, 1, len(headers))

    sample_data = [
        [
            "IT-CS-01",
            "録音テキスト入力時のSFDC項目への自動マッピング検証",
            "開発",
            "通話要約",
            "1. SFのケース画面を開く\n2. 録音テキストを入力欄に貼り付ける\n3. AIエージェントを実行する\n4. 通話要約項目を確認する",
            "通話録音テキスト（テストデータ001）",
            "SFの通話要約項目に値が格納されること",
            "",
            "2026/2/10",
            "",
            "",
            "",
            "",
            "",
        ],
        [
            "IT-CS-02",
            "通話要約の正確性・網羅性検証",
            "開発",
            "通話要約",
            "1. テストデータで通話要約を生成する\n2. 元の通話内容と要約を比較する\n3. 重要事項の網羅性を確認する",
            "通話録音テキスト（テストデータ002）",
            "通話の要点（顧客名、相談内容、対応結果等）が正確に要約されていること",
            "",
            "2026/2/10",
            "",
            "",
            "",
            "",
            "",
        ],
        [
            "IT-CS-03",
            "顧客情報からの要約生成精度検証",
            "開発",
            "顧客要約",
            "1. 対象顧客のSFレコードを開く\n2. 顧客要約生成を実行する\n3. 生成された要約を確認する",
            "顧客レコード（テストデータ003）",
            "顧客の基本情報・過去の問い合わせ履歴が正確に要約されること",
            "",
            "2026/2/12",
            "",
            "",
            "",
            "",
            "",
        ],
        [
            "IT-CS-05",
            "顧客ニーズに基づく商品提案精度検証",
            "開発",
            "商品提案",
            "1. 通話要約と顧客情報を入力する\n2. 商品提案AIを実行する\n3. 提案された商品と理由を確認する",
            "通話要約＋顧客情報（テストデータ005）",
            "顧客のニーズに合致した商品が提案され、提案理由が妥当であること",
            "",
            "2026/2/14",
            "",
            "",
            "",
            "",
            "",
        ],
        [
            "IT-CS-07",
            "ケース情報からのナレッジ自動生成検証",
            "開発",
            "ナレッジ作成",
            "1. 完了済みケースを選択する\n2. ナレッジ自動生成を実行する\n3. 生成されたナレッジ記事を確認する",
            "完了済みケースレコード（テストデータ007）",
            "ケースの対応内容がナレッジ記事として適切にフォーマットされること",
            "",
            "2026/2/17",
            "",
            "",
            "",
            "",
            "",
        ],
        [
            "IT-CS-09",
            "閉域網環境でのAPI通信検証",
            "ステージング",
            "セキュリティ（閉域網）",
            "1. 閉域網環境からAzure OpenAI APIへ接続する\n2. リクエスト/レスポンスを確認する\n3. 外部アクセスが遮断されていることを確認する",
            "API接続テスト用リクエスト",
            "閉域網経由でのみAPI通信が成功し、パブリック経由ではアクセス不可であること",
            "",
            "2026/2/20",
            "",
            "",
            "",
            "",
            "",
        ],
        [
            "IT-CS-10",
            "AI応答時間・スループット検証",
            "ステージング",
            "パフォーマンス",
            "1. 通話要約リクエストを送信する\n2. 応答時間を計測する\n3. 同時リクエストでスループットを測定する",
            "標準的な通話テキスト（約3000文字）",
            "応答時間が許容範囲内（要定義）であること",
            "",
            "2026/2/22",
            "",
            "",
            "",
            "",
            "",
        ],
    ]

    for row_idx, row_data in enumerate(sample_data, 2):
        for col_idx, value in enumerate(row_data, 1):
            ws.cell(row=row_idx, column=col_idx, value=value)
        apply_cell_style(ws, row_idx, 1, len(headers))

    set_column_widths(ws, {
        1: 12, 2: 40, 3: 15, 4: 18, 5: 50, 6: 35,
        7: 45, 8: 10, 9: 15, 10: 15, 11: 15, 12: 18, 13: 18, 14: 20
    })
    ws.sheet_properties.tabColor = "FFC000"


# ============================================================
# Sheet 4: 精度評価
# ============================================================
def create_accuracy_evaluation_sheet(wb):
    ws = wb.create_sheet("精度評価")

    # Row 1: Section headers (merged)
    section_headers = [
        ("A1:D1", "1. 入力と生成"),
        ("E1:G1", "2. 人間による評価"),
        ("H1:J1", "3. 分析と対応"),
        ("K1:M1", "4. 再検証"),
    ]
    for cell_range, title in section_headers:
        ws.merge_cells(cell_range)
        start_cell = cell_range.split(":")[0]
        ws[start_cell] = title
    apply_header_style(ws, 1, 1, 13)

    # Row 2: Column headers
    headers = [
        "サンプルID", "入力データ", "プロンプトVer.", "AI出力結果",
        "総合スコア(1-5)", "NG理由フラグ", "具体的フィードバック",
        "課題分類", "修正内容(Log)", "修正担当者",
        "修正後スコア(1-5)", "ステータス", "完了日"
    ]
    for col, h in enumerate(headers, 1):
        ws.cell(row=2, column=col, value=h)
    apply_header_style(ws, 2, 1, len(headers))

    sample_data = [
        [
            "SPL-001",
            "通話録音テストデータ001\n（医療保険に関する問い合わせ）",
            "v1.0",
            "（AIが生成した通話要約が入る）",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
        ],
        [
            "SPL-002",
            "通話録音テストデータ002\n（契約変更に関する問い合わせ）",
            "v1.0",
            "（AIが生成した通話要約が入る）",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
        ],
        [
            "SPL-003",
            "顧客レコードテストデータ003\n（長期契約顧客）",
            "v1.0",
            "（AIが生成した顧客要約が入る）",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
        ],
        [
            "SPL-004",
            "通話要約＋顧客情報テストデータ004\n（保障見直し相談）",
            "v1.0",
            "（AIが生成した商品提案が入る）",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
        ],
        [
            "SPL-005",
            "完了済みケーステストデータ005\n（クレーム対応ケース）",
            "v1.0",
            "（AIが生成したナレッジ記事が入る）",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
        ],
    ]

    for row_idx, row_data in enumerate(sample_data, 3):
        for col_idx, value in enumerate(row_data, 1):
            ws.cell(row=row_idx, column=col_idx, value=value)
        apply_cell_style(ws, row_idx, 1, len(headers))

    # Add notes/legend below data
    legend_row = 3 + len(sample_data) + 1
    legends = [
        "【凡例】",
        "総合スコア: 1=不可 / 2=不十分 / 3=最低限 / 4=良好 / 5=優秀",
        "NG理由フラグ: 事実誤認 / 表現不適切 / 網羅性不足 / その他",
        "課題分類: プロンプト修正 / システムバグ（SF連携等） / データ不備 / 仕様確認",
        "ステータス: 完了 / 対応中 / 見送り",
        "※ 総合スコア3点以下は自動で「課題」扱いとする",
    ]
    for i, text in enumerate(legends):
        cell = ws.cell(row=legend_row + i, column=1, value=text)
        cell.font = BOLD_FONT if i == 0 else NORMAL_FONT

    set_column_widths(ws, {
        1: 14, 2: 35, 3: 16, 4: 40,
        5: 18, 6: 25, 7: 35,
        8: 25, 9: 30, 10: 15,
        11: 18, 12: 18, 13: 14
    })
    ws.sheet_properties.tabColor = "FF6600"


# ============================================================
# Main
# ============================================================
def main():
    wb = openpyxl.Workbook()

    create_requirements_sheet(wb)
    create_scenario_case_list_sheet(wb)
    create_test_case_definition_sheet(wb)
    create_accuracy_evaluation_sheet(wb)

    output_path = "/home/user/0123_01/総合テストテンプレート.xlsx"
    wb.save(output_path)
    print(f"Excel file created: {output_path}")


if __name__ == "__main__":
    main()
