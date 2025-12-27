import { fetchAPI } from "@/lib/api";
import { HomeResponse } from "@/types";
import { HeroCarousel } from "@/components/features/HeroCarousel";

import { HomeScheduleWidget } from "@/components/features/HomeScheduleWidget"; // Import new widget
import { DailyOmikuji } from "@/components/features/DailyOmikuji";
import Link from "next/link";
import { ContinueWatching } from "@/components/features/ContinueWatching";
import { AnimeCard } from "@/components/ui/AnimeCard"; // Premium Component
import { ArrowRight } from "lucide-react";

async function getHomeData() {
  return fetchAPI<HomeResponse>("/home");
}

export default async function Home() {
  const response = await getHomeData();
  const ongoingList = response.data?.ongoing?.animeList || [];
  const completedList = response.data?.completed?.animeList || [];

  // Top 5 for Carousel
  const carouselData = ongoingList.slice(0, 5).map(anime => ({
    ...anime,
    score: anime.score || "8.5",
    synopsis: "Watch the latest episode now!",
  }));

  // Simple Genre List for Home
  const genres = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Isekai", "Magic", "Mecha", "Music", "Mystery", "Psychological", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"];

  return (
    <div className="container mx-auto px-6 pb-20">
      {/* Hero Carousel */}
      <HeroCarousel animeList={carouselData} />

      <div className="mt-8 mb-12 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <div className="lg:col-span-3">
          <HomeScheduleWidget />
        </div>
        <div className="lg:col-span-1 lg:pt-12 order-last lg:order-none">
          <DailyOmikuji />
        </div>
      </div>

      <ContinueWatching />

      {/* Genres Horizontal Scroll */}
      <section className="mb-12 mt-12">
        <h2 className="text-lg font-bold text-muted-foreground mb-4 px-1">Top Genres</h2>
        <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar snap-x">
          {genres.map(genre => (
            <Link href={`/genres/${genre.toLowerCase()}`} key={genre} className="snap-start shrink-0">
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

      {/* Ongoing Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-blue to-brand-lime bg-clip-text text-transparent">
            Ongoing Anime
          </h2>
          <Link href="/ongoing" className="text-sm text-muted-foreground hover:text-brand-lime transition-colors flex items-center gap-1 group">
            View All <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {ongoingList.map((anime) => (
            <AnimeCard key={anime.animeId} anime={anime} />
          ))}
        </div>
      </section>

      {/* Completed Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-blue to-brand-lime bg-clip-text text-transparent">Completed Anime</h2>
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
    </div>
  );
}