"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Download, X, HardDrive } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface DownloadModalProps {
    isOpen: boolean;
    onClose: () => void;
    downloadData?: {
        title: string;
        qualityList: {
            title: string;
            size: string;
            urlList: {
                title: string;
                url: string;
            }[];
        }[];
    };
}

export function DownloadModal({ isOpen, onClose, downloadData }: DownloadModalProps) {
    if (!downloadData || !downloadData.qualityList || downloadData.qualityList.length === 0) {
        return null; // Don't render anything if no download data is available
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col"
                    >
                        <GlassCard className="flex flex-col h-full overflow-hidden border-white/10 shadow-2xl bg-[#0a0a0a]/90">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-brand-lime/20 rounded-lg">
                                        <Download className="w-5 h-5 text-brand-lime" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">Download Episode</h2>
                                        <p className="text-xs text-muted-foreground">Pilih resolusi dan server untuk mengunduh</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-4 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                                {downloadData.qualityList.map((quality, idx) => (
                                    <div key={idx} className="space-y-3">
                                        {/* Quality Header */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-1 rounded bg-brand-lime/10 text-brand-lime text-xs font-bold border border-brand-lime/20 uppercase">
                                                    {quality.title}
                                                </span>
                                                {quality.size && quality.size !== "Unknown" && (
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <HardDrive className="w-3 h-3" /> {quality.size}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4" />
                                        </div>

                                        {/* Server Links Grid */}
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                            {quality.urlList.map((srv, srvIdx) => (
                                                <a
                                                    key={srvIdx}
                                                    href={srv.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center px-3 py-2 text-xs font-medium text-gray-300 bg-white/5 hover:bg-brand-blue/20 hover:text-brand-blue border border-white/5 hover:border-brand-blue/30 rounded-lg transition-all text-center truncate"
                                                    title={srv.title}
                                                >
                                                    {srv.title}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
