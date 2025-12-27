import { useState, useEffect } from "react";
import { useActivityLog } from "./useActivityLog";

export interface HistoryItem {
    episodeId: string;
    title: string;
    poster?: string;
    lastWatchedAt: number;
    watchedDuration?: number; // Seconds
    totalDuration?: number; // Seconds
}

const HISTORY_KEY = "eternime_history";

export function useHistory() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [hasMounted, setHasMounted] = useState(false);
    const { logActivity } = useActivityLog();

    useEffect(() => {
        setHasMounted(true);
        const stored = localStorage.getItem(HISTORY_KEY);
        if (stored) {
            try {
                setHistory(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
    }, []);

    const addToHistory = (item: Omit<HistoryItem, "lastWatchedAt">) => {
        const newItem = { ...item, lastWatchedAt: Date.now() };

        // Remove if exists to re-add at top with updated data
        const filtered = history.filter((h) => h.episodeId !== item.episodeId);

        // If updating an existing item, we might want to preserve the poster if the new one is missing
        const existing = history.find((h) => h.episodeId === item.episodeId);
        if (existing && !newItem.poster && existing.poster) {
            newItem.poster = existing.poster;
        }

        const updated = [newItem, ...filtered].slice(0, 10); // Keep last 10

        setHistory(updated);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));

        // Log daily activity (Debounce this if calling frequently, but for now it's fine as WatchHistoryHandler handles the interval)
        // We only want to log 'activity' (contribution graph) once per distinct episode session or day, 
        // but our simple logActivity just increments count. 
        // To avoid spamming the graph when just updating time, we could check if we already logged this episode today?
        // OR simpler: Only logActivity if we are NOT just updating time (e.g. initial load). 
        // But telling that apart is hard here without extra args.
        // Let's rely on the caller to control frequency or accept that "watching more = more activity points".
        // Actually, excessive updates will make the graph very green. 
        // Let's blindly log for now, optimization later.
        logActivity();
    };

    const removeFromHistory = (episodeId: string) => {
        const updated = history.filter((h) => h.episodeId !== episodeId);
        setHistory(updated);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    };

    return { history, addToHistory, removeFromHistory, hasMounted };
}
