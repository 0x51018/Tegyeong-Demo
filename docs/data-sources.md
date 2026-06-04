# Vinyl catalog crawl notes

수집 기준일: **2026-06-04**

이 데모는 실행 중 외부 API를 호출하지 않는다. 공개 웹 페이지와 Discogs API에서 확인한 실제 발매 판본 정보를 `src/data/catalog.ts`에 정적 데이터로 저장한다. 앱 내부 검수 재고 가격은 최근 공개 체결가에서 개봉 여부와 상태 등급을 반영한 기능 시연용 데이터이며, 실제 외부 체결가와 구분해 표시한다.

## Source policy

- Discogs: 판본 식별, 발매 국가, 레이블, 카탈로그 번호, 포맷, 컬러, 트랙리스트
- KREAM: 국내 공개 거래 페이지의 최근 체결가, 발매가, 현재 공식 판매가 참고
- Ktown4u / KREAM 공식 브랜드샵: 예약 판매, 출시일, 구성품, 판매처 재고 참고
- Yes24 / Turntable Lab: 예약·인기 LP와 Discogs 릴리즈에 발매 연도가 비어 있는 판본의 정보 보조 확인
- Fangamer: 게임 OST LP 상품가, 구성, 트랙 수, 재고 상태 확인
- 중고나라: 공개 매물의 제목, 가격, 상태 설명을 중고 거래 기능 목업에 반영
- 번개장터: LP 태그와 상품 검색 페이지를 조사했으나, 공개 상품 상세가 검색 엔진에 안정적으로 노출되지 않은 경우 목업 원문으로 사용하지 않음
- `marketPrice`는 현재 판매 희망가가 아니라 확인 가능한 가장 최근 공개 체결가를 기록
- `lowestPrice`와 앱 내부 검수 재고 가격은 상태를 반영한 데모 가격이며 외부 실제 체결가가 아님
- 가격과 재고는 수집 이후 변동될 수 있으므로 앱에 수집일을 함께 표시
- 생산 수량은 출처가 명시한 경우에만 기록
- `npm run crawl:catalog`가 요청 아티스트의 Discogs 데이터를 `src/data/crawledCatalog.json`으로 생성
- 동일 앨범의 국가·연도·컬러별 프레싱이 매우 많은 해외 아티스트는 정규 앨범별 대표 LP 마스터로 묶어 검색 결과 중복을 줄임

## The Black Skirts / 검정치마

