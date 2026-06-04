import { ArrowLeft, ChevronRight, ExternalLink, Heart, Music2, Share2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PurchaseSheet } from "../components/PurchaseSheet";
import { findVinyl, formatWon, getAlbumVersions, getListenLink, getReferencePrice } from "../data/catalog";

const tabs = ["발매 정보", "구매처", "중고 거래", "위키"] as const;
type DetailTab = (typeof tabs)[number];

export function VinylDetailScreen() {
  const { vinylId } = useParams();
  const navigate = useNavigate();
  const vinyl = findVinyl(vinylId);
  const [activeTab, setActiveTab] = useState<DetailTab>("발매 정보");
  const [liked, setLiked] = useState(false);
  const [purchaseMode, setPurchaseMode] = useState<"instant" | "condition" | null>(null);

  if (!vinyl) {
    return (
      <div className="empty-state">
        <h1>LP 정보를 찾을 수 없어요.</h1>
        <Link className="primary-button" to="/">홈으로</Link>
      </div>
    );
  }

  const referencePrice = getReferencePrice(vinyl);
  const listenLink = getListenLink(vinyl);
  const albumVersions = getAlbumVersions(vinyl);
  const sellersByPrice = [...vinyl.sellers].sort(
    (a, b) => (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY),
  );
  const goBack = () => {
    const historyIndex = window.history.state?.idx;
    if (typeof historyIndex === "number" && historyIndex > 0) navigate(-1);
    else navigate("/");
  };

  return (
    <>
      <header className="detail-header">
        <button type="button" className="header-action" aria-label="이전 화면으로 돌아가기" onClick={goBack}>
          <ArrowLeft size={21} />
        </button>
        <span>VINYL DETAIL</span>
        <div className="detail-actions">
          <button className="header-action" type="button" onClick={() => setLiked((current) => !current)} aria-label="찜하기">
            <Heart size={20} fill={liked ? "currentColor" : "none"} />
          </button>
          <button className="header-action" type="button" aria-label="공유">
            <Share2 size={19} />
          </button>
        </div>
      </header>

      <section className="detail-hero">
        <div className="detail-art">
          <div className="record-disc detail-disc" />
          <img src={vinyl.cover} alt={`${vinyl.artist} ${vinyl.title} 앨범 커버`} />
        </div>
        <p>{vinyl.artist}</p>
        <h1>{vinyl.title}</h1>
        <span>{vinyl.releaseDate} · {vinyl.label}</span>
        <div className="genre-line">{vinyl.genres.map((genre) => <em key={genre}>{genre}</em>)}</div>
        <a className="listen-button" href={listenLink.url} target="_blank" rel="noreferrer">
          <Music2 size={16} />
          {listenLink.label}
          <ExternalLink size={14} />
        </a>
      </section>

      {albumVersions.length > 1 ? (
        <section className="version-selector">
          <div>
            <h2>이 앨범의 LP 판본</h2>
            <span>{albumVersions.length}개 판본을 한곳에서 비교해요.</span>
          </div>
          <div className="version-rail">
            {albumVersions.map((version) => (
              <Link
                to={`/vinyl/${version.id}`}
                className={version.id === vinyl.id ? "active" : ""}
                key={version.id}
                replace
              >
                <img src={version.cover} alt="" />
                <span>{version.year} · {version.country}</span>
                <strong>{version.pressing}</strong>
                <em>{version.vinylColor}</em>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <nav className="detail-tabs" aria-label="LP 상세 정보 탭">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <section className="detail-panel">
        {activeTab === "발매 정보" ? (
          <>
            <div className="detail-status-line">
              <span>{vinyl.availability}</span>
              <strong>{vinyl.production}</strong>
            </div>
            <p className="detail-description">{vinyl.description}</p>
            <dl className="spec-list">
              <div><dt>발매일</dt><dd>{vinyl.releaseDate}</dd></div>
              <div><dt>판본</dt><dd>{vinyl.pressing}</dd></div>
              <div><dt>포맷</dt><dd>{vinyl.format}</dd></div>
              <div><dt>카탈로그 번호</dt><dd>{vinyl.catalogNumber}</dd></div>
              <div><dt>바이닐 컬러</dt><dd>{vinyl.vinylColor}</dd></div>
              <div><dt>발매 국가</dt><dd>{vinyl.country}</dd></div>
              <div><dt>판매 기간</dt><dd>{vinyl.releaseWindow}</dd></div>
              <div><dt>초기 판매가</dt><dd>{formatWon(vinyl.retailPrice)}</dd></div>
              <div><dt>최근 공개 체결가</dt><dd>{formatWon(vinyl.marketPrice)}</dd></div>
            </dl>
            {vinyl.dataNote ? <p className="data-note">{vinyl.dataNote}</p> : null}
            <div className="source-panel">
              <div><h2>확인한 출처</h2><span>{vinyl.crawledAt} 수집</span></div>
              {vinyl.sourceLinks.map((source) => (
                <a href={source.url} target="_blank" rel="noreferrer" key={`${source.label}-${source.url}`}>
                  <span><em>{source.kind}</em>{source.label}</span>
                  <ExternalLink size={15} />
                </a>
              ))}
            </div>
          </>
        ) : null}

        {activeTab === "구매처" ? (
          <div>
            <div className="panel-heading">
              <h2>구매처 가격 비교</h2>
              <span>{sellersByPrice.length > 0 ? `${sellersByPrice.length}곳 확인` : "판매처 확인 중"}</span>
            </div>
            <div className="option-list">
            {sellersByPrice.length > 0 ? sellersByPrice.map((seller) => (
              <a href={seller.url} target="_blank" rel="noreferrer" key={`${seller.name}-${seller.url}`} className="option-row">
                <div><strong>{seller.name}</strong><span>{seller.shipping} · {seller.region}</span></div>
                <b>{formatWon(seller.price)}</b>
                <ExternalLink size={17} />
              </a>
            )) : <p className="panel-empty">현재 확인된 새 상품 판매처가 없어요.</p>}
            </div>
            <p className="market-disclaimer">판매 상태와 가격은 외부 사이트에서 실시간으로 변동될 수 있습니다.</p>
          </div>
        ) : null}

        {activeTab === "중고 거래" ? (
          <div className="used-panel">
            <div className="panel-heading">
              <h2>공개 중고 매물·검수 재고</h2>
              <span>공개 설명 기반 상태 목업</span>
            </div>
            <div className="option-list">
              {vinyl.usedListings.length > 0 ? vinyl.usedListings.map((listing) => (
                listing.sourceUrl ? (
                  <a href={listing.sourceUrl} target="_blank" rel="noreferrer" key={listing.id} className="option-row">
                    <div>
                      <strong>{listing.sourceLabel} · 바이닐 {listing.grade} · 자켓 {listing.jacketGrade}</strong>
                      <span>{listing.note} · 청음 {listing.listeningGrade}{listing.shipping ? ` · ${listing.shipping}` : ""}</span>
                    </div>
                    <b>{formatWon(listing.price)}</b>
                    <ExternalLink size={17} />
                  </a>
                ) : (
                  <button type="button" key={listing.id} className="option-row">
                    <div><strong>바이닐 {listing.grade} · 자켓 {listing.jacketGrade}</strong><span>{listing.note} · 청음 {listing.listeningGrade}</span></div>
                    <b>{formatWon(listing.price)}</b>
                    <ChevronRight size={18} />
                  </button>
                )
              )) : <p className="panel-empty">검수 완료된 데모 재고가 아직 없어요.</p>}
            </div>
            <div className="panel-heading market-reference-heading">
              <h2>외부 최근 체결가 참고</h2>
              <span>{vinyl.crawledAt} 수집</span>
            </div>
            <div className="option-list">
              {vinyl.marketReferences.length > 0 ? vinyl.marketReferences.map((reference) => (
                <a href={reference.url} target="_blank" rel="noreferrer" className="option-row" key={`${reference.source}-${reference.label}`}>
                  <div><strong>{reference.source} · {reference.label}</strong><span>{reference.capturedAt} 공개 정보 기준</span></div>
                  <b>{formatWon(reference.price)}</b>
                  <ExternalLink size={17} />
                </a>
              )) : <p className="panel-empty">확인된 국내 공개 시세가 아직 없어요.</p>}
            </div>
            <p className="market-disclaimer">외부 체결가는 주로 미사용 상품 기준이며, 검수 재고 가격은 개봉 여부와 상태 등급을 반영한 데모 값입니다.</p>
          </div>
        ) : null}

        {activeTab === "위키" ? (
          <div className="wiki-panel">
            <p>{vinyl.description}</p>
            <h2>수록곡</h2>
            <ol>{vinyl.tracks.map((track) => <li key={track}>{track}</li>)}</ol>
            <button type="button" className="outline-button">정보 수정 제안</button>
          </div>
        ) : null}
      </section>

      <div className="sticky-purchase">
        <div><span>{referencePrice.label}</span><strong>{formatWon(referencePrice.price)}</strong></div>
        <div className="purchase-actions">
          <button type="button" className="condition-button" onClick={() => setPurchaseMode("condition")}>
            구매 조건 설정
          </button>
          <button type="button" onClick={() => setPurchaseMode("instant")}>
            즉시 구매
          </button>
        </div>
      </div>
      {purchaseMode ? <PurchaseSheet mode={purchaseMode} vinyl={vinyl} onClose={() => setPurchaseMode(null)} /> : null}
    </>
  );
}
