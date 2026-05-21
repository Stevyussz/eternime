"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";

interface ScheduledAnime {
    title: string;
    animeId: string;
    animeSlug: string;
    day: string; // "Monday", etc.
    releaseTime: string;
}

export function HomeScheduleWidget() {
    const [todayAnime, setTodayAnime] = useState<ScheduledAnime[]>([]);
    const [todayName, setTodayName] = useState("");

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                // Fetch flat list from backend
                const res = await fetchAPI<{ data: { animeList: ScheduledAnime[] } }>("/schedule");
                const list = res.data.animeList || [];

                const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                const today = days[new Date().getDay()]; // e.g. "Monday"
                setTodayName(today);

                // Filter for today's anime
                // Backend 'day' might be "Senin", "Monday", etc depending on parser.
                // Kuramanime likely returns Indonesian day names?
                // Parser `parseScheduledAnimeCard` uses text from site.
                // Let's match against English or Indonesian common names just in case.
                const dayMap: Record<string, string[]> = {
                    "Sunday": ["Sunday", "Minggu"],
                    "Monday": ["Monday", "Senin"],
                    "Tuesday": ["Tuesday", "Selasa"],
                    "Wednesday": ["Wednesday", "Rabu"],
                    "Thursday": ["Thursday", "Kamis"],
                    "Friday": ["Friday", "Jumat"],
                    "Saturday": ["Saturday", "Sabtu"]
                };

                const targetDays = dayMap[today] || [today];

                const filtered = list.filter(anime =>
                    anime.day && targetDays.some(d => anime.day.toLowerCase().includes(d.toLowerCase()))
                );

                setTodayAnime(filtered);
            } catch (e) {
                console.error("Failed to fetch schedule", e);
            }
        };
        fetchSchedule();
    }, []);

    if (todayAnime.length === 0) return null;

    return (
        <div className="mb-6 md:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
                <h2 className="text-base md:text-2xl font-bold flex items-center gap-2 md:gap-3">
                    <CalendarDays className="w-5 h-5 md:w-6 md:h-6 text-brand-blue shrink-0" />
                    <span className="truncate">New Releases Today</span>
                    <span className="text-xs md:text-sm font-normal text-muted-foreground ml-1 hidden md:inline">({todayName})</span>
                </h2>
                <Link href="/schedule" className="text-xs md:text-sm text-brand-lime hover:underline flex items-center self-end sm:self-auto">
                    Full Schedule <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {todayAnime.slice(0, 5).map(anime => (
                    <Link key={anime.animeId} href={`/anime/${anime.animeId}/${anime.animeSlug}`}>
                        <div className="group relative bg-secondary/20 hover:bg-secondary/40 border border-white/5 rounded-lg p-4 transition-all hover:-translate-y-1">
                            <h4 className="font-medium text-sm truncate group-hover:text-brand-blue transition-colors">
                                {anime.title}
                            </h4>
                            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                {anime.releaseTime || "Airing Today"}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
