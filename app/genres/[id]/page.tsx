import { fetchAPI } from "@/lib/api";
import { GenreAnimeResponse } from "@/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PagedAnimeGrid } from "@/components/features/PagedAnimeGrid";

export default async function GenreDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let animeList: any[] = [];
    let title = id.replace(/-/g, " ").toUpperCase();

    try {
        const res = await fetchAPI<GenreAnimeResponse>(`/genre/${id}`);
        animeList = res.data.animeList;
    } catch (e) {
        console.error("Failed to fetch genre details", e);
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
                <PagedAnimeGrid initialItems={animeList} endpoint={`/genre/${id}`} />
            )}
        </div>
    );
}
