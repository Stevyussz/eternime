import { smartFetch, fetchFromProvider } from "@/lib/smartFetch";
import { PROVIDER_ENDPOINTS, ProviderName } from "@/lib/providerConfig";
import { StreamResponse } from "@/types";
import { Metadata } from "next";
import { WatchContent } from "@/components/features/WatchContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    let title = "Episode";
    if (slug.length === 3) {
      const epPath = PROVIDER_ENDPOINTS.kuramanime.episode(slug[0], slug[1], slug[2]);
      const res = await fetchFromProvider<{ data: { details: any } }>(epPath, { revalidate: 300 });
      title = res?.data?.details?.title || res?.data?.details?.episodeTitle || title;
    } else if (slug.length === 1) {
      const res = await smartFetch(
        (p) => PROVIDER_ENDPOINTS[p].episode("", "", slug[0]),
        (raw: any) => raw?.data?.details,
        { providerOrder: ["otakudesu", "samehadaku"], revalidate: 300 }
      );
      title = res.data?.title || title;
    }
    return { title: `Watch ${title}` };
  } catch {
    return { title: "Watch Anime" };
  }
}

export default async function WatchPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  let streamData: StreamResponse | null = null;

  try {
    let epDetails: any = {};
    let animeDetails: any = {};
    let currentAnimeIdParam = "";

    if (slug.length === 3) {
      const [animeId, animeSlug, episodeIdParam] = slug;
      currentAnimeIdParam = `${animeId}/${animeSlug}`;
      const epPath    = PROVIDER_ENDPOINTS.kuramanime.episode(animeId, animeSlug, episodeIdParam);
      const animePath = PROVIDER_ENDPOINTS.kuramanime.anime(animeId, animeSlug);

      const [epResult, animeResult] = await Promise.allSettled([
        fetchFromProvider<{ data: { details: any } }>(epPath,    { revalidate: 0 }),
        fetchFromProvider<{ data: { details: any } }>(animePath, { revalidate: 600 }),
      ]);

      if (epResult.status === "rejected") {
        throw new Error(`Episode fetch failed: ${epResult.reason}`);
      }

      epDetails = epResult.value?.data?.details ?? {};
      animeDetails = animeResult.status === "fulfilled"
        ? animeResult.value?.data?.details ?? {}
        : {};
    } else if (slug.length === 1) {
      const [episodeIdParam] = slug;

      const epResult = await smartFetch(
        (p) => PROVIDER_ENDPOINTS[p].episode("", "", episodeIdParam),
        (raw: any) => raw?.data?.details,
        { providerOrder: ["otakudesu", "samehadaku"], revalidate: 0 }
      );

      epDetails = epResult.data ?? {};
      const activeProvider = epResult.activeProvider as ProviderName;
      
      if (epDetails.animeId) {
         currentAnimeIdParam = epDetails.animeId;
         try {
             const animePath = PROVIDER_ENDPOINTS[activeProvider].anime(epDetails.animeId);
             const animeResult = await fetchFromProvider<{ data: { details: any } }>(animePath, { revalidate: 600 });
             animeDetails = animeResult?.data?.details ?? {};
         } catch(e) {
             console.warn("Failed to fetch anime details for watch page", e);
         }
      }
    } else {
        throw new Error("Invalid slug length");
    }

    // Flatten complex objects (provider response may have {title: "..."} objects)
    const flat = (v: unknown): string => {
      if (!v) return "";
      if (typeof v === "string") return v;
      if (typeof v === "object" && v !== null && "title" in v) return String((v as any).title);
      return String(v);
    };

    // Build episode list from range data
    let episodeList: any[] = animeDetails.episodeList || [];
    if (animeDetails.episode?.last) {
      const first = animeDetails.episode.first || 1;
      const last  = animeDetails.episode.last;
      const genList = [];
      for (let i = last; i >= first; i--) {
        genList.push({
          title: `Episode ${i}`,
          episodeId: `${currentAnimeIdParam}/${i}`,
          otakudesuUrl: "",
        });
      }
      episodeList = genList;
    }

    // Auto-select first stream URL
    let defaultStreamingUrl = epDetails.defaultStreamingUrl || "";
    if (!defaultStreamingUrl) {
      const firstQuality = epDetails.server?.qualityList?.[0];
      if (firstQuality?.urlList?.[0]?.url) {
        defaultStreamingUrl = firstQuality.urlList[0].url;
      }
    }

    streamData = {
      message: "Success",
      data: {
        details: {
          defaultStreamingUrl,
          title: epDetails.title || epDetails.episodeTitle || animeDetails.title || "",
          poster: animeDetails.poster || epDetails.poster || "",
          prevEpisode: epDetails.hasPrevEpisode
            ? { episodeId: slug.length === 3 ? `${currentAnimeIdParam}/${epDetails.prevEpisode?.episodeId}` : epDetails.prevEpisode?.episodeId, title: "Previous" }
            : null,
          nextEpisode: epDetails.hasNextEpisode
            ? { episodeId: slug.length === 3 ? `${currentAnimeIdParam}/${epDetails.nextEpisode?.episodeId}` : epDetails.nextEpisode?.episodeId, title: "Next" }
            : null,
          server: epDetails.server || { qualityList: [] },
          info: {
            credit:      epDetails.info?.credit || "",
            encoder:     epDetails.info?.encoder || "",
            duration:    flat(animeDetails.duration),
            type:        flat(animeDetails.type),
            genreList:   animeDetails.genreList || [],
            episodeList,
          },
        },
      },
    } as StreamResponse;
  } catch (error) {
    console.error("[WatchPage] Error:", error);
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center px-6">
        <div className="space-y-4">
          <p className="text-red-400 text-lg font-medium">Gagal memuat video.</p>
          <p className="text-muted-foreground text-sm">
            Server sedang sibuk atau episode tidak tersedia. Coba lagi beberapa saat.
          </p>
          <a href="/" className="inline-block mt-4 px-6 py-2 bg-brand-lime/10 text-brand-lime border border-brand-lime/20 rounded-full text-sm hover:bg-brand-lime/20 transition-colors">
            Kembali ke Home
          </a>
        </div>
      </div>
    );
  }

  if (!streamData) return null;

  return (
    <div className="container mx-auto px-0 pb-20 pt-10">
      <WatchContent streamData={streamData} slug={slug.join("/")} />
    </div>
  );
}