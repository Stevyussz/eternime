"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

interface CountdownProps {
    targetDate: Date;
}

export function Countdown({ targetDate }: CountdownProps) {
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +targetDate - +new Date();

            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return null;
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft) {
        return <div className="text-brand-lime font-bold">New Episode Released! 🚀</div>;
    }

    return (
        <div className="flex items-center gap-2 bg-brand-lime/10 border border-brand-lime/20 rounded-lg p-2 backdrop-blur-sm w-fit">
            <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-brand-lime font-mono leading-none">
                    {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[8px] uppercase text-brand-lime/60 font-medium">Day</span>
            </div>
            <span className="text-sm font-bold text-brand-lime/40 -mt-1">:</span>
            <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-brand-lime font-mono leading-none">
                    {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[8px] uppercase text-brand-lime/60 font-medium">Hr</span>
            </div>
            <span className="text-sm font-bold text-brand-lime/40 -mt-1">:</span>
            <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-brand-lime font-mono leading-none">
                    {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[8px] uppercase text-brand-lime/60 font-medium">Min</span>
            </div>
            <span className="text-sm font-bold text-brand-lime/40 -mt-1">:</span>
            <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-brand-lime font-mono leading-none">
                    {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[8px] uppercase text-brand-lime/60 font-medium">Sec</span>
            </div>

            <div className="h-6 w-[1px] bg-brand-lime/20 mx-1" />

            <span className="text-[10px] font-bold text-brand-lime uppercase tracking-wider leading-tight w-16 text-center">
                Next Episode
            </span>
        </div>
    );
}
