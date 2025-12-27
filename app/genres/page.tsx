import { fetchAPI } from "@/lib/api";
import { Genre, GenreListResponse } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";

export const metadata = {
    title: "Genres - Eternime",
    description: "Explore anime by genre",
};

export default async function GenresPage() {
    let genres: Genre[] = [];
    try {
        const res = await fetchAPI<GenreListResponse>("/genre");
        genres = res.data.genreList;
    } catch (e) {
        console.error("Failed to fetch genres", e);
    }

    return (
        <div className="container mx-auto px-6 py-10 pb-20">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-blue to-brand-lime bg-clip-text text-transparent mb-8">
                Detailed Genres
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {genres.map((genre) => (
                    <Link href={`/genres/${genre.genreId}`} key={genre.genreId}>
                        <GlassCard className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group h-full">
                            <div className="flex items-center gap-3">
                                <Tag className="w-4 h-4 text-brand-lime" />
                                <span className="font-medium text-sm text-foreground group-hover:text-brand-lime transition-colors">
                                    {genre.title}
                                </span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                        </GlassCard>
                    </Link>
                ))}
            </div>
        </div>
    );
}
