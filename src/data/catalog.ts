import type { MarketReference, SourceLink, UsedListing, Vinyl } from "../types";
import crawledCatalog from "./crawledCatalog.json";

export const CRAWLED_AT = "2026-06-04";

type DefaultedFields = Pick<
  Vinyl,
  | "searchAliases"
  | "genres"
  | "catalogNumber"
  | "retailPrice"
  | "marketPrice"
  | "lowestPrice"
  | "production"
  | "sellers"
  | "usedListings"
  | "marketReferences"
>;

type VinylSeed = Omit<Vinyl, keyof DefaultedFields | "crawledAt"> & Partial<DefaultedFields>;
type CrawledOverride = Partial<Omit<VinylSeed, "id" | "sourceLinks">> & {
  sourceLinks?: SourceLink[];
};

interface CrawledCatalogItem {
  id: string;
  title: string;
  artist: string;
  searchAliases: string[];
  cover: string;
  year: number;
  releaseDate: string;
  genres: string[];
  label: string;
  catalogNumber: string;
  country: string;
  pressing: string;
  format: string;
  vinylColor: string;
  availability: Vinyl["availability"];
  releaseWindow: string;
  production: string;
  description: string;
  dataNote?: string;
  tracks: string[];
  sourceType: "master" | "release";
  sourceId: number;
}

const createVinyl = (seed: VinylSeed): Vinyl => ({
  searchAliases: [],
  genres: [],
  catalogNumber: "미확인",
  retailPrice: null,
  marketPrice: null,
  lowestPrice: null,
  production: "수량 미공개",
  sellers: [],
  usedListings: [],
  marketReferences: [],
  crawledAt: CRAWLED_AT,
  ...seed,
});

const discogsSource = (id: number): SourceLink => ({
  label: `Discogs release #${id}`,
  url: `https://www.discogs.com/release/${id}`,
  kind: "발매 정보",
});

const discogsMasterSource = (id: number): SourceLink => ({
  label: `Discogs master #${id}`,
  url: `https://www.discogs.com/master/${id}`,
  kind: "발매 정보",
});

const kreamSource = (url: string): SourceLink => ({
  label: "KREAM 공개 거래 페이지",
  url,
  kind: "시세",
});

const marketReference = (label: string, price: number, url: string): MarketReference => ({
  label,
  price,
  source: "KREAM",
  capturedAt: CRAWLED_AT,
  url,
});

const demoListing = (
  id: string,
  price: number,
  grade: UsedListing["grade"],
  jacketGrade: UsedListing["jacketGrade"],
  listeningGrade: UsedListing["listeningGrade"],
  note: string,
): UsedListing => ({
  id,
  price,
  grade,
  jacketGrade,
  listeningGrade,
  seller: "VINYL FIND 데모 검수 재고",
  note,
});

const marketplaceListing = (
  id: string,
  price: number,
  grade: UsedListing["grade"],
  jacketGrade: UsedListing["jacketGrade"],
  listeningGrade: UsedListing["listeningGrade"],
  note: string,
): UsedListing => ({
  id,
  price,
  grade,
  jacketGrade,
  listeningGrade,
  seller: "VINYL FIND 검수 재고",
  note,
  shipping: "검수 완료 · 안전 포장 배송",
});

const crawledOverrides: Record<number, CrawledOverride> = {
  32337: {
    lowestPrice: 40000,
    usedListings: [
      marketplaceListing(
        "joongna-david-bowie-space-oddity-sealed",
        40000,
        "M",
        "M",
        "M",
        "Parlophone 독일반 · 미개봉 · 구성품 전체 포함",
      ),
    ],
  },
  49376: {
    lowestPrice: 70000,
    usedListings: [
      marketplaceListing(
        "joongna-david-bowie-never-let-me-down-japan",
        70000,
        "VG+",
        "VG+",
        "VG+",
        "1987 일본반 · 속지와 속비닐 포함",
      ),
    ],
  },
  939598: {
    lowestPrice: 76000,
    usedListings: [
      marketplaceListing(
        "joongna-david-bowie-blackstar-mint",
        76000,
        "M",
        "M",
        "M",
        "자켓·바이닐 민트급 · 구입 즉시 보호 필름 보관",
      ),
    ],
  },
  435524: {
    lowestPrice: 60000,
    usedListings: [
      marketplaceListing(
        "joongna-michael-jackson-off-the-wall-us",
        60000,
        "VG+",
        "VG+",
        "VG+",
        "1979 미국 초반 · 초음파 세척 · B면 미세 스크래치 청음 완료",
      ),
    ],
  },
  8883: {
    lowestPrice: 45000,
    usedListings: [
      marketplaceListing(
        "joongna-michael-jackson-thriller-picture",
        45000,
        "M",
        "NM",
        "M",
        "픽처 디스크 · 밀봉 포장은 아니지만 미개봉 새제품",
      ),
    ],
  },
  8517: {
    lowestPrice: 36000,
    usedListings: [
      marketplaceListing(
        "joongna-michael-jackson-bad-japan",
        36000,
        "VG",
        "VG+",
        "VG",
        "1987 일본 초판 · 내지와 오리지널 이너슬리브 포함 · 알판 연흔",
      ),
    ],
  },
  14641: {
    lowestPrice: 100000,
    usedListings: [
      marketplaceListing(
        "joongna-michael-jackson-dangerous-original",
        100000,
        "VG+",
        "VG+",
        "VG+",
        "발매 당시 2LP · 게이트폴드 · 가사지 포함 · 장기 보관품",
      ),
    ],
  },
  13814: {
    lowestPrice: 70000,
    usedListings: [
      marketplaceListing(
        "joongna-nirvana-nevermind-license",
        70000,
        "VG+",
        "VG",
        "VG+",
        "라이선스반 · 자켓 빛바램과 가장자리 헤짐 · 재생 영향 없는 얼룩",
      ),
    ],
  },
  13859: {
    lowestPrice: 70000,
    usedListings: [
      marketplaceListing(
        "joongna-nirvana-in-utero-30th-sealed",
        70000,
        "M",
        "M",
        "M",
        "30주년 판본 · 미개봉 · 보호 비닐 포함",
      ),
    ],
  },
  22433: {
    lowestPrice: 90000,
    usedListings: [
      marketplaceListing(
        "joongna-nirvana-mtv-unplugged-sealed",
        90000,
        "M",
        "M",
        "M",
        "미개봉 LP · 구성품 상태는 공개 설명 기준",
      ),
    ],
  },
  30317135: {
    title: "이상비행",
    searchAliases: ["Hanroro", "Take-off", "理想飛行"],
    retailPrice: 56700,
    marketPrice: 219000,
    lowestPrice: 185000,
    usedListings: [
      demoListing("hanroro-take-off-demo-01", 185000, "NM", "VG+", "NM", "개봉 · 자켓 모서리 미세 눌림 · 구성품 포함"),
    ],
    marketReferences: [
      marketReference("최근 공개 체결가", 219000, "https://kream.co.kr/products/306173"),
    ],
    sourceLinks: [kreamSource("https://kream.co.kr/products/306173")],
  },
  34290994: {
    title: "이상비행 (2025 재발매)",
    searchAliases: ["Hanroro", "Take-off", "理想飛行", "이상비행"],
    releaseDate: "2025-04",
    retailPrice: 56700,
    sourceLinks: [
      {
        label: "Yes24 재발매 상품 상세",
        url: "https://m.yes24.com/goods/detail/147561261",
        kind: "판매처",
      },
    ],
  },
  35761546: {
    lowestPrice: 50000,
    usedListings: [
      marketplaceListing(
        "joongna-wave-light-blue",
        50000,
        "M",
        "NM",
        "M",
        "미개봉 · 한정 블루 컬러 · 구성품 전체 포함",
      ),
      marketplaceListing(
        "joongna-wave-light-limited",
        55000,
        "M",
        "NM",
        "M",
        "서울레코드페어 700매 한정 블루 컬러 · 미개봉",
      ),
    ],
  },
  35958604: {
    lowestPrice: 50000,
    usedListings: [
      marketplaceListing(
        "joongna-play-with-earth-black",
        50000,
        "M",
        "NM",
        "M",
        "블랙 바이닐 미개봉 · LP 전용 포장",
      ),
    ],
  },
};

