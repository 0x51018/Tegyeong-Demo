import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronRight,
  Disc3,
  Search,
  Shuffle,
} from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { VinylCard } from "../components/VinylCard";
import { formatWon, getAlbumVersions, getPublicListingPrice, vinyls } from "../data/catalog";

const modes = [
  { id: "search", label: "매물 검색", icon: Search },
  { id: "digging", label: "디깅", icon: Shuffle },
  { id: "sell", label: "내 LP 판매", icon: Camera },
] as const;

type MarketMode = (typeof modes)[number]["id"];

const gradingItems = ["자켓 손상", "바이닐 휨·오염", "육안 스크래치", "청음 상태"];
const diggingFilters = ["전체", "ㄱ-ㄹ", "ㅁ-ㅎ", "A-M", "N-Z"] as const;
const koreanInitials = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

const getArtistInitial = (artist: string) => {
  const first = artist.trim()[0]?.toUpperCase() ?? "#";
  const code = first.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) return koreanInitials[Math.floor((code - 0xac00) / 588)];
  return /[A-Z]/.test(first) ? first : "#";
};

const matchesDiggingFilter = (artist: string, filter: (typeof diggingFilters)[number]) => {
  const initial = getArtistInitial(artist);
  if (filter === "전체") return true;
  if (filter === "ㄱ-ㄹ") return ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ"].includes(initial);
  if (filter === "ㅁ-ㅎ") return koreanInitials.slice(6).includes(initial);
  if (filter === "A-M") return /^[A-M]$/.test(initial);
  return /^[N-Z]$/.test(initial);
};

