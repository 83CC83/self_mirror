"use client";

import { useState, useEffect } from "react";

// ── 工作情境題 ──
const WORK_QUESTIONS = [
  {
    id: "w1",
    scenario: "你已經連續幾次交出很用心的提案，主管每次看完都只說「還可以，再想想」，從來沒有具體說哪裡不好。你怎麼做？",
    options: [
      { label: "直接問主管，你需要知道具體哪裡有問題", value: "A" },
      { label: "默默回去改，繼續猜主管的意思", value: "B" },
      { label: "開始懷疑是不是自己根本哪裡不對", value: "C" },
      { label: "接受了，但這件事在心裡慢慢累積著", value: "D" },
    ],
  },
  {
    id: "w2",
    scenario: "你發現同事的方法可能有問題，但他比你資深。你會？",
    options: [
      { label: "直接說出來，對事不對人", value: "A" },
      { label: "找機會委婉地提建議", value: "B" },
      { label: "先觀察看看，也許自己判斷錯了", value: "C" },
      { label: "不說，反正不是我的責任", value: "D" },
    ],
  },
  {
    id: "w3",
    scenario: "你在做一個重要決策，理性分析指向一個方向，但直覺告訴你另一個。你？",
    options: [
      { label: "跟著分析走，感覺不可信", value: "A" },
      { label: "跟著直覺走，理性有盲點", value: "B" },
      { label: "再收集資訊，希望兩個能對齊", value: "C" },
      { label: "問信任的人，讓外部聲音幫你定奪", value: "D" },
    ],
  },
  {
    id: "w4",
    scenario: "專案臨時出現問題，需要你在很短的時間內做出決定。你的狀態是？",
    options: [
      { label: "立刻切換進入解決模式，這種時候反而清醒", value: "A" },
      { label: "先在腦子裡快速跑一遍可能的方向，再決定怎麼做", value: "B" },
      { label: "壓力很大，但不會讓別人看出來", value: "C" },
      { label: "會先找人確認方向，避免一個人判斷錯誤", value: "D" },
    ],
  },
  {
    id: "w5",
    scenario: "你完成了一個自己很滿意的成果，但在會議上沒有人特別提到。你？",
    options: [
      { label: "沒關係，自己知道做好了就夠了", value: "A" },
      { label: "有點失落，但不會表現出來，默默接受了", value: "B" },
      { label: "開始懷疑是不是做得沒有自己以為的好", value: "C" },
      { label: "找機會讓別人注意到這件事", value: "D" },
    ],
  },
  {
    id: "w6",
    scenario: "一個不在你職責範圍內的事情落在你身上，沒有人主動說要幫你。你通常？",
    options: [
      { label: "直接說這不是我的事，請重新分配", value: "A" },
      { label: "承接了，但心裡有點不平衡", value: "B" },
      { label: "承接了，因為覺得拒絕太麻煩", value: "C" },
      { label: "先做，之後再找機會提這件事", value: "D" },
    ],
  },
];

