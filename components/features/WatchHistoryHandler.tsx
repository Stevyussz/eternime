"use client";

import { useEffect } from "react";
import { useHistory } from "@/hooks/useHistory";

interface WatchHistoryHandlerProps {
    episodeId: string;
    title: string;
    poster?: string;
}

export function WatchHistoryHandler({ episodeId, title, poster }: WatchHistoryHandlerProps) {
    const { addToHistory } = useHistory();

    useEffect(() => {
        // Initial add or validation
        if (episodeId && title) {
            addToHistory({
                episodeId,
                title,
                poster,
                watchedDuration: 0,
                totalDuration: 24 * 60, // Assume 24 mins for anime as dummy total
            });
        }

        // Timer to track "approximate" watch time since we can't access iframe player events
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);

            addToHistory({
                episodeId,
                title,
                poster,
                watchedDuration: elapsedSeconds,
                totalDuration: 24 * 60,
            });
        }, 10000); // Update every 10 seconds

        return () => clearInterval(interval);
    }, [episodeId, title, poster]); // Re-run if episode changes

    return null;
}
