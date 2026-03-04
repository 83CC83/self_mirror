"use client";
import { useState, useEffect, useRef } from "react";

const QUESTIONS = [
  {
    id: 1,
    category: "日常",
    scenario: "朋友傳訊說晚上臨時有事，取消了你們計劃已久的約。你的第一反應是？",
    options: [
      { label: "沒關係啊，傳個貼圖說下次見", value: "A" },
      { label: "有點失落，但不會說出口", value: "B" },
      { label: "直接問他是什麼事、還好嗎", value: "C" },
      { label: "有點不爽，但轉頭就去做別的事了，沒特別放心上", value: "D" },
    ],
  },
  {
    id: 2,
    category: "工作",
    scenario: "你已經連續幾次交出很用心的提案，主管每次看完都只說「還可以，再想想」，從來沒有具體說哪裡不好。你怎麼做？",
    options: [
      { label: "直接問主管，你需要知道具體哪裡有問題", value: "A" },
      { label: "默默回去改，繼續猜主管的意思", value: "B" },
      { label: "開始懷疑是不是自己根本哪裡不對", value: "C" },
      { label: "接受了，但這件事在心裡慢慢累積著", value: "D" },
    ],
  },
  {
    id: 3,
    category: "兩難",
    scenario: "你和一群朋友要選餐廳，大家說「你決定就好」。你通常？",
    options: [
      { label: "直接給一個選項，讓大家投票", value: "A" },
      { label: "說「都可以你們決定」然後把球踢回去", value: "B" },
      { label: "提了一個，但說「不行的話換一家也沒關係」", value: "C" },
      { label: "暗中問最在乎的那個人他想吃什麼", value: "D" },
    ],
  },
  {
    id: 4,
    category: "感情",
    scenario: "你和一個重要的人發生了誤解，對方沒有主動解釋。你會？",
    options: [
      { label: "主動問清楚，不想讓事情懸著", value: "A" },
      { label: "等對方開口，不想顯得太在意", value: "B" },
      { label: "表面上沒提，但這件事一直在腦子裡轉", value: "C" },
      { label: "跟別人講這件事，整理自己的感受", value: "D" },
    ],
  },
  {
    id: 5,
    category: "兩難",
    scenario: "一個你不熟的人當眾說了一件你覺得不太對的事。你的選擇是？",
    options: [
      { label: "當場提出不同意見", value: "A" },
      { label: "事後私下跟對方說", value: "B" },
      { label: "跟旁邊認識的人小聲說", value: "C" },
      { label: "算了，不值得花力氣", value: "D" },
    ],
  },
  {
    id: 6,
    category: "日常",
    scenario: "你有一整天完全自由，沒有任何任務。你最可能做什麼？",
    options: [
      { label: "安排想做很久的事，把時間用得很充實", value: "A" },
      { label: "完全放空耍廢，毫無罪惡感", value: "B" },
      { label: "計劃了很多，最後只做了一件，但也還好", value: "C" },
      { label: "找人出去，比起一個人更享受有人陪的感覺", value: "D" },
    ],
  },
  {
    id: 7,
    category: "工作",
    scenario: "你發現同事的方法可能有問題，但他比你資深。你會？",
    options: [
      { label: "直接說出來，對事不對人", value: "A" },
      { label: "找機會委婉地提建議", value: "B" },
      { label: "先觀察看看，也許自己判斷錯了", value: "C" },
      { label: "不說，反正不是我的責任", value: "D" },
    ],
  },
  {
    id: 8,
    category: "兩難",
    scenario: "你在做一個決定，理性分析指向一個方向，但感覺告訴你另一個。你？",
    options: [
      { label: "跟著分析走，感覺不可信", value: "A" },
      { label: "跟著感覺走，理性有盲點", value: "B" },
      { label: "再收集資訊，希望兩個能對齊", value: "C" },
      { label: "問信任的人，讓外部聲音打破僵局", value: "D" },
    ],
  },
];

const categoryColor = {
  "日常": "#f9a8d4",
  "工作": "#93c5fd",
  "兩難": "#fcd34d",
  "感情": "#86efac",
};

