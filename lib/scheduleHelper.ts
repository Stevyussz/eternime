
export function getNextReleaseDate(scheduleDay: string): Date | null {
    const daysMap: { [key: string]: number } = {
        'sunday': 0, 'minggu': 0,
        'monday': 1, 'senin': 1,
        'tuesday': 2, 'selasa': 2,
        'wednesday': 3, 'rabu': 3,
        'thursday': 4, 'kamis': 4,
        'friday': 5, 'jumat': 5,
        'saturday': 6, 'sabtu': 6
    };

    const targetDay = daysMap[scheduleDay.toLowerCase()];
    if (targetDay === undefined) return null;

    const now = new Date();
    const currentDay = now.getDay();

    let daysUntil = targetDay - currentDay;
    if (daysUntil <= 0) {
        daysUntil += 7; // Next week
    }

    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + daysUntil);
    // Set arbitrary release time (e.g., 10:00 AM) or keep it vague
    nextDate.setHours(20, 0, 0, 0); // Assume 8 PM release for estimation

    return nextDate;
}
