"use client";

import Link from "next/link";
import { Search, Menu, X, Dice5, User, PlayCircle } from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useReminders } from "@/hooks/useReminders"; // Import reminder hook
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { fetchAPI } from "@/lib/api";
import { AnimeCard, HomeResponse, OngoingResponse } from "@/types";
import { GachaModal } from "./GachaModal";
import { useDebounce } from "@/hooks/useDebounce";

// ...

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSurpriseLoading, setIsSurpriseLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<AnimeCard[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [gachaOpen, setGachaOpen] = useState(false);
    const [targetSlug, setTargetSlug] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const { checkReminders } = useReminders();

    useEffect(() => {
        checkReminders(); // Check for due reminders
    }, []); // Run once on mount

    const debouncedSearch = useDebounce(searchQuery, 500);

    useEffect(() => {
        async function fetchSearchResults() {
            if (debouncedSearch.length < 3) {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);
            try {
                // Mock or real backend call.
                // Since this is client-side, we can't easily rely on server proxy without setup.
                // We will point to the specific search endpoint.
                const res = await fetch(`http://localhost:3001/otakudesu/search?q=${encodeURIComponent(debouncedSearch)}`);
                const data = await res.json();
                if (data.data?.animeList) {
                    setSearchResults(data.data.animeList.slice(0, 5)); // Limit to 5
                }
            } catch (error) {
                console.error("Search error", error);
            } finally {
                setIsSearching(false);
            }
        }

        fetchSearchResults();
    }, [debouncedSearch]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
        }
    };

    const handleSurpriseMe = async () => {
        setIsSurpriseLoading(true);
        try {
            // Fetch first to ensure we have a valid target
            const res = await fetchAPI<OngoingResponse>("/ongoing?page=1");
            const animes = res.data.animeList;
            if (animes.length > 0) {
                const randomAnime = animes[Math.floor(Math.random() * animes.length)];
                setTargetSlug(randomAnime.animeId);
                setGachaOpen(true); // Open modal, which plays animation then calls onComplete
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleGachaComplete = () => {
        setGachaOpen(false);
        if (targetSlug) {
            window.location.href = `/anime/${targetSlug}`;
        }
    };

    return (
        <>
            <GachaModal isOpen={gachaOpen} onComplete={handleGachaComplete} />
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isOpen ? "bg-background/80 backdrop-blur-md border-b border-white/5 shadow-lg" : "bg-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-black italic tracking-tighter bg-gradient-to-r from-brand-blue to-brand-lime bg-clip-text text-transparent transform hover:scale-105 transition-transform">
                        ETERNIME
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Home</Link>
                        <Link href="/ongoing" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Ongoing</Link>
                        <Link href="/completed" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Completed</Link>
                        <Link href="/genres" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Genres</Link>
                        <Link href="/schedule" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Schedule</Link>
                    </div>

                    {/* Search & Actions */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleSurpriseMe}
                            disabled={isSurpriseLoading}
                            className="p-2 rounded-full hover:bg-secondary/50 text-muted-foreground hover:text-brand-lime transition-colors relative group"
                            title="Surprise Me!"
                        >
                            <Dice5 className={`w-5 h-5 ${isSurpriseLoading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
                        </button>

                        <Link href="/profile" className="p-2 rounded-full hover:bg-secondary/50 text-muted-foreground hover:text-brand-blue transition-colors">
                            <User className="w-5 h-5" />
                        </Link>

                        <div className="relative hidden md:block group">
                            <form onSubmit={handleSearch} className="flex items-center bg-secondary/50 rounded-full px-4 py-2 border border-border focus-within:border-brand-blue transition-colors relative z-20">
                                <input
                                    type="text"
                                    placeholder="Search anime..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setShowDropdown(true);
                                    }}
                                    onFocus={() => setShowDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                    className="bg-transparent border-none outline-none text-sm text-foreground w-48 placeholder-muted-foreground"
                                />
                                <button type="submit">
                                    {isSearching ? <div className="w-4 h-4 border-2 border-brand-lime border-t-transparent rounded-full animate-spin" /> : <Search className="w-4 h-4 text-muted-foreground" />}
                                </button>
                            </form>

                            <AnimatePresence>
                                {showDropdown && searchResults.length > 0 && searchQuery.length >= 3 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full right-0 left-0 mt-3 bg-card border border-border rounded-xl shadow-2xl overflow-hidden min-w-[300px]"
                                    >
                                        <div className="p-2">
                                            <div className="text-xs font-bold text-muted-foreground px-2 py-1 mb-1 uppercase tracking-wider">Top Results</div>
                                            {searchResults.map(anime => (
                                                <Link
                                                    key={anime.animeId}
                                                    href={`/anime/${anime.animeId}`}
                                                    className="flex items-center gap-3 p-2 hover:bg-secondary/50 rounded-lg transition-colors group"
                                                >
                                                    <div className="w-10 h-14 bg-gray-800 rounded-md overflow-hidden relative flex-shrink-0">
                                                        <img src={anime.poster} alt={anime.title} className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <PlayCircle className="w-6 h-6 text-brand-lime" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-medium text-foreground truncate group-hover:text-brand-lime transition-colors">{anime.title}</h4>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <span className="bg-brand-blue/10 text-brand-blue px-1.5 py-0.5 rounded text-[10px]">{anime.score || "N/A"}</span>
                                                            <span>{anime.status}</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <ThemeToggle />

                        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden mt-4 overflow-hidden bg-black/90 backdrop-blur-xl border-t border-white/10"
                        >
                            <div className="flex flex-col p-4 gap-4">
                                <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
                                <Link href="/ongoing" className="text-gray-300 hover:text-white">Ongoing</Link>
                                <Link href="/completed" className="text-gray-300 hover:text-white">Completed</Link>
                                <Link href="/genres" className="text-gray-300 hover:text-white">Genres</Link>
                                <form onSubmit={handleSearch} className="flex items-center bg-white/5 rounded-lg px-4 py-2 border border-white/10">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-transparent flex-1 border-none outline-none text-sm text-white"
                                    />
                                    <Search className="w-4 h-4 text-gray-400" />
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </>
    );

}
