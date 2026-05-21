import { fetchFromProvider } from "@/lib/smartFetch";
import { PROVIDER_ENDPOINTS } from "@/lib/providerConfig";
import type { AnimeCard } from "@/types";
import { PagedAnimeGrid } from "@/components/features/PagedAnimeGrid";

export const metadata = {
  title: "Ongoing Anime",
  description: "Daftar anime yang sedang tayang di Eternime.",
};

export default async function OngoingPage() {
  let animeList: AnimeCard[] = [];

  try {
    const res = await fetchFromProvider<{ data: { animeList: AnimeCard[] } }>(
      PROVIDER_ENDPOINTS.kuramanime.ongoing(1),
      { revalidate: 600 }
    );
    animeList = res.data.animeList || [];
  } catch (e) {
    console.error("[OngoingPage] Error:", e);
  }

  return (
    <div className="container mx-auto px-6 pb-20 pt-10">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-blue to-brand-lime bg-clip-text text-transparent mb-8">
        Ongoing Anime
      </h1>
      <PagedAnimeGrid
        initialItems={animeList}
        endpoint={PROVIDER_ENDPOINTS.kuramanime.ongoing(1)}
      />
    </div>
  );
}
