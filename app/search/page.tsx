import { fetchAPI } from "@/lib/api";
import { AnimeCard as AnimeCardType } from "@/types";
import { AdvancedSearchResults } from "@/components/features/AdvancedSearchResults";

interface SearchResponse {
    data: {
        animeList: AnimeCardType[];
    };
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q: string }>;
}) {
    const { q } = await searchParams;

    if (!q) return <div className="p-20 text-center">Please enter a search term</div>;

    let results: AnimeCardType[] = [];
    try {
        const res = await fetchAPI<SearchResponse>(`/search?q=${encodeURIComponent(q)}`);
        results = res.data.animeList;
    } catch (error) {
        console.error(error);
    }

    return (
        <div className="container mx-auto px-6 pb-20 pt-10">
            <h1 className="text-3xl font-bold mb-8">
                Search Results for <span className="text-brand-lime">"{q}"</span>
            </h1>

            {results.length === 0 ? (
                <div className="text-center text-muted-foreground py-20">No anime found matching your query.</div>
            ) : (
                <AdvancedSearchResults initialResults={results} />
            )}
        </div>
    );
}
