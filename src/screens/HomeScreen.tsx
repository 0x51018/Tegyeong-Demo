import { ArrowLeft, ArrowRight, Bell, Disc3, SearchX, Shuffle } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SearchBar } from "../components/SearchBar";
import { VinylCard } from "../components/VinylCard";
import { albumsWithoutVinyl, CRAWLED_AT, findVinyl, formatWon, searchVinyls, vinyls } from "../data/catalog";

export function HomeScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const submittedQuery = searchParams.get("q")?.trim() ?? "";
  const [query, setQuery] = useState(submittedQuery);
  const featured = findVinyl("black-skirts-201-red-glitter") ?? vinyls[0];
  const featuredPrice = featured.retailPrice ?? featured.marketPrice;
  const popularVinyls = vinyls.filter((vinyl) =>
    ["black-skirts-team-baby", "hyukoh-20-korea-reissue", "hyukoh-aaa", "cjamm-keung-marbled"].includes(vinyl.id),
  );
  const diggingVinyls = vinyls.filter((vinyl) => vinyl.usedListings.length > 0).slice(0, 3);
  const yes24Vinyls = vinyls.filter((vinyl) => vinyl.id.startsWith("yes24-"));
  const searchResults = useMemo(() => searchVinyls(submittedQuery), [submittedQuery]);
  const noVinylAlbum = submittedQuery
    ? albumsWithoutVinyl.find((album) => album.title.toLowerCase().includes(submittedQuery.toLowerCase()))
    : undefined;

  useEffect(() => {
    setQuery(submittedQuery);
  }, [submittedQuery]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = query.trim();
    setSearchParams(nextQuery ? { q: nextQuery } : {});
  };

  const runExampleSearch = (value: string) => {
    setQuery(value);
    setSearchParams({ q: value });
  };

  const clearSearch = () => {
    setQuery("");
    setSearchParams({});
  };

  return (
    <>
      <header className="home-header">
        <Link className="wordmark" to="/">
          VINYL <span>FIND</span>
        </Link>
        <button className="header-action" type="button" aria-label="알림">
          <Bell size={20} strokeWidth={1.8} />
          <span />
        </button>
      </header>

      <section className="home-intro">
        <h1>오늘은 어떤 음악을<br />찾고 있나요?</h1>
        <SearchBar value={query} onChange={setQuery} onSubmit={handleSubmit} />
        <div className="home-search-examples">
          {["CJAMM", "한로로", "검정치마", "wave to earth"].map((example) => (
            <button key={example} type="button" onClick={() => runExampleSearch(example)}>{example}</button>
          ))}
        </div>
      </section>

      {submittedQuery ? (
        <section className="home-search-results">
          <div className="home-result-heading">
            <button type="button" onClick={clearSearch} aria-label="검색 결과 닫기"><ArrowLeft size={18} /></button>
            <div><span>"{submittedQuery}" 검색 결과</span><strong>{searchResults.length}</strong></div>
          </div>
          {noVinylAlbum ? (
            <div className="empty-state compact-empty">
              <SearchX size={34} strokeWidth={1.5} />
              <h2>{noVinylAlbum.title}은<br />Vinyl로 발매되지 않았어요.</h2>
              <p>{noVinylAlbum.artist}의 다른 LP 발매 앨범을 확인해보세요.</p>
              <button className="primary-button" type="button" onClick={() => runExampleSearch(noVinylAlbum.artist)}>아티스트 LP 보기</button>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="search-results">
              <div className="result-heading"><Disc3 size={18} /><span>앨범·곡·아티스트·참여 음반</span><strong>{searchResults.length}</strong></div>
              {searchResults.map((vinyl) => <VinylCard key={vinyl.id} vinyl={vinyl} compact />)}
            </div>
          ) : (
            <div className="empty-state compact-empty">
              <SearchX size={34} strokeWidth={1.5} />
              <h2>검색 결과가 없어요.</h2>
              <p>앨범, 곡 또는 아티스트 이름을 다시 확인해주세요.</p>
            </div>
          )}
        </section>
      ) : (
        <>
          <section className="featured-release">
            <div className="featured-copy">
              <p>{featured.availability} · {featured.production}</p>
              <h2>{featured.title}</h2>
              <span>{featured.artist}</span>
              <strong>{featuredPrice ? `초기 판매가 ${formatWon(featuredPrice)}` : featured.releaseDate}</strong>
              <Link to={`/vinyl/${featured.id}`} className="text-link">
                발매 정보 보기 <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <Link to={`/vinyl/${featured.id}`} className="featured-art" aria-label={`${featured.title} 상세 보기`}>
              <div className="record-disc" />
              <img src={featured.cover} alt={`${featured.title} 앨범 커버`} />
            </Link>
          </section>

          <section className="content-section">
            <div className="section-heading">
              <h2>국내 실제 발매 카탈로그</h2>
              <button type="button" onClick={() => runExampleSearch("한로로")}>한로로 LP 보기</button>
            </div>
            <p className="data-stamp">Discogs·공개 판매처 기반 · {CRAWLED_AT} 수집</p>
            <div className="horizontal-rail">
              {popularVinyls.map((vinyl) => <VinylCard key={vinyl.id} vinyl={vinyl} />)}
            </div>
          </section>

          <section className="content-section new-release-section">
            <div className="section-heading">
              <h2>YES24 인기·예약 LP</h2>
              <button type="button" onClick={() => runExampleSearch("YES24 인기 LP")}>전체 보기</button>
            </div>
            <p className="data-stamp">공개 상품 페이지 기반 · 가격과 일정은 변동 가능</p>
            <div className="horizontal-rail">
              {yes24Vinyls.map((vinyl) => <VinylCard key={vinyl.id} vinyl={vinyl} />)}
            </div>
          </section>

          <section className="digging-section">
            <div>
              <Shuffle size={22} strokeWidth={1.8} aria-hidden="true" />
              <h2>모르는 음악을<br />발견하는 디깅</h2>
              <p>재고 속에서 한 장씩 넘기며<br />새로운 취향을 만나보세요.</p>
            </div>
            <Link to="/market?mode=digging" className="digging-stack" aria-label="디깅 시작">
              {diggingVinyls.map((vinyl) => <img key={vinyl.id} src={vinyl.cover} alt="" />)}
            </Link>
          </section>
        </>
      )}
    </>
  );
}
