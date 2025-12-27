"use client";

import { motion } from "framer-motion";
import { Monitor, Maximize2, Minimize2, Settings, Server, ChevronLeft, ChevronRight, SkipForward, SkipBack } from "lucide-react";
import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useRouter } from "next/navigation";

interface PlayerControlsProps {
    serverData?: any;
    isTheaterMode: boolean;
    toggleTheaterMode: () => void;
    onServerSelect: (serverId: string) => void;
    prevEpisodeId?: string | null;
    nextEpisodeId?: string | null;
}

export function PlayerControls({ serverData, isTheaterMode, toggleTheaterMode, onServerSelect, prevEpisodeId, nextEpisodeId }: PlayerControlsProps) {
    const [showServers, setShowServers] = useState(false);
    const router = useRouter();

    return (
        <div className="flex items-center justify-between mt-4 p-4 bg-secondary/10 rounded-xl border border-border backdrop-blur-sm relative z-30">
            <div className="flex items-center gap-4">
                {/* Navigation Buttons */}
                <div className="flex items-center bg-black/20 rounded-lg p-1 border border-white/5">
                    <button
                        disabled={!prevEpisodeId}
                        onClick={() => prevEpisodeId && router.push(`/watch/${prevEpisodeId}`)}
                        className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        title="Previous Episode"
                    >
                        <SkipBack className="w-4 h-4" />
                    </button>
                    <div className="w-px h-3 bg-white/10 mx-1" />
                    <button
                        disabled={!nextEpisodeId}
                        onClick={() => nextEpisodeId && router.push(`/watch/${nextEpisodeId}`)}
                        className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        title="Next Episode"
                    >
                        <SkipForward className="w-4 h-4" />
                    </button>
                </div>

                <div className="h-4 w-px bg-white/10" />

                <button
                    onClick={toggleTheaterMode}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-brand-lime transition-colors"
                    title={isTheaterMode ? "Exit Theater Mode" : "Theater Mode"}
                >
                    {isTheaterMode ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    <span className="hidden sm:inline">{isTheaterMode ? "Exit Theater" : "Theater Mode"}</span>
                </button>
            </div>

            <div className="relative">
                <button
                    onClick={() => setShowServers(!showServers)}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-brand-blue transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Resolutions</span>
                </button>

                {showServers && serverData && (
                    <div className="absolute bottom-full right-0 mb-2 w-64 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl p-2 z-50">
                        <div className="text-xs font-bold text-gray-400 px-2 py-1 mb-1">SELECT SOURCE</div>
                        <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
                            {serverData.qualityList?.map((quality: any) => (
                                <div key={quality.title}>
                                    <div className="text-[10px] text-brand-lime px-2 py-1 bg-brand-lime/5 mt-1 rounded uppercase tracking-wider">{quality.title}</div>
                                    {quality.serverList.map((srv: any) => (
                                        <button
                                            key={srv.serverId}
                                            onClick={() => {
                                                onServerSelect(srv.serverId);
                                                setShowServers(false);
                                            }}
                                            className="w-full text-left px-2 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded flex items-center gap-2"
                                        >
                                            <Server className="w-3 h-3 text-gray-500" />
                                            {srv.title}
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
