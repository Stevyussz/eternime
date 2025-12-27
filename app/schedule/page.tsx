import { fetchAPI } from "@/lib/api";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import { CalendarDays } from "lucide-react";

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

export const metadata = {
    title: "Release Schedule - Eternime",
};

export default async function SchedulePage() {
    let scheduleList: ScheduleItem[] = [];
    try {
        const res = await fetchAPI<ScheduleResponse>("/schedule");
        scheduleList = res.data.scheduleList;
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
                {scheduleList.map((day) => (
                    <GlassCard key={day.title} className="p-6 h-full border-t-4 border-t-brand-lime">
                        <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                            {day.title}
                        </h2>
                        <ul className="space-y-3">
                            {day.animeList.map((anime) => (
                                <li key={anime.animeId}>
                                    <Link
                                        href={`/anime/${anime.animeId}`}
                                        className="text-sm text-muted-foreground hover:text-brand-lime transition-colors block py-1 hover:translate-x-1 transition-transform"
                                    >
                                        {anime.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
