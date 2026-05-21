import { smartFetch } from "@/lib/smartFetch";
import { PROVIDER_ENDPOINTS } from "@/lib/providerConfig";
import { PagedAnimeGrid } from "@/components/features/PagedAnimeGrid";
import { toAnimeCard, normalizeList } from "@/lib/normalize";

export const metadata = {
  title: "Ongoing Anime",
  description: "Daftar anime yang sedang tayang di Eternime.",
};

export default async function OngoingPage() {
  let animeList: any[] = [];
  let endpointStr = PROVIDER_ENDPOINTS.otakudesu.ongoing(1);

  try {
    const res = await smartFetch(
      (p) => PROVIDER_ENDPOINTS[p].ongoing(1),
      normalizeList,
      { revalidate: 600 }
    );
    animeList = res.data.items.map(toAnimeCard);
    endpointStr = PROVIDER_ENDPOINTS[res.activeProvider].ongoing(1);
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
        endpoint={endpointStr}
      />
    </div>
  );
}
