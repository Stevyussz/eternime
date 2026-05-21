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

// Untuk halaman Ongoing / Completed / Genres Detail
export interface NormalizedAnimeList {
  items: NormalizedAnimeCard[];
  provider: ProviderName;
}

export interface NormalizedScheduleDay {
  title: string;
  animeList: {
    title: string;
    animeId: string;
    releaseTime?: string;
    animeSlug?: string;
  }[];
}

export interface NormalizedSchedule {
  days: NormalizedScheduleDay[];
  provider: ProviderName;
}

export interface NormalizedGenre {
  title: string;
  genreId: string;
}

export interface NormalizedGenreList {
  items: NormalizedGenre[];
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

export function normalizeKuramanimeList(raw: any): NormalizedAnimeList {
  const list = raw?.data?.animeList || raw?.data?.list || [];
  return {
    items: list.map(normalizeKuramanimeCard),
    provider: "kuramanime",
  };
}

export function normalizeKuramanimeSchedule(raw: any): NormalizedSchedule {
  const flatList = raw?.data?.animeList || [];
  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Random"];
  const groups: Record<string, any[]> = {};

  flatList.forEach((anime: any) => {
    const day = anime.day || "Random";
    if (!groups[day]) groups[day] = [];
    groups[day].push({
      title: anime.title,
      animeId: anime.animeSlug ? `${anime.animeId}/${anime.animeSlug}` : anime.animeId,
      releaseTime: anime.releaseTime,
    });
  });

  const days = dayOrder
    .filter(day => groups[day] && groups[day].length > 0)
    .map(day => ({
      title: day,
      animeList: groups[day]
    }));

  return { days, provider: "kuramanime" };
}

export function normalizeKuramanimeGenres(raw: any): NormalizedGenreList {
  const list = raw?.data?.propertyList || raw?.data?.genreList || [];
  return {
    items: list.map((g: any) => ({
      title: g.title,
      genreId: g.propertyId || g.genreId,
    })),
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
    movies:    [], // Otakudesu doesn't separate movies
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

export function normalizeOtakudesuList(raw: any): NormalizedAnimeList {
  const list = raw?.data?.animeList || [];
  return {
    items: list.map(normalizeOtakudesuCard),
    provider: "otakudesu",
  };
}

export function normalizeOtakudesuSchedule(raw: any): NormalizedSchedule {
  const scheduleList = raw?.data?.scheduleList || [];
  const days = scheduleList.map((dayObj: any) => ({
    title: dayObj.title, // e.g. "Senin"
    animeList: (dayObj.animeList || []).map((anime: any) => ({
      title: anime.title,
      animeId: anime.animeId,
      releaseTime: anime.releaseTime || "",
    }))
  }));

  return { days, provider: "otakudesu" };
}

export function normalizeOtakudesuGenres(raw: any): NormalizedGenreList {
  const list = raw?.data?.genreList || [];
  return {
    items: list.map((g: any) => ({
      title: g.title,
      genreId: g.genreId,
    })),
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

export function normalizeAnimesailList(raw: any): NormalizedAnimeList {
  const list = raw?.data?.animeList || raw?.data?.list || [];
  return {
    items: list.map(normalizeAnimesailCard),
    provider: "animesail",
  };
}

export function normalizeAnimesailSchedule(raw: any): NormalizedSchedule {
  // Animesail doesn't have a specific schedule endpoint mapped properly, returning empty
  return { days: [], provider: "animesail" };
}

export function normalizeAnimesailGenres(raw: any): NormalizedGenreList {
  const list = raw?.data?.genreList || [];
  return {
    items: list.map((g: any) => ({
      title: g.title,
      genreId: g.genreId,
    })),
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

export function normalizeSamehadakuList(raw: any): NormalizedAnimeList {
  const list = raw?.data?.animeList || [];
  return {
    items: list.map(normalizeSamehadakuCard),
    provider: "samehadaku",
  };
}

export function normalizeSamehadakuSchedule(raw: any): NormalizedSchedule {
  const scheduleList = raw?.data?.scheduleList || [];
  const days = scheduleList.map((dayObj: any) => ({
    title: dayObj.title,
    animeList: (dayObj.animeList || []).map((anime: any) => ({
      title: anime.title,
      animeId: anime.animeId,
      releaseTime: anime.releaseTime || "",
    }))
  }));

  return { days, provider: "samehadaku" };
}

export function normalizeSamehadakuGenres(raw: any): NormalizedGenreList {
  const list = raw?.data?.genreList || [];
  return {
    items: list.map((g: any) => ({
      title: g.title,
      genreId: g.genreId,
    })),
    provider: "samehadaku",
  };
}

// ─── Dynamic Normalizers for smartFetch ───────────────────────────────────────

export function normalizeList(raw: unknown, provider: ProviderName): NormalizedAnimeList {
  switch (provider) {
    case "kuramanime": return normalizeKuramanimeList(raw);
    case "otakudesu":  return normalizeOtakudesuList(raw);
    case "animesail":  return normalizeAnimesailList(raw);
    case "samehadaku": return normalizeSamehadakuList(raw);
  }
}

export function normalizeSchedule(raw: unknown, provider: ProviderName): NormalizedSchedule {
  switch (provider) {
    case "kuramanime": return normalizeKuramanimeSchedule(raw);
    case "otakudesu":  return normalizeOtakudesuSchedule(raw);
    case "animesail":  return normalizeAnimesailSchedule(raw);
    case "samehadaku": return normalizeSamehadakuSchedule(raw);
  }
}

export function normalizeGenres(raw: unknown, provider: ProviderName): NormalizedGenreList {
  switch (provider) {
    case "kuramanime": return normalizeKuramanimeGenres(raw);
    case "otakudesu":  return normalizeOtakudesuGenres(raw);
    case "animesail":  return normalizeAnimesailGenres(raw);
    case "samehadaku": return normalizeSamehadakuGenres(raw);
  }
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
