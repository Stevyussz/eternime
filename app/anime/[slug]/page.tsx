import { fetchAPI } from "@/lib/api";
import { AnimeDetail } from "@/types";
import { AnimeHeader } from "@/components/features/AnimeHeader";
import { EpisodesList } from "@/components/features/EpisodesList";
import { Metadata } from "next";
import { getNextReleaseDate } from "@/lib/scheduleHelper";
import { SmartRecommendations } from "@/components/features/SmartRecommendations";

interface ScheduleItem {
    title: string;
    animeList: {
        title: string;
        animeId: string;
        otakudesuUrl: string;
    }[];
}

interface ScheduleResponse {
    data: {
        scheduleList: ScheduleItem[];
    };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    try {
        const res = await fetchAPI<{ data: { details: AnimeDetail } }>(`/anime/${slug}`);
        const anime = res.data.details;
        return {
            title: `${anime.title} - Eternime`,
            description: anime.synopsis?.paragraphList?.join(" ").slice(0, 160) || "Watch anime on Eternime",
            openGraph: {
                images: [anime.poster],
            },
        };
    } catch (error) {
        return { title: "Anime Not Found - Eternime" };
    }
}

export default async function AnimeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const [animeRes, scheduleRes] = await Promise.allSettled([
        fetchAPI<{ data: { details: AnimeDetail } }>(`/anime/${slug}`),
        fetchAPI<ScheduleResponse>("/schedule")
    ]);

    let anime: AnimeDetail & { animeId: string } | null = null;
    let nextEpisodeDate: Date | null = null;

    if (animeRes.status === "fulfilled") {
        anime = { ...animeRes.value.data.details, animeId: slug };
    } else {
        return <div className="text-center p-20 text-red-400">Error loading anime: {slug}</div>;
    }

    if (scheduleRes.status === "fulfilled" && anime?.status.toLowerCase() === "ongoing") {
        const scheduleList = scheduleRes.value.data.scheduleList;
        // Find which day this anime releases
        const foundDay = scheduleList.find(day =>
            day.animeList.some(s => s.animeId === slug)
        );

        if (foundDay) {
            nextEpisodeDate = getNextReleaseDate(foundDay.title);
        }
    }

    // Extract first genre ID for recommendations
    const firstGenreId = anime?.genreList?.[0]?.genreId || "";

    return (
        <div className="min-h-screen">
            {/* Hero & Metadata Header */}
            <AnimeHeader anime={anime} nextEpisodeDate={nextEpisodeDate} />

            {/* Episodes List with Search & Sort */}
            <EpisodesList episodes={anime.episodeList} />

            {/* Smart Recommendations */}
            {firstGenreId && (
                <SmartRecommendations
                    currentGenreId={firstGenreId}
                    currentAnimeId={anime.animeId}
                />
            )}
        </div>
    );
}