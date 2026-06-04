# VINYL FIND Demo

창업 캡스톤 디자인 수업에서 사용할 모바일 퍼스트 바이닐 탐색·거래 서비스 데모입니다.

## Stack

- React + TypeScript + Vite
- React Router
- Crawled Discogs catalog + local demo transaction data
- Mobile-first responsive UI

## Run

```bash
npm install
npm run dev
```

## GitHub Pages

이 저장소는 `main` 브랜치에 push하면 GitHub Actions가 프로덕션 빌드를 생성하고 GitHub Pages에 배포합니다.

```bash
npm run build:pages
```

배포 주소는 `https://0x51018.github.io/Tegyeong-Demo/`입니다. GitHub 저장소의 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 설정해야 합니다. GitHub Pages의 정적 호스팅에서도 상세 화면 새로고침이 동작하도록 앱 라우팅은 URL hash를 사용합니다.

## Demo routes

- `/`: 홈 통합 검색, 추천 바이닐, YES24 인기·예약 LP
- `/group-buy`: Fangamer 게임 OST 주문 취합, 합배송, 국내 개별 발송 기반 공동구매
- `/vinyl/:vinylId`: 동일 앨범 판본 비교, 음악 감상 링크, 발매 정보, 구매처, 중고 거래, 위키
- `/market`: 매물 검색, 오프라인 레코드 빈 형태의 검수 재고 디깅, AI 검수 기반 판매 흐름
- `/community`: 커뮤니티 골격
- `/profile`: 컬렉션 프로필 골격

실제 발매 판본과 최근 공개 체결가 참고 데이터는 `src/data/catalog.ts`와 `src/data/crawledCatalog.json`에서 관리합니다. `npm run crawl:catalog`로 요청 아티스트의 Discogs 데이터를 다시 수집할 수 있습니다. 외부 출처와 수집 기준은 `docs/data-sources.md`를 참고하세요. 앱 내부 검수 재고 가격은 상태 등급을 반영한 데모 데이터이며, 공구 가격·배송 일정과 판매 예상가도 기능 시연용입니다.
