import { ExternalLink, Heart, MessageCircle, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { communityPosts, communityTags } from "../data/community";

export function CommunityScreen() {
  const [activeTag, setActiveTag] = useState<(typeof communityTags)[number]>("전체");
  const visiblePosts = activeTag === "전체"
    ? communityPosts
    : communityPosts.filter((post) => post.tag === activeTag);

  return (
    <section className="screen-section feature-screen">
      <header className="screen-header inline-screen-header">
        <div><p>COMMUNITY</p><h1>바이닐 라운지</h1></div>
        <button className="round-primary" type="button" aria-label="글쓰기"><Plus size={21} /></button>
      </header>

      <div className="community-banner">
        <Sparkles size={22} />
        <p><strong>입문자도 편하게 묻는 커뮤니티</strong><br />질문하고, 추천하고, 오늘의 LP를 자랑해보세요.</p>
      </div>

      <nav className="community-filters" aria-label="커뮤니티 글 태그">
        {communityTags.map((tag) => (
          <button
            type="button"
            key={tag}
            className={activeTag === tag ? "active" : ""}
            onClick={() => setActiveTag(tag)}
          >
            {tag}
            <span>{tag === "전체" ? communityPosts.length : communityPosts.filter((post) => post.tag === tag).length}</span>
          </button>
        ))}
      </nav>

      <div className="community-list-heading">
        <strong>{activeTag === "전체" ? "라운지의 모든 글" : `${activeTag} 글`}</strong>
        <span>{visiblePosts.length}개 목업 게시물</span>
      </div>

      <div className="post-list">
        {visiblePosts.map((post) => (
          <article key={post.id}>
            <div className="post-meta">
              <span>{post.tag}</span>
              <time>{post.postedAt}</time>
            </div>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <div className="post-footer">
              <span className="post-author">{post.author}</span>
              <span><Heart size={15} /> {post.likes}</span>
              <span><MessageCircle size={15} /> {post.comments}</span>
            </div>
            <a href={post.sourceUrl} target="_blank" rel="noreferrer" className="post-source">
              참고: {post.sourceTitle} · 데모용 재작성
              <ExternalLink size={13} />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
