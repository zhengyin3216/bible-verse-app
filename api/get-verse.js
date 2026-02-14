// Vercel Serverless Function - Gemini 2.0 Flash Lite 버전
export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // OPTIONS 요청 처리 (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { situation } = req.body;

    if (!situation) {
      return res.status(400).json({ error: 'Situation is required' });
    }

    // API 키 확인
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('API key not found');
      return res.status(500).json({ error: 'API key not configured' });
    }

    // ✅ 최신 Gemini 2.0 Flash Lite 모델 사용
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `당신은 성경에 정통한 목회 상담가입니다. 사용자의 상황에 맞는 성경 구절을 찾아주고, 그 의미를 자세히 설명해주세요. 매번 다양한 구절을 추천하세요.

사용자가 "${situation}" 상황에 있습니다.

이 상황에 가장 적합한 성경 구절 하나를 찾아주세요. 매번 다른 구절을 추천해주세요.

다음 정보를 JSON 형식으로만 제공해주세요:

{
  "reference": "책 장:절 (예: 시편 23:1)",
  "text": "성경 구절 원문 (한글, 완전한 문장)",
  "context": "이 구절이 나온 성경의 앞뒤 문맥과 배경을 자세히 설명 (최소 3-4 문장)",
  "meaning": "이 구절이 현재 상황에 어떻게 적용되는지 구체적으로 설명 (최소 3-4 문장)",
  "prayer": "이 말씀을 바탕으로 한 진심어린 기도문 (최소 2-3 문장)"
}

JSON만 응답하고 다른 설명은 하지 마세요. 백틱이나 마크다운 형식도 사용하지 마세요.`
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      return res.status(response.status).json({ 
        error: 'API request failed',
        details: errorText 
      });
    }

    const data = await response.json();
    
    // Gemini 응답 구조: data.candidates[0].content.parts[0].text
    let content;
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      content = data.candidates[0].content.parts[0].text;
    } else {
      console.error('Unexpected Gemini response structure:', data);
      return res.status(200).json(getBackupVerse(situation));
    }
    
    // JSON 파싱
    let verseData;
    try {
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      verseData = JSON.parse(cleanContent);
    } catch (e) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          verseData = JSON.parse(jsonMatch[0]);
        } catch (e2) {
          console.error('JSON parsing failed, using backup verse');
          return res.status(200).json(getBackupVerse(situation));
        }
      } else {
        console.error('No JSON found in response, using backup verse');
        return res.status(200).json(getBackupVerse(situation));
      }
    }
    
    return res.status(200).json(verseData);

  } catch (error) {
    console.error('Server error:', error);
    return res.status(200).json(getBackupVerse('comfort'));
  }
}

