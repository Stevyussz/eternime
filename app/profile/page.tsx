"use client";

import { useStats } from "@/hooks/useStats";
import { useHistory } from "@/hooks/useHistory";
import { GlassCard } from "@/components/ui/GlassCard";
import { Trophy, Clock, Tv, Star, User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookmarksList } from "@/components/features/BookmarksList";
import { ActivityGraph } from "@/components/features/ActivityGraph";

// ... imports

export default function ProfilePage() {
    const { totalEpisodes, timeWatched, level, progress, nextLevel } = useStats();
    const { history } = useHistory();

    return (
        <div className="container mx-auto px-6 pb-20 pt-10">
            {/* Header */}
            <div className="flex items-center gap-6 mb-12">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-blue to-brand-lime flex items-center justify-center text-4xl shadow-xl">
                    <User className="w-12 h-12 text-black" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Guest User</h1>
                    <div className="px-3 py-1 bg-brand-lime/10 border border-brand-lime/30 text-brand-lime rounded-full text-sm inline-block font-bold">
                        {level}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <GlassCard className="p-6 flex items-center gap-4">
                    <div className="p-4 rounded-full bg-blue-500/20 text-blue-500">
                        <Tv className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-card-foreground">{totalEpisodes}</div>
                        <div className="text-sm text-muted-foreground">Episodes Watched</div>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 flex items-center gap-4">
                    <div className="p-4 rounded-full bg-purple-500/20 text-purple-500">
                        <Clock className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-card-foreground">{timeWatched}</div>
                        <div className="text-sm text-muted-foreground">Time Wasted</div>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 flex items-center gap-4">
                    <div className="p-4 rounded-full bg-yellow-500/20 text-yellow-500">
                        <Trophy className="w-8 h-8" />
                    </div>
                    <div className="w-full">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-card-foreground font-bold">{Math.round(progress)}%</span>
                            <span className="text-muted-foreground">Next Level: {nextLevel} Eps</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-brand-lime"
                            />
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Activity Graph */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <User className="w-6 h-6 text-brand-lime" />
                    Activity Log
                </h2>
                <ActivityGraph />
            </section>

            {/* My List */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-brand-lime" />
                    My List
                </h2>
                <BookmarksList />
            </section>

            {/* Recent History */}
            <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">Recent History</h2>
                {history.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground italic">No history yet. Go watch something!</div>
                ) : (
                    <div className="space-y-4">
                        {history.map((item) => (
                            <Link href={`/watch/${item.episodeId}`} key={item.episodeId}>
                                <GlassCard className="p-4 flex justify-between items-center hover:bg-secondary/20 transition-colors group mb-3">
                                    <div>
                                        <h3 className="font-semibold text-card-foreground group-hover:text-brand-lime transition-colors">{item.title}</h3>
                                        <p className="text-xs text-muted-foreground">Watched on {new Date(item.lastWatchedAt).toLocaleDateString()}</p>
                                    </div>
                                    <Star className="w-5 h-5 text-muted-foreground group-hover:text-yellow-400 transition-colors" />
                                </GlassCard>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
