// types/index.ts

export interface AnimeCard {
    title: string;
    animeId: string;
    animeSlug?: string;
    poster: string;
    episodes: string;
    latestReleaseDate?: string;
    score?: string;
    status?: string;
    type?: string;
    quality?: string;
    genreList?: {
        title: string;
        genreId?: string;
        url?: string;
    }[];
}

export interface HomeResponse {
    message: string;
    data: {
        ongoing: {
            episodeList: AnimeCard[];
        };
        completed: {
            animeList: AnimeCard[];
        };
        movie: {
            animeList: AnimeCard[];
        };
    };
}

// ... sisa interface lain (Episode, AnimeDetail, dll) biarkan sama
export interface Episode {
    title: string;
    episodeId: string;
    animeId?: string;
    animeSlug?: string;
    otakudesuUrl?: string;
}

export interface AnimeDetail {
    title: string;
    japanese?: string;
    poster: string;
    synopsis: {
        paragraphList: string[];
    };
    episodeList: Episode[];
    status: string;
    score: string;
    studios?: string;
    duration?: string;
    aired?: string;
    type?: string;
    producers?: string;
    genreList?: Genre[];
    recommendedAnimeList?: AnimeCard[];
}

export interface DetailResponse {
    message: string;
    data: {
        details: AnimeDetail;
    };
}

export interface StreamResponse {
    message: string;
    data: {
        details: {
            defaultStreamingUrl: string;
            title: string;
            poster: string;
            prevEpisode?: {
                episodeId: string;
                title: string;
            } | null;
            nextEpisode?: {
                episodeId: string;
                title: string;
            } | null;
            server?: {
                title: string;
                qualityList: {
                    title: string;
                    serverList: {
                        title: string;
                        serverId: string;
                    }[];
                }[];
            };
            info: {
                credit: string;
                encoder: string;
                duration: string;
                type: string;
                genreList: {
                    title: string;
                    genreId: string;
                    url: string;
                }[];
                episodeList: {
                    title: string;
                    episodeId: string;
                    otakudesuUrl: string;
                }[];
            };
        };
    };
}

export interface Genre {
    title: string;
    genreId: string;
    url: string;
}

export interface GenreListResponse {
    message: string;
    data: {
        genreList: Genre[];
    };
}

export interface GenreAnimeResponse {
    message: string;
    data: {
        animeList: AnimeCard[];
    };
    pagination: any;
}

export interface OngoingResponse {
    message: string;
    data: {
        animeList: AnimeCard[];
    };
    pagination?: any;
}