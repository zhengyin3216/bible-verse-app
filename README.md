# 오늘의 말씀 - 성경 말씀 앱 📖

당신의 상황에 맞는 성경 말씀과 그 의미를 찾아주는 웹 앱입니다.

## 🚀 배포 방법

### 방법 1: Vercel로 배포 (가장 쉬움!)

1. **GitHub에 코드 업로드**
   ```bash
   git init
   git add .
   git commit -m "첫 커밋"
   git branch -M main
   git remote add origin [당신의-GitHub-레포-URL]
   git push -u origin main
   ```

2. **Vercel 배포**
   - https://vercel.com 방문
   - GitHub 계정으로 로그인
   - "New Project" 클릭
   - 방금 만든 GitHub 레포지토리 선택
   - "Deploy" 클릭!
   - 몇 분 후 자동으로 배포 완료! 🎉

### 방법 2: Netlify로 배포

1. GitHub에 코드 업로드 (위와 동일)

2. **Netlify 배포**
   - https://netlify.com 방문
   - "Add new site" → "Import an existing project"
   - GitHub 연결 후 레포지토리 선택
   - Build command: `npm run build`
   - Publish directory: `build`
   - "Deploy site" 클릭!

## 💻 로컬에서 실행

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm start

# 브라우저에서 http://localhost:3000 열기
```

## 🔧 빌드

```bash
npm run build
```

빌드된 파일은 `build/` 폴더에 생성됩니다.

## 📁 프로젝트 구조

```
bible-verse-app/
├── public/
│   └── index.html
├── src/
│   ├── App.js          # 메인 앱 컴포넌트
│   └── index.js        # 진입점
├── package.json
└── README.md
```

## ⚙️ 기능

- 8가지 상황 카테고리 선택
- 커스텀 상황 입력
- AI가 상황에 맞는 성경 구절 검색
- 성경의 문맥과 배경 설명
- 현재 상황에 적용되는 의미 해석
- 말씀 기반 기도문 제공

## 🎨 기술 스택

- React 18
- Lucide React (아이콘)
- Claude AI API (말씀 검색)
- CSS-in-JS (인라인 스타일)

## 📝 참고사항

- Claude API는 이미 설정되어 있어 별도 API 키가 필요 없습니다
- 모바일 반응형 디자인 지원
- 다크 테마 기본 적용

## 🌟 배포 후 할 일

배포가 완료되면:
1. 생성된 URL을 친구들과 공유하세요!
2. 커스텀 도메인 연결 (선택사항)
3. Google Analytics 추가 (선택사항)

---

만든 이: Claude AI 🤖
배포 날짜: 2026년 2월
