"use client";

import { useReminders } from "@/hooks/useReminders";
import { Bell, BellOff } from "lucide-react";

interface ReminderButtonProps {
    animeId: string;
    title: string;
    targetDate: Date;
}

export function ReminderButton({ animeId, title, targetDate }: ReminderButtonProps) {
    const { addReminder, removeReminder, isReminded, isLoaded } = useReminders();
    const active = isReminded(animeId);

    if (!isLoaded) return <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />;

    const handleClick = () => {
        if (active) {
            removeReminder(animeId);
        } else {
            addReminder({
                animeId,
                title,
                targetDate: targetDate.toISOString()
            });
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`group flex items-center justify-center p-2 rounded-full transition-all duration-300 ${active
                ? "bg-brand-lime text-black hover:bg-brand-lime/80 shadow-[0_0_10px_rgba(132,204,22,0.4)]"
                : "bg-secondary/30 text-muted-foreground hover:text-brand-lime hover:bg-secondary/50 border border-white/10"
                }`}
            title={active ? "Remove Reminder" : "Notify me when released"}
        >
            {active ? (
                <BellOff className="w-5 h-5 fill-current" />
            ) : (
                <Bell className="w-5 h-5" />
            )}
        </button>
    );
}
