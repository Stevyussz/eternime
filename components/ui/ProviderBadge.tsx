import { PROVIDER_META, type ProviderName } from "@/lib/providerConfig";

interface ProviderBadgeProps {
  provider: ProviderName;
  className?: string;
}

/**
 * Pill badge showing which data provider is currently active.
 * Server-side renderable (no "use client" needed).
 */
export function ProviderBadge({ provider, className = "" }: ProviderBadgeProps) {
  const meta = PROVIDER_META[provider];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${className}`}
      style={{
        background: meta.bgColor,
        borderColor: meta.color + "30",
        color: meta.color,
      }}
      title={`Data source: ${meta.label}`}
    >
      <span className="text-[9px]">{meta.emoji}</span>
      {meta.label}
    </span>
  );
}
