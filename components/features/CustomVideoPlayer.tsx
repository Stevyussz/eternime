"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, FastForward, Rewind, SkipBack, SkipForward } from "lucide-react";
import { formatDuration } from "@/lib/utils"; // Assuming helper exists, or implemented inline

interface CustomVideoPlayerProps {
    src: string;
    poster?: string;
    episodeId: string; // for progress tracking key
    autoPlay?: boolean;
}

export function CustomVideoPlayer({ src, poster, episodeId, autoPlay = true }: CustomVideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [showControls, setShowControls] = useState(true);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Load progress from localStorage
    useEffect(() => {
        const savedTime = localStorage.getItem(`watch_progress_${episodeId}`);
        if (savedTime && videoRef.current) {
            videoRef.current.currentTime = parseFloat(savedTime);
        }
    }, [episodeId]);

    // Save progress periodically
    useEffect(() => {
        const interval = setInterval(() => {
            if (videoRef.current && !videoRef.current.paused) {
                localStorage.setItem(`watch_progress_${episodeId}`, videoRef.current.currentTime.toString());
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [episodeId]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setProgress(videoRef.current.currentTime);
            setDuration(videoRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setProgress(time);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const vol = parseFloat(e.target.value);
        setVolume(vol);
        if (videoRef.current) {
            videoRef.current.volume = vol;
            setIsMuted(vol === 0);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const changeSpeed = (speed: number) => {
        setPlaybackSpeed(speed);
        if (videoRef.current) {
            videoRef.current.playbackRate = speed;
        }
        setShowSpeedMenu(false);
    };

    const skip = (seconds: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime += seconds;
        }
    };

    // Auto-hide controls
    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

            switch (e.key.toLowerCase()) {
                case " ":
                case "k":
                    e.preventDefault();
                    togglePlay();
                    break;
                case "f":
                    toggleFullscreen();
                    break;
                case "arrowright":
                    skip(5);
                    break;
                case "arrowleft":
                    skip(-5);
                    break;
                case "l":
                    skip(10);
                    break;
                case "j":
                    skip(-10);
                    break;
                case "m":
                    toggleMute();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isMuted]); // dependency needed for mute toggle state if using closure, but checking ref directly is safer usually.

    const formatTime = (time: number) => {
        if (isNaN(time)) return "00:00";
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full bg-black group overflow-hidden select-none"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setShowControls(false)}
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
                autoPlay={autoPlay}
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

            {/* Controls Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 flex flex-col justify-end px-4 pb-4 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>

                {/* Progress Bar */}
                <div className="w-full mb-4 flex items-center gap-2 group/progress">
                    <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={progress}
                        onChange={handleSeek}
                        className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-lime hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                        style={{
                            backgroundSize: `${(progress / duration) * 100}% 100%`,
                            backgroundImage: `linear-gradient(#84cc16, #84cc16)`
                        }}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={togglePlay} className="hover:text-brand-lime transition-colors">
                            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                        </button>

                        <div className="flex items-center gap-2 group/volume">
                            <button onClick={toggleMute} className="hover:text-brand-lime transition-colors">
                                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </button>
                            <div className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300">
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.1}
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                                />
                            </div>
                        </div>

                        <div className="text-sm font-medium font-mono text-gray-300">
                            {formatTime(progress)} / {formatTime(duration)}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Skip Buttons */}
                        <button onClick={() => skip(-10)} className="hover:text-brand-lime transition-colors text-xs font-bold flex items-center gap-1" title="Rewind 10s">
                            <Rewind className="w-4 h-4" /> 10s
                        </button>
                        <button onClick={() => skip(10)} className="hover:text-brand-lime transition-colors text-xs font-bold flex items-center gap-1" title="Skip 10s">
                            10s <FastForward className="w-4 h-4" />
                        </button>

                        {/* Speed Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                                className="flex items-center gap-1 hover:text-brand-lime transition-colors text-sm font-bold w-12 justify-center"
                            >
                                {playbackSpeed}x
                            </button>
                            {showSpeedMenu && (
                                <div className="absolute bottom-full right-0 mb-2 bg-black/90 border border-white/10 rounded-lg p-1 min-w-[80px] flex flex-col gap-1 shadow-xl">
                                    {[0.5, 1, 1.25, 1.5, 2].map(speed => (
                                        <button
                                            key={speed}
                                            onClick={() => changeSpeed(speed)}
                                            className={`px-3 py-1.5 text-xs rounded hover:bg-white/10 ${playbackSpeed === speed ? 'text-brand-lime bg-white/5' : 'text-gray-300'}`}
                                        >
                                            {speed}x
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button onClick={toggleFullscreen} className="hover:text-brand-lime transition-colors">
                            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Center Play Button Overlay (when paused) */}
            {!isPlaying && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer pointer-events-none"
                >
                    <div className="p-4 bg-black/50 rounded-full backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform">
                        <Play className="w-12 h-12 fill-white text-white translate-x-1" />
                    </div>
                </div>
            )}
        </div>
    );
}
