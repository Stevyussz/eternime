import { useState, useEffect } from 'react';

export interface ReminderItem {
    animeId: string;
    title: string;
    targetDate: string; // ISO String
}

export function useReminders() {
    const [reminders, setReminders] = useState<ReminderItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("my-reminders");
        if (stored) {
            setReminders(JSON.parse(stored));
        }
        setIsLoaded(true);

        // Request notification permission on load
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    const saveReminders = (newReminders: ReminderItem[]) => {
        setReminders(newReminders);
        localStorage.setItem("my-reminders", JSON.stringify(newReminders));
    };

    const addReminder = (item: ReminderItem) => {
        if (!reminders.some(r => r.animeId === item.animeId)) {
            const updated = [...reminders, item];
            saveReminders(updated);
            // Trigger immediate test notification to confirm perms
            if ("Notification" in window && Notification.permission === "granted") {
                new Notification(`Reminder Set: ${item.title}`, {
                    body: "We'll notify you when the new episode is out!",
                    icon: "/icon.png"
                });
            }
        }
    };

    const removeReminder = (animeId: string) => {
        const updated = reminders.filter(r => r.animeId !== animeId);
        saveReminders(updated);
    };

    const isReminded = (animeId: string) => {
        return reminders.some(r => r.animeId === animeId);
    };

    const checkReminders = () => {
        if (!isLoaded) return;
        const now = new Date();
        const updatedReminders = reminders.filter(r => {
            const target = new Date(r.targetDate);
            // If passed or within 10 mins
            if (target <= now) {
                if ("Notification" in window && Notification.permission === "granted") {
                    new Notification(`New Episode Available!`, {
                        body: `${r.title} might have a new episode out now!`,
                        icon: "/icon.png"
                    });
                }
                return false; // Remove from reminders after notifying
            }
            return true;
        });

        if (updatedReminders.length !== reminders.length) {
            saveReminders(updatedReminders);
        }
    };

    return { reminders, addReminder, removeReminder, isReminded, isLoaded, checkReminders };
}