// ── 生活情境題 ──
const LIFE_QUESTIONS = [
  {
    id: "l1",
    scenario: "朋友傳訊息說晚上臨時有事，取消了你們計劃已久的約。你的第一反應是？",
    options: [
      { label: "沒關係啊，傳個貼圖說下次見", value: "A" },
      { label: "有點失落，但理解對方，傳個訊息說沒事", value: "B" },
      { label: "直接問他是什麼事、還好嗎", value: "C" },
      { label: "失落和不爽都有，但都沒說出口，自己消化", value: "D" },
    ],
  },
  {
    id: "l2",
    scenario: "你和一群朋友要選餐廳，大家說「你決定就好」。你通常？",
    options: [
      { label: "直接給一個選項，讓大家投票", value: "A" },
      { label: "說「都可以你們決定」然後把球踢回去", value: "B" },
      { label: "提了一個，但說「不行的話換一家也沒關係」", value: "C" },
      { label: "暗中問最在乎的那個人他想吃什麼", value: "D" },
    ],
  },
  {
    id: "l3",
    scenario: "你和一個重要的人發生了誤解，對方沒有主動解釋。你會？",
    options: [
      { label: "主動問清楚，不想讓事情懸著", value: "A" },
      { label: "等對方開口，不想顯得太在意", value: "B" },
      { label: "表面上沒提，但這件事一直在腦子裡轉", value: "C" },
      { label: "跟別人講這件事，整理自己的感受", value: "D" },
    ],
  },
  {
    id: "l4",
    scenario: "你有一整天完全自由，沒有任何任務。你最可能做什麼？",
    options: [
      { label: "安排想做很久的事，把時間用得很充實", value: "A" },
      { label: "完全放空耍廢，毫無罪惡感", value: "B" },
      { label: "計劃了很多，最後只做了一件，但也還好", value: "C" },
      { label: "找人出去，比起一個人更享受有人陪", value: "D" },
    ],
  },
  {
    id: "l5",
    scenario: "一個你不熟的人當眾說了一件你覺得不太對的事。你的選擇是？",
    options: [
      { label: "當場提出不同意見", value: "A" },
      { label: "事後私下跟對方說", value: "B" },
      { label: "跟旁邊認識的人小聲說", value: "C" },
      { label: "算了，不值得花力氣", value: "D" },
    ],
  },
  {
    id: "l6",
    scenario: "你在跟一個你很喜歡的人傳訊息，對方突然回得很短、感覺有點冷淡。你的反應是？",
    options: [
      { label: "直接問他怎麼了", value: "A" },
      { label: "繼續聊，假裝沒注意到", value: "B" },
      { label: "開始在腦子裡回放剛才說了什麼", value: "C" },
      { label: "回放了一遍，然後把自己縮回去，減少主動傳訊，等他先開口", value: "D" },
    ],
  },
];

// ── 自我標籤 ──
const WORK_LABELS = [
  { id: "w_calm", hint: "情緒來了但還是能做決定",     text: "我不容易被情緒影響判斷" },
  { id: "w_plan", hint: "沒有計劃就很難開始",     text: "我是計劃型的人" },
  { id: "w_flex", hint: "計劃被改掉我還是能繼續",     text: "臨時變動不太會打亂我" },
  { id: "w_lead", hint: "自然會去掌握方向和節奏",     text: "我習慣主導事情" },
  { id: "w_detail", hint: "細節出錯會讓我很不舒服",   text: "我很注重細節" },
  { id: "w_border", hint: "分得清楚哪些是我該做的",   text: "我知道什麼是我的責任" },
  { id: "w_collab", hint: "氣氛不好比事情沒做好更讓我在意",   text: "我重視團隊和諧" },
  { id: "w_ambition", hint: "做到八十分還是覺得不夠", text: "我對自己要求很高" },
  { id: "w_feedback", hint: "看到問題會直接指出來", text: "我習慣直接指出問題" },
  { id: "w_logic", hint: "沒想好不太會說出來",    text: "我習慣把事情想清楚再開口" },
  { id: "w_honest", hint: "不太會為了讓人好過而說場面話",   text: "我有話直說" },
  { id: "w_indep", hint: "自己做比較放心",    text: "我喜歡獨立作業" },
  { id: "w_fair", hint: "誰多做誰少做我都看在眼裡",     text: "我很在意公平" },
  { id: "w_protect", hint: "就算很趕也不會表現出來",  text: "我不輕易讓人看見壓力" },
  { id: "w_selfcrit", hint: "對自己的標準比對別人高", text: "我對自己比對別人嚴格" },
  { id: "w_trust", hint: "做完不太需要人說好才放心",    text: "我不需要別人認可" },
  { id: "w_read", hint: "會注意到別人沒說出口的部分",     text: "我很會察言觀色" },
  { id: "w_carry", hint: "問題先自己消化，不太找人幫",    text: "我習慣扛下來再說" },
];

