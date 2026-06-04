import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const API_ROOT = "https://api.discogs.com";
const OUTPUT_PATH = new URL("../src/data/crawledCatalog.json", import.meta.url);
const USER_AGENT = "VinylFindDemo/0.2";
const CACHE_DIR = join(tmpdir(), "vinyl-find-discogs-cache");

const masterAlbums = [
  { artist: "Nirvana", aliases: ["너바나"], title: "Bleach", year: 1989, masterId: 13773 },
  { artist: "Nirvana", aliases: ["너바나"], title: "Nevermind", year: 1991, masterId: 13814 },
  { artist: "Nirvana", aliases: ["너바나"], title: "Incesticide", year: 1992, masterId: 20424 },
  { artist: "Nirvana", aliases: ["너바나"], title: "In Utero", year: 1993, masterId: 13859 },
  { artist: "Nirvana", aliases: ["너바나"], title: "MTV Unplugged In New York", year: 1994, masterId: 22433 },
  { artist: "Nirvana", aliases: ["너바나"], title: "From The Muddy Banks Of The Wishkah", year: 1996, masterId: 42473 },
  { artist: "Nirvana", aliases: ["너바나"], title: "Nirvana", year: 2002, masterId: 42476 },

  { artist: "Slipknot", aliases: ["슬립낫"], title: "Slipknot", year: 1999, masterId: 53314 },
  { artist: "Slipknot", aliases: ["슬립낫"], title: "Iowa", year: 2001, masterId: 53296 },
  { artist: "Slipknot", aliases: ["슬립낫"], title: "Vol. 3: (The Subliminal Verses)", year: 2004, masterId: 53328 },
  { artist: "Slipknot", aliases: ["슬립낫"], title: "All Hope Is Gone", year: 2008, masterId: 53293 },
  { artist: "Slipknot", aliases: ["슬립낫"], title: ".5: The Gray Chapter", year: 2014, masterId: 746172 },
  { artist: "Slipknot", aliases: ["슬립낫"], title: "We Are Not Your Kind", year: 2019, masterId: 1586847 },
  { artist: "Slipknot", aliases: ["슬립낫"], title: "The End, So Far", year: 2022, masterId: 2802419 },

  { artist: "David Bowie", aliases: ["데이비드 보위"], title: "David Bowie", year: 1967 },
  { artist: "David Bowie", aliases: ["데이비드 보위", "Space Oddity"], title: "David Bowie", displayTitle: "Space Oddity (1969 / David Bowie)", year: 1969 },
  { artist: "David Bowie", aliases: ["데이비드 보위"], title: "The Man Who Sold The World", year: 1970 },
  { artist: "David Bowie", aliases: ["데이비드 보위"], title: "Hunky Dory", year: 1971 },
  { artist: "David Bowie", aliases: ["데이비드 보위", "Ziggy Stardust"], title: "The Rise And Fall Of Ziggy Stardust And The Spiders From Mars", year: 1972 },
  { artist: "David Bowie", aliases: ["데이비드 보위"], title: "Aladdin Sane", year: 1973 },
  { artist: "David Bowie", aliases: ["데이비드 보위", "Pin Ups"], title: "Pinups", year: 1973 },
  { artist: "David Bowie", aliases: ["데이비드 보위"], title: "Diamond Dogs", year: 1974 },
  { artist: "David Bowie", aliases: ["데이비드 보위"], title: "Young Americans", year: 1975 },
  { artist: "David Bowie", aliases: ["데이비드 보위"], title: "Station To Station", year: 1976 },
  { artist: "David Bowie", aliases: ["데이비드 보위"], title: "Low", year: 1977 },
  { artist: "David Bowie", aliases: ["데이비드 보위"], title: "\"Heroes\"", year: 1977 },
  { artist: "David Bowie", aliases: ["데이비드 보위"], title: "Lodger", year: 1979 },
  { artist: "David Bowie", aliases: ["데이비드 보위"], title: "Scary Monsters", displayTitle: "Scary Monsters (And Super Creeps)", year: 1980 },
  { artist: "David Bowie", aliases: ["데이비드 보위"], title: "Let's Dance", year: 1983 },
  { artist: "David Bowie", aliases: ["데이비드 보위"], title: "Tonight", year: 1984 },
  { artist: "David Bowie", aliases: ["데이비드 보위"], title: "Never Let Me Down", year: 1987 },
  { artist: "David Bowie", aliases: ["데이비드 보위"], title: "Black Tie White Noise", year: 1993 },
  { artist: "David Bowie", aliases: ["데이비드 보위"], title: "The Buddha Of Suburbia", year: 1993 },
  { artist: "David Bowie", aliases: ["데이비드 보위"], title: "1. Outside", year: 1995, masterId: 22350 },
  { artist: "David Bowie", aliases: ["데이비드 보위"], title: "Earthling", year: 1997, masterId: 49746 },
  { artist: "David Bowie", aliases: ["데이비드 보위"], title: "Hours...", displayTitle: "'hours...'", year: 1999 },
  { artist: "David Bowie", aliases: ["데이비드 보위"], title: "Heathen", year: 2002 },
  { artist: "David Bowie", aliases: ["데이비드 보위"], title: "Reality", year: 2003 },
  { artist: "David Bowie", aliases: ["데이비드 보위"], title: "The Next Day", year: 2013 },
  { artist: "David Bowie", aliases: ["데이비드 보위", "Blackstar"], title: "★", year: 2016, masterId: 939598 },
  { artist: "David Bowie", aliases: ["데이비드 보위"], title: "Toy", year: 2022, masterId: 603639 },

  { artist: "Michael Jackson", aliases: ["마이클 잭슨"], title: "Got To Be There", year: 1972 },
  { artist: "Michael Jackson", aliases: ["마이클 잭슨"], title: "Ben", year: 1972 },
  { artist: "Michael Jackson", aliases: ["마이클 잭슨"], title: "Music & Me", year: 1973 },
  { artist: "Michael Jackson", aliases: ["마이클 잭슨"], title: "Forever, Michael", year: 1975 },
  { artist: "Michael Jackson", aliases: ["마이클 잭슨"], title: "Off The Wall", year: 1979 },
  { artist: "Michael Jackson", aliases: ["마이클 잭슨"], title: "Thriller", year: 1982 },
  { artist: "Michael Jackson", aliases: ["마이클 잭슨"], title: "Bad", year: 1987 },
  { artist: "Michael Jackson", aliases: ["마이클 잭슨"], title: "Dangerous", year: 1991, masterId: 14641 },
  { artist: "Michael Jackson", aliases: ["마이클 잭슨"], title: "HIStory - Past, Present And Future - Book I", displayTitle: "HIStory: Past, Present And Future, Book I", year: 1995 },
  { artist: "Michael Jackson", aliases: ["마이클 잭슨"], title: "Blood On The Dance Floor - HIStory In The Mix", year: 1997 },
  { artist: "Michael Jackson", aliases: ["마이클 잭슨"], title: "Invincible", year: 2001 },
  { artist: "Michael Jackson", aliases: ["마이클 잭슨"], title: "Michael", year: 2010, masterId: 293695 },
  { artist: "Michael Jackson", aliases: ["마이클 잭슨"], title: "Xscape", year: 2014 },
];

