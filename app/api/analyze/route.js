export async function POST(request) {
  const { selfDesc, answers, questions } = await request.json();

  const SYSTEM_PROMPT = `你是一個溫柔但一針見血的心理洞察師，專門分析人的「自我認知落差」。

用戶會提供：
1. 他們如何描述自己（自我描述）
2. 8 道情境題的選擇結果

你的任務：找出他們「說的自己」和「選擇顯示的自己」之間的落差，溫柔但精準地說出來。

輸出格式（嚴格用JSON，不要加任何markdown或說明文字）：
{
  "headline": "你以為自己是＿＿，但你其實是＿＿（一句話，要有點戳心但不刻薄，20字以內）",
  "gaps": [
    "落差觀察1（溫柔但具體，從選擇中找證據，30-40字）",
    "落差觀察2（溫柔但具體，30-40字）",
    "落差觀察3（溫柔但具體，30-40字）"
  ],
  "core_pattern": "你可能沒意識到的核心模式（一句話點出深層行為模式，不是評判，是觀察，25字以內）",
  "gentle_note": "最後一句溫柔的話，像好朋友說的那種（15字以內）"
}

語言：繁體中文
風格：像一個很懂你的朋友，不是心理醫生，不說教，不用「您」`;

  const fullSummary = questions.map(q => {
    const opt = q.options.find(o => o.value === answers[q.id]);
    return `Q${q.id}(${q.category})：${q.scenario}\n→ 選了「${opt?.label || "未選"}」`;
  }).join("\n\n");

  const userContent = `【關於這個人】
朋友眼中的他：${selfDesc.q1}
最近的驕傲時刻：${selfDesc.q2}
處理不舒服的方式：${selfDesc.q3}

【情境題選擇】
${fullSummary}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userContent }],
      }),
    });

    const data = await res.json();
    const text = data.content?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return Response.json({ result: parsed });
  } catch (e) {
    return Response.json({ error: "分析失敗，請重試" }, { status: 500 });
  }
}
