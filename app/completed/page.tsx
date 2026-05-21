import { fetchFromProvider, smartFetch } from "@/lib/smartFetch";
import { PROVIDER_ENDPOINTS, ProviderName } from "@/lib/providerConfig";
import { PagedAnimeGrid } from "@/components/features/PagedAnimeGrid";
import { toAnimeCard, normalizeList } from "@/lib/normalize";
import { AnimeCard } from "@/types";

export const metadata = {
    title: "Completed Anime",
    description: "Daftar anime yang telah selesai tayang di Eternime.",
};

export default async function CompletedPage() {
    let animeList: AnimeCard[] = [];
    let activeProvider: ProviderName = "otakudesu";

    try {
        const res = await smartFetch(
            (p) => PROVIDER_ENDPOINTS[p].completed(1),
            normalizeList,
            { revalidate: 600 }
        );
        animeList = res.data.items.map(toAnimeCard);
        activeProvider = res.activeProvider as ProviderName;
    } catch (e) {
        console.error("[CompletedPage] Error:", e);
    }

    async function fetchNextPage(page: number): Promise<AnimeCard[]> {
        "use server";
        try {
            const endpoint = PROVIDER_ENDPOINTS[activeProvider].completed(page);
            const raw = await fetchFromProvider(endpoint, { revalidate: 600 });
            return normalizeList(raw, activeProvider).items.map(toAnimeCard);
        } catch (e) {
            console.error("[CompletedPage] loadMore error:", e);
            return [];
        }
    }

    return (
        <div className="container mx-auto px-6 pb-20 pt-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-blue to-brand-lime bg-clip-text text-transparent mb-8">
                Completed Anime
            </h1>

            <PagedAnimeGrid initialItems={animeList} fetchNextPage={fetchNextPage} />
        </div>
    );
}