const releaseAlbums = [
  { artist: "한로로", aliases: ["Hanroro", "Take-off", "理想飛行"], displayTitle: "이상비행", releaseId: 30317135, edition: "2024 Original LP" },
  { artist: "한로로", aliases: ["Hanroro", "Take-off", "理想飛行", "이상비행"], displayTitle: "이상비행 (2025 재발매)", releaseId: 34290994, edition: "2025 Reissue LP" },

  { artist: "Wave To Earth", aliases: ["wave to earth", "웨이브 투 어스"], releaseId: 20269207, edition: "2021 Limited LP" },
  { artist: "Wave To Earth", aliases: ["wave to earth", "웨이브 투 어스"], releaseId: 30675154, edition: "2024 Reissue LP" },
  { artist: "Wave To Earth", aliases: ["wave to earth", "웨이브 투 어스"], releaseId: 28994491, edition: "Korean Limited LP" },
  { artist: "Wave To Earth", aliases: ["wave to earth", "웨이브 투 어스"], releaseId: 31759049, edition: "US Limited LP" },
  { artist: "Wave To Earth", aliases: ["wave to earth", "웨이브 투 어스"], releaseId: 34705077, edition: "Korean Limited LP" },
  { artist: "Wave To Earth", aliases: ["wave to earth", "웨이브 투 어스"], releaseId: 34776455, edition: "Korean Standard LP" },
  { artist: "Wave To Earth", aliases: ["wave to earth", "웨이브 투 어스"], releaseId: 35835838, edition: "Australian Limited LP" },
  {
    artist: "Wave To Earth",
    aliases: ["wave to earth", "웨이브 투 어스"],
    releaseId: 35958604,
    edition: "2025 International LP",
    fallbackYear: 2025,
    fallbackReleaseDate: "2025",
  },
  { artist: "Wave To Earth", aliases: ["wave to earth", "웨이브 투 어스"], releaseId: 35761546, edition: "US Limited 7-inch" },
  { artist: "Wave To Earth", aliases: ["wave to earth", "웨이브 투 어스"], releaseId: 36636829, edition: "2026 12-inch" },
  { artist: "Wave To Earth", aliases: ["wave to earth", "웨이브 투 어스"], releaseId: 37455801, edition: "2026 45 RPM 12-inch" },
  {
    artist: "Wave To Earth",
    aliases: ["wave to earth", "웨이브 투 어스", "전진희"],
    releaseId: 29052022,
    edition: "2023 Collaborative 7-inch",
    fallbackYear: 2023,
    fallbackReleaseDate: "2023-08-17",
  },

  { artist: "저스트뮤직 (Just Music)", aliases: ["C Jamm", "CJAMM", "씨잼", "Just Music"], releaseId: 31086356, edition: "C Jamm 참여 2LP" },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let lastRequestAt = 0;

const fetchJson = async (url, attempt = 0) => {
  await mkdir(CACHE_DIR, { recursive: true });
  const cachePath = join(CACHE_DIR, `${createHash("sha1").update(url).digest("hex")}.json`);

  try {
    return JSON.parse(await readFile(cachePath, "utf8"));
  } catch {
    // Cache miss.
  }

  const elapsed = Date.now() - lastRequestAt;
  if (elapsed < 2600) await sleep(2600 - elapsed);
  lastRequestAt = Date.now();

  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });

  if (response.status === 429 && attempt < 8) {
    console.log(`Rate limited. Waiting before retry ${attempt + 1}: ${url}`);
    await sleep(65000);
    return fetchJson(url, attempt + 1);
  }

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }

  const data = await response.json();
  await writeFile(cachePath, JSON.stringify(data), "utf8");
  return data;
};

