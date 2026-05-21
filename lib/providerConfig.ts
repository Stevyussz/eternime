// Provider configuration & cascade order for auto-fallback

export type ProviderName = "kuramanime" | "otakudesu" | "animesail" | "samehadaku";

/** Urutan prioritas provider. Provider pertama dicoba duluan. */
export const PROVIDER_ORDER: ProviderName[] = [
  "otakudesu",
  "kuramanime",
  "animesail",
  "samehadaku",
];

export const PROVIDER_META: Record<ProviderName, {
  label: string;
  color: string;
  bgColor: string;
  emoji: string;
}> = {
  kuramanime: { label: "Kuramanime", color: "#a855f7", bgColor: "rgba(168,85,247,0.15)", emoji: "⚡" },
  otakudesu:  { label: "Otakudesu",  color: "#3b82f6", bgColor: "rgba(59,130,246,0.15)",  emoji: "🔵" },
  animesail:  { label: "AnimeSail",  color: "#22c55e", bgColor: "rgba(34,197,94,0.15)",   emoji: "🚀" },
  samehadaku: { label: "Samehadaku", color: "#f59e0b", bgColor: "rgba(245,158,11,0.15)",  emoji: "🌟" },
};

/** Endpoint paths per provider per feature */
export const PROVIDER_ENDPOINTS: Record<ProviderName, {
  home: string;
  ongoing: (page: number) => string;
  completed: (page: number) => string;
  search: (q: string) => string;
  anime: (id: string, slug?: string) => string;
  episode: (animeId: string, animeSlug: string, episodeId: string) => string;
  server?: (serverId: string) => string;
  schedule: string;
  genres: string;
}> = {
  kuramanime: {
    home:      "/kuramanime/home",
    ongoing:   (p) => `/kuramanime/anime?status=ongoing&page=${p}`,
    completed: (p) => `/kuramanime/anime?status=completed&page=${p}`,
    search:    (q) => `/kuramanime/anime?search=${encodeURIComponent(q)}`,
    anime:     (id, slug = "") => `/kuramanime/anime/${id}/${slug}`,
    episode:   (animeId, animeSlug, episodeId) => `/kuramanime/episode/${animeId}/${animeSlug}/${episodeId}`,
    server:    (id) => `/kuramanime/server/${id}`,
    schedule:  "/kuramanime/schedule",
    genres:    "/kuramanime/properties/genre",
  },
  otakudesu: {
    home:      "/otakudesu/home",
    ongoing:   (p) => `/otakudesu/ongoing?page=${p}`,
    completed: (p) => `/otakudesu/completed?page=${p}`,
    search:    (q) => `/otakudesu/search?q=${encodeURIComponent(q)}`,
    anime:     (id) => `/otakudesu/anime/${id}`,
    episode:   (_animeId, _animeSlug, episodeId) => `/otakudesu/episode/${episodeId}`,
    server:    (id) => `/otakudesu/server/${id}`,
    schedule:  "/otakudesu/schedule",
    genres:    "/otakudesu/genre",
  },
  animesail: {
    home:      "/animesail/home",
    ongoing:   (p) => `/animesail/home?page=${p}`,
    completed: (_p) => `/animesail/home`,
    search:    (q) => `/animesail/search?q=${encodeURIComponent(q)}`,
    anime:     (id) => `/animesail/anime/${id}`,
    episode:   (_animeId, _animeSlug, episodeId) => `/animesail/episode/${episodeId}`,
    server:    (id) => `/animesail/server/${id}`,
    schedule:  "/animesail/home",
    genres:    "/animesail/genres",
  },
  samehadaku: {
    home:      "/samehadaku/home",
    ongoing:   (p) => `/samehadaku/ongoing?page=${p}`,
    completed: (p) => `/samehadaku/completed?page=${p}`,
    search:    (q) => `/samehadaku/search?q=${encodeURIComponent(q)}`,
    anime:     (id) => `/samehadaku/anime/${id}`,
    episode:   (_animeId, _animeSlug, episodeId) => `/samehadaku/episode/${episodeId}`,
    server:    (id) => `/samehadaku/server/${id}`,
    schedule:  "/samehadaku/schedule",
    genres:    "/samehadaku/genre",
  },
};
