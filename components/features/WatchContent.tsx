"use client";

import Link from "next/link";
import { ArrowLeft, MonitorPlay, Lightbulb, Download, Flag, Share2, ThumbsUp } from "lucide-react";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { WatchHistoryHandler } from "@/components/features/WatchHistoryHandler";
import { PlayerControls } from "@/components/features/PlayerControls";
import { EpisodeStrip } from "@/components/features/EpisodeStrip";
import { SocialShareModal } from "@/components/features/SocialShareModal";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { StreamResponse } from "@/types";
import { useRouter } from "next/navigation";
import { useWatchShortcuts } from "@/hooks/useWatchShortcuts";
import { DownloadModal } from "@/components/features/DownloadModal";

import { Keyboard } from "lucide-react";
import { CustomVideoPlayer } from "@/components/features/CustomVideoPlayer";

interface WatchContentProps {
    streamData: StreamResponse;
    slug: string;
}

export function WatchContent({ streamData, slug }: WatchContentProps) {
    const { defaultStreamingUrl, title, server, prevEpisode, nextEpisode, poster, info } = streamData.data.details;
    const [currentUrl, setCurrentUrl] = useState(defaultStreamingUrl);
    const [isTheaterMode, setIsTheaterMode] = useState(false);
    const [isLightsOff, setIsLightsOff] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [showDownloadModal, setShowDownloadModal] = useState(false);

    const router = useRouter();

    const handleServerSelect = async (urlOrId: string) => {
        if (!urlOrId) return;
        if (urlOrId.startsWith("http")) {
            setCurrentUrl(urlOrId);
        } else {
            // It's a serverId (base64url). We need to fetch the real URL.
            try {
                // we assume active provider is samehadaku or otakudesu if it has serverId
                const provider = slug.split("/").length === 3 ? "kuramanime" : "samehadaku";
                const API_ROOT = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
                const res = await fetch(`${API_ROOT}/${provider}/server/${urlOrId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data?.data?.details?.url) {
                        setCurrentUrl(data.data.details.url);
                    }
                }
            } catch (e) {
                console.warn("Failed to resolve server URL", e);
            }
        }
    };

    const { showShortcuts, setShowShortcuts } = useWatchShortcuts(
        () => setIsTheaterMode(p => !p),
        () => nextEpisode && router.push(`/watch/${nextEpisode.episodeId}`),
        () => prevEpisode && router.push(`/watch/${prevEpisode.episodeId}`)
    );

    return (
        <div className="max-w-[1400px] mx-auto relative px-4 lg:px-8 pb-20 -mt-11">

            {/* Lights Off Overlay */}
            <div className={cn(
                "fixed inset-0 bg-black/95 z-30 transition-opacity duration-700 pointer-events-none",
                isLightsOff ? "opacity-100 pointer-events-auto" : "opacity-0"
            )} />

            {/* Back Nav & Lights Off */}
            <div className="flex items-center justify-between mb-2 relative z-30">
                <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors group">
                    <div className="p-2 rounded-full bg-secondary/50 group-hover:bg-secondary mr-3 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm">Back to Home</span>
                </Link>

                <button
                    onClick={() => setIsLightsOff(!isLightsOff)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-xs font-bold uppercase tracking-wider relative",
                        isLightsOff
                            ? "bg-brand-lime text-black border-brand-lime shadow-[0_0_20px_rgba(132,204,22,0.4)] z-40"
                            : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                >
                    <Lightbulb className={cn("w-4 h-4", isLightsOff && "fill-current")} />
                    {isLightsOff ? "Lights On" : "Lights Off"}
                </button>
            </div>

            <AmbientBackground image={poster || "https://media.giphy.com/media/26BRy95vCgM8c5b9K/giphy.gif"} />

            {/* Main Layout - Single Column now */}
            <div className="flex flex-col gap-4 relative z-30">

                <div className={cn(
                    "relative w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-border/50 group transition-all duration-500",
                    isTheaterMode ? "h-[85vh] rounded-none -mx-4 lg:-mx-8 w-[calc(100%+2rem)] lg:w-[calc(100%+4rem)] border-x-0" : "aspect-video"
                )}>
                    {currentUrl ? (
                        currentUrl.match(/\.(mp4|mkv|webm|m3u8)$/i) ? (
                            <CustomVideoPlayer
                                src={currentUrl}
                                poster={streamData.data.details.poster}
                                episodeId={slug}
                                autoPlay={true}
                            />
                        ) : (
                            <iframe
                                src={currentUrl}
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        )
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black/80">
                            <div className="text-center space-y-2 p-4">
                                <MonitorPlay className="w-12 h-12 mx-auto text-brand-lime opacity-50 mb-2" />
                                <h3 className="text-xl font-bold text-white">Select a Server</h3>
                                <p className="text-sm text-gray-400">Choose a server below to start watching</p>
                            </div>
                        </div>
                    )}
                </div>

                <PlayerControls
                    serverData={server}
                    isTheaterMode={isTheaterMode}
                    toggleTheaterMode={() => setIsTheaterMode(!isTheaterMode)}
                    onServerSelect={handleServerSelect}
                    prevEpisodeId={prevEpisode?.episodeId}
                    nextEpisodeId={nextEpisode?.episodeId}
                    hasDownload={!!streamData.data.details.download?.qualityList?.length}
                    onDownloadClick={() => setShowDownloadModal(true)}
                />

                {/* Horizontal Episode Strip */}
                <div className="mt-2 mb-2">
                    <EpisodeStrip
                        currentEpisodeId={slug}
                        episodeList={info.episodeList}
                        title={title}
                    />
                </div>

                {/* Metadata Section - "About this Anime" card */}
                <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 flex flex-col gap-6 shadow-lg">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-black text-foreground mb-2 leading-tight">
                            {title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-xs lg:text-sm text-muted-foreground">
                            <span className="bg-brand-lime/10 text-brand-lime px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
                                Streaming
                            </span>
                            <span>{info.type}</span>
                            <span>{info.duration}</span>
                            <button
                                onClick={() => setShowShortcuts(true)}
                                className="border border-border px-2 py-0.5 rounded hover:bg-secondary transition-colors hidden md:block"
                            >
                                SHORTCUTS <kbd className="font-mono text-[10px] ml-1">?</kbd>
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 lg:gap-3 relative z-20">
                        <button
                            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-foreground text-background font-bold hover:opacity-90 transition-opacity text-sm shadow-md"
                            onClick={() => setIsShareOpen(true)}
                        >
                            <Share2 className="w-4 h-4" /> Share
                        </button>

                        {/* Direct Download */}
                        <a
                            href={currentUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-secondary/50 text-foreground font-medium border border-border hover:bg-secondary transition-colors text-sm"
                        >
                            <Download className="w-4 h-4" /> Download
                        </a>

                        {/* Report Button with Dropdown */}
                        <div className="relative flex-1 lg:flex-none">
                            <button
                                onClick={() => setIsReportOpen(!isReportOpen)}
                                className={cn(
                                    "w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium border border-border transition-colors text-sm",
                                    isReportOpen ? "bg-red-500/10 text-red-500 border-red-500/50" : "bg-secondary/50 text-foreground hover:bg-secondary"
                                )}
                            >
                                <Flag className="w-4 h-4" /> Report
                            </button>

                            {/* Dropdown Menu */}
                            {isReportOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-xl overflow-hidden flex flex-col z-50 animate-in fade-in zoom-in-95 duration-200">
                                    <button
                                        onClick={() => window.location.href = `mailto:support@eternime.com?subject=Broken%20Episode:%20${title}&body=Episode%20${slug}%20is%20not%20working.`}
                                        className="text-left px-4 py-3 text-xs font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5"
                                    >
                                        Video Broken / Error
                                    </button>
                                    <button
                                        onClick={() => window.location.href = `mailto:dmca@eternime.com?subject=DMCA%20Takedown:%20${title}`}
                                        className="text-left px-4 py-3 text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                                    >
                                        DMCA / Takedown
                                    </button>
                                    {/* Subtitles Issue */}
                                    <button
                                        onClick={() => window.location.href = `mailto:subs@eternime.com?subject=Subtitle%20Issue:%20${title}`}
                                        className="text-left px-4 py-3 text-xs font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors border-t border-white/5"
                                    >
                                        Wrong Subtitles
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="border-t border-border pt-6">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {info.genreList.map((g: any, i: number) => (
                                <span key={i} className="px-3 py-1 rounded-full text-[10px] bg-brand-blue/10 text-brand-blue border border-brand-blue/20 uppercase tracking-wider font-bold">
                                    {g.title}
                                </span>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                            <div>
                                <span className="block uppercase tracking-widest mb-1 text-foreground/80">Credit</span>
                                <span className="font-medium">{info.credit || "-"}</span>
                            </div>
                            <div>
                                <span className="block uppercase tracking-widest mb-1 text-foreground/80">Encoder</span>
                                <span className="font-medium">{info.encoder || "-"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <WatchHistoryHandler episodeId={slug} title={title} poster={poster} />

            {/* Shortcuts Modal (Z-Index increased) */}
            {showShortcuts && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowShortcuts(false)}>
                    <div className="bg-[#050505] border border-white/10 p-8 rounded-2xl shadow-2xl max-w-sm w-full" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-6">
                            <Keyboard className="w-6 h-6 text-brand-lime" />
                            <h3 className="text-xl font-bold text-white">Shortcuts</h3>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-gray-400">Theater Mode</span>
                                <kbd className="bg-white/10 px-2 py-0.5 rounded text-brand-lime font-mono">T</kbd>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-gray-400">Next / Prev</span>
                                <kbd className="bg-white/10 px-2 py-0.5 rounded text-brand-lime font-mono">N / P</kbd>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowShortcuts(false)}
                            className="mt-6 w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <DownloadModal
                isOpen={showDownloadModal}
                onClose={() => setShowDownloadModal(false)}
                downloadData={streamData.data.details.download}
            />

            <SocialShareModal
                anime={{
                    title: title,
                    poster: poster,
                    status: "Watching",
                    animeId: slug,
                    genreList: info.genreList,
                    type: info.type
                } as any}
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
            />
        </div>
    );
}