// 백업 성경 구절 함수
function getBackupVerse(situation) {
  const backupVerses = {
    '위로가 필요할 때': {
      reference: "시편 46:1",
      text: "하나님은 우리의 피난처시요 힘이시니 환난 중에 만날 큰 도움이시라",
      context: "시편 46편은 예루살렘이 아시리아의 침략 위협을 받았을 때 쓰여진 것으로 여겨집니다. 이 시는 위기 속에서도 하나님께서 그의 백성의 피난처가 되시며, 역사를 주관하시는 분이심을 노래합니다. 시인은 산이 흔들리고 바다가 요동쳐도 하나님께서 함께 하시면 두려워할 필요가 없다고 선포합니다.",
      meaning: "힘든 상황 속에 계신다면, 이 말씀은 하나님께서 여러분의 안전한 피난처가 되신다는 것을 상기시켜줍니다. 세상이 흔들리고 모든 것이 불안정해 보일 때도 하나님은 변함없이 우리 곁에 계시며, 우리가 필요로 하는 모든 힘과 도움을 주십니다. 두려워하지 마시고 하나님을 신뢰하세요.",
      prayer: "사랑하는 하나님 아버지, 제가 힘들고 어려울 때 주님께서 저의 피난처가 되어주심을 감사드립니다. 환난 가운데서도 주님께서 저와 함께 하시며 도와주심을 믿습니다. 주님의 평안과 위로로 제 마음을 채워주시고, 이 어려운 시간을 주님과 함께 이겨낼 수 있도록 힘을 주소서. 예수님의 이름으로 기도합니다. 아멘."
    },
    '불안하고 두려울 때': {
      reference: "마태복음 6:34",
      text: "그러므로 내일 일을 위하여 염려하지 말라 내일 일은 내일이 염려할 것이요 한 날의 괴로움은 그 날로 족하니라",
      context: "예수님께서 산상수훈에서 제자들에게 가르치신 말씀입니다. 예수님은 먹을 것과 입을 것에 대해 염려하는 사람들에게, 하늘의 새와 들의 백합화를 보며 하나님의 돌보심을 깨달으라고 하셨습니다. 하나님께서 이들을 먹이시고 입히신다면, 하나님의 자녀인 우리를 얼마나 더 돌보시겠느냐는 말씀입니다.",
      meaning: "불안과 걱정이 마음을 짓누를 때, 이 말씀은 오늘 하루에 집중하라고 권면합니다. 미래의 문제는 그때 가서 주어질 은혜로 해결하면 됩니다. 하나님께서 우리의 필요를 아시고 채워주실 것을 신뢰하며, 오늘 이 순간을 충실히 살아가는 것이 중요합니다.",
      prayer: "주님, 저는 미래에 대한 걱정으로 마음이 무겁습니다. 하지만 주님께서 저의 내일도 책임지고 계심을 믿습니다. 오늘 하루를 주님과 함께 충실히 살아가게 하시고, 내일 일은 내일 주실 은혜로 감당할 수 있도록 도와주소서. 주님을 신뢰하며 평안을 누리게 하소서. 아멘."
    },
    '감사할 때': {
      reference: "시편 100:4-5",
      text: "감사함으로 그의 문에 들어가며 찬송함으로 그의 궁정에 들어가서 그에게 감사하며 그의 이름을 송축할지어다 여호와는 선하시니 그의 인자하심이 영원하고 그의 성실하심이 대대에 이르리로다",
      context: "시편 100편은 전체 땅을 향한 찬양의 초대입니다. 이 시는 하나님께 예배드릴 때 감사와 찬송으로 나아가야 함을 강조하며, 하나님의 선하심과 영원한 사랑, 그리고 세대를 이어 변함없으신 성실하심을 선포합니다. 감사는 하나님과의 관계에서 핵심적인 요소입니다.",
      meaning: "감사할 일이 있을 때, 이것이 모두 하나님의 선하심에서 비롯된 것임을 기억하세요. 하나님께 감사를 드리는 것은 우리의 시선을 문제에서 하나님께로 돌리게 하며, 하나님의 신실하심을 다시 한번 확인하게 합니다. 오늘도 감사의 제목들을 세어보며 하나님을 찬양하세요.",
      prayer: "감사의 하나님, 오늘 제게 주신 모든 은혜에 감사드립니다. 주님의 선하심과 신실하심을 찬양하며, 기쁨으로 주님을 예배합니다. 제 삶 가운데 베푸신 모든 축복을 기억하며, 감사하는 마음으로 살아가게 하소서. 아멘."
    },
    '결정이 필요할 때': {
      reference: "잠언 3:5-6",
      text: "너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라 너는 범사에 그를 인정하라 그리하면 네 길을 지도하시리라",
      context: "잠언 3장은 지혜의 가치와 하나님을 신뢰하는 삶에 대한 가르침입니다. 솔로몬은 우리 자신의 이해나 판단에만 의지하지 말고, 모든 일에서 하나님을 인정하고 신뢰할 때 하나님께서 우리의 길을 바르게 인도하신다고 말합니다. 이는 하나님 중심의 삶을 살라는 권면입니다.",
      meaning: "중요한 결정을 앞두고 계신가요? 이 말씀은 우리 자신의 판단만이 아니라 하나님의 인도하심을 구하라고 권면합니다. 하나님을 신뢰하며 그분의 뜻을 구할 때, 그분께서 우리를 올바른 길로 인도하실 것입니다. 기도하며 하나님의 음성에 귀 기울이세요.",
      prayer: "지혜의 하나님, 제가 내려야 할 결정 가운데 주님의 인도하심을 구합니다. 제 생각과 판단이 아닌 주님의 뜻을 따르게 하시고, 바른 길로 인도해 주소서. 주님을 신뢰하며 이 결정을 주님께 맡깁니다. 아멘."
    },
    '힘이 필요할 때': {
      reference: "이사야 40:31",
      text: "오직 여호와를 앙망하는 자는 새 힘을 얻으리니 독수리가 날개치며 올라감 같을 것이요 달음박질하여도 곤비하지 아니하겠고 걸어가도 피곤하지 아니하리로다",
      context: "이사야 40장은 바벨론 포로 생활로 지친 이스라엘 백성에게 주신 위로의 메시지입니다. 예언자 이사야는 하나님께서 창조주시며 영원하신 분이라는 사실을 상기시키며, 그분을 바라보며 기다리는 자들에게 새로운 힘과 소망을 주실 것을 약속합니다.",
      meaning: "지치고 힘들 때, 이 말씀은 하나님을 바라보며 기다리는 자에게 새 힘이 주어진다고 약속합니다. 우리의 힘이 다했을 때, 하나님께서 우리를 새롭게 하시고 능력을 주십니다. 하나님을 신뢰하고 그분께 의지할 때, 독수리처럼 높이 날아오를 수 있는 힘을 경험하게 될 것입니다.",
      prayer: "능력의 하나님, 지친 제게 새 힘을 주소서. 주님을 바라보며 기다리는 가운데 독수리같이 올라가는 힘을 경험하게 하소서. 주님의 능력으로 오늘의 어려움을 이겨내게 하시고, 주님 안에서 승리하게 하소서. 아멘."
    },
    '용서하고 싶을 때': {
      reference: "에베소서 4:32",
      text: "서로 친절하게 하며 불쌍히 여기며 서로 용서하기를 하나님이 그리스도 안에서 너희를 용서하심과 같이 하라",
      context: "사도 바울은 에베소 교회 성도들에게 그리스도 안에서의 새로운 삶의 방식을 가르치고 있습니다. 이 구절은 그리스도인의 관계에서 친절과 자비, 그리고 용서가 얼마나 중요한지 강조하며, 이 모든 것이 하나님께서 우리를 용서하신 것에 기초해야 함을 말합니다.",
      meaning: "용서는 쉽지 않지만, 하나님께서 먼저 우리를 용서하셨음을 기억할 때 가능합니다. 하나님께서 그리스도 안에서 우리의 모든 죄를 용서하신 것처럼, 우리도 다른 사람을 용서할 수 있습니다. 용서는 상대방뿐 아니라 우리 자신을 자유롭게 하며, 치유와 회복의 길을 엽니다.",
      prayer: "자비하신 하나님, 저를 먼저 용서해 주신 것처럼 저도 용서할 수 있는 마음을 주소서. 용서를 통해 자유와 평안을 경험하게 하시고, 주님의 사랑으로 다른 이들을 대할 수 있게 하소서. 아멘."
    },
    '희망이 필요할 때': {
      reference: "예레미야 29:11",
      text: "여호와의 말씀이니라 너희를 향한 나의 생각을 내가 아나니 평안이요 재앙이 아니니라 너희에게 미래와 희망을 주는 것이니라",
      context: "예레미야 선지자가 바벨론에 포로로 끌려간 이스라엘 백성에게 전한 하나님의 약속입니다. 70년의 포로 생활이라는 어두운 현실 속에서도, 하나님께서는 그들을 위한 선한 계획을 가지고 계시며 결국 회복과 귀환의 희망을 주실 것을 약속하셨습니다.",
      meaning: "앞이 보이지 않고 희망이 없어 보일 때도, 하나님께서는 우리를 위한 선한 계획을 가지고 계십니다. 현재의 어려움이 끝이 아니며, 하나님께서 예비하신 희망찬 미래가 있습니다. 하나님의 약속을 붙잡고 인내하며 나아갈 때, 그분의 선하신 계획이 이루어지는 것을 보게 될 것입니다.",
      prayer: "소망의 하나님, 제 앞날을 주관하시는 주님을 신뢰합니다. 주님께서 예비하신 좋은 계획과 희망을 믿으며 오늘을 살아가게 하소서. 어두운 터널을 지나는 이 시간에도 주님께서 함께 하심을 믿으며 나아가게 하소서. 아멘."
    },
    '사랑에 대해 알고 싶을 때': {
      reference: "요한일서 4:7-8",
      text: "사랑하는 자들아 우리가 서로 사랑하자 사랑은 하나님께 속한 것이니 사랑하는 자마다 하나님으로부터 나서 하나님을 알고 사랑하지 아니하는 자는 하나님을 알지 못하나니 이는 하나님은 사랑이심이라",
      context: "사도 요한은 그의 서신에서 사랑의 본질에 대해 가르칩니다. 진정한 사랑은 하나님으로부터 오며, 하나님 자신이 사랑이시기 때문에 우리도 사랑할 수 있다고 말합니다. 요한은 사랑하는 것이 하나님을 아는 것의 증거이며, 하나님의 자녀 된 우리의 본질임을 강조합니다.",
      meaning: "사랑은 단순한 감정이 아니라 하나님의 본질입니다. 우리가 서로 사랑할 때, 하나님을 알고 경험하게 됩니다. 하나님의 사랑을 받은 우리는 그 사랑으로 다른 사람들을 사랑할 수 있습니다. 진정한 사랑은 하나님으로부터 시작되며, 우리를 통해 세상에 흘러가게 됩니다.",
      prayer: "사랑의 하나님, 주님의 크신 사랑을 감사드립니다. 그 사랑으로 제 주변 사람들을 진심으로 사랑하게 하시고, 사랑 가운데 살아가게 하소서. 주님의 사랑이 저를 통해 흘러가게 하소서. 아멘."
    }
  };
  
  return backupVerses[situation] || backupVerses['위로가 필요할 때'];
}
