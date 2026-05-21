import type { ProviderName } from "./providerConfig";
import type { AnimeCard } from "@/types";

// ─── Shared normalized types ─────────────────────────────────────────────────

export interface NormalizedAnimeCard {
  title: string;
  animeId: string;       // composite nav ID (e.g. "123/kimetsu-no-yaiba" for kuramanime)
  poster: string;
  episodes: string;
  status: string;
  score?: string;
  type?: string;
  provider: ProviderName;
}

export interface NormalizedHome {
  ongoing: NormalizedAnimeCard[];
  completed: NormalizedAnimeCard[];
  movies: NormalizedAnimeCard[];
  provider: ProviderName;
}

export interface NormalizedSearchResult {
  items: NormalizedAnimeCard[];
  provider: ProviderName;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function flat(val: unknown): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object" && val !== null && "title" in val) return String((val as any).title);
  return String(val);
}

// ─── Kuramanime normalizers ───────────────────────────────────────────────────

function normalizeKuramanimeCard(item: any): NormalizedAnimeCard {
  return {
    title: item.title || item.episodeTitle || "",
    animeId: item.animeId && item.animeSlug
      ? `${item.animeId}/${item.animeSlug}`
      : item.animeId || "",
    poster: item.poster || "",
    episodes: item.episodes || item.episodeId || "",
    status: item.status || "Ongoing",
    score: flat(item.quality) || item.score || "",
    type: flat(item.type) || "",
    provider: "kuramanime",
  };
}

export function normalizeKuramanimeHome(raw: any): NormalizedHome {
  return {
    ongoing:   (raw?.data?.ongoing?.episodeList || []).map(normalizeKuramanimeCard),
    completed: (raw?.data?.completed?.animeList || []).map(normalizeKuramanimeCard),
    movies:    (raw?.data?.movie?.animeList     || []).map(normalizeKuramanimeCard),
    provider:  "kuramanime",
  };
}

export function normalizeKuramanimeSearch(raw: any): NormalizedSearchResult {
  const list = raw?.data?.animeList || raw?.data?.list || [];
  return {
    items:    list.map(normalizeKuramanimeCard),
    provider: "kuramanime",
  };
}

// ─── Otakudesu normalizers ────────────────────────────────────────────────────

function normalizeOtakudesuCard(item: any): NormalizedAnimeCard {
  return {
    title:    item.title || "",
    animeId:  item.animeId || "",
    poster:   item.poster || "",
    episodes: item.episodes || item.latestEpisode || "",
    status:   item.status || "Ongoing",
    score:    item.score || "",
    type:     item.type || "",
    provider: "otakudesu",
  };
}

export function normalizeOtakudesuHome(raw: any): NormalizedHome {
  return {
    ongoing:   (raw?.data?.ongoing?.animeList   || []).map(normalizeOtakudesuCard),
    completed: (raw?.data?.completed?.animeList || []).map(normalizeOtakudesuCard),
    movies:    [],
    provider:  "otakudesu",
  };
}

export function normalizeOtakudesuSearch(raw: any): NormalizedSearchResult {
  const list = raw?.data?.animeList || [];
  return {
    items:    list.map(normalizeOtakudesuCard),
    provider: "otakudesu",
  };
}

// ─── AnimeSail normalizers ────────────────────────────────────────────────────

function normalizeAnimesailCard(item: any): NormalizedAnimeCard {
  return {
    title:    item.title || "",
    animeId:  item.animeId || "",
    poster:   item.poster || "",
    episodes: item.episodes?.toString() || "",
    status:   item.status || "Ongoing",
    score:    item.score || "",
    type:     item.type || "",
    provider: "animesail",
  };
}

export function normalizeAnimesailHome(raw: any): NormalizedHome {
  const list = raw?.data?.list || raw?.data?.animeList || [];
  return {
    ongoing:   list.map(normalizeAnimesailCard),
    completed: [],
    movies:    [],
    provider:  "animesail",
  };
}

export function normalizeAnimesailSearch(raw: any): NormalizedSearchResult {
  const list = raw?.data?.animeList || raw?.data?.list || [];
  return {
    items:    list.map(normalizeAnimesailCard),
    provider: "animesail",
  };
}

// ─── Samehadaku normalizers ───────────────────────────────────────────────────

function normalizeSamehadakuCard(item: any): NormalizedAnimeCard {
  return {
    title:    item.title || "",
    animeId:  item.animeId || "",
    poster:   item.poster || "",
    episodes: item.episodes || "",
    status:   item.status || item.releaseDay || "Ongoing",
    score:    item.score || "",
    type:     "",
    provider: "samehadaku",
  };
}

export function normalizeSamehadakuHome(raw: any): NormalizedHome {
  return {
    ongoing:   (raw?.data?.ongoing?.animeList   || []).map(normalizeSamehadakuCard),
    completed: (raw?.data?.completed?.animeList || []).map(normalizeSamehadakuCard),
    movies:    [],
    provider:  "samehadaku",
  };
}

export function normalizeSamehadakuSearch(raw: any): NormalizedSearchResult {
  const list = raw?.data?.animeList || [];
  return {
    items:    list.map(normalizeSamehadakuCard),
    provider: "samehadaku",
  };
}

// ─── Converter: NormalizedAnimeCard → legacy AnimeCard (for existing components) ─

export function toAnimeCard(card: NormalizedAnimeCard): AnimeCard {
  return {
    title:    card.title,
    animeId:  card.animeId,
    poster:   card.poster,
    episodes: card.episodes,
    status:   card.status,
    score:    card.score,
    type:     card.type,
  };
}