const blackSkirts201Tracks = [
  "좋아해줘",
  "Stand Still",
  "강아지",
  "상아",
  "Antifreeze",
  "Tangled",
  "Avant Garde Kim",
  "Le Fou Muet",
  "Dientes",
  "Kiss And Tell",
  "Fling; Fig From France",
  "I Like Watching You Go",
];

const hyukoh20Tracks = ["Lonely", "Feels Like Roller Coaster Ride", "Ohio", "위잉위잉", "Our Place", "I Have No Hometown"];
const hyukoh22Tracks = ["Settled Down", "와리가리", "큰새", "Mer", "Hooka", "공드리"];
const hyukoh23Tracks = [
  "Burning Youth",
  "Tokyo Inn",
  "가죽자켓",
  "TOMBOY",
  "2002WorldCup",
  "Jesus Lived In A Motel Room",
  "Wanli 万里",
  "Die Alone",
  "지정석",
  "Simon",
  "Paul",
  "Surf Boy",
];
const hyukoh24Tracks = ["Graduation", "하늘나라", "LOVE YA!", "Citizen Kane", "Gang Gang Schiele", "Goodbye Seoul"];
const throughLoveTracks = ["Help", "Hey Sun", "Silverhair Express", "Flat Dog", "World Of The Forgotten", "New Born"];
const aaaTracks = ["Kite War", "Y", "Antenna", "Glue", "Young Man", "Do Nothing", "Aaaannnnteeeeennnaaaaaa", "2F 年轻人"];
const keungTracks = ["가끔 난 날 안 믿어", "원래 난 이랬나", "Slay", "휙", "끽", "ㅈ", "샹송", "코케인 러브❤", "약빨", "포커페이스", "왈"];

const hyukoh20Cover =
  "https://i.discogs.com/flbB1yVTBAwt0P6qvWds3GaLrhFM0LZugqhN4y7REJw/rs:fit/g:sm/q:90/h:596/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM2MTUy/NDQ5LTE3Njk3NTI2/MjUtNjY5MS5qcGVn.jpeg";
const hyukoh22Cover =
  "https://i.discogs.com/0xxXrmmBwtUd3EjVv62asPbEdVJR2AJAzGWhbAZ0fLc/rs:fit/g:sm/q:90/h:593/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM2MTUy/OTU2LTE3Njk3NTQ1/OTYtMjYwMy5qcGVn.jpeg";
const hyukoh23Cover =
  "https://i.discogs.com/8mt60Mp3p8mEAEMnKc6x8F2x_9UVsjOXDSYiYZt4kwo/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM2MTUy/ODc4LTE3NjgyNzY2/MzYtOTM4Mi5qcGVn.jpeg";
const hyukoh24Cover =
  "https://i.discogs.com/jiFtxdLZ5M-0JzK005KdBCjXG_8bfVYmdNyIp7WNYnc/rs:fit/g:sm/q:90/h:589/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM2MTUy/NDM0LTE3Njk3NTc0/ODYtNzI0My5qcGVn.jpeg";

