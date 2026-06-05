import { Check, CheckCircle2, PackageCheck, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { formatWon } from "../data/catalog";
import type { UsedListing, Vinyl } from "../types";

type PurchaseMode = "instant" | "condition";
type OpenCondition = "전체" | "미개봉" | "개봉";
type Grade = UsedListing["grade"];
type OrderResult = "instant-complete" | "condition-complete" | "condition-waiting" | null;

interface PurchaseSheetProps {
  mode: PurchaseMode;
  vinyl: Vinyl;
  onClose: () => void;
}

const grades: Grade[] = ["M", "NM", "VG+", "VG"];
const gradeScore: Record<Grade, number> = { M: 4, NM: 3, "VG+": 2, VG: 1 };

const isSealed = (listing: UsedListing) => listing.note.includes("미개봉");

const listingSource = (listing: UsedListing) => listing.seller;

export function PurchaseSheet({ mode, vinyl, onClose }: PurchaseSheetProps) {
  const inventory = useMemo(
    () => [...vinyl.usedListings].sort((a, b) => a.price - b.price),
    [vinyl.usedListings],
  );
  const suggestedMaxPrice = inventory[0]?.price ?? vinyl.marketPrice ?? vinyl.retailPrice ?? 100000;
  const [selectedListingId, setSelectedListingId] = useState(inventory[0]?.id ?? "");
  const [openCondition, setOpenCondition] = useState<OpenCondition>("전체");
  const [vinylGrade, setVinylGrade] = useState<Grade>("VG+");
  const [jacketGrade, setJacketGrade] = useState<Grade>("VG+");
  const [listeningGrade, setListeningGrade] = useState<Grade>("VG+");
  const [maxPrice, setMaxPrice] = useState(suggestedMaxPrice);
  const [result, setResult] = useState<OrderResult>(null);
  const [matchedListing, setMatchedListing] = useState<UsedListing | null>(null);

  const selectedListing = inventory.find((listing) => listing.id === selectedListingId) ?? null;
  const title = mode === "instant" ? "즉시 구매" : "구매 조건 설정";

  const completeInstantPurchase = () => {
    if (selectedListing) {
      setMatchedListing(selectedListing);
      setResult("instant-complete");
    }
  };

  const submitConditionOrder = () => {
    const match = inventory.find((listing) => {
      const matchesOpened = openCondition === "전체"
        || (openCondition === "미개봉" ? isSealed(listing) : !isSealed(listing));

      return matchesOpened
        && listing.price <= maxPrice
        && gradeScore[listing.grade] >= gradeScore[vinylGrade]
        && gradeScore[listing.jacketGrade] >= gradeScore[jacketGrade]
        && gradeScore[listing.listeningGrade] >= gradeScore[listeningGrade];
    }) ?? null;

    setMatchedListing(match);
    setResult(match ? "condition-complete" : "condition-waiting");
  };

  if (result) {
    const completed = result !== "condition-waiting";

    return (
      <div className="purchase-overlay" role="presentation" onClick={onClose}>
        <section
          className="purchase-sheet purchase-result-sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="purchase-result-title"
          onClick={(event) => event.stopPropagation()}
        >
          <button type="button" className="purchase-close" aria-label="구매 창 닫기" onClick={onClose}>
            <X size={19} />
          </button>
          <div className={`purchase-result-icon ${completed ? "complete" : "waiting"}`}>
            {completed ? <CheckCircle2 size={31} /> : <SlidersHorizontal size={31} />}
          </div>
          <p>{completed ? "VINYL FIND 검수 거래" : "조건 매칭 대기"}</p>
          <h2 id="purchase-result-title">
            {result === "instant-complete"
              ? "즉시 구매가 완료되었습니다."
              : result === "condition-complete"
                ? "구매 주문이 체결되었습니다."
                : "구매 대기 주문이 등록되었습니다."}
          </h2>
          <span>
            {completed
              ? "결제와 배송은 데모에서 목업으로 처리됩니다."
              : "조건에 맞는 검수 재고가 입고되면 가장 저렴한 매물부터 연결해드려요."}
          </span>
          {matchedListing ? <ListingSummary listing={matchedListing} selected /> : (
            <div className="order-condition-summary">
              <span>{openCondition} · 바이닐 {vinylGrade} 이상 · 자켓 {jacketGrade} 이상</span>
              <strong>{formatWon(maxPrice)} 이하</strong>
            </div>
          )}
          <button type="button" className="purchase-primary-button" onClick={onClose}>확인</button>
        </section>
      </div>
    );
  }

  return (
    <div className="purchase-overlay" role="presentation" onClick={onClose}>
      <section
        className="purchase-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="purchase-sheet-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="purchase-sheet-header">
          <div>
            <p>{vinyl.artist}</p>
            <h2 id="purchase-sheet-title">{title}</h2>
          </div>
          <button type="button" className="purchase-close" aria-label="구매 창 닫기" onClick={onClose}>
            <X size={19} />
          </button>
        </header>

        {mode === "instant" ? (
          <>
            <div className="purchase-intro">
              <PackageCheck size={18} />
              <div>
                <strong>지금 구매 가능한 검수 재고</strong>
                <span>상태와 가격을 비교하고 한 장을 선택하세요.</span>
              </div>
            </div>
            {inventory.length > 0 ? (
              <div className="purchase-list">
                {inventory.map((listing) => (
                  <button
                    type="button"
                    className={selectedListingId === listing.id ? "selected" : ""}
                    key={listing.id}
                    onClick={() => setSelectedListingId(listing.id)}
                  >
                    <span className="purchase-radio">{selectedListingId === listing.id ? <Check size={13} /> : null}</span>
                    <ListingSummary listing={listing} />
                  </button>
                ))}
              </div>
            ) : <p className="purchase-empty">현재 즉시 구매 가능한 검수 재고가 없어요.</p>}
            <div className="purchase-sheet-footer">
              <div><span>선택 상품</span><strong>{formatWon(selectedListing?.price ?? null)}</strong></div>
              <button
                type="button"
                className="purchase-primary-button"
                disabled={!selectedListing}
                onClick={completeInstantPurchase}
              >
                즉시 구매하기
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="purchase-intro">
              <SlidersHorizontal size={18} />
              <div>
                <strong>원하는 상태와 가격을 알려주세요</strong>
                <span>현재 재고를 먼저 확인하고, 없으면 대기 주문으로 등록해요.</span>
              </div>
            </div>
            <div className="condition-form">
              <fieldset>
                <legend>개봉 여부</legend>
                <div className="segmented-control">
                  {(["전체", "미개봉", "개봉"] as OpenCondition[]).map((condition) => (
                    <button
                      type="button"
                      className={openCondition === condition ? "active" : ""}
                      key={condition}
                      onClick={() => setOpenCondition(condition)}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              </fieldset>
              <GradeSelector label="바이닐 최소 등급" value={vinylGrade} onChange={setVinylGrade} />
              <GradeSelector label="자켓 최소 등급" value={jacketGrade} onChange={setJacketGrade} />
              <GradeSelector label="청음 최소 등급" value={listeningGrade} onChange={setListeningGrade} />
              <label className="price-condition">
                <span>최대 구매 가격</span>
                <div>
                  <input
                    type="number"
                    min={10000}
                    step={5000}
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(Number(event.target.value))}
                  />
                  <em>원 이하</em>
                </div>
              </label>
              <p className="grading-note">Goldmine 기준 · M &gt; NM &gt; VG+ &gt; VG</p>
            </div>
            <button type="button" className="purchase-primary-button condition-submit" onClick={submitConditionOrder}>
              조건으로 재고 확인하기
            </button>
          </>
        )}
      </section>
    </div>
  );
}

function GradeSelector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Grade;
  onChange: (grade: Grade) => void;
}) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <div className="grade-control">
        {grades.map((grade) => (
          <button
            type="button"
            className={value === grade ? "active" : ""}
            key={grade}
            onClick={() => onChange(grade)}
          >
            {grade}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function ListingSummary({ listing, selected = false }: { listing: UsedListing; selected?: boolean }) {
  return (
    <span className={`purchase-listing-summary${selected ? " selected-summary" : ""}`}>
      <span>
        <strong>{listingSource(listing)}</strong>
        <em>{isSealed(listing) ? "미개봉" : "개봉"} · 바이닐 {listing.grade} · 자켓 {listing.jacketGrade} · 청음 {listing.listeningGrade}</em>
      </span>
      <b>{formatWon(listing.price)}</b>
    </span>
  );
}
