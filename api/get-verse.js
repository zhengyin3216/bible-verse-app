// Vercel Serverless Function
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
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      console.error('API key not found');
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Hugging Face Inference API 호출
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `<s>[INST] 당신은 성경에 정통한 목회 상담가입니다. 사용자의 상황에 맞는 성경 구절을 찾아주고, 그 의미를 자세히 설명해주세요. 매번 다양한 구절을 추천하세요.

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

JSON만 응답하고 다른 설명은 하지 마세요. 백틱이나 마크다운 형식도 사용하지 마세요. [/INST]`,
          parameters: {
            max_new_tokens: 1200,
            temperature: 0.7,
            top_p: 0.95,
            return_full_text: false
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', response.status, errorText);
      
      // 503 에러 (모델 로딩 중)인 경우 재시도 안내
      if (response.status === 503) {
        return res.status(503).json({ 
          error: 'Model is loading',
          message: '모델이 시작 중입니다. 잠시 후 다시 시도해주세요.'
        });
      }
      
      return res.status(response.status).json({ 
        error: 'API request failed',
        details: errorText 
      });
    }

    const data = await response.json();
    
    // Hugging Face는 배열로 응답하거나 직접 텍스트로 응답
    let content;
    if (Array.isArray(data)) {
      content = data[0].generated_text || data[0];
    } else if (data.generated_text) {
      content = data.generated_text;
    } else {
      content = JSON.stringify(data);
    }
    
    // JSON 파싱
    let verseData;
    try {
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      verseData = JSON.parse(cleanContent);
    } catch (e) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        verseData = JSON.parse(jsonMatch[0]);
      } else {
        console.error('JSON parsing failed:', content);
        return res.status(500).json({ error: 'Failed to parse response' });
      }
    }
    
    return res.status(200).json(verseData);

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