const coreVinyls: Vinyl[] = [
  createVinyl({
    id: "black-skirts-201-red-glitter",
    title: "201",
    artist: "검정치마",
    searchAliases: ["The Black Skirts", "조휴일"],
    cover: "https://media.ktown4u.com/products/resize/thumbnail/2026/03/12/kWTpw9.png",
    year: 2026,
    releaseDate: "2026-07-03 예정",
    genres: ["Indie Rock", "K-Rock"],
    label: "Doggy Rich / YG Plus",
    catalogNumber: "GD00158802",
    country: "대한민국",
    pressing: "201 Red Glitter 첫 LP 판본",
    format: "180g 1LP · Tip-on Gatefold",
    vinylColor: "Red Glitter",
    availability: "발매 예정",
    retailPrice: 55000,
    releaseWindow: "예약 판매 2026.03.12 - 2026.03.26 · 발매 2026.07.03 예정",
    production: "예약 주문 제작 · 수량 미공개",
    description:
      "검정치마 정규 1집 201의 첫 LP 판본입니다. 180g 레드 글리터 컬러 디스크와 팁온 게이트폴드 자켓으로 구성됩니다.",
    dataNote: "Ktown4u 페이지는 현재 품절로 표시되며, KREAM에는 2026-07-07 발매 예정으로 등록되어 날짜 차이가 있습니다.",
    tracks: blackSkirts201Tracks,
    sellers: [
      {
        name: "Ktown4u",
        price: 55000,
        shipping: "예약 판매 종료 · 2026-07-03 입고 예정",
        region: "국내",
        url: "https://kr.ktown4u.com/iteminfo?goods_no=158802",
      },
    ],
    sourceLinks: [
      { label: "Ktown4u 상품 상세", url: "https://kr.ktown4u.com/iteminfo?goods_no=158802", kind: "판매처" },
      kreamSource("https://kream.co.kr/products/792992"),
    ],
  }),
  createVinyl({
    id: "black-skirts-team-baby",
    title: "Team Baby",
    artist: "검정치마",
    searchAliases: ["The Black Skirts", "조휴일"],
    cover:
      "https://i.discogs.com/4hx-hhM8IQkDY6PrXxy2-66h45U4LMGtsKwCdVMXMQY/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI1MzQ0/ODA1LTE2ODM4Njg4/OTMtNzE0NS5qcGVn.jpeg",
    year: 2022,
    releaseDate: "2022",
    genres: ["Indie Rock", "K-Rock"],
    label: "Doggy Rich",
    catalogNumber: "YP0171",
    country: "대한민국",
    pressing: "Team Baby Splatter LP",
    format: "1LP · Poster · Lyric Sheet · Photocard",
    vinylColor: "Splatter Color",
    availability: "중고 거래만",
    retailPrice: 55000,
    marketPrice: 410000,
    lowestPrice: 360000,
    releaseWindow: "2022 발매 · 현재 정규 판매 종료",
    description: "검정치마의 사랑 연작 첫 앨범을 담은 스플래터 컬러 LP 판본입니다.",
    tracks: ["난 아니에요", "Big Love", "Diamond", "Love Is All", "내 고향 서울엔", "폭죽과 풍선들", "한시 오분", "나랑 아니면", "혜야", "Everything", "걱정 하지마"],
    usedListings: [demoListing("team-baby-demo-01", 360000, "NM", "VG+", "NM", "개봉 · 포스터 포함 · 자켓 모서리 미세 눌림")],
    marketReferences: [marketReference("최근 공개 체결가", 410000, "https://kream.co.kr/products/74135")],
    sourceLinks: [discogsSource(25344805), kreamSource("https://kream.co.kr/products/74135")],
  }),
  createVinyl({
    id: "black-skirts-thirsty",
    title: "THIRSTY",
    artist: "검정치마",
    searchAliases: ["The Black Skirts", "조휴일"],
    cover:
      "https://i.discogs.com/jtW_KKulhLt3_pwDWrLxknAD55gNDU0GzBy1xr4oi0E/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI4NTAw/MzYxLTE2OTY0ODUz/MjUtNDYxNC5qcGVn.jpeg",
    year: 2023,
    releaseDate: "2023-10-04",
    genres: ["Indie Rock", "K-Rock"],
    label: "Doggy Rich",
    catalogNumber: "YP0172",
    country: "대한민국",
    pressing: "THIRSTY Marble Smoke LP",
    format: "1LP · Gatefold",
    vinylColor: "Marble Smoke Transparent",
    availability: "중고 거래만",
    marketPrice: 219000,
    lowestPrice: 190000,
    releaseWindow: "2023.10.04 발매 · 현재 정규 판매 종료",
    description: "검정치마 정규 3집의 마블 스모크 투명 바이닐 판본입니다.",
    tracks: ["틀린질문", "Lester Burnham", "섬 (Queen Of Diamonds)", "상수역", "광견일기", "Bollywood", "빨간 나를", "Put Me On Drugs", "하와이 검은 모래", "맑고 묽게", "그늘은 그림자로", "피와 갈증 (King Of Hurts)"],
    usedListings: [
      marketplaceListing(
        "joongna-thirsty-sealed",
        95000,
        "M",
        "NM",
        "M",
        "미개봉 · 구성품 전체 포함",
      ),
      demoListing("thirsty-demo-01", 190000, "NM", "NM", "NM", "개봉 후 1회 청음 · 구성품 포함"),
    ],
    marketReferences: [marketReference("최근 공개 체결가", 219000, "https://kream.co.kr/products/110854")],
    sourceLinks: [discogsSource(28500361), kreamSource("https://kream.co.kr/products/110854")],
  }),
  createVinyl({
    id: "black-skirts-teen-troubles",
    title: "Teen Troubles",
    artist: "검정치마",
    searchAliases: ["The Black Skirts", "조휴일"],
    cover:
      "https://i.discogs.com/63MJp8o1L1SdXpowvoaDuGm0YLLdC-a_eBIj1oqNfpw/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTMyMTYz/NTU1LTE3MzA0Mzc3/MTUtNTc5NS5qcGVn.jpeg",
    year: 2024,
    releaseDate: "2024-10-31",
    genres: ["Indie Rock", "K-Rock"],
    label: "Doggy Rich",
    catalogNumber: "YP0469",
    country: "대한민국",
    pressing: "Teen Troubles Emerald 2LP",
    format: "180g 2LP · Gatefold",
    vinylColor: "Emerald Green Transparent",
    availability: "중고 거래만",
    retailPrice: 95000,
    marketPrice: 220000,
    lowestPrice: 190000,
    releaseWindow: "2024.10.31 발매 · 현재 정규 판매 종료",
    description: "검정치마 정규 4집을 180g 에메랄드 그린 투명 2LP로 담은 판본입니다.",
    tracks: ["Flying Bobs", "Baptized In Fire", "My Little Lambs", "Sunday Girl", "Friends In Bed", "Cicadas", "Garden State Dreamers", "Follow You", "Jersey Girl", "Love You The Same", "Powder Blue", "Electra", "Min", "Jeff & Alana", "Ling Ling", "John Fry", "99%", "Our Own Summer"],
    usedListings: [demoListing("teen-troubles-demo-01", 190000, "NM", "NM", "NM", "2LP 모두 청음 검수 완료")],
    marketReferences: [marketReference("최근 공개 체결가", 220000, "https://kream.co.kr/products/334422")],
    sourceLinks: [discogsSource(32163555), kreamSource("https://kream.co.kr/products/334422")],
  }),
  createVinyl({
    id: "black-skirts-hollywood",
    title: "Hollywood",
    artist: "검정치마",
    searchAliases: ["The Black Skirts", "조휴일"],
    cover:
      "https://i.discogs.com/GXzSxBKxaLW_YtgVH-wK_r6NcZSY9aW3DLxuCyflnio/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE0OTgw/MzIwLTE1ODUwNDkz/NjMtNTU1NC5qcGVn.jpeg",
    year: 2020,
    releaseDate: "2020-03-25",
    genres: ["Indie Rock", "K-Rock"],
    label: "Doggy Rich",
    catalogNumber: "HR7S174",
    country: "일본",
    pressing: "Japanese 7-inch Single",
    format: '7" Single',
    vinylColor: "Black",
    availability: "중고 거래만",
    retailPrice: 41000,
    marketPrice: 350000,
    releaseWindow: "2020.03.25 발매 · 현재 정규 판매 종료",
    description: "Hollywood와 In My City Of Seoul을 담은 일본 발매 7인치 싱글입니다.",
    tracks: ["Hollywood", "In My City Of Seoul"],
    usedListings: [
      marketplaceListing(
        "joongna-hollywood-opened",
        200000,
        "NM",
        "VG",
        "NM",
        "개봉 · 청음 횟수 적음 · 커버 뒷면 오염",
      ),
    ],
    marketReferences: [marketReference("최근 공개 체결가", 350000, "https://kream.co.kr/products/382214")],
    sourceLinks: [discogsSource(14980320), kreamSource("https://kream.co.kr/products/382214")],
  }),
  createVinyl({
    id: "hyukoh-20-korea-reissue",
    title: "20",
    artist: "HYUKOH",
    searchAliases: ["혁오", "오혁"],
    cover: hyukoh20Cover,
    year: 2025,
    releaseDate: "2025-01-09",
    genres: ["Indie Rock", "K-Rock"],
    label: "Dooroodooroo Artist Company",
    catalogNumber: "YP0592",
    country: "대한민국",
    pressing: "Korean 2nd Pressing",
    format: '180g 1LP · 12" EP · Gatefold',
    vinylColor: "Black",
    availability: "중고 거래만",
    retailPrice: 65900,
    marketPrice: 60000,
    lowestPrice: 55000,
    releaseWindow: "2025.01.09 공개 판매 · 최근 공개 체결가 확인 가능",
    description: "HYUKOH의 데뷔 EP를 180g 블랙 바이닐과 게이트폴드 자켓으로 재발매한 한국 판본입니다.",
    dataNote: "Discogs에는 2026-01-09로 입력되어 있으나 국내 상품 페이지의 발매일 2025-01-09를 우선 표기했습니다.",
    tracks: hyukoh20Tracks,
    usedListings: [demoListing("hyukoh-20-demo-01", 55000, "NM", "NM", "NM", "개봉 · 인서트 포함 · 청음 검수 완료")],
    marketReferences: [marketReference("최근 공개 체결가", 60000, "https://kream.co.kr/products/755260")],
    sourceLinks: [discogsSource(36152449), kreamSource("https://kream.co.kr/products/755260")],
  }),
  createVinyl({
    id: "hyukoh-22-korea-reissue",
    title: "22",
    artist: "HYUKOH",
    searchAliases: ["혁오", "오혁"],
    cover: hyukoh22Cover,
    year: 2025,
    releaseDate: "2025-01-09",
    genres: ["Indie Rock", "K-Rock"],
    label: "Dooroodooroo Artist Company",
    catalogNumber: "YP0593",
    country: "대한민국",
    pressing: "Korean 2nd Pressing",
    format: '180g 1LP · 12" EP · Gatefold',
    vinylColor: "Black",
    availability: "중고 거래만",
    retailPrice: 65900,
    marketPrice: 72000,
    lowestPrice: 68000,
    releaseWindow: "2025.01.09 공개 판매 · 최근 공개 체결가 확인 가능",
    description: "EP 22의 두 번째 프레싱. 180g 블랙 바이닐, 게이트폴드 자켓과 8페이지 인서트 구성입니다.",
    dataNote: "Discogs에는 2026-01-09로 입력되어 있으나 국내 상품 페이지의 발매일 2025-01-09를 우선 표기했습니다.",
    tracks: hyukoh22Tracks,
    usedListings: [
      marketplaceListing(
        "joongna-hyukoh-22-sealed",
        75000,
        "M",
        "M",
        "M",
        "미개봉 · 구성품 전체 포함 · 직거래 가능",
      ),
      demoListing("hyukoh-22-demo-01", 68000, "VG+", "VG+", "NM", "개봉 · 자켓 생활 흔적 · 재생 상태 양호"),
    ],
    marketReferences: [marketReference("최근 공개 체결가", 72000, "https://kream.co.kr/products/755261")],
    sourceLinks: [discogsSource(36152956), kreamSource("https://kream.co.kr/products/755261")],
  }),
  createVinyl({
    id: "hyukoh-23-korea-reissue",
    title: "23",
    artist: "HYUKOH",
    searchAliases: ["혁오", "오혁"],
    cover: hyukoh23Cover,
    year: 2025,
    releaseDate: "2025-01-09",
    genres: ["Indie Rock", "K-Rock"],
    label: "Dooroodooroo Artist Company",
    catalogNumber: "YP0594",
    country: "대한민국",
    pressing: "Korean 2nd Pressing",
    format: "180g 2LP · Gatefold",
    vinylColor: "Transparent Clear",
    availability: "중고 거래만",
    retailPrice: 79300,
    marketPrice: 97000,
    releaseWindow: "2025.01.09 공개 판매 · 최근 공개 체결가 확인 가능",
    description: "HYUKOH 정규 1집을 180g 투명 컬러 2LP와 게이트폴드 자켓으로 재발매한 판본입니다.",
    dataNote: "Discogs에는 2026-01-09로 입력되어 있으나 국내 상품 페이지의 발매일 2025-01-09를 우선 표기했습니다.",
    tracks: hyukoh23Tracks,
    usedListings: [
      marketplaceListing(
        "joongna-hyukoh-23-sealed",
        103000,
        "M",
        "M",
        "M",
        "미개봉 새제품 · LP 전용 박스 포장",
      ),
    ],
    marketReferences: [marketReference("최근 공개 체결가", 97000, "https://kream.co.kr/products/755262")],
    sourceLinks: [discogsSource(36152878), kreamSource("https://kream.co.kr/products/755262")],
  }),
  createVinyl({
    id: "hyukoh-24-korea-reissue",
    title: "24: How To Find True Love And Happiness",
    artist: "HYUKOH",
    searchAliases: ["혁오", "오혁", "24"],
    cover: hyukoh24Cover,
    year: 2025,
    releaseDate: "2025-01-09",
    genres: ["Indie Rock", "K-Rock"],
    label: "Dooroodooroo Artist Company",
    catalogNumber: "YP0595",
    country: "대한민국",
    pressing: "Korean 2nd Pressing",
    format: '180g 1LP · 12" EP · Gatefold',
    vinylColor: "Transparent Red",
    availability: "중고 거래만",
    retailPrice: 65900,
    marketPrice: 70000,
    releaseWindow: "2025.01.09 공개 판매 · 최근 공개 체결가 확인 가능",
    description: "EP 24의 두 번째 프레싱으로, 180g 투명 레드 바이닐과 8페이지 인서트로 구성됩니다.",
    dataNote: "Discogs에는 2026-01-09로 입력되어 있으나 국내 상품 페이지의 발매일 2025-01-09를 우선 표기했습니다.",
    tracks: hyukoh24Tracks,
    marketReferences: [marketReference("최근 공개 체결가", 70000, "https://kream.co.kr/products/755263")],
    sourceLinks: [discogsSource(36152434), kreamSource("https://kream.co.kr/products/755263")],
  }),
  createVinyl({
    id: "hyukoh-through-love-korea",
    title: "사랑으로 (Through Love)",
    artist: "HYUKOH",
    searchAliases: ["혁오", "오혁", "Through Love"],
    cover:
      "https://i.discogs.com/lQ6eFn-snjERX0SBo_NlEUXCg93S0TclnFuJpkE8t1g/rs:fit/g:sm/q:90/h:595/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTMzMjQz/OTAzLTE3Njk3NTgz/NDEtNTAyMC5qcGVn.jpeg",
    year: 2025,
    releaseDate: "2025-01-09",
    genres: ["Country Rock", "K-Rock"],
    label: "Dooroodooroo Artist Company",
    catalogNumber: "YP0596",
    country: "대한민국",
    pressing: "1st Vinyl Pressing",
    format: '180g 1LP · 12" EP · Gatefold',
    vinylColor: "Opaque White",
    availability: "중고 거래만",
    retailPrice: 65900,
    marketPrice: 50000,
    lowestPrice: 45000,
    releaseWindow: "2025.01.09 공개 판매 · 최근 공개 체결가 확인 가능",
    description: "HYUKOH의 EP 사랑으로를 처음 바이닐로 옮긴 180g 불투명 화이트 판본입니다.",
    dataNote: "Discogs에는 2026-01-09로 입력되어 있으나 국내 상품 페이지의 발매일 2025-01-09를 우선 표기했습니다.",
    tracks: throughLoveTracks,
    usedListings: [demoListing("through-love-demo-01", 45000, "NM", "VG+", "NM", "개봉 · 화이트 바이닐 오염 없음 · 자켓 미세 눌림")],
    marketReferences: [marketReference("최근 공개 체결가", 50000, "https://kream.co.kr/products/755264")],
    sourceLinks: [discogsSource(33243903), kreamSource("https://kream.co.kr/products/755264")],
  }),
  createVinyl({
    id: "hyukoh-aaa",
    title: "AAA",
    artist: "HYUKOH & Sunset Rollercoaster",
    searchAliases: ["혁오", "오혁", "落日飛車", "낙일비차"],
    cover:
      "https://i.discogs.com/8B_C4i7SZBUq01WbF0yVVIRm0sQiQCEk8StT46g0PgM/rs:fit/g:sm/q:90/h:570/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTMxNzkw/MDU3LTE3MjY5NzQx/MzMtNjE1NS5wbmc.jpeg",
    year: 2024,
    releaseDate: "2024-10-15",
    genres: ["Alternative Rock", "Krautrock"],
    label: "Dooroodooroo Artist Company / 夕陽音樂",
    catalogNumber: "YP0405",
    country: "대한민국",
    pressing: "1st Vinyl Pressing",
    format: "1LP · Album",
    vinylColor: "Black",
    availability: "중고 거래만",
    marketPrice: 73000,
    lowestPrice: 60000,
    releaseWindow: "2024.10.15 발매 · 최근 공개 체결가 확인 가능",
    description: "HYUKOH와 대만 밴드 Sunset Rollercoaster가 함께 만든 협업 앨범의 한국 바이닐 판본입니다.",
    tracks: aaaTracks,
    usedListings: [demoListing("aaa-demo-01", 60000, "NM", "NM", "NM", "개봉 후 청음 검수 완료")],
    marketReferences: [marketReference("최근 공개 체결가", 73000, "https://kream.co.kr/products/344944")],
    sourceLinks: [discogsSource(31790057), kreamSource("https://kream.co.kr/products/344944")],
  }),
  createVinyl({
    id: "hyukoh-funeral-for-a-friend-box",
    title: "Funeral For A Friend",
    artist: "HYUKOH",
    searchAliases: ["혁오", "오혁", "Box Set"],
    cover:
      "https://i.discogs.com/LtM95y4RyWNrLt-4zWCrqKyJAbXHRrwR-DmGW1YjBt8/rs:fit/g:sm/q:90/h:450/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTMzNTg0/MDA3LTE3NDM2MDI4/OTYtNTYyMi5qcGVn.jpeg",
    year: 2025,
    releaseDate: "2025-02-14",
    genres: ["Indie Rock", "K-Rock"],
    label: "Dooroodooroo Artist Company",
    country: "대한민국",
    pressing: "Numbered Limited Box Set",
    format: "5LP Box Set",
    vinylColor: "Black · Clear Red · White",
    availability: "판매 중",
    retailPrice: 660000,
    releaseWindow: "2025.02.14 발매 · 판매처별 재고 변동",
    production: "0000-1993 넘버링 한정",
    description: "20, 22, 23, 24, 사랑으로를 한데 묶은 5LP 넘버링 박스셋. HYUKOH와 Hiroshi Fujiwara / Fragment가 디자인했습니다.",
    dataNote: "KREAM 공식 브랜드샵의 현재 판매가입니다. 일반 중고 체결가와 구분해 표시합니다.",
    tracks: ["20", "22", "23", "24: How To Find True Love And Happiness", "사랑으로 (Through Love)"],
    sellers: [
      {
        name: "KREAM 공식 브랜드샵",
        price: 660000,
        shipping: "브랜드 배송 · 재고 실시간 변동",
        region: "국내",
        url: "https://kream.co.kr/products/434981",
      },
    ],
    sourceLinks: [
      discogsSource(33584007),
      kreamSource("https://kream.co.kr/products/434981"),
    ],
  }),
  createVinyl({
    id: "hyukoh-20-japan-2016",
    title: "20",
    artist: "HYUKOH",
    searchAliases: ["혁오", "오혁", "일본 초판"],
    cover:
      "https://i.discogs.com/ZykLEOwKH3xcE9xSdIAnpC_EA0aBCLioyYxO5hS9PwI/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTk0Mjkw/ODQtMTQ4MDQzMzQ3/MC0yMjk0LmpwZWc.jpeg",
    year: 2016,
    releaseDate: "2016-11-09",
    genres: ["Indie Rock", "K-Rock"],
    label: "Toy's Factory",
    catalogNumber: "TFJK-38504",
    country: "일본",
    pressing: "Japanese 1st Pressing",
    format: '12" EP · Limited Edition',
    vinylColor: "Black",
    availability: "단종",
    releaseWindow: "2016 일본 한정 발매 · 판매 종료",
    description: "EP 20의 일본 한정 첫 바이닐 판본입니다.",
    tracks: hyukoh20Tracks,
    sourceLinks: [discogsSource(9429084)],
  }),
  createVinyl({
    id: "hyukoh-22-japan-2016",
    title: "22",
    artist: "HYUKOH",
    searchAliases: ["혁오", "오혁", "일본 초판"],
    cover:
      "https://i.discogs.com/hZD5yfglc7RxqqOe2C-0aNmARz7HO58K6QtPmXdIpyc/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTk0Mjkw/NDUtMTQ4MDQzMzcz/Ni05NzQxLmpwZWc.jpeg",
    year: 2016,
    releaseDate: "2016-11-09",
    genres: ["Indie Rock", "K-Rock"],
    label: "Toy's Factory",
    catalogNumber: "TFJK-38505",
    country: "일본",
    pressing: "Japanese 1st Pressing",
    format: '12" EP · Limited Edition',
    vinylColor: "Black",
    availability: "단종",
    releaseWindow: "2016 일본 한정 발매 · 판매 종료",
    description: "EP 22의 일본 한정 첫 바이닐 판본입니다.",
    tracks: hyukoh22Tracks,
    sourceLinks: [discogsSource(9429045)],
  }),
  createVinyl({
    id: "hyukoh-23-japan-2018",
    title: "23",
    artist: "HYUKOH",
    searchAliases: ["혁오", "오혁", "일본 초판"],
    cover:
      "https://i.discogs.com/cY66IJMm5agl-_7s2GMPEl-itgERU7sa1FSzqPDW5Qs/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTEyNjU4/MzA2LTE1Mzk0OTkz/NDktODk0NS5qcGVn.jpeg",
    year: 2018,
    releaseDate: "2018-10-10",
    genres: ["Indie Rock", "K-Rock"],
    label: "Toy's Factory",
    catalogNumber: "TFJK-38506",
    country: "일본",
    pressing: "Japanese 1st Pressing",
    format: "2LP · Limited Edition",
    vinylColor: "Black",
    availability: "단종",
    releaseWindow: "2018 일본 한정 발매 · 판매 종료",
    description: "정규 1집 23의 일본 한정 첫 바이닐 판본입니다.",
    tracks: hyukoh23Tracks,
    sourceLinks: [discogsSource(12658306)],
  }),
  createVinyl({
    id: "hyukoh-24-japan-2018",
    title: "24: How To Find True Love And Happiness",
    artist: "HYUKOH",
    searchAliases: ["혁오", "오혁", "24", "일본 초판"],
    cover:
      "https://i.discogs.com/aWQ_w5SwS0b5sNrsYm1db3ha2rvkD2n_htSQ2lCgZI8/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTEyNjU4/MzI0LTE1Mzk0OTk0/NDktNzI5My5qcGVn.jpeg",
    year: 2018,
    releaseDate: "2018-10-10",
    genres: ["Indie Rock", "K-Rock"],
    label: "Toy's Factory",
    catalogNumber: "TFJK-38507",
    country: "일본",
    pressing: "Japanese 1st Pressing",
    format: '12" EP · Limited Edition',
    vinylColor: "Black",
    availability: "단종",
    releaseWindow: "2018 일본 한정 발매 · 판매 종료",
    description: "EP 24의 일본 한정 첫 바이닐 판본입니다.",
    tracks: hyukoh24Tracks,
    sourceLinks: [discogsSource(12658324)],
  }),
  createVinyl({
    id: "hyukoh-panda-bear-7",
    title: "Panda Bear",
    artist: "HYUKOH",
    searchAliases: ["혁오", "오혁"],
    cover:
      "https://i.discogs.com/8se1kLCMUzgWjj5Hocvxzb8ujdd9gePE-a7oOAcpcZs/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTcyMDIz/NjQtMTQzNjA0NDI2/Mi01ODMxLmpwZWc.jpeg",
    year: 2015,
    releaseDate: "2015-06-28",
    genres: ["Indie Rock", "K-Rock"],
    label: "DURUDURUamc",
    catalogNumber: "none",
    country: "대한민국",
    pressing: "Picture Disc Mispress",
    format: '7" · 45 RPM · Single · Picture Disc',
    vinylColor: "Picture Disc",
    availability: "단종",
    releaseWindow: "2015 발매 · 판매 종료",
    description: "Bamboo와 Panda Bear를 담은 픽처 디스크 7인치 싱글입니다. Discogs에는 미스프레스 판본으로 등록되어 있습니다.",
    tracks: ["Bamboo", "Panda Bear"],
    sourceLinks: [discogsSource(7202364)],
  }),
  createVinyl({
    id: "cjamm-keung-black",
    title: "킁",
    artist: "C Jamm",
    searchAliases: ["씨잼", "CJAMM", "Keung"],
    cover:
      "https://i.discogs.com/4SNV0YnZ0djX6aD8CElMWkoS25GRsVPygB6PwfiyIok/rs:fit/g:sm/q:90/h:600/w:563/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTMxMDg2/Mjc4LTE3Mzk5NTk5/NjQtOTM5NC5qcGVn.jpeg",
    year: 2024,
    releaseDate: "2024-05-01",
    genres: ["Hip Hop"],
    label: "Linchpin Music Corp / DKDK Studio",
    catalogNumber: "SWDK-034",
    country: "대한민국",
    pressing: "Black 180g Edition",
    format: "180g 1LP",
    vinylColor: "Black",
    availability: "중고 거래만",
    retailPrice: 49000,
    marketPrice: 220000,
    lowestPrice: 176000,
    releaseWindow: "2024.05.01 발매 · KREAM 기준 M/M/M 220,000원",
    description: "C Jamm의 정규 앨범 킁을 담은 180g 블랙 바이닐 판본입니다.",
    tracks: keungTracks,
    usedListings: [
      demoListing("keung-black-mint-demo-01", 220000, "M", "M", "M", "미개봉 · 블랙 180g 일반반 · 구성품 전체 포함"),
      demoListing("keung-black-nm-demo-01", 198000, "NM", "NM", "NM", "개봉 · 구성품 전체 포함 · 1회 청음 검수 완료"),
      demoListing("keung-black-vgplus-demo-01", 176000, "NM", "VG+", "NM", "개봉 · 자켓 모서리 미세 눌림 · 재생 상태 양호"),
    ],
    marketReferences: [marketReference("KREAM 기준 M/M/M", 220000, "https://kream.co.kr/products/283464")],
    sourceLinks: [discogsSource(31086278), kreamSource("https://kream.co.kr/products/283464")],
  }),
  createVinyl({
    id: "cjamm-keung-marbled",
    title: "킁",
    artist: "C Jamm",
    searchAliases: ["씨잼", "CJAMM", "Keung", "킁 한정반", "오렌지 레드 마블"],
    cover:
      "https://i.discogs.com/bBvFcZ8ghV9DzvPJiQzDv0OXDgnKKQY88O2sqDepadY/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTMxMDg2/MzIwLTE3NjgwNDA0/MjctODczNy5qcGVn.jpeg",
    year: 2024,
    releaseDate: "2024-05-01",
    genres: ["Hip Hop"],
    label: "Linchpin Music Corp / DKDK Studio",
    catalogNumber: "none",
    country: "대한민국",
    pressing: "Limited Color Edition",
    format: "1LP · Limited Edition",
    vinylColor: "Orange & Red Marbled",
    availability: "중고 거래만",
    retailPrice: 55000,
    marketPrice: 320000,
    lowestPrice: 256000,
    releaseWindow: "2024.05.01 발매 · KREAM 기준 M/M/M 320,000원",
    production: "1,000장 한정",
    description: "C Jamm의 킁을 오렌지·레드 마블 컬러로 제작한 1,000장 한정 판본입니다.",
    tracks: keungTracks,
    usedListings: [
      demoListing("keung-marbled-mint-demo-01", 320000, "M", "M", "M", "미개봉 · 오렌지·레드 마블 한정반 · 구성품 전체 포함"),
      demoListing("keung-marbled-nm-demo-01", 288000, "NM", "NM", "NM", "개봉 · 컬러 무늬 개체 차이 · 구성품 포함"),
      demoListing("keung-marbled-vgplus-demo-01", 256000, "NM", "VG+", "NM", "개봉 · 자켓 모서리 미세 눌림 · 청음 검수 완료"),
    ],
    marketReferences: [marketReference("KREAM 기준 M/M/M", 320000, "https://kream.co.kr/products/283463")],
    sourceLinks: [discogsSource(31086320), kreamSource("https://kream.co.kr/products/283463")],
  }),
  createVinyl({
    id: "fangamer-hollow-knight-ost",
    title: "Hollow Knight Vinyl Soundtrack",
    artist: "Christopher Larkin",
    searchAliases: ["Hollow Knight", "할로우 나이트", "Game OST", "Fangamer"],
    cover: "https://cdn.shopify.com/s/files/1/0014/1962/files/product_HK_original_vinyl_designview_471ea4c7-43e9-48bf-af91-7d74abb795cd.png?v=1684862963",
    year: 2019,
    releaseDate: "2019-05-02",
    genres: ["Game Soundtrack", "Ambient", "Orchestral"],
    label: "Ghost Ramp / Fangamer",
    country: "미국",
    pressing: "Fangamer 2LP Picture Disc",
    format: "2LP · Picture Disc · Download Code",
    vinylColor: "Picture Disc",
    availability: "판매 중",
    retailPrice: 57000,
    releaseWindow: "현재 판매 중 · Fangamer 해외 직구 가능",
    description: "Christopher Larkin의 Hollow Knight OST 26곡을 두 장의 픽처 디스크에 담은 Fangamer 판매 판본입니다.",
    dataNote: "2026-06-04 Fangamer 공개 상품 JSON에서 판매 가능 상태를 확인했습니다. $39 환산가와 공구 결제액은 기능 시연용 목업입니다.",
    listenUrl: "https://christopherlarkin.bandcamp.com/album/hollow-knight-original-soundtrack",
    listenLabel: "Bandcamp에서 듣기",
    tracks: ["Enter Hallownest", "Dirtmouth", "Crossroads", "Greenpath", "Hornet", "City of Tears", "Dream", "White Palace"],
    sellers: [{
      name: "Fangamer",
      price: 57000,
      shipping: "해외 직구 · 재고 변동",
      region: "해외",
      url: "https://www.fangamer.com/products/hollow-knight-vinyl-soundtrack",
    }],
    sourceLinks: [{
      label: "Fangamer 상품 상세",
      url: "https://www.fangamer.com/products/hollow-knight-vinyl-soundtrack",
      kind: "판매처",
    }],
  }),
  createVinyl({
    id: "fangamer-undertale-complete-ost",
    title: "UNDERTALE Complete Vinyl Soundtrack Box Set",
    artist: "Toby Fox",
    searchAliases: ["UNDERTALE", "언더테일", "Game OST", "Fangamer"],
    cover: "https://www.fangamer.com/cdn/shop/products/product_undertale_vinyl_box_set_front_photo.png?crop=center&height=600&v=1691700392&width=900",
    year: 2025,
    releaseDate: "Fangamer 재입고 대기",
    genres: ["Game Soundtrack", "Chiptune"],
    label: "Fangamer",
    country: "미국",
    pressing: "Fangamer Complete Box Set",
    format: "5LP Box Set · 109 Tracks · Digital Download",
    vinylColor: "Five Colored LPs",
    availability: "예약 판매",
    retailPrice: 122000,
    releaseWindow: "현재 품절 · Fangamer 재입고 알림 신청 가능",
    production: "고객당 최대 4개",
    description: "Toby Fox가 큐레이션하고 바이닐용으로 리마스터한 UNDERTALE 전체 OST 109곡의 5LP 박스셋입니다.",
    dataNote: "상품 가격은 Fangamer 공개가 $84를 기준으로 한 환산 목업입니다.",
    listenUrl: "https://tobyfox.bandcamp.com/album/undertale-soundtrack",
    listenLabel: "Bandcamp에서 듣기",
    tracks: ["Once Upon a Time", "Fallen Down", "Heartache", "Bonetrousle", "Spider Dance", "Death by Glamour", "Hopes and Dreams", "MEGALOVANIA"],
    sellers: [{
      name: "Fangamer",
      price: 122000,
      shipping: "해외 직구 · 현재 품절",
      region: "해외",
      url: "https://www.fangamer.com/products/undertale-vinyl-soundtrack-2xlp",
    }],
    sourceLinks: [{
      label: "Fangamer 상품 상세",
      url: "https://www.fangamer.com/products/undertale-vinyl-soundtrack-2xlp",
      kind: "판매처",
    }],
  }),
  createVinyl({
    id: "fangamer-stardew-valley-complete-ost",
    title: "Stardew Valley Complete Vinyl Soundtrack Box Set",
    artist: "ConcernedApe",
    searchAliases: ["Stardew Valley", "스타듀 밸리", "Game OST", "Fangamer"],
    cover: "https://cdn.shopify.com/s/files/1/0014/1962/files/product_sdv_vinyl_boxset_designview.png?v=1762390419",
    year: 2018,
    releaseDate: "2018-11-21",
    genres: ["Game Soundtrack", "Ambient", "Folk"],
    label: "Fangamer",
    country: "미국",
    pressing: "Fangamer Complete Box Set",
    format: "4LP Box Set · 77 Tracks · Digital Download",
    vinylColor: "Four Seasonal Colored LPs",
    availability: "판매 중",
    retailPrice: 115000,
    releaseWindow: "현재 판매 중 · Fangamer 해외 직구 가능",
    production: "고객당 최대 3개",
    description: "Stardew Valley의 사계절을 담은 77곡을 네 장의 컬러 LP와 슬립케이스로 구성한 Fangamer 박스셋입니다.",
    dataNote: "2026-06-04 Fangamer 공개 상품 JSON에서 판매 가능 상태를 확인했습니다. 상품 가격은 공개가 $79를 기준으로 한 환산 목업입니다.",
    listenUrl: "https://concernedape.bandcamp.com/album/stardew-valley-ost",
    listenLabel: "Bandcamp에서 듣기",
    tracks: ["Stardew Valley Overture", "Spring (It's A Big World Outside)", "Pelican Town", "Summer (Nature's Crescendo)", "Fall (The Smell Of Mushroom)", "Winter (Nocturne Of Ice)", "Night Market"],
    sellers: [{
      name: "Fangamer",
      price: 115000,
      shipping: "해외 직구 · 재고 변동",
      region: "해외",
      url: "https://www.fangamer.com/products/stardew-valley-complete-ost-vinyl-box-set",
    }],
    sourceLinks: [{
      label: "Fangamer 상품 상세",
      url: "https://www.fangamer.com/products/stardew-valley-complete-ost-vinyl-box-set",
      kind: "판매처",
    }],
  }),
  createVinyl({
    id: "fangamer-celeste-ost",
    title: "Celeste Vinyl Soundtrack",
    artist: "Lena Raine",
    searchAliases: ["Celeste", "셀레스트", "Game OST", "Fangamer"],
    cover: "https://cdn.shopify.com/s/files/1/0014/1962/products/product_celeste_vinyl_relaunch_designview.png?v=1549417507",
    year: 2019,
    releaseDate: "2019-02-05",
    genres: ["Game Soundtrack", "Electronic", "Ambient"],
    label: "Ship to Shore PhonoCo. / Fangamer",
    country: "미국",
    pressing: "Fangamer Exclusive Colorway",
    format: "2LP · Album",
    vinylColor: "Aurora and Strawberry",
    availability: "판매 중",
    retailPrice: 57000,
    releaseWindow: "현재 판매 중 · Fangamer 해외 직구 가능",
    description: "Lena Raine의 수상작 Celeste OST 19곡을 Aurora와 Strawberry 컬러 두 장에 담은 Fangamer 독점 판본입니다.",
    dataNote: "2026-06-04 Fangamer 공개 상품 JSON에서 판매 가능 상태를 확인했습니다. 상품 가격은 공개가 $39를 기준으로 한 환산 목업입니다.",
    listenUrl: "https://radicaldreamland.bandcamp.com/album/celeste-original-soundtrack",
    listenLabel: "Bandcamp에서 듣기",
    tracks: ["Prologue", "First Steps", "Resurrections", "Scattered and Lost", "Quiet and Falling", "Confronting Myself", "Reach for the Summit", "Exhale"],
    sellers: [{
      name: "Fangamer",
      price: 57000,
      shipping: "해외 직구 · 재고 변동",
      region: "해외",
      url: "https://jp.fangamer.com/products/celeste-vinyl-soundtrack",
    }],
    sourceLinks: [{
      label: "Fangamer 상품 상세",
      url: "https://jp.fangamer.com/products/celeste-vinyl-soundtrack",
      kind: "판매처",
    }],
  }),
  createVinyl({
    id: "yes24-v-layover-color-lp",
    title: "Layover",
    artist: "뷔 (V)",
    searchAliases: ["V", "BTS", "방탄소년단", "YES24 인기 LP", "한국 LP"],
    cover: "https://image.yes24.com/goods/146827471/XL",
    year: 2024,
    releaseDate: "2024-09-20",
    genres: ["K-Pop", "R&B"],
    label: "BIGHIT MUSIC / YGPLUS",
    country: "대한민국",
    pressing: "Sky Blue Color LP",
    format: "1LP · Color Vinyl",
    vinylColor: "Sky Blue",
    availability: "판매 중",
    retailPrice: 52000,
    releaseWindow: "2024.09.20 발매 · 판매처별 재고 변동",
    description: "뷔의 첫 솔로 앨범 Layover를 스카이 블루 컬러 바이닐로 제작한 LP 판본입니다.",
    dataNote: "2026-06-04 공개 판매 페이지 기준으로 YES24와 알라딘은 판매 중, Ktown4u는 품절 상태입니다.",
    tracks: ["Rainy Days", "Blue", "Love Me Again", "Slow Dancing", "For Us", "Slow Dancing (Piano Ver.)"],
    sellers: [
      {
        name: "YES24",
        price: 52000,
        shipping: "판매 중 · 국내배송",
        region: "국내",
        url: "https://www.yes24.com/product/goods/146827471",
      },
      {
        name: "알라딘",
        price: 52000,
        shipping: "판매 중 · 무료배송",
        region: "국내",
        url: "https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=362746750",
      },
      {
        name: "Ktown4u",
        price: 52000,
        shipping: "품절 · 재입고 알림",
        region: "국내",
        url: "https://kr.ktown4u.com/iteminfo?goods_no=143067",
      },
    ],
    sourceLinks: [
      { label: "YES24 상품 상세", url: "https://www.yes24.com/product/goods/146827471", kind: "판매처" },
      { label: "알라딘 상품 상세", url: "https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=362746750", kind: "판매처" },
      { label: "Ktown4u 상품 상세", url: "https://kr.ktown4u.com/iteminfo?goods_no=143067", kind: "판매처" },
    ],
  }),
  createVinyl({
    id: "yes24-doyoung-soar-color-lp",
    title: "Soar",
    artist: "도영 (DOYOUNG)",
    searchAliases: ["DOYOUNG", "도영", "NCT", "YES24 인기 LP", "한국 LP"],
    cover: "https://image.yes24.com/goods/148341869/XL",
    year: 2025,
    releaseDate: "2025-07-28",
    genres: ["K-Pop", "Pop Rock"],
    label: "SM Entertainment / Kakao Entertainment",
    country: "대한민국",
    pressing: "Color LP",
    format: "1LP · Color Vinyl",
    vinylColor: "Color Vinyl",
    availability: "판매 중",
    retailPrice: 53500,
    releaseWindow: "2025.07.28 발매 · 판매처별 재고 변동",
    description: "도영의 정규 2집 Soar를 컬러 바이닐로 제작한 LP 판본입니다.",
    dataNote: "2026-06-04 공개 판매 페이지 기준으로 YES24는 판매 중, Ktown4u는 품절 상태입니다.",
    tracks: ["안녕, 우주 (Memory)"],
    sellers: [
      {
        name: "YES24",
        price: 53500,
        shipping: "판매 중 · 국내배송",
        region: "국내",
        url: "https://www.yes24.com/product/goods/148341869",
      },
      {
        name: "Ktown4u",
        price: 53500,
        shipping: "품절 · 재입고 알림",
        region: "국내",
        url: "https://kr.ktown4u.com/iteminfo?goods_no=143154",
      },
    ],
    sourceLinks: [
      { label: "YES24 상품 상세", url: "https://www.yes24.com/product/goods/148341869", kind: "판매처" },
      { label: "Ktown4u 상품 상세", url: "https://kr.ktown4u.com/iteminfo?goods_no=143154", kind: "판매처" },
    ],
  }),
  createVinyl({
    id: "yes24-ive-revive-plus-lp",
    title: "REVIVE+",
    artist: "IVE (아이브)",
    searchAliases: ["아이브", "IVE", "YES24 인기 LP", "한국 LP"],
    cover: "https://image.yes24.com/goods/176179004/XL",
    year: 2026,
    releaseDate: "2026-09-30 예정",
    genres: ["K-Pop"],
    label: "Starship Entertainment / Kakao Entertainment",
    country: "대한민국",
    pressing: "White Marble Color LP",
    format: "1LP · White Marble Color Vinyl",
    vinylColor: "White Marble",
    availability: "발매 예정",
    retailPrice: 54200,
    releaseWindow: "예약 판매 종료 · 2026.09.30 발매 예정",
    description: "IVE의 두 번째 정규 앨범 REVIVE+를 화이트 마블 컬러 바이닐로 구성한 예약 LP입니다.",
    tracks: ["REVIVE+", "BANG BANG"],
    sellers: [{
      name: "YES24",
      price: 54200,
      shipping: "일시품절 · 발매 예정",
      region: "국내",
      url: "https://www.yes24.com/product/goods/176179004",
    }],
    sourceLinks: [{
      label: "YES24 상품 상세",
      url: "https://www.yes24.com/product/goods/176179004",
      kind: "판매처",
    }],
  }),
  createVinyl({
    id: "yes24-thornapple-seoulbyeong-10th-lp",
    title: "서울병 10th Anniversary",
    artist: "쏜애플 (THORNAPPLE)",
    searchAliases: ["THORNAPPLE", "쏜애플", "서울병", "YES24 인기 LP", "한국 LP"],
    cover: "https://image.yes24.com/goods/185831792/XL",
    year: 2026,
    releaseDate: "2026-10-02 예정",
    genres: ["K-Rock", "Indie Rock"],
    label: "Happy Robot Records / 마더뮤직",
    country: "대한민국",
    pressing: "10th Anniversary LP",
    format: "1LP · Anniversary Edition",
    vinylColor: "Black",
    availability: "발매 예정",
    retailPrice: 69800,
    releaseWindow: "예약 판매 종료 · 2026.10.02 발매 예정",
    description: "쏜애플 정규 2집 서울병의 발매 10주년을 기념해 제작한 LP 판본입니다.",
    tracks: ["피난", "시퍼런 봄", "낯선 열대", "암실", "살"],
    sellers: [{
      name: "YES24",
      price: 69800,
      shipping: "일시품절 · 발매 예정",
      region: "국내",
      url: "https://www.yes24.com/product/goods/185831792",
    }],
    sourceLinks: [{
      label: "YES24 상품 상세",
      url: "https://www.yes24.com/product/goods/185831792",
      kind: "판매처",
    }],
  }),
  createVinyl({
    id: "yes24-hanroro-home-2lp",
    title: "집",
    artist: "한로로",
    searchAliases: ["HANRORO", "HOME", "YES24 인기 LP"],
    cover: "https://image.yes24.com/goods/181825649/XL",
    year: 2026,
    releaseDate: "2026-11-05 예정",
    genres: ["K-Rock", "Indie Rock"],
    label: "POCLANOS / authentic",
    country: "대한민국",
    pressing: "YES24 예약 판매 2LP",
    format: "Heavyweight 2LP · Gatefold",
    vinylColor: "Red Marble + Black",
    availability: "발매 예정",
    retailPrice: 69800,
    lowestPrice: 88000,
    releaseWindow: "예약 판매 2026.03.09 - 2026.03.30 · 2026.11.05 발매 예정",
    description: "한로로의 두 번째 LP 집을 레드 마블과 블랙 바이닐 2LP로 구성한 예약 판매 판본입니다.",
    tracks: ["ㅈㅣㅂ", "도망", "먹이사슬", "나침반", "생존법"],
    sellers: [{
      name: "YES24",
      price: 69800,
      shipping: "예약 판매 종료 · 발매 예정",
      region: "국내",
      url: "https://www.yes24.com/product/goods/181825649",
    }],
    usedListings: [
      marketplaceListing(
        "joongna-hanroro-home-preorder",
        88000,
        "M",
        "M",
        "M",
        "미개봉 예약 상품 · 배송지 변경 방식",
      ),
    ],
    sourceLinks: [{
      label: "YES24 상품 상세",
      url: "https://www.yes24.com/product/goods/181825649",
      kind: "판매처",
    }],
  }),
  createVinyl({
    id: "yes24-akmu-gaehwa-lp",
    title: "개화",
    artist: "AKMU",
    searchAliases: ["악뮤", "악동뮤지션", "YES24 인기 LP"],
    cover: "https://image.yes24.com/goods/190816472/XL",
    year: 2026,
    releaseDate: "2026-10-12 예정",
    genres: ["K-Pop", "Folk Pop"],
    label: "YGPLUS / 영감의샘터",
    country: "대한민국",
    pressing: "YES24 예약 판매 LP",
    format: "1LP · Gatefold · Inner Sleeve · 8p Lyric Book",
    vinylColor: "Black",
    availability: "예약 판매",
    retailPrice: 59500,
    releaseWindow: "예약 판매 2026.06.01 - 2026.06.14 · 2026.10.12 발매 예정",
    description: "YES24 이달의 가요 LP와 베스트셀러에 오른 AKMU 정규 4집 개화의 바이닐 판본입니다.",
    tracks: ["소문의 낙원", "봄 색깔", "벌레를 내고", "기쁨, 슬픔, 아름다운 마음", "햇빛 bless you", "Tent", "어린 부부", "옳은 사람", "우아한 아침 식사", "난민들의 축제", "얼룩"],
    sellers: [{
      name: "YES24",
      price: 59500,
      shipping: "예약 판매 · 해외배송 가능",
      region: "국내",
      url: "https://www.yes24.com/product/goods/190816472",
    }],
    sourceLinks: [{
      label: "YES24 상품 상세",
      url: "https://www.yes24.com/product/goods/190816472",
      kind: "판매처",
    }],
  }),
  createVinyl({
    id: "yes24-so-soo-bin-every-lp",
    title: "EVERY",
    artist: "소수빈",
    searchAliases: ["So Soo Bin", "YES24 인기 LP"],
    cover: "https://image.yes24.com/goods/189625648/XL",
    year: 2026,
    releaseDate: "2026-08-03 예정",
    genres: ["Ballad", "K-Pop"],
    label: "Kakao Entertainment / 뮤직팜",
    country: "대한민국",
    pressing: "YES24 예약 판매 LP",
    format: "1LP · Printed Inner Sleeve",
    vinylColor: "Ivory",
    availability: "발매 예정",
    retailPrice: 52000,
    releaseWindow: "예약 판매 2026.05.18 - 2026.05.31 · 2026.08.03 발매 예정",
    description: "소수빈이 노래해 온 사랑의 서사를 한 장에 모은 첫 바이닐이자 YES24 인기 예약 LP입니다.",
    tracks: ["그대라는 선물", "해야만 할까요", "사랑의 소동", "이러지도 못하고", "사랑하자", "우리라는 건", "언젠가는 다시 마주치게 되는 것들", "every!"],
    sellers: [
      {
        name: "YES24",
        price: 52000,
        shipping: "예약 판매 종료 · 국내배송",
        region: "국내",
        url: "https://www.yes24.com/product/goods/189625648",
      },
      {
        name: "알라딘",
        price: 52000,
        shipping: "판매 상태 변동 · 무료배송",
        region: "국내",
        url: "https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=393512794",
      },
    ],
    sourceLinks: [
      {
        label: "YES24 상품 상세",
        url: "https://www.yes24.com/product/goods/189625648",
        kind: "판매처",
      },
      {
        label: "알라딘 상품 상세",
        url: "https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=393512794",
        kind: "판매처",
      },
    ],
  }),
  createVinyl({
    id: "yes24-yerin-baek-flash-and-core",
    title: "Flash and Core",
    artist: "백예린",
    searchAliases: ["Yerin Baek", "YES24 인기 LP"],
    cover: "https://image.yes24.com/goods/182626463/XL",
    year: 2026,
    releaseDate: "2026-08-03 예정",
    genres: ["R&B", "Indie Pop"],
    label: "Sony Music / peoplelikepeople",
    country: "대한민국",
    pressing: "YES24 예약 판매 White 2LP",
    format: "180g 2LP · Triple Gatefold · Abbey Road Mastering",
    vinylColor: "Heavyweight White",
    availability: "발매 예정",
    retailPrice: 79000,
    releaseWindow: "예약 판매 2026.03.16 - 2026.03.31 · 2026.08.03 발매 예정",
    description: "Miles Showell이 바이닐 마스터링과 라커 커팅을 맡은 백예린 정규 3집의 화이트 2LP 판본입니다.",
    tracks: ["Flash and Core", "Artist", "In a good way", "I am not your ocean anymore"],
    sellers: [{
      name: "YES24",
      price: 79000,
      shipping: "예약 판매 종료 · 발매 예정",
      region: "국내",
      url: "https://m.yes24.com/goods/detail/182626463",
    }],
    sourceLinks: [{
      label: "YES24 상품 상세",
      url: "https://m.yes24.com/goods/detail/182626463",
      kind: "판매처",
    }],
  }),
];

