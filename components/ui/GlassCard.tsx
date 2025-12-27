"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = true, ...props }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hoverEffect ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
            className={cn(
                "relative overflow-hidden rounded-xl border border-border bg-card/40 dark:bg-black/20 backdrop-blur-md shadow-xl hover:border-brand-lime/50 transition-colors duration-300",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="relative z-10 text-card-foreground">{children}</div>
        </motion.div>
    );
}
