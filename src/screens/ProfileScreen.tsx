import { ChevronRight, Disc3, Headphones, Settings } from "lucide-react";
import { vinyls } from "../data/catalog";

export function ProfileScreen() {
  return (
    <section className="screen-section feature-screen">
      <header className="screen-header inline-screen-header">
        <div><p>MY COLLECTION</p><h1>나의 레코드장</h1></div>
        <button className="header-action" type="button" aria-label="설정"><Settings size={20} /></button>
      </header>
      <div className="profile-card">
        <div className="profile-avatar">VF</div>
        <div><strong>vinyl_beginner</strong><span>서울 · 수집 1년 차</span></div>
        <ChevronRight size={18} />
      </div>
      <div className="profile-stats">
        <div><Disc3 size={18} /><strong>12</strong><span>소유 LP</span></div>
        <div><Headphones size={18} /><strong>38</strong><span>청음 기록</span></div>
      </div>
      <div className="section-heading"><h2>최근 추가한 LP</h2><button type="button">전체 보기</button></div>
      <div className="collection-grid">
        {vinyls.slice(0, 3).map((vinyl) => (
          <div key={vinyl.id}><img src={vinyl.cover} alt={`${vinyl.title} 앨범 커버`} /><strong>{vinyl.title}</strong><span>{vinyl.artist}</span></div>
        ))}
      </div>
    </section>
  );
}