const crawledVinyls = (crawledCatalog as CrawledCatalogItem[]).map((item) =>
  createVinyl({
    ...item,
    ...crawledOverrides[item.sourceId],
    sourceLinks: [
      item.sourceType === "master"
        ? discogsMasterSource(item.sourceId)
        : discogsSource(item.sourceId),
      ...(crawledOverrides[item.sourceId]?.sourceLinks ?? []),
    ],
  }),
);

export const vinyls: Vinyl[] = [...coreVinyls, ...crawledVinyls];

export const albumsWithoutVinyl = [
  { title: "Don't You Worry Baby (I'm Only Swimming)", artist: "검정치마" },
];

export const formatWon = (price: number | null | undefined) =>
  price === null || price === undefined ? "가격 정보 없음" : `${price.toLocaleString("ko-KR")}원`;

export const getPublicListingPrice = (vinyl: Vinyl) => {
  const inventoryPrices = vinyl.usedListings.map((listing) => listing.price);
  return inventoryPrices.length > 0 ? Math.min(...inventoryPrices) : null;
};

const gradeScore: Record<UsedListing["grade"], number> = { M: 4, NM: 3, "VG+": 2, VG: 1 };

export const getOverallGrade = (listing: UsedListing): UsedListing["grade"] => {
  const grades = [listing.grade, listing.jacketGrade, listing.listeningGrade];
  return grades.reduce((lowest, grade) => (
    gradeScore[grade] < gradeScore[lowest] ? grade : lowest
  ), "M" as UsedListing["grade"]);
};