| 판본 | 발매 정보 | 국내 공개 시세/판매처 |
| --- | --- | --- |
| 201 Red Glitter LP | [Ktown4u](https://kr.ktown4u.com/iteminfo?goods_no=158802) | [KREAM](https://kream.co.kr/products/792992) |
| Hollywood 7-inch | [Discogs #14980320](https://www.discogs.com/release/14980320) | [KREAM](https://kream.co.kr/products/36332) |
| Team Baby | [Discogs #25344805](https://www.discogs.com/release/25344805) | [KREAM](https://kream.co.kr/products/74135) |
| THIRSTY | [Discogs #28500361](https://www.discogs.com/release/28500361) | [KREAM](https://kream.co.kr/products/110854) |
| Teen Troubles | [Discogs #32163555](https://www.discogs.com/release/32163555) | [KREAM](https://kream.co.kr/products/334422) |

`201`은 Ktown4u에서 2026-07-03 출시 예정, KREAM에서 2026-07-07 발매 예정으로 표시되어 있다. 현재 날짜인 2026-06-04 기준 아직 발매 전이며, Ktown4u 예약 판매 기간은 종료된 상태로 표시된다.

`Don't You Worry Baby (I'm Only Swimming)`의 확인된 바이닐 판본은 찾지 못해 미발매 검색 예시로 사용한다.

## HYUKOH / 혁오

| 판본 | Discogs | 국내 공개 시세/판매처 |
| --- | --- | --- |
| Panda Bear 7-inch Picture Disc | [#7202364](https://www.discogs.com/release/7202364) | - |
| 20 Japanese 1st Press | [#9429084](https://www.discogs.com/release/9429084) | - |
| 22 Japanese 1st Press | [#9429045](https://www.discogs.com/release/9429045) | - |
| 23 Japanese 1st Press | [#12658306](https://www.discogs.com/release/12658306) | - |
| 24 Japanese 1st Press | [#12658324](https://www.discogs.com/release/12658324) | - |
| 20 Korean Reissue | [#36152449](https://www.discogs.com/release/36152449) | [KREAM](https://kream.co.kr/products/755260) |
| 22 Korean Reissue | [#36152956](https://www.discogs.com/release/36152956) | [KREAM](https://kream.co.kr/products/755261) |
| 23 Korean Reissue | [#36152878](https://www.discogs.com/release/36152878) | [KREAM](https://kream.co.kr/products/755262) |
| 24 Korean Reissue | [#36152434](https://www.discogs.com/release/36152434) | [KREAM](https://kream.co.kr/products/755263) |
| Through Love / 사랑으로 | [#33243903](https://www.discogs.com/release/33243903) | [KREAM](https://kream.co.kr/products/755264) |
| AAA | [#31790057](https://www.discogs.com/release/31790057) | [KREAM](https://kream.co.kr/products/344944) |
| Funeral For A Friend 5LP Box | [#33584007](https://www.discogs.com/release/33584007) | [KREAM 공식 브랜드샵](https://kream.co.kr/products/434981) |

한국 재발매 20, 22, 23, 24와 사랑으로는 Discogs에 2026-01-09로 입력되어 있지만 국내 상품 페이지에는 2025-01-09로 표시된다. 사용자 화면에는 국내 상품 페이지 날짜를 우선 사용하고 차이를 주석으로 남겼다.

## C Jamm / 씨잼

| 판본 | Discogs | 국내 공개 시세 |
| --- | --- | --- |
| 킁 Black 180g LP | [#31086278](https://www.discogs.com/release/31086278) | [KREAM](https://kream.co.kr/products/283464) |
| 킁 Orange & Red Marbled Limited LP | [#31086320](https://www.discogs.com/release/31086320) | [KREAM](https://kream.co.kr/products/283463) |

Just Music 컴필레이션 `파급효과` 2LP는 C Jamm 참여 음반이므로 `C Jamm`, `CJAMM`, `씨잼` 검색 결과에 함께 표시한다.

## Price recheck

2026-06-04에 KREAM 상품 연결과 최근 공개 체결가를 다시 확인했다.

| 판본 | 최근 공개 체결가 또는 공식 판매가 | 출처 |
| --- | ---: | --- |
| 검정치마 Team Baby | 410,000원 최근 체결 | [KREAM](https://kream.co.kr/products/74135) |
| 검정치마 THIRSTY | 219,000원 최근 체결 | [KREAM](https://kream.co.kr/products/110854) |
| 검정치마 Teen Troubles | 220,000원 최근 체결 | [KREAM](https://kream.co.kr/products/334422) |
| HYUKOH 20 / 22 / 23 / 24 / 사랑으로 | 60,000 / 72,000 / 97,000 / 70,000 / 50,000원 최근 체결 | [20](https://kream.co.kr/products/755260), [22](https://kream.co.kr/products/755261), [23](https://kream.co.kr/products/755262), [24](https://kream.co.kr/products/755263), [사랑으로](https://kream.co.kr/products/755264) |
| HYUKOH & Sunset Rollercoaster AAA | 73,000원 최근 체결 | [KREAM](https://kream.co.kr/products/344944) |
| HYUKOH Funeral For A Friend 5LP Box | 660,000원 공식 판매가 | [KREAM](https://kream.co.kr/products/434981) |
| C Jamm 킁 Black / Marbled | 200,000 / 300,000원 최근 체결 | [Black](https://kream.co.kr/products/283464), [Marbled](https://kream.co.kr/products/283463) |
| 한로로 이상비행 | 219,000원 최근 체결, 56,700원 발매가 | [KREAM](https://kream.co.kr/products/306173) |

## Expanded Discogs catalog

아래 범위는 Discogs API를 통해 자동 수집한다.

| 아티스트 | 앱 수록 기준 |
| --- | --- |
| Nirvana | 정규 앨범과 주요 공식 라이브·컴필레이션의 대표 LP 마스터 |
| Slipknot | 정규 앨범 전체의 대표 LP 마스터 |
| David Bowie | 솔로 정규 앨범 전체의 대표 LP 마스터 |
| Michael Jackson | 솔로 정규·사후 정규 앨범과 `Blood On The Dance Floor`의 대표 LP 마스터 |
| 한로로 | Discogs에서 확인된 `이상비행` 오리지널 LP와 재발매 LP |
| Wave To Earth | Discogs에서 확인된 앨범·EP·7인치 개별 바이닐 판본 |
| C Jamm 참여작 | Just Music `파급효과 (Ripple Effect)` 2LP |

대표 마스터 항목은 정확한 구매 전 개별 프레싱의 국가, 카탈로그 번호, 컬러를 다시 확인해야 한다. 한로로와 Wave To Earth처럼 개별 릴리즈를 수록한 항목은 해당 판본의 릴리즈 ID를 직접 출처로 사용한다.

Discogs에서 연도가 비어 있는 Wave To Earth 참여 7인치 `여름밤에 우리는 / 우리는 우리를`은 [Yes24](https://www.yes24.com/product/goods/120822179)의 2023-08-17 정보를 사용했다. `Play With Earth! 0.03` 한국 LP는 [Turntable Lab](https://www.turntablelab.com/products/wave-to-earth-play-with-earth-0-03-vinyl-2lp)의 Wavy 2025 표기를 사용했다.

## Fangamer group-buy demo

공구 탭은 같은 해외 판매처 주문을 모아 국제 배송비를 나누고, VINYL FIND 입고 후 국내에서 개별 발송하는 흐름을 보여준다. 상품 자체의 공개 정보는 실제 Fangamer 페이지를 사용하고, 환율 환산가·국제 배송비·참여 인원·마감일은 기능 시연용 목업 데이터다.

| 게임 OST | 확인한 공개 상품 정보 |
| --- | --- |
| Hollow Knight | [Fangamer](https://www.fangamer.com/products/hollow-knight-vinyl-soundtrack) · $39 · 2LP picture disc · 26 tracks |
| UNDERTALE Complete Soundtrack | [Fangamer](https://www.fangamer.com/products/undertale-vinyl-soundtrack-2xlp) · $84 · 5LP · 109 tracks |
| Stardew Valley Complete Soundtrack | [Fangamer](https://www.fangamer.com/products/stardew-valley-complete-ost-vinyl-box-set) · $79 · 4LP · 77 tracks |
| Celeste | [Fangamer JP](https://jp.fangamer.com/products/celeste-vinyl-soundtrack) · $39 · Aurora and Strawberry 2LP · 19 tracks |

게임 OST 상세 페이지의 감상 버튼은 각 작곡가의 Bandcamp 앨범으로 연결한다. 그 외 카탈로그는 Apple Music 검색으로 연결한다.

2026-06-04 공개 상품 JSON 재확인 결과 Hollow Knight, Stardew Valley, Celeste는 판매 가능 상태이며, UNDERTALE은 상품 페이지에서 품절 상태로 확인했다. 재고 상태는 이후 변동될 수 있다.

## Yes24 popular and preorder demo

홈의 `YES24 인기·예약 LP` 레일은 아래 공개 상품 페이지를 기반으로 구성했다. 가격과 발매 일정은 수집 이후 변경될 수 있다.

| 앨범 | 공개 상품 페이지 |
| --- | --- |
| 한로로 `집` 2LP | [Yes24](https://www.yes24.com/product/goods/181825649) |
| AKMU `개화` LP | [Yes24](https://www.yes24.com/product/goods/190816472) |
| 소수빈 `EVERY` LP | [Yes24](https://www.yes24.com/product/goods/189625648) |
| 백예린 `Flash and Core` White 2LP | [Yes24](https://m.yes24.com/goods/detail/182626463) |
| 뷔 `Layover` Color LP | [Yes24](https://www.yes24.com/product/goods/146827471) |
| 도영 `Soar` Color LP | [Yes24](https://www.yes24.com/product/goods/148341869) |
| IVE `REVIVE+` White Marble LP | [Yes24](https://www.yes24.com/product/goods/176179004) |
| 쏜애플 `서울병 10th Anniversary` LP | [Yes24](https://www.yes24.com/product/goods/185831792) |

### 국내 새 상품 구매처 비교

2026-06-04 공개 판매 페이지를 기준으로 동일 LP의 가격과 재고 상태를 비교했다. 판매가가 같아도 판매 중·품절 상태가 다르므로 상세 페이지에는 가격과 상태를 함께 표시한다.

| 앨범 | 판매처 비교 |
| --- | --- |
| 뷔 `Layover` Color LP | [YES24 52,000원 판매 중](https://www.yes24.com/product/goods/146827471), [알라딘 52,000원 판매 중](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=362746750), [Ktown4u 52,000원 품절](https://kr.ktown4u.com/iteminfo?goods_no=143067) |
| 도영 `Soar` Color LP | [YES24 53,500원 판매 중](https://www.yes24.com/product/goods/148341869), [Ktown4u 53,500원 품절](https://kr.ktown4u.com/iteminfo?goods_no=143154) |
| 소수빈 `EVERY` LP | [YES24 52,000원](https://www.yes24.com/product/goods/189625648), [알라딘 52,000원](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=393512794) |

## Public used-listing mock data

중고 거래 탭의 외부 매물은 중고나라 공개 페이지를 바탕으로 만든 목업이다. 앱은 해당 매물의 실재·판매 상태를 보장하지 않으며, 공개 페이지가 삭제되거나 가격·설명이 변경될 수 있다. 상태 등급은 공개 설명을 데모용 Goldmine 필드에 맞춰 옮긴 값이며 실제 검수 결과가 아니다.

| 앨범 | 반영한 공개 매물 |
| --- | --- |
| Wave To Earth `Wave / Light` | [50,000원 매물](https://web.joongna.com/product/221128372), [55,000원 매물](https://web.joongna.com/product/221567936) |
| Wave To Earth `Play With Earth! 0.03` | [50,000원 매물](https://web.joongna.com/product/225849616) |
| 한로로 `집` | [88,000원 예약 상품 매물](https://web.joongna.com/product/227990129) |
| 검정치마 `THIRSTY` | [95,000원 매물](https://web.joongna.com/product/184525599) |
| 검정치마 `Hollywood` | [200,000원 매물](https://web.joongna.com/product/179002101) |
| C Jamm `킁` | [89,000원 일반반 매물](https://web.joongna.com/product/223761583), [150,000원 마블 한정반 매물](https://web.joongna.com/product/182376340) |
| HYUKOH `22` / `23` | [75,000원 22 매물](https://web.joongna.com/product/225650029), [103,000원 23 매물](https://web.joongna.com/product/225449676) |
| Nirvana `Nevermind` | [70,000원 라이선스반 매물](https://web.joongna.com/product/227501604) |
| Nirvana `In Utero` | [70,000원 30주년 미개봉 매물](https://web.joongna.com/product/218492054) |
| Nirvana `MTV Unplugged In New York` | [90,000원 미개봉 매물](https://web.joongna.com/product/226065324) |
| Michael Jackson `Off The Wall` | [60,000원 미국 초반 매물](https://web.joongna.com/product/228611395) |
| Michael Jackson `Thriller` | [45,000원 픽처 디스크 매물](https://web.joongna.com/product/226161416) |
| Michael Jackson `Bad` | [36,000원 일본 초판 매물](https://web.joongna.com/product/204906533) |
| Michael Jackson `Dangerous` | [100,000원 발매 당시 2LP 매물](https://web.joongna.com/product/207497983) |
| David Bowie `Space Oddity` | [40,000원 독일 미개봉 매물](https://web.joongna.com/product/221926470) |
| David Bowie `Blackstar` | [76,000원 민트급 매물](https://web.joongna.com/product/223163864) |
| David Bowie `Never Let Me Down` | [70,000원 일본반 매물](https://web.joongna.com/product/218519346) |
