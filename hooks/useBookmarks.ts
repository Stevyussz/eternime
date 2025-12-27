"use client";

import { useState, useEffect } from "react";
import { AnimeCard, AnimeDetail } from "@/types";

export interface BookmarkItem {
    animeId: string;
    title: string;
    poster: string;
    score: string;
    status: string;
    addedAt: number;
}

export function useBookmarks() {
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("my-list");
        if (stored) {
            setBookmarks(JSON.parse(stored));
        }
        setIsLoaded(true);
    }, []);

    const saveBookmarks = (newBookmarks: BookmarkItem[]) => {
        setBookmarks(newBookmarks);
        localStorage.setItem("my-list", JSON.stringify(newBookmarks));
    };

    const addBookmark = (anime: AnimeDetail & { animeId: string }) => {
        const newItem: BookmarkItem = {
            animeId: anime.animeId || "", // AnimeId might need to be passed explicitly if not in AnimeDetail
            title: anime.title,
            poster: anime.poster,
            score: anime.score,
            status: anime.status,
            addedAt: Date.now(),
        };

        // Check if exists
        if (bookmarks.some(b => b.animeId === newItem.animeId)) return;

        const updated = [newItem, ...bookmarks];
        saveBookmarks(updated);
    };

    const removeBookmark = (animeId: string) => {
        const updated = bookmarks.filter(b => b.animeId !== animeId);
        saveBookmarks(updated);
    };

    const isBookmarked = (animeId: string) => {
        return bookmarks.some(b => b.animeId === animeId);
    };

    return { bookmarks, addBookmark, removeBookmark, isBookmarked, isLoaded };
}