export const getInventoryVinyls = () =>
  vinyls
    .filter((vinyl) => vinyl.usedListings.length > 0)
    .sort((a, b) => a.artist.localeCompare(b.artist, "ko") || a.title.localeCompare(b.title, "ko"));

export const getCheapestListing = (vinyl: Vinyl) =>
  [...vinyl.usedListings].sort((a, b) => a.price - b.price)[0];

export const findInventoryListing = (listingId: string | undefined) => {
  if (!listingId) return null;
  for (const vinyl of vinyls) {
    const listing = vinyl.usedListings.find((candidate) => candidate.id === listingId);
    if (listing) return { vinyl, listing };
  }
  return null;
};

export const getReferencePrice = (vinyl: Vinyl) => {
  const publicListingPrice = getPublicListingPrice(vinyl);
  return {
    price: vinyl.marketPrice ?? vinyl.retailPrice ?? publicListingPrice,
    label: vinyl.marketPrice
      ? "최근 공개 체결가"
      : vinyl.retailPrice
        ? "발매가"
        : publicListingPrice
          ? "검수 재고 최저가"
          : "현재 가격",
  };
};

export const getListenLink = (vinyl: Vinyl) => ({
  label: vinyl.listenLabel ?? "Apple Music에서 듣기",
  url:
    vinyl.listenUrl ??
    `https://music.apple.com/kr/search?term=${encodeURIComponent(`${vinyl.artist} ${getAlbumTitle(vinyl.title)}`)}`,
});

