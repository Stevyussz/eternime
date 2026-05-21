import { fetchFromProvider } from "@/lib/smartFetch";
import { PROVIDER_ENDPOINTS } from "@/lib/providerConfig";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import { CalendarDays } from "lucide-react";

interface ScheduledAnime {
    title: string;
    animeId: string;
    animeSlug: string;
    day: string;
    releaseTime: string;
}

export default async function SchedulePage() {
    let scheduleList: { title: string; animeList: ScheduledAnime[] }[] = [];

    try {
        const res = await fetchFromProvider<{ data: { animeList: ScheduledAnime[] } }>(
            PROVIDER_ENDPOINTS.kuramanime.schedule,
            { revalidate: 3600 }
        );
        const flatList = res.data.animeList || [];

        // Group by day using a Map to preserve order if possible, or predefined order
        const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Random"];
        const groups: Record<string, ScheduledAnime[]> = {};

        flatList.forEach(anime => {
            const day = anime.day || "Random";
            if (!groups[day]) groups[day] = [];
            groups[day].push(anime);
        });

        // Convert to array sorted by dayOrder
        scheduleList = dayOrder
            .filter(day => groups[day] && groups[day].length > 0)
            .map(day => ({
                title: day,
                animeList: groups[day]
            }));

    } catch (e) {
        console.error(e);
    }

    return (
        <div className="container mx-auto px-6 pb-20 pt-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-blue to-brand-lime bg-clip-text text-transparent mb-8 flex items-center gap-3">
                <CalendarDays className="w-8 h-8 text-brand-lime" />
                Release Schedule
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scheduleList.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="bg-brand-lime/10 p-6 rounded-full">
                            <CalendarDays className="w-12 h-12 text-brand-lime opacity-50" />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground">Schedule Not Available</h2>
                        <p className="text-muted-foreground max-w-md">
                            Unable to load schedule at this time.
                        </p>
                        <Link
                            href="/"
                            className="mt-4 px-6 py-2 bg-brand-lime/10 hover:bg-brand-lime/20 text-brand-lime border border-brand-lime/20 rounded-full transition-all text-sm font-medium"
                        >
                            Back to Home
                        </Link>
                    </div>
                ) : (
                    scheduleList.map((day) => (
                        <GlassCard key={day.title} className="p-6 h-full border-t-4 border-t-brand-lime">
                            <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2 flex justify-between items-center">
                                {day.title}
                                <span className="text-xs font-normal text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full">{day.animeList.length} Anime</span>
                            </h2>
                            <ul className="space-y-3">
                                {day.animeList.map((anime) => (
                                    <li key={anime.animeId}>
                                        <Link
                                            href={`/anime/${anime.animeId}/${anime.animeSlug}`}
                                            className="group flex justify-between items-start gap-2"
                                        >
                                            <span className="text-sm text-muted-foreground group-hover:text-brand-lime transition-colors block py-0.5 group-hover:translate-x-1 transition-transform line-clamp-1">
                                                {anime.title}
                                            </span>
                                            {anime.releaseTime && (
                                                <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-gray-500 whitespace-nowrap">
                                                    {anime.releaseTime}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </GlassCard>
                    ))
                )}
            </div>
        </div>
    );
}
