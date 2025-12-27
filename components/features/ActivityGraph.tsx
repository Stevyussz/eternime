"use client";

import { useActivityLog } from "@/hooks/useActivityLog";
import { motion } from "framer-motion";

export function ActivityGraph() {
    const { activityLog } = useActivityLog();

    // Generate last 365 days (52 weeks)
    const generateDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 364; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            dates.push(d.toISOString().split("T")[0]);
        }
        return dates;
    };

    const dates = generateDates();

    const getColor = (count: number) => {
        if (count === 0) return "bg-white/5";
        if (count <= 2) return "bg-brand-lime/30";
        if (count <= 4) return "bg-brand-lime/60";
        return "bg-brand-lime shadow-[0_0_8px_rgba(132,204,22,0.8)]";
    };

    return (
        <div className="p-6 bg-glass border border-white/5 rounded-2xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                Watch Activity <span className="text-xs font-normal text-muted-foreground">(Last 365 Days)</span>
            </h3>

            <div className="flex flex-wrap gap-1 max-w-full overflow-x-auto pb-2">
                {/* Simplified Grid: Just rows of boxes for now, flexible layout */}
                {dates.map((date) => {
                    const count = activityLog[date] || 0;
                    return (
                        <div
                            key={date}
                            title={`${date}: ${count} episodes`}
                            className={`w-3 h-3 rounded-sm ${getColor(count)} transition-all hover:scale-125 hover:z-10`}
                        />
                    );
                })}
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
                <span>Less</span>
                <div className="w-3 h-3 rounded-sm bg-white/5" />
                <div className="w-3 h-3 rounded-sm bg-brand-lime/30" />
                <div className="w-3 h-3 rounded-sm bg-brand-lime/60" />
                <div className="w-3 h-3 rounded-sm bg-brand-lime" />
                <span>More</span>
            </div>
        </div>
    );
}
