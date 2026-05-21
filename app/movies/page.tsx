import { fetchAPI } from "@/lib/api";
import { AnimeCard } from "@/types";
import { PagedAnimeGrid } from "@/components/features/PagedAnimeGrid";

interface MoviesResponse {
    data: {
        list: AnimeCard[];
    };
    pagination: any;
}

export const metadata = {
    title: "Anime Movies - Eternime",
};

export default async function MoviesPage() {
    let animeList: AnimeCard[] = [];
    try {
        const res = await fetchAPI<{ data: { animeList: AnimeCard[] } }>("/anime?status=movie");
        animeList = res.data.animeList || [];
    } catch (e) {
        console.error(e);
    }

    return (
        <div className="container mx-auto px-6 pb-20 pt-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-blue to-brand-lime bg-clip-text text-transparent mb-8">
                Anime Movies
            </h1>

            <PagedAnimeGrid initialItems={animeList} endpoint="/anime?status=movie" />
        </div>
    );
}
