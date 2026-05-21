import { fetchFromProvider } from "@/lib/smartFetch";
import { PROVIDER_ENDPOINTS } from "@/lib/providerConfig";
import type { AnimeDetail } from "@/types";
import { AnimeHeader } from "@/components/features/AnimeHeader";
import { EpisodesList } from "@/components/features/EpisodesList";
import type { Metadata } from "next";
import { getNextReleaseDate } from "@/lib/scheduleHelper";
import { SmartRecommendations } from "@/components/features/SmartRecommendations";

interface ScheduledAnime {
    title: string;
    animeId: string;
    animeSlug: string;
    day: string;
    releaseTime: string;
}

interface ScheduleResponse {
    data: {
        animeList: ScheduledAnime[];
    };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
    const { slug } = await params;
    const [animeId, animeSlug] = slug;
    try {
        const res = await fetchFromProvider<{ data: { details: any } }>(
            PROVIDER_ENDPOINTS.kuramanime.anime(animeId, animeSlug),
            { revalidate: 600 }
        );
        const anime = res.data.details;
        const synopsisList = typeof anime.synopsis === 'string'
            ? [anime.synopsis]
            : anime.synopsis?.paragraphList || [];
        return {
            title: `${anime.title}`,
            description: synopsisList.join(" ").slice(0, 160) || "Watch anime on Eternime",
            openGraph: { images: [anime.poster] },
        };
    } catch {
        return { title: "Anime Not Found" };
    }
}

export default async function AnimeDetailPage({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;
    const [animeId, animeSlug] = slug;

    const [animeRes, scheduleRes] = await Promise.allSettled([
        fetchFromProvider<{ data: { details: any } }>(
            PROVIDER_ENDPOINTS.kuramanime.anime(animeId, animeSlug),
            { revalidate: 600 }
        ),
        fetchFromProvider<ScheduleResponse>(
            PROVIDER_ENDPOINTS.kuramanime.schedule,
            { revalidate: 3600 }
        ),
    ]);

    let anime: AnimeDetail & { animeId: string } | null = null;
    let nextEpisodeDate: Date | null = null;

    if (animeRes.status === "fulfilled") {
        const details = animeRes.value.data.details;

        // Generate episodes from range if list is missing (Kuramanime logic)
        let episodeList: any[] = details.episodeList || [];
        if (details.episode && details.episode.last) {
            const first = details.episode.first || 1;
            const last = details.episode.last;
            const generated = [];
            for (let i = last; i >= first; i--) {
                generated.push({
                    title: `Episode ${i}`,
                    episodeId: i.toString(),
                    animeId: animeId,
                    animeSlug: animeSlug
                });
            }
            episodeList = generated;
        }

        // Flatten complex objects to strings for UI compatibility
        const flattenProperty = (prop: any) => prop?.title || prop || "Unknown";

        anime = {
            ...details,
            animeId: `${animeId}/${animeSlug}`,
            synopsis: { paragraphList: typeof details.synopsis === 'string' ? [details.synopsis] : details.synopsis?.paragraphList || [] },
            episodeList: episodeList,
            // Map rich objects to strings
            type: flattenProperty(details.type),
            status: flattenProperty(details.status),
            season: flattenProperty(details.season),
            quality: flattenProperty(details.quality),
            country: flattenProperty(details.country),
            source: flattenProperty(details.source),
            studios: details.studioList?.map((s: any) => s.title).join(", ") || details.studios || "Unknown",
            // genreList is used as array in Header, so keep it as is (Array of {title, id})
        };
    } else {
        return <div className="text-center p-20 text-red-400">Error loading anime: {animeId}</div>;
    }

    if (scheduleRes.status === "fulfilled" && String(anime?.status || "").toLowerCase() === "ongoing") {
        const scheduleList = scheduleRes.value.data.animeList || [];
        // Find which day this anime releases
        const found = scheduleList.find(s => s.animeId === animeId);

        if (found && found.day) {
            nextEpisodeDate = getNextReleaseDate(found.day);
        }
    }

    // Extract first genre ID for recommendations
    const firstGenreId = anime?.genreList?.[0]?.genreId || "";

    if (!anime) return null; // Should be handled by error return above, but satisfies TS

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