import { fetchFromProvider } from "@/lib/smartFetch";
import { PROVIDER_ENDPOINTS } from "@/lib/providerConfig";
import { StreamResponse } from "@/types";
import { Metadata } from "next";
import { WatchContent } from "@/components/features/WatchContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [animeId, animeSlug, episodeId] = slug;
  try {
    const epPath = PROVIDER_ENDPOINTS.kuramanime.episode(animeId, animeSlug, episodeId);
    const res = await fetchFromProvider<{ data: { details: any } }>(epPath, { revalidate: 300 });
    const title = res?.data?.details?.title || res?.data?.details?.episodeTitle || "Episode";
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
  const [animeId, animeSlug, episodeIdParam] = slug;

  let streamData: StreamResponse | null = null;

  try {
    const epPath    = PROVIDER_ENDPOINTS.kuramanime.episode(animeId, animeSlug, episodeIdParam);
    const animePath = PROVIDER_ENDPOINTS.kuramanime.anime(animeId, animeSlug);

    // ✅ Parallel fetch — episode + anime details serentak
    const [epResult, animeResult] = await Promise.allSettled([
      fetchFromProvider<{ data: { details: any } }>(epPath,    { revalidate: 0 }),
      fetchFromProvider<{ data: { details: any } }>(animePath, { revalidate: 600 }),
    ]);

    if (epResult.status === "rejected") {
      throw new Error(`Episode fetch failed: ${epResult.reason}`);
    }

    const epDetails    = epResult.value?.data?.details ?? {};
    const animeDetails = animeResult.status === "fulfilled"
      ? animeResult.value?.data?.details ?? {}
      : {};

    // Flatten complex objects (provider response may have {title: "..."} objects)
    const flat = (v: unknown): string => {
      if (!v) return "";
      if (typeof v === "string") return v;
      if (typeof v === "object" && v !== null && "title" in v) return String((v as any).title);
      return String(v);
    };

    // Build episode list from range data
    const episodeList: any[] = [];
    if (animeDetails.episode?.last) {
      const first = animeDetails.episode.first || 1;
      const last  = animeDetails.episode.last;
      for (let i = last; i >= first; i--) {
        episodeList.push({
          title: `Episode ${i}`,
          episodeId: `${animeId}/${animeSlug}/${i}`,
          otakudesuUrl: "",
        });
      }
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
            ? { episodeId: `${animeId}/${animeSlug}/${epDetails.prevEpisode?.episodeId}`, title: "Previous" }
            : null,
          nextEpisode: epDetails.hasNextEpisode
            ? { episodeId: `${animeId}/${animeSlug}/${epDetails.nextEpisode?.episodeId}`, title: "Next" }
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