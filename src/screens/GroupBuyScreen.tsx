import {
  ArrowRight,
  Box,
  Check,
  Clock3,
  PackageCheck,
  Plane,
  Plus,
  Truck,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { findVinyl, formatWon } from "../data/catalog";

const campaigns = [
  {
    id: "group-fangamer-hollow-knight",
    vinylId: "fangamer-hollow-knight-ost",
    store: "Fangamer",
    country: "미국",
    members: 11,
    target: 12,
    deadline: "6월 9일 마감",
    arrival: "주문 확정 후 3주 내 국내 발송",
    itemPrice: 57000,
    soloShipping: 48000,
    groupTotal: 74000,
  },
  {
    id: "group-fangamer-undertale",
    vinylId: "fangamer-undertale-complete-ost",
    store: "Fangamer",
    country: "미국",
    members: 6,
    target: 8,
    deadline: "6월 12일 마감",
    arrival: "재입고 후 4주 내 국내 발송",
    itemPrice: 122000,
    soloShipping: 67000,
    groupTotal: 145000,
  },
  {
    id: "group-fangamer-stardew",
    vinylId: "fangamer-stardew-valley-complete-ost",
    store: "Fangamer",
    country: "미국",
    members: 8,
    target: 10,
    deadline: "6월 15일 마감",
    arrival: "주문 확정 후 4주 내 국내 발송",
    itemPrice: 115000,
    soloShipping: 62000,
    groupTotal: 137000,
  },
  {
    id: "group-fangamer-celeste",
    vinylId: "fangamer-celeste-ost",
    store: "Fangamer",
    country: "미국",
    members: 3,
    target: 8,
    deadline: "6월 18일 마감",
    arrival: "주문 확정 후 3주 내 국내 발송",
    itemPrice: 57000,
    soloShipping: 48000,
    groupTotal: 76000,
  },
];

export function GroupBuyScreen() {
  const [joined, setJoined] = useState<string[]>([]);

  return (
    <section className="screen-section group-buy-screen">
      <header className="screen-header">
        <p>TOGETHER ORDER</p>
        <h1>해외 LP, 같이 사요</h1>
        <span>같은 해외 판매처 주문을 모아 국제 배송비를 나누고, VINYL FIND가 국내에서 다시 보내드려요.</span>
      </header>

      <div className="group-buy-hero">
        <div>
          <UsersRound size={22} />
          <strong>모일수록 낮아지는 배송비</strong>
          <span>상품가는 그대로, 비싼 국제 배송비는 함께 나눠요.</span>
        </div>
        <div className="group-saving"><span>예상 절감</span><strong>최대 23,000원</strong></div>
      </div>

      <div className="fulfillment-flow" aria-label="공동구매 배송 과정">
        <div><Plane size={17} /><strong>해외 구매</strong><span>주문 취합</span></div>
        <ArrowRight size={15} />
        <div><PackageCheck size={17} /><strong>회사 입고</strong><span>수량 확인</span></div>
        <ArrowRight size={15} />
        <div><Truck size={17} /><strong>국내 발송</strong><span>개별 배송</span></div>
      </div>

      <div className="group-buy-heading">
        <div><h2>Fangamer 게임 OST 공구</h2><span>실제 상품 · 환율·배송비는 기능 시연용 데이터</span></div>
        <button type="button"><Plus size={15} /> 공구 요청</button>
      </div>

      <div className="group-buy-list">
        {campaigns.map((campaign) => {
          const vinyl = findVinyl(campaign.vinylId);
          if (!vinyl) return null;

          const isJoined = joined.includes(campaign.id);
          const participants = campaign.members + (isJoined ? 1 : 0);
          const progress = Math.min(100, Math.round((participants / campaign.target) * 100));
          const soloTotal = campaign.itemPrice + campaign.soloShipping;
          const saved = soloTotal - campaign.groupTotal;

          return (
            <article className="group-buy-card" key={campaign.id}>
              <Link to={`/vinyl/${vinyl.id}`} className="group-buy-product">
                <img src={vinyl.cover} alt={`${vinyl.title} 커버`} />
                <div>
                  <span>{campaign.country} · {campaign.store}</span>
                  <h2>{vinyl.title}</h2>
                  <p>{vinyl.artist} · {vinyl.pressing}</p>
                </div>
              </Link>
              <div className="group-buy-progress">
                <div><strong>{participants}명 참여</strong><span>{campaign.target}명부터 주문 확정</span></div>
                <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
              </div>
              <dl className="group-price-list">
                <div><dt>혼자 직구하면</dt><dd>{formatWon(soloTotal)}</dd></div>
                <div><dt>공구 예상 결제</dt><dd>{formatWon(campaign.groupTotal)}</dd></div>
                <div className="saving-row"><dt>배송비 절감</dt><dd>-{formatWon(saved)}</dd></div>
              </dl>
              <div className="group-buy-meta">
                <span><Clock3 size={13} />{campaign.deadline}</span>
                <span><Box size={13} />{campaign.arrival}</span>
              </div>
              <button
                className={`group-join-button${isJoined ? " joined" : ""}`}
                type="button"
                onClick={() => setJoined((current) =>
                  isJoined ? current.filter((id) => id !== campaign.id) : [...current, campaign.id],
                )}
              >
                {isJoined ? <><Check size={16} /> 참여 완료 · 취소하기</> : "이 공구에 참여하기"}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