const LIFE_LABELS = [
  { id: "l_easygoing", hint: "知道不想但還是答應了", text: "我很難說不" },
  { id: "l_express", hint: "不舒服不太會憋著",   text: "我直接表達情緒" },
  { id: "l_indep", hint: "不太需要別人確認我的決定",     text: "我很獨立" },
  { id: "l_empath", hint: "對方心情不好我馬上感覺到",    text: "我很能感受別人的情緒" },
  { id: "l_social", hint: "跟人相處讓我有能量",    text: "我喜歡社交" },
  { id: "l_conflict", hint: "說真話比讓人好過更重要",  text: "我不怕讓人失望" },
  { id: "l_present", hint: "不太會為還沒發生的事擔心",   text: "我活在當下" },
  { id: "l_care", hint: "說話前會先想對方聽了會怎樣",      text: "我很在意別人感受" },
  { id: "l_border", hint: "什麼可以什麼不行，我很清楚",    text: "我的界線很明確" },
  { id: "l_recover", hint: "低潮不會持續太久",   text: "我復原力很強" },
  { id: "l_alone", hint: "社交完需要一個人待著才能恢復",     text: "我很需要獨處時間" },
  { id: "l_lowmaint",  hint: "不聯絡一陣子也不會影響我們的關係", text: "我不太需要頻繁聯絡" },
  { id: "l_understood", hint: "被誤解比被忽略更讓我難受",        text: "我很需要被理解" },
  { id: "l_lowkey", hint: "沒人注意到我也不會在意",    text: "我不需要被關注" },
  { id: "l_loyal", hint: "在乎的人我會一直在",     text: "我對重要的人很忠誠" },
  { id: "l_patient", hint: "等待和重複不太會讓我煩",   text: "我很有耐心" },
  { id: "l_nothink", hint: "事情過了就過了，不太回頭想",   text: "我不會想太多" },
  { id: "l_adapt", hint: "計劃改掉不會特別影響我",     text: "我很能接受變化" },
  { id: "l_selfaware", hint: "知道自己為什麼會有這些反應", text: "我很了解自己" },
];

