import { ArrowLeft, ChevronRight, ExternalLink, Heart, Music2, PenLine, Share2, Star, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PurchaseSheet } from "../components/PurchaseSheet";
import { findVinyl, formatWon, getAlbumVersions, getListenLink, getOverallGrade, getReferencePrice } from "../data/catalog";
import { getVinylReviews } from "../data/reviews";

const tabs = ["발매 정보", "구매처", "중고 거래", "후기·평가", "위키"] as const;
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
  const reviews = getVinylReviews(vinyl);
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
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
              <h2>VINYL FIND 검수 재고</h2>
              <span>{vinyl.usedListings.length > 0 ? `${vinyl.usedListings.length}장 보유` : "재고 없음"}</span>
            </div>
            <div className="option-list">
              {vinyl.usedListings.length > 0 ? vinyl.usedListings.map((listing) => (
                <Link to={`/inventory/${listing.id}`} key={listing.id} className="option-row">
                  <div>
                    <strong>통합 {getOverallGrade(listing)} · 바이닐 {listing.grade} · 자켓 {listing.jacketGrade}</strong>
                    <span>{listing.note} · 청음 {listing.listeningGrade}</span>
                  </div>
                  <b>{formatWon(listing.price)}</b>
                  <ChevronRight size={18} />
                </Link>
              )) : <p className="panel-empty">검수 완료된 내부 재고가 아직 없어요.</p>}
            </div>
            <p className="market-disclaimer">중고 거래는 외부 판매처 연결 없이 VINYL FIND 내부 검수 재고로만 진행됩니다. 각 재고는 통합 등급과 부위별 등급을 따로 확인할 수 있습니다.</p>
          </div>
        ) : null}

        {activeTab === "후기·평가" ? (
          <div className="review-panel">
            <div className="review-summary">
              <div>
                <span>커뮤니티 평점</span>
                <strong>{averageRating.toFixed(1)}</strong>
                <div className="review-stars" aria-label={`5점 만점에 ${averageRating.toFixed(1)}점`}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={index} size={15} fill={index < Math.round(averageRating) ? "currentColor" : "none"} />
                  ))}
                </div>
                <small>{reviews.length}개의 데모 후기</small>
              </div>
              <div className="rating-bars">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter((review) => review.rating === rating).length;
                  return (
                    <div key={rating}>
                      <span>{rating}</span>
                      <i><b style={{ width: `${(count / reviews.length) * 100}%` }} /></i>
                      <em>{count}</em>
                    </div>
                  );
                })}
              </div>
            </div>
            <button type="button" className="write-review-button">
              <PenLine size={16} />
              이 판본의 후기 남기기
            </button>
            <div className="review-list">
              {reviews.map((review) => (
                <article key={review.id}>
                  <header>
                    <div>
                      <strong>{review.author}</strong>
                      <span>{review.postedAt}</span>
                    </div>
                    <div className="review-stars">
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star key={index} size={12} fill={index < review.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </header>
                  <h2>{review.title}</h2>
                  <p>{review.body}</p>
                  <dl>
                    <div><dt>보유 판본</dt><dd>{review.pressing}</dd></div>
                    <div><dt>청음 환경</dt><dd>{review.setup}</dd></div>
                  </dl>
                  <button type="button"><ThumbsUp size={13} /> 도움돼요 {review.helpful}</button>
                </article>
              ))}
            </div>
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