const getAlbumTitle = (title: string) =>
  title
    .replace(/\s*\((?:20\d{2}\s*)?(?:재발매|reissue|keung)\)\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim();

const getAlbumKey = (vinyl: Vinyl) =>
  `${vinyl.artist.toLocaleLowerCase()}::${getAlbumTitle(vinyl.title).toLocaleLowerCase()}`;

export const findVinyl = (id: string | undefined) =>
  vinyls.find((vinyl) => vinyl.id === id);

export const getAlbumVersions = (vinyl: Vinyl) =>
  vinyls
    .filter((candidate) => getAlbumKey(candidate) === getAlbumKey(vinyl))
    .sort((a, b) => a.year - b.year || a.pressing.localeCompare(b.pressing));

export const searchVinyls = (query: string) => {
  const normalizedQuery = query.trim().toLowerCase();
  const matches = !normalizedQuery
    ? vinyls
    : vinyls.filter((vinyl) =>
      [
        vinyl.title,
        vinyl.artist,
        vinyl.label,
        vinyl.catalogNumber,
        vinyl.pressing,
        ...vinyl.searchAliases,
        ...vinyl.tracks,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );

  return matches.filter(
    (vinyl, index) => matches.findIndex((candidate) => getAlbumKey(candidate) === getAlbumKey(vinyl)) === index,
  );
};
