import { useEffect, useState } from "react";


export function useWatchShortcuts(
    toggleTheater: () => void,
    onNext: () => void,
    onPrev: () => void,
) {
    const [showShortcuts, setShowShortcuts] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            switch (e.key.toLowerCase()) {
                case 't':
                    e.preventDefault();
                    toggleTheater();
                    try { /* toast("Theater Mode Toggled"); */ } catch (e) { }
                    break;
                case 'n':
                    e.preventDefault();
                    onNext();
                    try { /* toast("Next Episode"); */ } catch (e) { }
                    break;
                case 'p':
                    e.preventDefault();
                    onPrev();
                    try { /* toast("Previous Episode"); */ } catch (e) { }
                    break;
                case '?':
                    e.preventDefault();
                    setShowShortcuts(prev => !prev);
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleTheater, onNext, onPrev]);

    return { showShortcuts, setShowShortcuts };
}
