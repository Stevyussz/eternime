"use client";

import { motion } from "framer-motion";

interface AmbientBackgroundProps {
    image?: string;
}

export function AmbientBackground({ image }: AmbientBackgroundProps) {
    if (!image) return null;

    return (
        <div className="absolute inset-x-0 top-10 -bottom-10 z-[-1] pointer-events-none overflow-hidden flex justify-center">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 1.5 }}
                className="relative w-[120%] h-full max-w-7xl blur-[120px] opacity-60"
            >
                <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${image})` }}
                />
                <div className="absolute inset-0 bg-background/50" />
            </motion.div>
        </div>
    );
}
