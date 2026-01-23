# -*- coding: utf-8 -*-
"""
日本の政令指定都市データ
各都市の魅力、特徴、推奨度を定義
"""

DESIGNATED_CITIES = [
    {
        "name": "札幌市",
        "region": "北海道",
        "recommendation": "★★★★★",
        "population": "約197万人",
        "highlights": [
            "豊かな自然と都市機能の調和",
            "新鮮な海の幸・山の幸が豊富",
            "四季がはっきりしており、特に雪まつりが有名",
            "物価が比較的安く、住みやすい"
        ],
        "living_cost": "中",
        "climate": "冬は寒いが、夏は涼しく快適",
        "appeal": "北海道の中心都市として、自然と都市生活の両方を楽しめる"
    },
    {
        "name": "仙台市",
        "region": "宮城県",
        "recommendation": "★★★★☆",
        "population": "約109万人",
        "highlights": [
            "「杜の都」として緑豊かな都市",
            "東北の中心都市で利便性が高い",
            "牛タン、笹かまぼこなど美食の街",
            "程よい都会と自然のバランス"
        ],
        "living_cost": "中",
        "climate": "四季がはっきり、比較的温暖",
        "appeal": "東北の玄関口として、ビジネスと生活の質が高い"
    },
    {
        "name": "さいたま市",
        "region": "埼玉県",
        "recommendation": "★★★★☆",
        "population": "約133万人",
        "highlights": [
            "東京都心へのアクセスが抜群",
            "比較的新しい都市で計画的な街づくり",
            "子育て環境が充実",
            "災害リスクが比較的低い"
        ],
        "living_cost": "やや高",
        "climate": "温暖で住みやすい",
        "appeal": "首都圏で働きながら、落ち着いた生活環境を求める人に最適"
    },
    {
        "name": "千葉市",
        "region": "千葉県",
        "recommendation": "★★★★☆",
        "population": "約98万人",
        "highlights": [
            "東京湾に面し、海が近い",
            "幕張メッセなどビジネス・イベント施設充実",
            "東京へのアクセスも良好",
            "マリンスポーツが楽しめる"
        ],
        "living_cost": "やや高",
        "climate": "温暖で過ごしやすい",
        "appeal": "都会の利便性と海辺のリゾート感を両立"
    },
    {
        "name": "横浜市",
        "region": "神奈川県",
        "recommendation": "★★★★★",
        "population": "約377万人",
        "highlights": [
            "日本最大の人口を持つ市",
            "港町としての国際的な雰囲気",
            "みなとみらい、中華街など観光地多数",
            "文化・商業施設が充実"
        ],
        "living_cost": "高",
        "climate": "温暖で過ごしやすい",
        "appeal": "都会的な魅力と歴史、国際色豊かな環境"
    },
    {
        "name": "川崎市",
        "region": "神奈川県",
        "recommendation": "★★★★☆",
        "population": "約154万人",
        "highlights": [
            "東京・横浜の中間に位置し交通至便",
            "工業都市から住宅都市へ発展",
            "多摩川沿いの自然環境",
            "多文化共生の街"
        ],
        "living_cost": "高",
        "climate": "温暖",
        "appeal": "都心アクセスと生活利便性の高さ"
    },
    {
        "name": "相模原市",
        "region": "神奈川県",
        "recommendation": "★★★☆☆",
        "population": "約72万人",
        "highlights": [
            "豊かな自然環境（丹沢山地など）",
            "JAXA宇宙科学研究所がある",
            "都心へのアクセスも可能",
            "比較的広い住宅環境"
        ],
        "living_cost": "中",
        "climate": "内陸性で寒暖差あり",
        "appeal": "自然と都市の中間的な環境で子育てに最適"
    },
    {
        "name": "新潟市",
        "region": "新潟県",
        "recommendation": "★★★★☆",
        "population": "約79万人",
        "highlights": [
            "日本海側最大の都市",
            "米どころで食べ物が美味しい",
            "日本酒の名産地",
            "信濃川や日本海の自然"
        ],
        "living_cost": "低〜中",
        "climate": "冬は雪が多いが、夏は涼しい",
        "appeal": "食文化と自然に恵まれた日本海側の中心都市"
    },
    {
        "name": "静岡市",
        "region": "静岡県",
        "recommendation": "★★★★☆",
        "population": "約69万人",
        "highlights": [
            "富士山の眺望が素晴らしい",
            "温暖な気候で過ごしやすい",
            "お茶の産地として有名",
            "東京・名古屋の中間地点"
        ],
        "living_cost": "中",
        "climate": "温暖で日照時間が長い",
        "appeal": "自然と気候に恵まれた、住みやすさトップクラス"
    },
    {
        "name": "浜松市",
        "region": "静岡県",
        "recommendation": "★★★★☆",
        "population": "約79万人",
        "highlights": [
            "ものづくりの街（楽器、オートバイ産業）",
            "浜名湖の自然と温泉",
            "うなぎが名物",
            "起業家精神が旺盛"
        ],
        "living_cost": "中",
        "climate": "温暖で住みやすい",
        "appeal": "産業と自然のバランス、イノベーション都市"
    },
    {
        "name": "名古屋市",
        "region": "愛知県",
        "recommendation": "★★★★★",
        "population": "約233万人",
        "highlights": [
            "中部地方最大の都市",
            "自動車産業の中心地",
            "名古屋めし（味噌カツ、ひつまぶし等）",
            "交通の要衝で東京・大阪にアクセス良好"
        ],
        "living_cost": "中〜やや高",
        "climate": "夏は暑いが、冬は比較的温暖",
        "appeal": "経済力と独自の文化、中部の中核都市"
    },
    {
        "name": "京都市",
        "region": "京都府",
        "recommendation": "★★★★★",
        "population": "約147万人",
        "highlights": [
            "千年の古都、世界遺産多数",
            "伝統文化と学術都市",
            "四季折々の景観美",
            "京料理など食文化も豊か"
        ],
        "living_cost": "中〜やや高",
        "climate": "盆地気候で寒暖差あり",
        "appeal": "歴史と文化に囲まれた唯一無二の環境"
    },
    {
        "name": "大阪市",
        "region": "大阪府",
        "recommendation": "★★★★★",
        "population": "約275万人",
        "highlights": [
            "西日本最大の都市",
            "食い倒れの街、たこ焼き・お好み焼き",
            "商業・ビジネスの中心",
            "人情味ある文化"
        ],
        "living_cost": "中〜やや高",
        "climate": "温暖",
        "appeal": "活気あふれる商都、エンターテイメント豊富"
    },
    {
        "name": "堺市",
        "region": "大阪府",
        "recommendation": "★★★☆☆",
        "population": "約83万人",
        "highlights": [
            "古墳群（仁徳天皇陵など）世界遺産",
            "刃物の伝統産業",
            "大阪都心へのアクセス良好",
            "歴史ある自由都市"
        ],
        "living_cost": "中",
        "climate": "温暖",
        "appeal": "歴史と伝統産業、大阪近郊の住環境"
    },
    {
        "name": "神戸市",
        "region": "兵庫県",
        "recommendation": "★★★★★",
        "population": "約152万人",
        "highlights": [
            "異国情緒あふれる港町",
            "美しい夜景（六甲山からの眺望）",
            "神戸ビーフ、洋菓子など美食",
            "おしゃれで洗練された街並み"
        ],
        "living_cost": "中〜やや高",
        "climate": "温暖で過ごしやすい",
        "appeal": "国際色豊かで美しい港湾都市"
    },
    {
        "name": "岡山市",
        "region": "岡山県",
        "recommendation": "★★★★☆",
        "population": "約72万人",
        "highlights": [
            "「晴れの国」として日照時間が長い",
            "岡山城、後楽園など歴史遺産",
            "桃、マスカットなど果物の産地",
            "災害が少なく住みやすい"
        ],
        "living_cost": "低〜中",
        "climate": "温暖で降水量少ない",
        "appeal": "気候の良さと住みやすさ、中国地方の交通要衝"
    },
    {
        "name": "広島市",
        "region": "広島県",
        "recommendation": "★★★★★",
        "population": "約120万人",
        "highlights": [
            "平和記念都市として国際的に著名",
            "牡蠣、お好み焼きなど美食の街",
            "宮島（厳島神社）が近い",
            "中国・四国地方の中心都市"
        ],
        "living_cost": "中",
        "climate": "温暖で過ごしやすい",
        "appeal": "平和の象徴、文化と自然の調和"
    },
    {
        "name": "北九州市",
        "region": "福岡県",
        "recommendation": "★★★☆☆",
        "population": "約94万人",
        "highlights": [
            "本州と九州を結ぶ玄関口",
            "工業都市から環境都市へ転換",
            "関門海峡の景観",
            "物価が安く住みやすい"
        ],
        "living_cost": "低",
        "climate": "温暖",
        "appeal": "コンパクトシティ、生活コストの安さ"
    },
    {
        "name": "福岡市",
        "region": "福岡県",
        "recommendation": "★★★★★",
        "population": "約163万人",
        "highlights": [
            "九州最大の都市、アジアの玄関口",
            "博多ラーメン、明太子など美食",
            "コンパクトで暮らしやすい街",
            "スタートアップ都市として注目"
        ],
        "living_cost": "中",
        "climate": "温暖",
        "appeal": "活気と成長性、アジアに開かれた都市"
    },
    {
        "name": "熊本市",
        "region": "熊本県",
        "recommendation": "★★★★☆",
        "population": "約74万人",
        "highlights": [
            "熊本城などの歴史遺産",
            "阿蘇山の雄大な自然が近い",
            "地下水が豊富で水が美味しい",
            "馬刺し、辛子蓮根など独自の食文化"
        ],
        "living_cost": "低〜中",
        "climate": "温暖",
        "appeal": "自然と歴史、水の都としての魅力"
    }
]
