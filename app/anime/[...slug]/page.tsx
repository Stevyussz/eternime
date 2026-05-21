import { smartFetch, fetchFromProvider } from "@/lib/smartFetch";
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
    try {
        let anime: any = null;
        if (slug.length === 2) {
             const res = await fetchFromProvider<{ data: { details: any } }>(
                 PROVIDER_ENDPOINTS.kuramanime.anime(slug[0], slug[1])
             );
             anime = res?.data?.details;
        } else if (slug.length === 1) {
             const res = await smartFetch(
                 (p) => PROVIDER_ENDPOINTS[p].anime(slug[0]),
                 (raw: any) => raw?.data?.details,
                 { providerOrder: ["otakudesu", "samehadaku"] }
             );
             anime = res.data;
        }

        const synopsisList = typeof anime?.synopsis === 'string'
            ? [anime.synopsis]
            : anime?.synopsis?.paragraphList || [];
        return {
            title: `${anime?.title || "Anime"}`,
            description: synopsisList.join(" ").slice(0, 160) || "Watch anime on Eternime",
            openGraph: anime?.poster ? { images: [anime.poster] } : undefined,
        };
    } catch {
        return { title: "Anime Not Found" };
    }
}

export default async function AnimeDetailPage({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;

    let animeRes: any = null;
    let animeData: any = null;
    let usedProvider = "";
    let animeIdToPass = slug[0];

    try {
        if (slug.length === 2) {
            animeIdToPass = `${slug[0]}/${slug[1]}`;
            const res = await fetchFromProvider<{ data: { details: any } }>(
                PROVIDER_ENDPOINTS.kuramanime.anime(slug[0], slug[1]),
                { revalidate: 600 }
            );
            animeData = res?.data?.details;
            usedProvider = "kuramanime";
        } else if (slug.length === 1) {
            animeIdToPass = slug[0];
            const res = await smartFetch(
                (p) => PROVIDER_ENDPOINTS[p].anime(slug[0]),
                (raw: any) => raw?.data?.details,
                { providerOrder: ["otakudesu", "samehadaku"], revalidate: 600 }
            );
            animeData = res.data;
            usedProvider = res.activeProvider;
        }
    } catch (e) {
        return <div className="text-center p-20 text-red-400">Error loading anime: {slug.join("/")}</div>;
    }

    const scheduleRes = await fetchFromProvider<ScheduleResponse>(
        PROVIDER_ENDPOINTS.kuramanime.schedule,
        { revalidate: 3600 }
    ).catch(() => null);

    let anime: AnimeDetail & { animeId: string } | null = null;
    let nextEpisodeDate: Date | null = null;

    if (animeData) {
        const details = animeData;

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
                    animeId: slug[0],
                    animeSlug: slug[1] || ""
                });
            }
            episodeList = generated;
        }

        // Flatten complex objects to strings for UI compatibility
        const flattenProperty = (prop: any) => prop?.title || prop || "Unknown";

        anime = {
            ...details,
            animeId: animeIdToPass,
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
        return <div className="text-center p-20 text-red-400">Error loading anime details.</div>;
    }

    if (scheduleRes && String(anime?.status || "").toLowerCase() === "ongoing") {
        const scheduleList = scheduleRes.data?.animeList || [];
        // Find which day this anime releases
        const found = scheduleList.find(s => s.animeId === slug[0]);

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