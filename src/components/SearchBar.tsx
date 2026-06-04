import { Search, SlidersHorizontal } from "lucide-react";
import type { FormEvent } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  autoFocus?: boolean;
}

export function SearchBar({ value, onChange, onSubmit, autoFocus = false }: SearchBarProps) {
  return (
    <form className="search-bar" role="search" onSubmit={onSubmit}>
      <Search size={20} strokeWidth={1.9} aria-hidden="true" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="앨범, 곡, 아티스트 검색"
        aria-label="바이닐 검색"
        autoFocus={autoFocus}
      />
      <button className="icon-button" type="submit" aria-label="검색">
        <SlidersHorizontal size={18} strokeWidth={1.9} aria-hidden="true" />
      </button>
    </form>
  );
}