export default function SelfMirror() {
  const [step, setStep] = useState("intro");
  const [selfDesc, setSelfDesc] = useState({ q1: "", q2: "", q3: "" });
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState(null);
  const [animating, setAnimating] = useState(false);

  const q = QUESTIONS[currentQ];

  useEffect(() => {
    if (step === "loading" && Object.keys(answers).length === QUESTIONS.length) {
      analyze(answers);
    }
  }, [step, answers]);

  const selectAnswer = (qId, value) => {
    if (currentQ === QUESTIONS.length - 1) {
      const newAnswers = { ...answers, [qId]: value };
      setAnswers(newAnswers);
      setStep("loading");
    } else {
      setAnimating(true);
      setTimeout(() => {
        setAnswers(prev => ({ ...prev, [qId]: value }));
        setCurrentQ(q => q + 1);
        setAnimating(false);
      }, 250);
    }
  };

  const analyze = async (finalAnswers) => {
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selfDesc, answers: finalAnswers, questions: QUESTIONS }),
      });
      const data = await res.json();
      if (data.result) {
        setResult(data.result);
        setStep("result");
      } else {
        throw new Error("no result");
      }
    } catch {
      setResult({
        headline: "你以為自己很好懂，但你其實很有層次",
        gaps: [
          "你在面對衝突時傾向保持表面和諧，但內心其實記得每一次的不舒服。",
          "你說自己不在意別人的看法，但你的選擇顯示你很少在公開場合表達異議。",
          "你習慣把決策權讓給別人，但那不是你不在意，而是你太在意結果了。",
        ],
        core_pattern: "你用「彈性」保護自己不受傷，但有時也擋住了真正的連結",
        gentle_note: "你比你以為的更需要被看見 🌿",
      });
      setStep("result");
    }
  };

  const reset = () => {
    setStep("intro");
    setAnswers({});
    setCurrentQ(0);
    setResult(null);
    setSelfDesc({ q1: "", q2: "", q3: "" });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#faf7f2",
      fontFamily: "'Noto Serif TC', Georgia, serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "0 20px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;600;700&family=Noto+Sans+TC:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeOut { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(-14px)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .opt-btn { transition: all 0.18s ease; cursor: pointer; border: 1.5px solid #e5e7eb !important; }
        .opt-btn:hover { transform: translateX(6px); background: #1a1a1a !important; color: #faf7f2 !important; border-color: #1a1a1a !important; }
        .opt-btn:active { transform: scale(0.98); }
        .cta:hover { background: #333 !important; }
        .cta:active { transform: scale(0.97); }
        textarea { box-sizing: border-box; }
        textarea:focus { outline: none; border-color: #1a1a1a !important; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 540, paddingTop: 48, paddingBottom: 60 }}>

        {/* INTRO */}
        {step === "intro" && (
          <div style={{ animation: "fadeIn 0.6s ease-out" }}>
            <p style={{
              fontSize: 11, letterSpacing: 6, color: "#9ca3af", margin: "0 0 20px",
              fontFamily: "'Noto Sans TC', sans-serif", textTransform: "uppercase",
            }}>SELF MIRROR</p>
            <h1 style={{ fontSize: 30, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.4, margin: "0 0 16px" }}>
              你以為的自己<br />和真實的你
            </h1>
            <div style={{ width: 36, height: 2, background: "#1a1a1a", margin: "0 0 24px" }} />
            <p style={{
              fontSize: 15, color: "#6b7280", lineHeight: 1.9, margin: "0 0 40px",
              fontFamily: "'Noto Sans TC', sans-serif",
            }}>
              8 道情境題，不測性格類型。<br />
              只是幫你看見你說的和你做的<br />
              之間，那個有趣的距離。
            </p>
            <button className="cta" onClick={() => setStep("describe")} style={{
              width: "100%", padding: "16px", background: "#1a1a1a", border: "none",
              borderRadius: 12, color: "#faf7f2", fontSize: 15, fontWeight: 600,
              cursor: "pointer", fontFamily: "'Noto Sans TC', sans-serif",
              letterSpacing: 1, transition: "background 0.2s",
            }}>開始 →</button>
            <p style={{
              textAlign: "center", marginTop: 16, fontSize: 12, color: "#d1d5db",
              fontFamily: "'Noto Sans TC', sans-serif",
            }}>約 3 分鐘 · 不需要登入</p>
          </div>
        )}

        {/* DESCRIBE */}
        {step === "describe" && (
          <div style={{ animation: "fadeIn 0.5s ease-out" }}>
            <p style={{
              fontSize: 11, letterSpacing: 4, color: "#9ca3af", margin: "0 0 32px",
              fontFamily: "'Noto Sans TC', sans-serif",
            }}>STEP 1 / 2</p>
            <h2 style={{ fontSize: 22, color: "#1a1a1a", margin: "0 0 8px", fontWeight: 700 }}>先認識一下你</h2>
            <p style={{
              fontSize: 13, color: "#9ca3af", lineHeight: 1.8, margin: "0 0 32px",
              fontFamily: "'Noto Sans TC', sans-serif",
            }}>不用定義自己是什麼樣的人。<br />三個小問題，隨便說都可以。</p>

            {[
              { key: "q1", num: "01", q: "你朋友會怎麼描述你？", ph: "可能他們會說你很...或者你總是..." },
              { key: "q2", num: "02", q: "你最近一次為自己驕傲是什麼時候？", ph: "不管大事小事都算，甚至可以是昨天..." },
              { key: "q3", num: "03", q: "你通常怎麼處理讓你不舒服的事？", ph: "逃避？直接面對？還是先消化再說..." },
            ].map(({ key, num, q, ph }) => (
              <div key={key} style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "flex-start" }}>
                <span style={{
                  fontSize: 10, letterSpacing: 2, color: "#d1d5db", paddingTop: 3, flexShrink: 0,
                  fontFamily: "'Noto Sans TC', sans-serif",
                }}>{num}</span>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: 14, color: "#1a1a1a", fontWeight: 600, margin: "0 0 10px",
                    lineHeight: 1.6, fontFamily: "'Noto Sans TC', sans-serif",
                  }}>{q}</p>
                  <textarea
                    value={selfDesc[key]}
                    onChange={e => setSelfDesc(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={ph}
                    rows={2}
                    style={{
                      width: "100%", padding: "12px 14px",
                      background: "#fff", border: "1.5px solid #e5e7eb",
                      borderRadius: 10, fontSize: 13, color: "#1a1a1a",
                      lineHeight: 1.8, resize: "none",
                      fontFamily: "'Noto Sans TC', sans-serif",
                      transition: "border-color 0.2s",
                    }}
                  />
                </div>
              </div>
            ))}

            {(() => {
              const filled = Object.values(selfDesc).filter(v => v.trim().length > 3).length;
              const ready = filled >= 2;
              return (
                <button className={ready ? "cta" : ""} onClick={() => ready && setStep("questions")} style={{
                  marginTop: 8, width: "100%", padding: "16px",
                  background: ready ? "#1a1a1a" : "#e5e7eb",
                  border: "none", borderRadius: 12,
                  color: ready ? "#faf7f2" : "#9ca3af",
                  fontSize: 15, fontWeight: 600,
                  cursor: ready ? "pointer" : "default",
                  fontFamily: "'Noto Sans TC', sans-serif",
                  transition: "all 0.2s",
                }}>
                  {filled < 2 ? `還差 ${2 - filled} 題` : "繼續 →"}
                </button>
              );
            })()}
          </div>
        )}

        {/* QUESTIONS */}
        {step === "questions" && (
          <div style={{ animation: animating ? "fadeOut 0.25s ease-out" : "fadeIn 0.35s ease-out" }}>
            <div style={{ marginBottom: 36 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 11, letterSpacing: 4, color: "#9ca3af", fontFamily: "'Noto Sans TC', sans-serif" }}>STEP 2 / 2</span>
                <span style={{ fontSize: 11, color: "#9ca3af", fontFamily: "'Noto Sans TC', sans-serif" }}>{currentQ + 1} / {QUESTIONS.length}</span>
              </div>
              <div style={{ height: 2, background: "#e5e7eb", borderRadius: 1 }}>
                <div style={{
                  height: "100%", borderRadius: 1, background: "#1a1a1a",
                  width: `${(currentQ / QUESTIONS.length) * 100}%`,
                  transition: "width 0.4s ease",
                }} />
              </div>
            </div>

            <span style={{
              display: "inline-block", padding: "3px 10px", borderRadius: 20,
              background: (categoryColor[q.category] || "#e5e7eb") + "44",
              color: "#4b5563", fontSize: 11,
              fontFamily: "'Noto Sans TC', sans-serif",
              marginBottom: 16, letterSpacing: 1,
            }}>{q.category}</span>

            <h2 style={{ fontSize: 17, color: "#1a1a1a", lineHeight: 1.75, margin: "0 0 28px", fontWeight: 600 }}>
              {q.scenario}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.options.map(opt => (
                <button key={opt.value} className="opt-btn" onClick={() => selectAnswer(q.id, opt.value)} style={{
                  padding: "14px 18px", background: "#fff",
                  borderRadius: 10, textAlign: "left",
                  fontSize: 14, color: "#374151", lineHeight: 1.6,
                  fontFamily: "'Noto Sans TC', sans-serif",
                }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* LOADING */}
        {step === "loading" && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", minHeight: "60vh", gap: 24,
            animation: "fadeIn 0.4s ease-out",
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              border: "2px solid #e5e7eb", borderTopColor: "#1a1a1a",
              animation: "spin 1s linear infinite",
            }} />
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 16, color: "#1a1a1a", fontWeight: 600, margin: "0 0 8px" }}>正在照鏡子...</p>
              <p style={{
                fontSize: 13, color: "#9ca3af", margin: 0,
                fontFamily: "'Noto Sans TC', sans-serif",
                animation: "pulse 2s ease-in-out infinite",
              }}>比對你說的你，和你選的你</p>
            </div>
          </div>
        )}

        {/* RESULT */}
        {step === "result" && result && (
          <div style={{ animation: "fadeIn 0.7s ease-out" }}>
            <p style={{
              fontSize: 11, letterSpacing: 4, color: "#9ca3af", margin: "0 0 28px",
              fontFamily: "'Noto Sans TC', sans-serif",
            }}>你的鏡中像</p>

            {/* Headline */}
            <div style={{
              background: "#1a1a1a", borderRadius: 20, padding: "32px 28px",
              marginBottom: 20, position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: -30, right: -30, width: 110, height: 110,
                borderRadius: "50%",
                background: "radial-gradient(circle, #ffffff08 0%, transparent 70%)",
              }} />
              <p style={{
                fontSize: 10, letterSpacing: 4, color: "#6b7280", margin: "0 0 16px",
                fontFamily: "'Noto Sans TC', sans-serif",
              }}>SELF MIRROR</p>
              <p style={{ fontSize: 19, color: "#faf7f2", lineHeight: 1.65, margin: 0, fontWeight: 700 }}>
                {result.headline}
              </p>
            </div>

            {/* Gaps */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              {result.gaps.map((gap, i) => (
                <div key={i} style={{
                  background: "#fff", border: "1.5px solid #f3f4f6",
                  borderRadius: 12, padding: "18px 20px",
                  animation: `fadeIn 0.5s ease-out ${0.1 * (i + 1)}s both`,
                }}>
                  <p style={{
                    fontSize: 10, letterSpacing: 3, color: "#d1d5db", margin: "0 0 8px",
                    fontFamily: "'Noto Sans TC', sans-serif",
                  }}>觀察 {String(i + 1).padStart(2, "0")}</p>
                  <p style={{
                    fontSize: 14, color: "#374151", lineHeight: 1.8, margin: 0,
                    fontFamily: "'Noto Sans TC', sans-serif",
                  }}>{gap}</p>
                </div>
              ))}
            </div>

            {/* Core pattern */}
            <div style={{
              background: "#fef9ee", border: "1.5px solid #fcd34d44",
              borderRadius: 12, padding: "18px 20px", marginBottom: 16,
              animation: "fadeIn 0.5s ease-out 0.4s both",
            }}>
              <p style={{
                fontSize: 10, letterSpacing: 3, color: "#d1d5db", margin: "0 0 8px",
                fontFamily: "'Noto Sans TC', sans-serif",
              }}>你的核心模式</p>
              <p style={{
                fontSize: 14, color: "#374151", lineHeight: 1.8, margin: 0,
                fontFamily: "'Noto Sans TC', sans-serif",
              }}>{result.core_pattern}</p>
            </div>

            {/* Gentle note */}
            <p style={{
              textAlign: "center", padding: "16px 0 24px",
              fontSize: 15, color: "#6b7280", fontStyle: "italic", margin: 0,
              animation: "fadeIn 0.5s ease-out 0.5s both",
            }}>{result.gentle_note}</p>

            <button className="cta" onClick={reset} style={{
              width: "100%", padding: "14px",
              background: "transparent", border: "1.5px solid #e5e7eb",
              borderRadius: 12, color: "#6b7280", fontSize: 14, cursor: "pointer",
              fontFamily: "'Noto Sans TC', sans-serif", transition: "all 0.2s",
            }}>重新照一次</button>
          </div>
        )}
      </div>
    </div>
  );
}