export function MarketScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = modes.some((mode) => mode.id === searchParams.get("mode"))
    ? (searchParams.get("mode") as MarketMode)
    : "search";
  const [activeMode, setActiveMode] = useState<MarketMode>(initialMode);
  const [query, setQuery] = useState("");
  const [diggingFilter, setDiggingFilter] = useState<(typeof diggingFilters)[number]>("전체");
  const [selectedDiggingId, setSelectedDiggingId] = useState<string>();
  const [photoAdded, setPhotoAdded] = useState(false);

  const inventoryVinyls = useMemo(
    () => vinyls
      .filter((vinyl) => vinyl.usedListings.some((listing) => listing.sourceUrl))
      .sort((a, b) => a.artist.localeCompare(b.artist, "ko") || a.title.localeCompare(b.title, "ko")),
    [],
  );
  const marketSearchVinyls = useMemo(
    () => inventoryVinyls.filter((vinyl, index) =>
      inventoryVinyls.findIndex((candidate) =>
        getAlbumVersions(vinyl).some((version) => version.id === candidate.id),
      ) === index,
    ),
    [inventoryVinyls],
  );
  const normalizedQuery = query.trim().toLowerCase();
  const results = normalizedQuery
    ? marketSearchVinyls.filter((vinyl) =>
      [
        vinyl.title,
        vinyl.artist,
        ...vinyl.searchAliases,
        ...vinyl.tracks,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    )
    : marketSearchVinyls;
  const visibleDiggingVinyls = inventoryVinyls.filter((vinyl) => matchesDiggingFilter(vinyl.artist, diggingFilter));
  const diggingVinyl =
    visibleDiggingVinyls.find((vinyl) => vinyl.id === selectedDiggingId) ??
    visibleDiggingVinyls[0] ??
    inventoryVinyls[0]!;
  const diggingListing = diggingVinyl.usedListings.find((listing) => listing.sourceUrl) ?? diggingVinyl.usedListings[0];

  const changeMode = (mode: MarketMode) => {
    setActiveMode(mode);
    setSearchParams(mode === "search" ? {} : { mode });
  };

  return (
    <section className="screen-section market-screen">
      <header className="screen-header">
        <p>SECONDHAND MARKET</p>
        <h1>중고 거래</h1>
        <span>국내 중고 플랫폼의 국내·해외 LP 공개 매물을 찾고, 레코드 빈에서 꺼내보고, 내 LP를 판매해보세요.</span>
      </header>

      <nav className="market-mode-tabs" aria-label="중고 거래 기능">
        {modes.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" className={activeMode === id ? "active" : ""} onClick={() => changeMode(id)}>
            <Icon size={16} strokeWidth={1.8} />
            {label}
          </button>
        ))}
      </nav>

      {activeMode === "search" ? (
        <div className="market-panel">
          <label className="market-search">
            <Search size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="앨범 또는 아티스트 검색" />
          </label>
          <div className="market-summary">
            <span>{query ? `"${query}" 매물 검색 결과` : "국내·해외 LP 공개 매물 목업"}</span>
            <strong>{results.length}</strong>
          </div>
          <div className="market-results">
            {results.map((vinyl) => (
              <div className="market-result" key={vinyl.id}>
                <VinylCard vinyl={vinyl} compact />
                <div className="market-result-meta">
                  <span>공개 매물 기반 목업 {vinyl.usedListings.filter((listing) => listing.sourceUrl).length}개</span>
                  <strong>
                    {vinyl.marketPrice
                      ? `최근 공개 체결가 ${formatWon(vinyl.marketPrice)}`
                      : `공개 매물 최저가 ${formatWon(getPublicListingPrice(vinyl))}`}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {activeMode === "digging" ? (
        <div className="market-panel digging-panel">
          <div className="digging-counter"><span>공개 매물 기반 레코드 빈에서 한 장씩 꺼내보세요</span><strong>{visibleDiggingVinyls.length}장</strong></div>
          <div className="crate-filters" aria-label="아티스트 이름순 필터">
            {diggingFilters.map((filter) => (
              <button
                type="button"
                className={diggingFilter === filter ? "active" : ""}
                onClick={() => {
                  setDiggingFilter(filter);
                  setSelectedDiggingId(undefined);
                }}
                key={filter}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="record-bin-shell">
            <div className="record-bin">
              {visibleDiggingVinyls.map((vinyl, index) => {
                const initial = getArtistInitial(vinyl.artist);
                const previousInitial = index > 0 ? getArtistInitial(visibleDiggingVinyls[index - 1].artist) : undefined;
                const active = diggingVinyl.id === vinyl.id;
                return (
                  <Fragment key={vinyl.id}>
                    {initial !== previousInitial ? <div className="record-divider"><span>{initial}</span></div> : null}
                    <button
                      type="button"
                      className={`record-sleeve${active ? " active" : ""}`}
                      onClick={() => setSelectedDiggingId(vinyl.id)}
                      aria-label={`${vinyl.artist} ${vinyl.title} 꺼내보기`}
                    >
                      <img src={vinyl.cover} alt="" />
                      <span>{vinyl.artist}</span>
                    </button>
                  </Fragment>
                );
              })}
            </div>
            <div className="crate-front"><span>VINYL FIND · INSPECTED SECONDHAND</span></div>
          </div>
          <div className="digging-record-card">
            <div className="digging-record-art">
              <div className="record-disc" />
              <img src={diggingVinyl.cover} alt={`${diggingVinyl.title} 커버`} />
            </div>
            <p>{diggingVinyl.artist}</p>
            <h2>{diggingVinyl.title}</h2>
            <span>{diggingVinyl.pressing}</span>
            <div className="digging-grade">
              <div><span>바이닐</span><strong>{diggingListing.grade}</strong></div>
              <div><span>자켓</span><strong>{diggingListing.jacketGrade}</strong></div>
              <div><span>청음</span><strong>{diggingListing.listeningGrade}</strong></div>
            </div>
            <p className="digging-note">{diggingListing.note}</p>
            <strong className="digging-price">{formatWon(diggingListing.price)}</strong>
          </div>
          <div className="digging-actions">
            {diggingListing.sourceUrl ? (
              <a className="outline-button" href={diggingListing.sourceUrl} target="_blank" rel="noreferrer">
                {diggingListing.sourceLabel} 원문
              </a>
            ) : <span className="digging-demo-label">VINYL FIND 데모 검수 재고</span>}
            <Link className="primary-button" to={`/vinyl/${diggingVinyl.id}`}>
              상세 보기 <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      ) : null}

      {activeMode === "sell" ? (
        <div className="market-panel sell-panel">
          <button className={`photo-drop${photoAdded ? " added" : ""}`} type="button" onClick={() => setPhotoAdded(true)}>
            {photoAdded ? <CheckCircle2 size={28} strokeWidth={1.6} /> : <Camera size={28} strokeWidth={1.6} />}
            <strong>{photoAdded ? "사진이 등록되었어요" : "앨범과 바이닐 사진 올리기"}</strong>
            <span>{photoAdded ? "데모 분석 결과: 예상 등급 NM / 자켓 VG+" : "AI가 임시 등급과 예상 매입가를 계산합니다."}</span>
          </button>
          {photoAdded ? (
            <div className="sell-estimate">
              <span>예상 매입가</span>
              <strong>68,000원 - 74,000원</strong>
              <p>실제 매입가는 입고 후 프레싱 식별과 청음 검수를 거쳐 확정됩니다.</p>
            </div>
          ) : null}
          <div className="feature-list">
            <h2>Goldmine 기준 검수 항목</h2>
            {gradingItems.map((item) => (
              <div key={item}><CheckCircle2 size={18} /><span>{item}</span><ChevronRight size={18} /></div>
            ))}
          </div>
          <div className="grading-note">
            <Disc3 size={22} />
            <p><strong>판매는 VINYL FIND에만</strong><br />입고 후 동일한 기준으로 검수하고 매입가를 확정합니다.</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
