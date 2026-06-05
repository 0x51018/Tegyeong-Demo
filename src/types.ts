export type Availability = "발매 예정" | "예약 판매" | "판매 중" | "중고 거래만" | "단종";

export interface Seller {
  name: string;
  price: number | null;
  shipping: string;
  region: "국내" | "해외";
  url: string;
}

export interface UsedListing {
  id: string;
  grade: "M" | "NM" | "VG+" | "VG";
  jacketGrade: "M" | "NM" | "VG+" | "VG";
  listeningGrade: "M" | "NM" | "VG+" | "VG";
  price: number;
  seller: string;
  note: string;
  shipping?: string;
}

export interface SourceLink {
  label: string;
  url: string;
  kind: "발매 정보" | "시세" | "판매처";
}

export interface MarketReference {
  label: string;
  price: number;
  source: string;
  capturedAt: string;
  url: string;
}

export interface Vinyl {
  id: string;
  title: string;
  artist: string;
  searchAliases: string[];
  cover: string;
  year: number;
  releaseDate: string;
  genres: string[];
  label: string;
  catalogNumber: string;
  country: string;
  pressing: string;
  format: string;
  vinylColor: string;
  availability: Availability;
  retailPrice: number | null;
  marketPrice: number | null;
  lowestPrice: number | null;
  releaseWindow: string;
  production: string;
  description: string;
  dataNote?: string;
  listenUrl?: string;
  listenLabel?: string;
  tracks: string[];
  sellers: Seller[];
  usedListings: UsedListing[];
  marketReferences: MarketReference[];
  sourceLinks: SourceLink[];
  crawledAt: string;
}
