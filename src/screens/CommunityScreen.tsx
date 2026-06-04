import { Heart, MessageCircle, Plus, Sparkles } from "lucide-react";

const posts = [
  { tag: "자랑", title: "오래 찾던 초판을 드디어 구했습니다", author: "needle_drop", likes: 42, comments: 8 },
  { tag: "추천", title: "비 오는 날 듣기 좋은 국내 재즈 LP", author: "side_a", likes: 31, comments: 12 },
  { tag: "가이드", title: "처음 시작하는 사람을 위한 그레이딩 읽는 법", author: "33rpm", likes: 87, comments: 19 },
];

export function CommunityScreen() {
  return (
    <section className="screen-section feature-screen">
      <header className="screen-header inline-screen-header">
        <div><p>COMMUNITY</p><h1>바이닐 라운지</h1></div>
        <button className="round-primary" type="button" aria-label="글쓰기"><Plus size={21} /></button>
      </header>
      <div className="community-banner">
        <Sparkles size={22} />
        <p><strong>이번 주 질문</strong><br />처음 구매했던 LP는 무엇인가요?</p>
      </div>
      <div className="post-list">
        {posts.map((post) => (
          <article key={post.title}>
            <span>{post.tag}</span>
            <h2>{post.title}</h2>
            <p>{post.author}</p>
            <div><Heart size={15} /> {post.likes}<MessageCircle size={15} /> {post.comments}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
