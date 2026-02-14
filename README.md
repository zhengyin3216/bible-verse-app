# 오늘의 말씀 📖

당신의 상황에 맞는 성경 말씀을 AI가 찾아주는 웹 애플리케이션입니다.

![Status](https://img.shields.io/badge/status-active-success.svg)
![Platform](https://img.shields.io/badge/platform-Vercel-black.svg)

---

## ✨ 주요 기능

- 🎯 **상황별 성경 구절 추천**: 8가지 카테고리 (위로, 불안, 감사, 결정, 힘, 용서, 희망, 사랑)
- 🤖 **AI 기반 검색**: Claude AI가 매번 다른 적절한 성경 구절을 찾아줍니다
- 📝 **커스텀 상황 입력**: 직접 상황을 입력하면 그에 맞는 말씀을 추천
- 📖 **성경적 문맥 제공**: 구절의 배경과 앞뒤 문맥 설명
- 💡 **실용적 적용**: 현재 상황에 어떻게 적용할 수 있는지 구체적 설명
- 🙏 **기도문 제공**: 말씀을 바탕으로 한 기도문

---

## 🚀 라이브 데모

[https://bible-verse-app-kohl.vercel.app](https://bible-verse-app-kohl.vercel.app)

---

## 🛠️ 기술 스택

### Frontend
- **React 18** - UI 프레임워크
- **Lucide React** - 아이콘
- **CSS-in-JS** - 스타일링 (인라인 스타일)

### Backend
- **Vercel Serverless Functions** - API 엔드포인트
- **Google Gemini Pro API** - 무료 고품질 AI (한글 특화)

### Deployment
- **Vercel** - 배포 및 호스팅
- **GitHub** - 버전 관리

---

## 📦 프로젝트 구조

```
bible-verse-app/
├── api/
│   └── get-verse.js          # Serverless Function (Claude API 호출)
├── public/
│   ├── index.html            # HTML 템플릿 (필수!)
│   └── _redirects            # SPA 리다이렉트 설정
├── src/
│   ├── App.js                # 메인 React 컴포넌트
│   └── index.js              # 진입점
├── package.json              # 의존성 및 스크립트
├── vercel.json               # Vercel 배포 설정
├── .gitignore                # Git 제외 파일
└── README.md                 # 이 파일
```

---

## 🔧 로컬 개발 환경 설정

### 1. 사전 요구사항
- Node.js 14.x 이상
- npm 6.x 이상
- Git

### 2. 설치

```bash
# 레포지토리 클론
git clone https://github.com/yourusername/bible-verse-app.git
cd bible-verse-app

# 의존성 설치
npm install
```

### 3. 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성:

```env
# Google Gemini API Key (https://aistudio.google.com에서 발급)
GEMINI_API_KEY=your_api_key_here
```

### 4. 개발 서버 실행

```bash
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 5. 빌드

```bash
npm run build
```

빌드된 파일은 `build/` 폴더에 생성됩니다.

---

## 🌐 Vercel 배포

### 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

| Key | Value | Environments |
|-----|-------|--------------|
| `GEMINI_API_KEY` | your_gemini_key_here | Production, Preview, Development |

### 자동 배포

GitHub에 푸시하면 Vercel이 자동으로 배포합니다:

```bash
git add .
git commit -m "Update"
git push origin master
```

---

## 🎨 디자인 특징

- **고딕 성당 스타일**: 경건하고 차분한 분위기
- **다크 테마**: 눈의 피로를 줄이고 집중력 향상
- **그라데이션 배경**: 보라-핑크 계열의 부드러운 색상
- **유리형태(Glassmorphism)**: 반투명 효과와 블러 처리
- **애니메이션**: 부드러운 페이드인, 글로우 효과
- **세리프 폰트**: Crimson Text, Noto Serif KR
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원

---

## 🔐 보안

- ✅ API 키는 서버리스 함수에서만 사용 (브라우저에 노출 안 됨)
- ✅ CORS 정책 준수
- ✅ 환경 변수로 민감 정보 관리
- ✅ HTTPS 기본 사용 (Vercel)

---

## 📊 API 사용량 & 비용

**Google Gemini Pro API**
- ✅ **완전 무료!** 💰
- ✅ 신용카드 등록 불필요
- ✅ 분당 15회 요청 (개인 사용 충분)
- ✅ 일일 1,500회 요청 제한
- ✅ 한글 품질 최고 (GPT-4/Claude 수준)

**월 운영비: $0** 🎉

사용 모델: **Gemini Pro** (Google)
- 최신 멀티모달 AI
- 한글 특화 학습
- 빠른 응답 속도
- 안정적 서비스

사용량 확인: [Google AI Studio](https://aistudio.google.com)

---

## 🐛 문제 해결

### CORS 에러
- Serverless Function (`api/get-verse.js`) 사용으로 해결
- 브라우저에서 직접 API 호출하지 않음

### 환경 변수 인식 안 됨
- Vercel에 2개의 환경 변수 모두 설정 확인
- 배포 후 재시작 필요

### 빌드 에러
- `npm install` 재실행
- `node_modules` 삭제 후 재설치

문제 발견 시 [Issues](https://github.com/yourusername/bible-verse-app/issues)에 등록해주세요.

---

## 🤝 기여

기여는 언제나 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

## 👤 만든이

**zhengyin3216**
- GitHub: [@zhengyin3216](https://github.com/zhengyin3216)
- 프로젝트 링크: [https://github.com/zhengyin3216/bible-verse-app](https://github.com/zhengyin3216/bible-verse-app)

---

## 🙏 감사의 말

- [Google](https://google.com) - Gemini Pro API 무료 제공
- [Vercel](https://vercel.com) - 무료 호스팅 및 서버리스 함수
- [Lucide](https://lucide.dev) - 아름다운 아이콘
- [React](https://react.dev) - 강력한 UI 라이브러리

---

**주님의 말씀으로 하루하루 위로받으시기를 바랍니다.** 🙏✨
