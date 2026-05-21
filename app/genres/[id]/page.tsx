import { smartFetch, fetchFromProvider } from "@/lib/smartFetch";
import { PROVIDER_ENDPOINTS, ProviderName } from "@/lib/providerConfig";
import { normalizeList, toAnimeCard } from "@/lib/normalize";
import { AnimeCard } from "@/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PagedAnimeGrid } from "@/components/features/PagedAnimeGrid";

export default async function GenreDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let animeList: AnimeCard[] = [];
    let title = id.replace(/-/g, " ").toUpperCase();
    let activeProvider: ProviderName = "otakudesu";

    try {
        const res = await smartFetch(
            (p) => PROVIDER_ENDPOINTS[p].genre(id, 1),
            normalizeList,
            { revalidate: 3600 }
        );
        animeList = res.data.items.map(toAnimeCard);
        activeProvider = res.activeProvider as ProviderName;
    } catch (e) {
        console.error("Failed to fetch genre details", e);
    }

    async function fetchNextPage(page: number): Promise<AnimeCard[]> {
        "use server";
        try {
            const endpoint = PROVIDER_ENDPOINTS[activeProvider].genre(id, page);
            const raw = await fetchFromProvider(endpoint, { revalidate: 3600 });
            return normalizeList(raw, activeProvider).items.map(toAnimeCard);
        } catch (e) {
            console.error("[GenrePage] loadMore error:", e);
            return [];
        }
    }

    return (
        <div className="container mx-auto px-6 py-10 pb-20">
            <Link href="/genres" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> All Genres
            </Link>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-blue to-brand-lime bg-clip-text text-transparent mb-8">
                Genre: {title}
            </h1>

            {animeList.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">No anime found in this genre yet.</div>
            ) : (
                <PagedAnimeGrid initialItems={animeList} fetchNextPage={fetchNextPage} />
            )}
        </div>
    );
}