export default function SelfMirror() {
  const [step, setStep] = useState("intro"); // intro | context | labels | questions | loading | result
  const [context, setContext] = useState(null); // "work" | "life"
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [result, setResult] = useState(null);

  const questions = context === "work" ? WORK_QUESTIONS : LIFE_QUESTIONS;
  const labels = (context ?? "work") === "work" ? WORK_LABELS : LIFE_LABELS;
  const q = questions[currentQ];
  const isLastQ = currentQ === questions.length - 1;

  const toggleLabel = (id) => {
    setSelectedLabels(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  };

  const handleAnswer = (val) => {
    setCurrentSelection(val);
    setAnswers(prev => ({ ...prev, [q.id]: val }));
    if (isLastQ) {
      // trigger loading after state update
    }
  };

  const handleNext = () => {
    if (!currentSelection) return;
    setCurrentSelection(null);
    if (isLastQ) {
      setStep("loading");
    } else {
      setCurrentQ(c => c + 1);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step]);

  useEffect(() => {
    if (step !== "loading") return;
    const runAnalyze = async () => {
      const labelTexts = labels.filter(l => selectedLabels.includes(l.id)).map(l => l.text);
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            context,
            selectedLabelTexts: labelTexts,
            answers,
            questions,
          })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setResult(data.result);
        setStep("result");
      } catch (e) {
        setResult({
          headline: "你以為自己很好懂，但你其實很有層次",
          gaps: [
            "你在面對衝突時傾向保持表面和諧，但內心其實記得每一次的不舒服。",
            "你說自己不在意別人的看法，但你的選擇顯示你很少在公開場合表達異議。",
            "你習慣把決策權讓給別人，但那不是你不在意，而是你太在意結果了。"
          ],
          core_pattern: "你用「彈性」保護自己不受傷，但有時也擋住了真正的連結",
          gentle_note: "你比你以為的更需要被看見 🌿"
        });
        setStep("result");
      }
    };
    runAnalyze();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const reset = () => {
    setStep("intro");
    setContext(null);
    setSelectedLabels([]);
    setAnswers({});
    setCurrentQ(0);
    setCurrentSelection(null);
    setResult(null);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#faf7f2",
      fontFamily: "Noto Serif TC, Georgia, serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "0 20px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;600;700&family=Noto+Sans+TC:wght@400;500&display=swap');
        @keyframes fadeIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .opt-btn { transition: all 0.15s ease; cursor: pointer; }
        .opt-btn:hover { background: #f3f4f6 !important; }
        .label-chip { transition: all 0.15s ease; cursor: pointer; user-select: none; }
        .label-chip:hover { border-color: #1a1a1a !important; }
        .next-btn { transition: all 0.18s ease; cursor: pointer; }
        .next-btn:hover { opacity: 0.85; }
        .ctx-btn { transition: all 0.2s ease; cursor: pointer; }
        .ctx-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.08); }
      `}</style>

      <div style={{ width: "100%", maxWidth: 520, paddingTop: 48, paddingBottom: 60 }}>

        {/* ── INTRO ── */}
        {step === "intro" && (
          <div style={{ animation: "fadeIn 0.6s ease-out" }}>
            <div style={{ fontSize: 11, letterSpacing: 6, color: "#9ca3af", fontFamily: "Noto Sans TC, sans-serif", marginBottom: 16 }}>SELF MIRROR</div>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.4, margin: 0 }}>你認識自己嗎</h1>
            <div style={{ width: 40, height: 2, background: "#1a1a1a", marginTop: 20, marginBottom: 24 }} />
            <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.9, fontFamily: "Noto Sans TC, sans-serif", margin: "0 0 40px" }}>
              你選的每一個選項，<br/>都在說一件你自己可能沒注意到的事。
            </p>
            <button className="next-btn" onClick={() => { setStep("context"); }} style={{
              width: "100%", padding: "16px 24px",
              background: "#1a1a1a", border: "none", borderRadius: 12,
              color: "#faf7f2", fontSize: 15, fontWeight: 600,
              fontFamily: "Noto Sans TC, sans-serif", letterSpacing: 1,
            }}>開始</button>
            <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#d1d5db", fontFamily: "Noto Sans TC, sans-serif" }}>約 3 分鐘 · 不需要登入</div>
          </div>
        )}

        {/* ── CONTEXT ── */}
        {step === "context" && (
          <div style={{ animation: "fadeIn 0.5s ease-out" }}>
            <button onClick={() => { setStep("intro"); }} style={{
              background: "transparent", border: "1px solid #e5e7eb",
              borderRadius: 20, padding: "4px 14px", fontSize: 11,
              color: "#9ca3af", cursor: "pointer",
              fontFamily: "Noto Sans TC, sans-serif", marginBottom: 24,
              display: "block",
            }}>返回</button>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#9ca3af", fontFamily: "Noto Sans TC, sans-serif", marginBottom: 32 }}>STEP 1 / 3</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: "0 0 10px" }}>今天想照哪面鏡子？</h2>
            <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.8, fontFamily: "Noto Sans TC, sans-serif", margin: "0 0 36px" }}>
              先選一個場景。
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { value: "work", emoji: "", title: "工作中的我", desc: "面對主管、同事、任務、壓力時的選擇" },
                { value: "life", emoji: "", title: "生活中的我", desc: "面對朋友、關係、自由時間時的選擇" },
              ].map(opt => (
                <button key={opt.value} className="ctx-btn" onClick={() => { setContext(opt.value); setSelectedLabels([]); setAnswers({}); setCurrentQ(0); setCurrentSelection(null); setResult(null); setStep("labels"); }} style={{
                  padding: "22px 24px", background: "#fff",
                  border: "1.5px solid #e5e7eb", borderRadius: 14,
                  textAlign: "left", cursor: "pointer",
                }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", marginBottom: 4, fontFamily: "Noto Sans TC, sans-serif" }}>{opt.title}</div>
                  <div style={{ fontSize: 13, color: "#9ca3af", fontFamily: "Noto Sans TC, sans-serif" }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── LABELS ── */}
        {step === "labels" && (
          <div style={{ animation: "fadeIn 0.5s ease-out" }}>
            <button onClick={() => { setStep("context"); setSelectedLabels([]); setContext(null); }} style={{ background: "transparent", border: "1px solid #e5e7eb", borderRadius: 20, padding: "4px 14px", fontSize: 11, color: "#9ca3af", cursor: "pointer", fontFamily: "Noto Sans TC, sans-serif", marginBottom: 24, display: "block" }}>返回</button>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#9ca3af", fontFamily: "Noto Sans TC, sans-serif", marginBottom: 32 }}>STEP 2 / 3</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>你覺得自己是怎樣的人？</h2>
            <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.8, fontFamily: "Noto Sans TC, sans-serif", margin: "0 0 28px" }}>
              選 1–5 個，憑直覺。選你真實的樣子，不是你希望自己是的樣子。
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 36 }}>
              {labels.map(l => {
                const active = selectedLabels.includes(l.id);
                return (
                  <button key={l.id} className="label-chip" onClick={() => toggleLabel(l.id)} style={{
                    padding: "10px 16px",
                    background: active ? "#1a1a1a" : "#fff",
                    border: `1.5px solid ${active ? "#1a1a1a" : "#e5e7eb"}`,
                    borderRadius: 14, fontSize: 13,
                    color: active ? "#faf7f2" : "#374151",
                    fontFamily: "Noto Sans TC, sans-serif",
                    textAlign: "left", lineHeight: 1.4,
                    display: "flex", flexDirection: "column", gap: 2,
                  }}>
                    <span>{l.text}</span>
                    {l.hint && <span style={{ fontSize: 11, color: active ? "#d1d5db" : "#9ca3af", fontWeight: 400 }}>{l.hint}</span>}
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize: 12, color: "#d1d5db", fontFamily: "Noto Sans TC, sans-serif", marginBottom: 16, textAlign: "right" }}>
              已選 {selectedLabels.length} / 最多 5 個
            </div>
            <button className="next-btn" onClick={() => { if (selectedLabels.length > 0) { setStep("questions"); } }} style={{
              width: "100%", padding: "16px",
              background: selectedLabels.length > 0 ? "#1a1a1a" : "#e5e7eb",
              border: "none", borderRadius: 12,
              color: selectedLabels.length > 0 ? "#faf7f2" : "#9ca3af",
              fontSize: 15, fontWeight: 600,
              fontFamily: "Noto Sans TC, sans-serif", letterSpacing: 1,
              cursor: selectedLabels.length > 0 ? "pointer" : "default",
            }}>繼續</button>
          </div>
        )}

        {/* ── QUESTIONS ── */}
        {step === "questions" && q && (
          <div>
            {/* Header — static */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <button onClick={() => { if (currentQ === 0) { setStep("labels"); setCurrentSelection(null); } else { const prevIdx = currentQ - 1; const prevQid = questions[prevIdx]?.id; setCurrentQ(prevIdx); setCurrentSelection(answers[prevQid] ?? null); } }} style={{ background: "transparent", border: "1px solid #e5e7eb", borderRadius: 20, padding: "4px 14px", fontSize: 11, color: "#9ca3af", cursor: "pointer", fontFamily: "Noto Sans TC, sans-serif" }}>返回</button>
              <div style={{ fontSize: 11, letterSpacing: 4, color: "#9ca3af", fontFamily: "Noto Sans TC, sans-serif" }}>STEP 3 / 3</div>
                <div style={{ fontSize: 11, color: "#9ca3af", fontFamily: "Noto Sans TC, sans-serif" }}>{currentQ + 1} / {questions.length}</div>
              </div>
              <div style={{ height: 2, background: "#e5e7eb", borderRadius: 1 }}>
                <div style={{
                  height: "100%", borderRadius: 1, background: "#1a1a1a",
                  width: `${(currentQ / questions.length) * 100}%`,
                  transition: "width 0.4s ease",
                }} />
              </div>
            </div>

            {/* Content — animated per question */}
            <div key={q.id} style={{ animation: "fadeIn 0.35s ease-out", minHeight: 400 }}>
              <h2 style={{ fontSize: 17, color: "#1a1a1a", lineHeight: 1.75, margin: "0 0 28px", fontWeight: 600, fontFamily: "Noto Sans TC, sans-serif" }}>{q.scenario}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {q.options.map((opt, i) => (
                  <button key={`${q.id}-${i}`} className="opt-btn" onClick={() => handleAnswer(opt.value)} style={{
                    padding: "14px 18px",
                    background: currentSelection === opt.value ? "#f3f4f6" : "#fff",
                    border: `1.5px solid ${currentSelection === opt.value ? "#1a1a1a" : "#e5e7eb"}`,
                    borderRadius: 10, textAlign: "left", fontSize: 14,
                    color: currentSelection === opt.value ? "#1a1a1a" : "#374151",
                    lineHeight: 1.6, fontFamily: "Noto Sans TC, sans-serif",
                    fontWeight: currentSelection === opt.value ? 500 : 400,
                  }}>{opt.label}</button>
                ))}
              </div>
              <button className="next-btn" onClick={handleNext} disabled={!currentSelection} style={{
                width: "100%", padding: "14px",
                background: currentSelection ? "#1a1a1a" : "#e5e7eb",
                border: "none", borderRadius: 12,
                color: currentSelection ? "#faf7f2" : "#9ca3af",
                fontSize: 14, fontWeight: 600, letterSpacing: 2,
                fontFamily: "Noto Sans TC, sans-serif",
                cursor: currentSelection ? "pointer" : "default",
              }}>{isLastQ ? "查看結果" : "下一題"}</button>
            </div>
          </div>
        )}

        {/* ── LOADING ── */}
        {step === "loading" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 24, animation: "fadeIn 0.4s ease-out" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", border: "2px solid #e5e7eb", borderTopColor: "#1a1a1a", animation: "spin 1s linear infinite" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, color: "#1a1a1a", fontWeight: 600, marginBottom: 8, fontFamily: "Noto Sans TC, sans-serif" }}>正在照鏡子...</div>
              <div style={{ fontSize: 13, color: "#9ca3af", fontFamily: "Noto Sans TC, sans-serif", animation: "pulse 2s ease-in-out infinite" }}>比對你認為的你，和你選擇顯示的你</div>
            </div>
          </div>
        )}

        {/* ── RESULT ── */}
        {step === "result" && result && (
          <div style={{ animation: "fadeIn 0.7s ease-out", paddingBottom: 60 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#9ca3af", fontFamily: "Noto Sans TC, sans-serif", marginBottom: 32 }}>你的鏡中像</div>

            {/* Headline */}
            <div style={{ background: "#1a1a1a", borderRadius: 20, padding: "32px 28px", marginBottom: 24 }}>
              <div style={{ fontSize: 11, letterSpacing: 4, color: "#6b7280", fontFamily: "Noto Sans TC, sans-serif", marginBottom: 16 }}>SELF MIRROR</div>
              <p style={{ fontSize: 20, color: "#faf7f2", lineHeight: 1.6, margin: 0, fontWeight: 700 }}>{result.headline}</p>
            </div>

            {/* Gaps */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
              {result.gaps.map((gap, i) => (
                <div key={i} style={{
                  background: "#fff", border: "1.5px solid #f3f4f6",
                  borderRadius: 12, padding: "18px 20px",
                  animation: `fadeIn 0.5s ease-out ${0.1 * (i + 1)}s both`,
                }}>
                  <div style={{ fontSize: 10, letterSpacing: 3, color: "#d1d5db", fontFamily: "Noto Sans TC, sans-serif", marginBottom: 8 }}>觀察 {String(i + 1).padStart(2, "0")}</div>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, margin: 0, fontFamily: "Noto Sans TC, sans-serif" }}>{gap}</p>
                </div>
              ))}
            </div>

            {/* Core pattern */}
            <div style={{ background: "#fef9ee", border: "1.5px solid #fcd34d44", borderRadius: 12, padding: "18px 20px", marginBottom: 16, animation: "fadeIn 0.5s ease-out 0.4s both" }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: "#d1d5db", fontFamily: "Noto Sans TC, sans-serif", marginBottom: 8 }}>你的核心模式</div>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, margin: 0, fontFamily: "Noto Sans TC, sans-serif" }}>{result.core_pattern}</p>
            </div>

            {/* Gentle note */}
            <div style={{ textAlign: "center", padding: "20px", fontSize: 15, color: "#6b7280", fontStyle: "italic", animation: "fadeIn 0.5s ease-out 0.5s both" }}>
              {result.gentle_note}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
              <button className="next-btn" onClick={() => { setStep("context"); setSelectedLabels([]); setAnswers({}); setCurrentQ(0); setCurrentSelection(null); setResult(null); setContext(null); }} style={{
                width: "100%", padding: "14px",
                background: "#1a1a1a", border: "none", borderRadius: 12,
                color: "#faf7f2", fontSize: 14, fontWeight: 600,
                fontFamily: "Noto Sans TC, sans-serif", letterSpacing: 1,
              }}>換個情境再照一次</button>
              <button className="next-btn" onClick={reset} style={{
                width: "100%", padding: "14px",
                background: "transparent", border: "1.5px solid #e5e7eb", borderRadius: 12,
                color: "#6b7280", fontSize: 14,
                fontFamily: "Noto Sans TC, sans-serif",
              }}>重新開始</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
