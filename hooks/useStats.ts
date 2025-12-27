"use client";

import { useHistory } from "@/hooks/useHistory";
import { useMemo } from "react";

export function useStats() {
    const { history } = useHistory();

    const stats = useMemo(() => {
        const totalEpisodes = history.length;
        const totalMinutes = totalEpisodes * 24;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        let level = "Newbie";
        let nextLevel = 10;
        let progress = (totalEpisodes / 10) * 100;

        if (totalEpisodes >= 10) {
            level = "Anime Watcher";
            nextLevel = 50;
            progress = ((totalEpisodes - 10) / 40) * 100;
        }
        if (totalEpisodes >= 50) {
            level = "Otaku";
            nextLevel = 100;
            progress = ((totalEpisodes - 50) / 50) * 100;
        }
        if (totalEpisodes >= 100) {
            level = "Weeb Lord";
            nextLevel = 500;
            progress = 100;
        }

        return {
            totalEpisodes,
            timeWatched: `${hours}h ${minutes}m`,
            level,
            progress: Math.min(progress, 100),
            nextLevel,
        };
    }, [history]);

    return stats;
}
