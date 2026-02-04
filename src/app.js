// 質問テンプレート（多角的な観点から学びを深掘り）
const questionTemplates = [
    {
        category: "What - 定義",
        template: "「{topic}」を自分の言葉で説明すると？"
    },
    {
        category: "Why - 理由",
        template: "なぜ「{topic}」は重要だと思う？"
    },
    {
        category: "How - 方法",
        template: "「{topic}」を実際に使うとしたら、どんな場面で使う？"
    },
    {
        category: "例示 - 具体例",
        template: "「{topic}」の具体的な例を1つ挙げてみて"
    },
    {
        category: "比較 - 対比",
        template: "「{topic}」と似ているもの、または反対のものは？"
    },
    {
        category: "関連 - つながり",
        template: "「{topic}」は他のどんな知識とつながる？"
    },
    {
        category: "疑問 - 深掘り",
        template: "「{topic}」についてまだ分からないこと、もっと知りたいことは？"
    },
    {
        category: "応用 - 実践",
        template: "明日から「{topic}」をどう活かせる？"
    }
];

// アプリケーションの状態
let state = {
    learning: "",
    currentQuestionIndex: 0,
    answers: [],
    questions: []
};

// DOM要素
const elements = {
    inputSection: document.getElementById("input-section"),
    qaSection: document.getElementById("qa-section"),
    resultSection: document.getElementById("result-section"),
    learningInput: document.getElementById("learning-input"),
    startBtn: document.getElementById("start-btn"),
    progressFill: document.getElementById("progress-fill"),
    currentQ: document.getElementById("current-q"),
    totalQ: document.getElementById("total-q"),
    questionCategory: document.getElementById("question-category"),
    questionText: document.getElementById("question-text"),
    answerInput: document.getElementById("answer-input"),
    skipBtn: document.getElementById("skip-btn"),
    answerBtn: document.getElementById("answer-btn"),
    originalLearning: document.getElementById("original-learning"),
    answersSummary: document.getElementById("answers-summary"),
    answeredCount: document.getElementById("answered-count"),
    skippedCount: document.getElementById("skipped-count"),
    restartBtn: document.getElementById("restart-btn")
};

// 画面の切り替え
function showSection(sectionId) {
    elements.inputSection.classList.add("hidden");
    elements.qaSection.classList.add("hidden");
    elements.resultSection.classList.add("hidden");

    document.getElementById(sectionId).classList.remove("hidden");
}

// 質問を生成
function generateQuestions(topic) {
    return questionTemplates.map(q => ({
        category: q.category,
        text: q.template.replace("{topic}", topic)
    }));
}

// 進捗を更新
function updateProgress() {
    const progress = ((state.currentQuestionIndex) / state.questions.length) * 100;
    elements.progressFill.style.width = `${progress}%`;
    elements.currentQ.textContent = state.currentQuestionIndex + 1;
    elements.totalQ.textContent = state.questions.length;
}

// 現在の質問を表示
function showCurrentQuestion() {
    const question = state.questions[state.currentQuestionIndex];
    elements.questionCategory.textContent = question.category;
    elements.questionText.textContent = question.text;
    elements.answerInput.value = "";
    elements.answerInput.focus();
    updateProgress();
}

// 次の質問へ進む
function nextQuestion() {
    state.currentQuestionIndex++;

    if (state.currentQuestionIndex >= state.questions.length) {
        showResults();
    } else {
        showCurrentQuestion();
    }
}

// 回答を保存
function saveAnswer(skipped = false) {
    const question = state.questions[state.currentQuestionIndex];
    const answer = elements.answerInput.value.trim();

    state.answers.push({
        category: question.category,
        question: question.text,
        answer: skipped ? null : answer,
        skipped: skipped
    });

    nextQuestion();
}

// 結果を表示
function showResults() {
    showSection("result-section");

    elements.originalLearning.textContent = state.learning;

    const answered = state.answers.filter(a => !a.skipped);
    const skipped = state.answers.filter(a => a.skipped);

    elements.answeredCount.textContent = answered.length;
    elements.skippedCount.textContent = skipped.length;

    // 回答一覧を生成
    let html = "";
    state.answers.forEach(a => {
        const skippedClass = a.skipped ? "skipped" : "";
        const answerText = a.skipped ? "スキップしました" : a.answer;

        html += `
            <div class="answer-item ${skippedClass}">
                <div class="q-category">${a.category}</div>
                <div class="q-text">${a.question}</div>
                <div class="a-text">${answerText}</div>
            </div>
        `;
    });

    elements.answersSummary.innerHTML = html;
}

// アプリケーションをリセット
function resetApp() {
    state = {
        learning: "",
        currentQuestionIndex: 0,
        answers: [],
        questions: []
    };

    elements.learningInput.value = "";
    showSection("input-section");
    elements.learningInput.focus();
}

// QAを開始
function startQA() {
    const learning = elements.learningInput.value.trim();

    if (!learning) {
        elements.learningInput.focus();
        return;
    }

    state.learning = learning;
    state.questions = generateQuestions(learning);
    state.currentQuestionIndex = 0;
    state.answers = [];

    showSection("qa-section");
    showCurrentQuestion();
}

// イベントリスナーを設定
function initEventListeners() {
    elements.startBtn.addEventListener("click", startQA);

    elements.learningInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && e.ctrlKey) {
            startQA();
        }
    });

    elements.answerBtn.addEventListener("click", () => {
        const answer = elements.answerInput.value.trim();
        if (answer) {
            saveAnswer(false);
        }
    });

    elements.skipBtn.addEventListener("click", () => {
        saveAnswer(true);
    });

    elements.answerInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && e.ctrlKey) {
            const answer = elements.answerInput.value.trim();
            if (answer) {
                saveAnswer(false);
            }
        }
    });

    elements.restartBtn.addEventListener("click", resetApp);
}

// アプリケーションの初期化
function init() {
    initEventListeners();
    elements.learningInput.focus();
}

// DOMの読み込み完了後に初期化
document.addEventListener("DOMContentLoaded", init);
