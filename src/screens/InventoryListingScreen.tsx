import { ArrowLeft, CheckCircle2, ChevronRight, Disc3, PackageCheck, ShieldCheck, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { findInventoryListing, formatWon, getOverallGrade } from "../data/catalog";

const inspectionLabels = {
  grade: "바이닐 상태",
  jacketGrade: "자켓 상태",
  listeningGrade: "청음 상태",
} as const;

const gradeDescriptions = {
  M: "미사용 또는 미개봉 수준",
  NM: "사용감이 거의 없는 우수 상태",
  "VG+": "가벼운 사용감은 있으나 재생과 보관에 문제 없음",
  VG: "사용감이 확인되지만 구매 가능한 검수 통과 상태",
};

const isSealed = (note: string) => note.includes("미개봉");

const getInspectionDate = (listingId: string) => {
  const seed = [...listingId].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const day = 1 + (seed % 4);
  return `2026-06-0${day}`;
};

const getStockCode = (listingId: string) => {
  const code = [...listingId].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 10000;
  return `VF-INSPECTED-${code.toString().padStart(4, "0")}`;
};

export function InventoryListingScreen() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const record = findInventoryListing(listingId);
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  const goBack = () => {
    const historyIndex = window.history.state?.idx;
    if (typeof historyIndex === "number" && historyIndex > 0) navigate(-1);
    else navigate("/market");
  };

  if (!record) {
    return (
      <div className="empty-state">
        <h1>검수 재고를 찾을 수 없어요.</h1>
        <Link className="primary-button" to="/market">중고 거래로</Link>
      </div>
    );
  }

  const { vinyl, listing } = record;
  const overallGrade = getOverallGrade(listing);
  const sealed = isSealed(listing.note);
  const inspectionDate = getInspectionDate(listing.id);
  const stockCode = getStockCode(listing.id);

  return (
    <>
      <header className="detail-header">
        <button type="button" className="header-action" aria-label="이전 화면으로 돌아가기" onClick={goBack}>
          <ArrowLeft size={21} />
        </button>
        <span>INSPECTED STOCK</span>
        <Link className="header-action" to={`/vinyl/${vinyl.id}`} aria-label="앨범 상세 보기">
          <Disc3 size={19} />
        </Link>
      </header>

      <section className="inventory-hero">
        <div className="inventory-art">
          <img src={vinyl.cover} alt={`${vinyl.artist} ${vinyl.title} 커버`} />
          <div>
            <span>통합 등급</span>
            <strong>{overallGrade}</strong>
          </div>
        </div>
        <p>{vinyl.artist}</p>
        <h1>{vinyl.title}</h1>
        <span>{vinyl.pressing}</span>
        <strong className="inventory-price">{formatWon(listing.price)}</strong>
      </section>

      <section className="inventory-panel">
        <div className="inventory-status-card">
          <ShieldCheck size={22} />
          <div>
            <strong>VINYL FIND 검수 완료 재고</strong>
            <span>{inspectionDate} 입고 검수 · Goldmine 기준</span>
          </div>
        </div>

        <div className="inspection-grid">
          {(Object.keys(inspectionLabels) as Array<keyof typeof inspectionLabels>).map((key) => {
            const grade = listing[key];
            return (
              <article key={key}>
                <span>{inspectionLabels[key]}</span>
                <strong>{grade}</strong>
                <p>{gradeDescriptions[grade]}</p>
              </article>
            );
          })}
        </div>

        <div className="inventory-note">
          <h2>검수 메모</h2>
          <p>{listing.note}</p>
        </div>

        <dl className="inventory-spec-list">
          <div><dt>개봉 여부</dt><dd>{sealed ? "미개봉" : "개봉"}</dd></div>
          <div><dt>구성품</dt><dd>{listing.note.includes("구성품") || listing.note.includes("포스터") || listing.note.includes("가사지") ? "기재 구성품 포함" : "기본 구성 확인"}</dd></div>
          <div><dt>배송</dt><dd>{listing.shipping ?? "안전 포장 배송"}</dd></div>
          <div><dt>재고 ID</dt><dd>{stockCode}</dd></div>
        </dl>

        <div className="inventory-decision">
          <h2>구매 전 확인</h2>
          <div><CheckCircle2 size={16} /><span>부위별 등급과 통합 등급을 확인했습니다.</span></div>
          <div><CheckCircle2 size={16} /><span>검수 기준은 동일한 Goldmine 체계로 적용됩니다.</span></div>
          <div><CheckCircle2 size={16} /><span>데모에서는 결제와 배송이 목업으로 처리됩니다.</span></div>
        </div>
      </section>

      <div className="sticky-purchase">
        <div><span>검수 재고 판매가</span><strong>{formatWon(listing.price)}</strong></div>
        <div className="purchase-actions">
          <button type="button" className="condition-button" onClick={goBack}>
            보류
          </button>
          <button type="button" onClick={() => setPurchaseComplete(true)}>
            구매하기
          </button>
        </div>
      </div>

      {purchaseComplete ? (
        <div className="purchase-overlay" role="presentation" onClick={() => setPurchaseComplete(false)}>
          <section
            className="purchase-sheet purchase-result-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="inventory-purchase-result"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="purchase-close" aria-label="구매 창 닫기" onClick={() => setPurchaseComplete(false)}>
              <X size={19} />
            </button>
            <div className="purchase-result-icon complete"><PackageCheck size={31} /></div>
            <p>VINYL FIND 검수 거래</p>
            <h2 id="inventory-purchase-result">검수 재고 구매가 완료되었습니다.</h2>
            <span>선택한 재고의 통합 등급과 부위별 등급이 주문 내역에 함께 기록됩니다.</span>
            <button type="button" className="purchase-primary-button" onClick={() => setPurchaseComplete(false)}>
              확인 <ChevronRight size={15} />
            </button>
          </section>
        </div>
      ) : null}
    </>
  );
}
