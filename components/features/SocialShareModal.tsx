"use client";

import { useRef, useState } from "react";
import { AnimeDetail } from "@/types";
import { Download, Share2, Smartphone, Square, CheckCircle2, QrCode } from "lucide-react";
import html2canvas from "html2canvas";
import { AnimatePresence, motion } from "framer-motion";

interface SocialShareModalProps {
    anime: AnimeDetail;
    isOpen: boolean;
    onClose: () => void;
}

export function SocialShareModal({ anime, isOpen, onClose }: SocialShareModalProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [format, setFormat] = useState<"story" | "square">("story");

    const generateImage = async () => {
        if (!cardRef.current) return;
        setIsGenerating(true);

        try {
            const canvas = await html2canvas(cardRef.current, {
                useCORS: true,
                scale: 3, // Higher quality
                backgroundColor: null,
                logging: false,
                allowTaint: true,
            });

            const link = document.createElement("a");
            link.download = `eternime-${anime.title.slice(0, 10).replace(/\s+/g, '-')}-share.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (err) {
            console.error("Failed to generate share card", err);
            alert("Oops! could not generate image. Try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                onClick={e => e.stopPropagation()}
            >
                {/* Left: Controls */}
                <div className="p-8 md:w-[350px] shrink-0 flex flex-col gap-8 border-r border-white/5 bg-zinc-900/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-brand-lime/5 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative">
                        <h2 className="text-3xl font-black text-white mb-2">
                            Share <span className="text-brand-lime">Card</span>
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Generate a premium card for your social media. Show off your anime taste in style.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Layout Format</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setFormat("story")}
                                className={`group flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${format === 'story' ? 'bg-brand-lime/10 border-brand-lime/50 text-brand-lime shadow-[0_0_20px_rgba(132,204,22,0.1)]' : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'}`}
                            >
                                <div className={`p-2 rounded-lg ${format === 'story' ? 'bg-brand-lime/20' : 'bg-white/5 group-hover:bg-white/10'} transition-colors`}>
                                    <Smartphone className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold">Story 9:16</span>
                            </button>
                            <button
                                onClick={() => setFormat("square")}
                                className={`group flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${format === 'square' ? 'bg-brand-blue/10 border-brand-blue/50 text-brand-blue shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'}`}
                            >
                                <div className={`p-2 rounded-lg ${format === 'square' ? 'bg-brand-blue/20' : 'bg-white/5 group-hover:bg-white/10'} transition-colors`}>
                                    <Square className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold">Post 1:1</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-auto space-y-3 relative z-10">
                        <button
                            onClick={generateImage}
                            disabled={isGenerating}
                            className="w-full py-4 rounded-xl font-bold bg-white text-black hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            {isGenerating ? (
                                <span className="animate-pulse">Rendering...</span>
                            ) : (
                                <>
                                    <Download className="w-5 h-5" /> Save Image
                                </>
                            )}
                        </button>
                        <button onClick={onClose} className="w-full py-3 text-gray-500 hover:text-white transition-colors text-sm font-medium">
                            Close Preview
                        </button>
                    </div>
                </div>

                {/* Right: Preview Area */}
                <div className="flex-1 bg-[#050505] p-8 flex items-center justify-center overflow-auto relative">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

                    {/* The Capture Zone */}
                    <div
                        ref={cardRef}
                        className={`relative shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden shrink-0 transition-all duration-500 group ${format === "story" ? "w-[380px] h-[675px]" : "w-[600px] h-[600px]"
                            }`}
                    >
                        {/* Dynamic Background */}
                        <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
                            <img
                                src={anime.poster}
                                className="w-full h-full object-cover opacity-60 blur-2xl scale-125 saturate-150"
                                crossOrigin="anonymous"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
                            <div className="absolute inset-0 bg-black/20" /> {/* Dimmer */}
                        </div>

                        {/* Content Layer */}
                        <div className="absolute inset-0 z-10 flex flex-col p-8 font-sans">

                            {/* Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-brand-lime flex items-center justify-center font-black text-black text-xs">E</div>
                                    <span className="font-bold text-white tracking-widest text-xs uppercase">Eternime</span>
                                </div>
                                <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Now Watching</span>
                                </div>
                            </div>

                            {/* Main Art & Badge */}
                            <div className="relative mx-auto mt-4 mb-8 w-fit group-hover:scale-[1.02] transition-transform duration-700">
                                <div className="absolute -inset-4 bg-gradient-to-tr from-brand-lime/40 to-brand-blue/40 rounded-[2rem] blur-xl opacity-75" />
                                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl w-[240px] aspect-[2/3]">
                                    <img src={anime.poster} className="w-full h-full object-cover" crossOrigin="anonymous" />
                                </div>
                                {anime.score && (
                                    <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-black font-black text-xl w-14 h-14 rounded-full flex items-center justify-center border-4 border-[#0a0a0a] shadow-xl rotate-12">
                                        {anime.score}
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="text-center mt-auto">
                                <h1 className="text-3xl lg:text-4xl font-black text-white leading-none mb-3 drop-shadow-xl uppercase italic tracking-tight">
                                    {anime.title}
                                </h1>

                                <div className="flex flex-wrap justify-center gap-2 mb-8">
                                    {anime.genreList?.slice(0, 3).map(g => (
                                        <span key={g.genreId} className="px-3 py-1 rounded-lg text-[10px] bg-white/5 text-gray-300 font-bold uppercase tracking-wider border border-white/5">
                                            {g.title}
                                        </span>
                                    ))}
                                </div>

                                {/* Stats Bar */}
                                <div className="grid grid-cols-2 gap-4 bg-white/5 rounded-2xl p-4 border border-white/5 backdrop-blur-md relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-brand-lime/5 to-transparent opacity-50" />
                                    <div className="relative text-center border-r border-white/10">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Status</p>
                                        <div className="flex items-center justify-center gap-1.5 text-white font-bold">
                                            {anime.status === 'Ongoing' && <span className="relative flex h-2 w-2 mr-1"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-lime opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-brand-lime"></span></span>}
                                            {anime.status}
                                        </div>
                                    </div>
                                    <div className="relative text-center">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Verification</p>
                                        <div className="flex items-center justify-center gap-1.5 text-brand-blue font-bold">
                                            <CheckCircle2 className="w-4 h-4" /> Authentic
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-6 flex items-center justify-between opacity-60">
                                <div className="flex flex-col">
                                    <span className="text-[9px] text-gray-400 font-mono tracking-widest uppercase">Generated By</span>
                                    <span className="text-[10px] text-white font-bold tracking-widest uppercase">Eternime App</span>
                                </div>
                                <QrCode className="w-10 h-10 text-white p-1 bg-white/10 rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