const slugify = (value) =>
  value
    .normalize("NFKD")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

const flattenTracks = (tracks = []) =>
  tracks.flatMap((track) => {
    const childTracks = flattenTracks(track.sub_tracks);
    return track.type_ === "track" && track.title ? [track.title, ...childTracks] : childTracks;
  });

const normalizeText = (value) =>
  value
    .toLowerCase()
    .replace(/['".,:()\-–—]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const normalizeReleaseDate = (value) =>
  value
    ?.replace(/-00-00$/, "")
    .replace(/-00$/, "");

const findMaster = async (album) => {
  if (album.masterId) return fetchJson(`${API_ROOT}/masters/${album.masterId}`);

  const normalizedTitle = normalizeText(album.title);
  const searchMaster = async (vinylOnly) => {
    const params = new URLSearchParams({
      artist: album.artist,
      release_title: album.title,
      type: "master",
      per_page: "25",
    });
    if (vinylOnly) params.set("format", "Vinyl");

    const search = await fetchJson(`${API_ROOT}/database/search?${params}`);
    const exactCandidates = search.results.filter((result) => {
      const resultTitle = result.title.split(" - ").slice(1).join(" - ");
      const isAlbum = result.format?.includes("Album");
      const isExpectedYear = Number(result.year) === album.year;
      return isAlbum && isExpectedYear && normalizeText(resultTitle) === normalizedTitle;
    });
    const orderedCandidates = exactCandidates.filter(
      (candidate, index, list) => list.findIndex((item) => item.id === candidate.id) === index,
    );

    for (const candidate of orderedCandidates) {
      try {
        return await fetchJson(`${API_ROOT}/masters/${candidate.id}`);
      } catch (error) {
        if (!String(error).includes("404 Not Found")) throw error;
      }
    }
    return undefined;
  };

  const vinylMaster = await searchMaster(true);
  if (vinylMaster) return vinylMaster;

  const generalMaster = await searchMaster(false);
  if (generalMaster) return generalMaster;

  throw new Error(`No valid Discogs master found for ${album.artist} - ${album.title}`);
};

const masterToCatalogItem = async (album) => {
  const master = await findMaster(album);
  const sourceTitle = album.displayTitle ?? master.title;
  return {
    id: `${slugify(album.artist)}-${slugify(sourceTitle)}-${album.year}`,
    title: sourceTitle,
    artist: album.artist,
    searchAliases: album.aliases,
    cover: master.images?.[0]?.uri ?? "",
    year: album.year,
    releaseDate: String(album.year),
    genres: [...new Set([...(master.genres ?? []), ...(master.styles ?? [])])],
    label: "Discogs 대표 LP 마스터",
    catalogNumber: "다수 판본",
    country: "다수 국가",
    pressing: "대표 공식 LP 카탈로그",
    format: "LP · Album · 판본별 상이",
    vinylColor: "판본별 상이",
    availability: "중고 거래만",
    releaseWindow: `${album.year} 최초 발매 · 국가별 재발매 판본 존재`,
    production: "판본별 상이",
    description: `${album.artist}의 ${album.year}년 앨범입니다. 동일 앨범의 국가·연도·컬러별 프레싱은 대표 LP 마스터로 묶어 표시합니다.`,
    dataNote: "Discogs 마스터 기준 대표 카탈로그입니다. 상세 구매 전 개별 프레싱과 카탈로그 번호를 확인해야 합니다.",
    tracks: flattenTracks(master.tracklist),
    sourceType: "master",
    sourceId: master.id,
  };
};

const releaseToCatalogItem = async (album) => {
  const release = await fetchJson(`${API_ROOT}/releases/${album.releaseId}`);
  const format = release.formats?.[0];
  const label = release.labels?.[0];
  const releaseYear = Number(release.year) || Number(String(release.released).slice(0, 4)) || album.fallbackYear || 0;
  const releaseDate =
    normalizeReleaseDate(release.released) ||
    album.fallbackReleaseDate ||
    String(release.year || "발매일 미확인");
  return {
    id: `${slugify(album.artist)}-${slugify(album.displayTitle ?? release.title)}-${album.releaseId}`,
    title: album.displayTitle ?? release.title,
    artist: album.artist,
    searchAliases: album.aliases,
    cover: release.images?.[0]?.uri ?? "",
    year: releaseYear,
    releaseDate,
    genres: [...new Set([...(release.genres ?? []), ...(release.styles ?? [])])],
    label: label?.name ?? "레이블 미확인",
    catalogNumber: label?.catno ?? "미확인",
    country: release.country ?? "미확인",
    pressing: album.edition,
    format: [format?.qty ? `${format.qty}${format.name === "Vinyl" ? "LP" : format?.name}` : format?.name, ...(format?.descriptions ?? [])].filter(Boolean).join(" · "),
    vinylColor: format?.text ?? "Black / 미기재",
    availability: releaseYear >= 2025 ? "판매 중" : "중고 거래만",
    releaseWindow: `${releaseDate} 발매 · 판매 상태 변동`,
    production: release.notes?.match(/\d[\d,]*\s*(?:made|copies|장)/i)?.[0] ?? "수량 미공개",
    description: `${album.artist}의 ${album.edition} 판본입니다. Discogs 개별 릴리즈 데이터를 기준으로 수집했습니다.`,
    dataNote: album.artist.includes("Just Music") ? "C Jamm 참여 음반으로 아티스트 검색 결과에 함께 표시합니다." : undefined,
    tracks: flattenTracks(release.tracklist),
    sourceType: "release",
    sourceId: release.id,
  };
};

const mapWithConcurrency = async (items, worker, concurrency = 4) => {
  const results = new Array(items.length);
  let cursor = 0;

  const runners = Array.from({ length: concurrency }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index]);
      console.log(`Crawled ${index + 1}/${items.length}: ${items[index].artist} - ${items[index].title ?? items[index].releaseId}`);
    }
  });

  await Promise.all(runners);
  return results;
};

const main = async () => {
  const masterItems = await mapWithConcurrency(masterAlbums, masterToCatalogItem, 1);
  const releaseItems = await mapWithConcurrency(releaseAlbums, releaseToCatalogItem, 1);
  const catalog = [...masterItems, ...releaseItems].sort((a, b) =>
    a.artist.localeCompare(b.artist) || a.year - b.year || a.title.localeCompare(b.title),
  );
  const invalidItems = catalog.filter((item) => item.year <= 0 || !item.cover || item.tracks.length === 0);

  if (invalidItems.length > 0) {
    throw new Error(
      `Catalog validation failed: ${invalidItems.map((item) => `${item.artist} - ${item.title}`).join(", ")}`,
    );
  }

  await writeFile(OUTPUT_PATH, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  console.log(`Wrote ${catalog.length} Discogs catalog records to ${OUTPUT_PATH.pathname}`);
};

await main();
