"use client";

import Link from "next/link";
import { useHistory } from "@/hooks/useHistory";
import { GlassCard } from "@/components/ui/GlassCard";
import { Clock, PlayCircle, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function ContinueWatching() {
    const { history, hasMounted, removeFromHistory } = useHistory();

    if (!hasMounted || history.length === 0) return null;

    return (
        <section className="mb-12">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground/90 uppercase tracking-wider text-sm">
                <Clock className="w-4 h-4 text-brand-lime" />
                Resume Playback
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                    {history.map((item) => {
                        const duration = item.watchedDuration || 0;
                        const total = item.totalDuration || (24 * 60);
                        const progress = Math.min(Math.max((duration / total) * 100, 2), 100);
                        const watchedMins = Math.floor(duration / 60);

                        return (
                            <motion.div
                                key={item.episodeId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                layout
                            >
                                <GlassCard className="group relative flex h-24 overflow-hidden border border-white/5 hover:border-brand-lime/30 bg-black/40 hover:bg-white/5 transition-all duration-300">
                                    <Link href={`/watch/${item.episodeId}`} className="flex w-full h-full">
                                        {/* Thumbnail (Left) */}
                                        <div className="w-36 h-full relative shrink-0">
                                            {item.poster ? (
                                                <img
                                                    src={item.poster}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                                    <PlayCircle className="w-8 h-8 text-white/20" />
                                                </div>
                                            )}

                                            {/* Play Overlay */}
                                            <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors flex items-center justify-center">
                                                <PlayCircle className="w-8 h-8 text-white/80 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 drop-shadow-lg" />
                                            </div>

                                            {/* Progress Line on Image Bottom */}
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                                                <div
                                                    className="h-full bg-brand-lime shadow-[0_0_8px_rgba(132,204,22,1)]"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Info (Right) */}
                                        <div className="flex-1 p-3 flex flex-col justify-center relative min-w-0">
                                            <h3 className="font-semibold text-sm text-white/90 leading-tight line-clamp-2 mb-1 group-hover:text-brand-lime transition-colors">
                                                {item.title.replace('Episode', 'Ep')}
                                            </h3>

                                            <div className="flex items-center gap-2 mt-auto">
                                                <span className="text-[10px] text-muted-foreground font-medium px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
                                                    {new Date(item.lastWatchedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                                {watchedMins > 0 && (
                                                    <span className="text-[10px] text-brand-lime/80 font-medium">
                                                        {watchedMins}m watched
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Remove Action */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeFromHistory(item.episodeId);
                                        }}
                                        className="absolute top-2 right-2 p-1.5 text-muted-foreground/50 hover:text-red-400 hover:bg-white/5 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                        title="Remove"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </section>
    );
}
