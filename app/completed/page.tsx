import { smartFetch } from "@/lib/smartFetch";
import { PROVIDER_ENDPOINTS } from "@/lib/providerConfig";
import { PagedAnimeGrid } from "@/components/features/PagedAnimeGrid";
import { toAnimeCard, normalizeList } from "@/lib/normalize";

export const metadata = {
    title: "Completed Anime",
    description: "Daftar anime yang telah selesai tayang di Eternime.",
};

export default async function CompletedPage() {
    let animeList: any[] = [];
    let endpointStr = PROVIDER_ENDPOINTS.otakudesu.completed(1);

    try {
        const res = await smartFetch(
            (p) => PROVIDER_ENDPOINTS[p].completed(1),
            normalizeList,
            { revalidate: 600 }
        );
        animeList = res.data.items.map(toAnimeCard);
        endpointStr = PROVIDER_ENDPOINTS[res.activeProvider].completed(1);
    } catch (e) {
        console.error("[CompletedPage] Error:", e);
    }

    return (
        <div className="container mx-auto px-6 pb-20 pt-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-blue to-brand-lime bg-clip-text text-transparent mb-8">
                Completed Anime
            </h1>

            <PagedAnimeGrid initialItems={animeList} endpoint={endpointStr} />
        </div>
    );
}
