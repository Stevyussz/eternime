"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface GradientButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    isLoading?: boolean;
    variant?: "primary" | "secondary";
    size?: "sm" | "md" | "lg";
}

export function GradientButton({
    children,
    isLoading,
    variant = "primary",
    size = "md",
    className,
    ...props
}: GradientButtonProps) {
    const variants = {
        primary: "bg-gradient-to-r from-brand-blue to-brand-lime hover:from-blue-500 hover:to-lime-400 text-black font-bold",
        secondary: "bg-secondary/10 hover:bg-secondary/20 border border-border text-foreground",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
            className={cn(
                "relative rounded-xl transition-all shadow-lg flex items-center gap-2 justify-center",
                variants[variant],
                sizes[size],
                isLoading && "opacity-70 cursor-not-allowed",
                className
            )}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {children}
        </motion.button>
    );
}
