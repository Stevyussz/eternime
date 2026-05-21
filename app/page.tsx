import { HeroCarousel } from "@/components/features/HeroCarousel";
import { HomeScheduleWidget } from "@/components/features/HomeScheduleWidget";
import { DailyOmikuji } from "@/components/features/DailyOmikuji";
import { ContinueWatching } from "@/components/features/ContinueWatching";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { ProviderBadge } from "@/components/ui/ProviderBadge";
import { ProviderSwitchToast } from "@/components/ui/ProviderSwitchToast";
import { smartFetch } from "@/lib/smartFetch";
import { PROVIDER_ENDPOINTS } from "@/lib/providerConfig";
import {
  normalizeKuramanimeHome,
  normalizeOtakudesuHome,
  normalizeAnimesailHome,
  normalizeSamehadakuHome,
  toAnimeCard,
  type NormalizedHome,
} from "@/lib/normalize";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProviderName } from "@/lib/providerConfig";

export const metadata = {
  title: "Eternime — Watch Anime Free",
  description: "Watch the latest anime online for free in HD quality on Eternime.",
};

const NORMALIZERS: Record<ProviderName, (raw: unknown) => NormalizedHome> = {
  kuramanime: normalizeKuramanimeHome,
  otakudesu:  normalizeOtakudesuHome,
  animesail:  normalizeAnimesailHome,
  samehadaku: normalizeSamehadakuHome,
};

async function getHomeData() {
  return smartFetch<NormalizedHome>(
    (p) => PROVIDER_ENDPOINTS[p].home,
    (raw, p) => NORMALIZERS[p](raw),
    { revalidate: 600 }
  );
}

// Genre fallback list (shown if API unavailable)
const FALLBACK_GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy",
  "Horror", "Isekai", "Magic", "Mecha", "Music",
  "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Sports",
  "Supernatural", "Thriller", "Psychological",
];

export default async function Home() {
  let result;
  let ongoingList: ReturnType<typeof toAnimeCard>[] = [];
  let completedList: ReturnType<typeof toAnimeCard>[] = [];
  let movieList: ReturnType<typeof toAnimeCard>[] = [];
  let activeProvider: ProviderName = "kuramanime";
  let fallbackOccurred = false;

  try {
    result = await getHomeData();
    activeProvider = result.activeProvider;
    fallbackOccurred = result.fallbackOccurred;
    ongoingList   = result.data.ongoing.map(toAnimeCard);
    completedList = result.data.completed.map(toAnimeCard);
    movieList     = result.data.movies.map(toAnimeCard);
  } catch (err) {
    console.error("[Home] All providers failed:", err);
  }

  const carouselData = [...ongoingList, ...movieList].slice(0, 6).map((anime) => ({
    ...anime,
    synopsis: `Nonton ${anime.title} sub Indo HD gratis di Eternime!`,
  }));

  return (
    <div className="container mx-auto px-6 pb-20">
      {/* Auto-provider switch toast — client component */}
      <ProviderSwitchToast provider={activeProvider} fallbackOccurred={fallbackOccurred} />

      {/* Hero Carousel */}
      {carouselData.length > 0 && <HeroCarousel animeList={carouselData} />}

      {/* Schedule + Omikuji */}
      <div className="mt-6 mb-12 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <div className="lg:col-span-3">
          <HomeScheduleWidget />
        </div>
        <div className="lg:col-span-1 lg:pt-12 order-last lg:order-none">
          <DailyOmikuji />
        </div>
      </div>

      <ContinueWatching />

      {/* Genres */}
      <section className="mb-12 mt-12">
        <h2 className="text-lg font-bold text-muted-foreground mb-4 px-1">Top Genres</h2>
        <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar snap-x">
          {FALLBACK_GENRES.map((genre) => (
            <Link
              href={`/genres/${genre.toLowerCase()}`}
              key={genre}
              className="snap-start shrink-0"
            >
              <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-brand-lime/50 transition-all cursor-pointer whitespace-nowrap text-sm font-medium text-foreground hover:text-brand-lime">
                {genre}
              </div>
            </Link>
          ))}
          <Link href="/genres" className="snap-start shrink-0">
            <div className="px-6 py-3 bg-secondary/20 border border-white/5 rounded-xl hover:bg-secondary/40 transition-colors whitespace-nowrap text-sm font-medium text-brand-lime flex items-center gap-2">
              View All <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        </div>
      </section>

      {/* Latest Episodes */}
      {ongoingList.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-blue to-brand-lime bg-clip-text text-transparent">
              Latest Episodes
            </h2>
            <Link href="/ongoing" className="text-sm text-muted-foreground hover:text-brand-lime transition-colors flex items-center gap-1 group">
              View All <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {ongoingList.slice(0, 10).map((anime) => (
              <AnimeCard key={anime.animeId} anime={anime} />
            ))}
          </div>
        </section>
      )}

      {/* Completed Anime */}
      {completedList.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-blue to-brand-lime bg-clip-text text-transparent">
              Completed Anime
            </h2>
            <Link href="/completed" className="text-sm text-muted-foreground hover:text-brand-lime transition-colors flex items-center gap-1 group">
              View All <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {completedList.slice(0, 10).map((anime) => (
              <AnimeCard key={anime.animeId} anime={anime} />
            ))}
          </div>
        </section>
      )}

      {/* Movies */}
      {movieList.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-blue to-brand-lime bg-clip-text text-transparent">
              Latest Movies
            </h2>
            <Link href="/movies" className="text-sm text-muted-foreground hover:text-brand-lime transition-colors flex items-center gap-1 group">
              View All <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {movieList.slice(0, 5).map((anime) => (
              <AnimeCard key={anime.animeId} anime={anime} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}