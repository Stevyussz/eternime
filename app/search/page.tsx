import { smartFetch } from "@/lib/smartFetch";
import { PROVIDER_ENDPOINTS } from "@/lib/providerConfig";
import {
  normalizeKuramanimeSearch,
  normalizeOtakudesuSearch,
  normalizeAnimesailSearch,
  normalizeSamehadakuSearch,
  toAnimeCard,
  type NormalizedSearchResult,
} from "@/lib/normalize";
import type { AnimeCard as AnimeCardType } from "@/types";
import type { ProviderName } from "@/lib/providerConfig";
import { AdvancedSearchResults } from "@/components/features/AdvancedSearchResults";
import { ProviderBadge } from "@/components/ui/ProviderBadge";
import { ProviderSwitchToast } from "@/components/ui/ProviderSwitchToast";

const SEARCH_NORMALIZERS: Record<ProviderName, (raw: unknown) => NormalizedSearchResult> = {
  kuramanime: normalizeKuramanimeSearch,
  otakudesu:  normalizeOtakudesuSearch,
  animesail:  normalizeAnimesailSearch,
  samehadaku: normalizeSamehadakuSearch,
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;

  if (!q) {
    return (
      <div className="p-20 text-center text-muted-foreground">
        Ketik sesuatu untuk mencari anime...
      </div>
    );
  }

  let results: AnimeCardType[] = [];
  let activeProvider: ProviderName = "kuramanime";
  let fallbackOccurred = false;

  try {
    const result = await smartFetch<NormalizedSearchResult>(
      (p) => PROVIDER_ENDPOINTS[p].search(q),
      (raw, p) => SEARCH_NORMALIZERS[p](raw),
      { revalidate: 300 }
    );
    results = result.data.items.map(toAnimeCard);
    activeProvider = result.activeProvider;
    fallbackOccurred = result.fallbackOccurred;
  } catch (error) {
    console.error("[SearchPage] All providers failed:", error);
  }

  return (
    <div className="container mx-auto px-6 pb-20 pt-10">
      <ProviderSwitchToast provider={activeProvider} fallbackOccurred={fallbackOccurred} />

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          Hasil pencarian{" "}
          <span className="text-brand-lime">&ldquo;{q}&rdquo;</span>
        </h1>
        <ProviderBadge provider={activeProvider} />
      </div>

      {results.length === 0 ? (
        <div className="text-center text-muted-foreground py-20">
          Tidak ada anime yang ditemukan untuk &ldquo;{q}&rdquo;.
        </div>
      ) : (
        <AdvancedSearchResults initialResults={results} />
      )}
    </div>
  );
}
