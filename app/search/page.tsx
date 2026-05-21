import { fetchFromProvider } from "@/lib/smartFetch";
import { PROVIDER_ENDPOINTS, PROVIDER_ORDER } from "@/lib/providerConfig";
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

  try {
    const promises = PROVIDER_ORDER.map(async (provider) => {
      const endpoint = PROVIDER_ENDPOINTS[provider].search(q);
      const raw = await fetchFromProvider(endpoint, { revalidate: 300 });
      return { provider, data: SEARCH_NORMALIZERS[provider](raw) };
    });

    const settled = await Promise.allSettled(promises);
    const allItems: AnimeCardType[] = [];

    // Combine all successful results
    for (const result of settled) {
      if (result.status === "fulfilled") {
        const { provider, data } = result.value;
        const mapped = data.items.map((item) => {
          const card = toAnimeCard(item);
          // Tag the card with its provider so AdvancedSearchResults knows its origin
          return { ...card, provider };
        });
        allItems.push(...mapped);
      }
    }

    // Deduplicate by title (keeping the first one found, prioritizing by PROVIDER_ORDER)
    const seen = new Set<string>();
    for (const item of allItems) {
      const key = item.title.toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        results.push(item);
      }
    }
  } catch (error) {
    console.error("[SearchPage] Search failed:", error);
  }

  return (
    <div className="container mx-auto px-6 pb-20 pt-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          Hasil pencarian{" "}
          <span className="text-brand-lime">&ldquo;{q}&rdquo;</span>
        </h1>
        <div className="text-sm text-muted-foreground">
          Menampilkan dari {PROVIDER_ORDER.length} sumber
        </div>
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
