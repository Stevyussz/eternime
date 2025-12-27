"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";

interface ScheduleItem {
    title: string;
    animeList: {
        title: string;
        animeId: string;
        otakudesuUrl: string;
    }[];
}

export function HomeScheduleWidget() {
    const [todaySchedule, setTodaySchedule] = useState<ScheduleItem | null>(null);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const res = await fetchAPI<{ data: { scheduleList: ScheduleItem[] } }>("/schedule");
                const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                const today = days[new Date().getDay()];

                // Find matching day (ignoring caseish)
                const schedule = res.data.scheduleList.find(s => s.title.toLowerCase().includes(today.toLowerCase()) ||
                    (today === "Sunday" && s.title.toLowerCase().includes("minggu")) ||
                    (today === "Monday" && s.title.toLowerCase().includes("senin")) ||
                    (today === "Tuesday" && s.title.toLowerCase().includes("selasa")) ||
                    (today === "Wednesday" && s.title.toLowerCase().includes("rabu")) ||
                    (today === "Thursday" && s.title.toLowerCase().includes("kamis")) ||
                    (today === "Friday" && s.title.toLowerCase().includes("jumat")) ||
                    (today === "Saturday" && s.title.toLowerCase().includes("sabtu"))
                );

                if (schedule) setTodaySchedule(schedule);
            } catch (e) {
                console.error("Failed to fetch schedule", e);
            }
        };
        fetchSchedule();
    }, []);

    if (!todaySchedule) return null;

    return (
        <div className="mb-6 md:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
                <h2 className="text-base md:text-2xl font-bold flex items-center gap-2 md:gap-3">
                    <CalendarDays className="w-5 h-5 md:w-6 md:h-6 text-brand-blue shrink-0" />
                    <span className="truncate">New Releases Today</span>
                    <span className="text-xs md:text-sm font-normal text-muted-foreground ml-1 hidden md:inline">({todaySchedule.title})</span>
                    <span className="text-xs md:text-sm font-normal text-muted-foreground ml-1 md:hidden">({todaySchedule.title.split(',')[0]})</span>
                </h2>
                <Link href="/schedule" className="text-xs md:text-sm text-brand-lime hover:underline flex items-center self-end sm:self-auto">
                    Full Schedule <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {todaySchedule.animeList.slice(0, 5).map(anime => (
                    <Link key={anime.animeId} href={`/anime/${anime.animeId}`}>
                        <div className="group relative bg-secondary/20 hover:bg-secondary/40 border border-white/5 rounded-lg p-4 transition-all hover:-translate-y-1">
                            <h4 className="font-medium text-sm truncate group-hover:text-brand-blue transition-colors">
                                {anime.title}
                            </h4>
                            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Airing Today
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
