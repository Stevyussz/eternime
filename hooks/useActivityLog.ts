"use client";

import { useState, useEffect, useCallback } from "react";

const LOG_KEY = "eternime_activity_log";

export interface ActivityLog {
    [date: string]: number; // "YYYY-MM-DD": count
}

export function useActivityLog() {
    const [activityLog, setActivityLog] = useState<ActivityLog>({});

    useEffect(() => {
        const stored = localStorage.getItem(LOG_KEY);
        if (stored) {
            try {
                setActivityLog(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse activity log", e);
            }
        }
    }, []);

    const logActivity = useCallback(() => {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        setActivityLog((prev) => {
            const currentCount = prev[today] || 0;
            const newLog = { ...prev, [today]: currentCount + 1 };
            localStorage.setItem(LOG_KEY, JSON.stringify(newLog));
            return newLog;
        });
    }, []);

    return { activityLog, logActivity };
}
