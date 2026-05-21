"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROVIDER_META, type ProviderName } from "@/lib/providerConfig";
import { Zap } from "lucide-react";

interface ProviderSwitchToastProps {
  provider: ProviderName;
  fallbackOccurred: boolean;
}

/**
 * Toast notification yang muncul ketika provider cascade terjadi.
 * Auto-dismiss setelah 4 detik.
 */
export function ProviderSwitchToast({ provider, fallbackOccurred }: ProviderSwitchToastProps) {
  const [visible, setVisible] = useState(fallbackOccurred);
  const meta = PROVIDER_META[provider];

  useEffect(() => {
    if (!fallbackOccurred) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, [fallbackOccurred, provider]);

  if (!fallbackOccurred) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl text-sm font-medium"
          style={{
            background: meta.bgColor,
            borderColor: meta.color + "40",
            color: meta.color,
          }}
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 0.5, repeat: 1, delay: 0.2 }}
          >
            <Zap className="w-4 h-4" style={{ color: meta.color }} />
          </motion.div>
          <span>
            Switched to{" "}
            <strong style={{ color: meta.color }}>{meta.emoji} {meta.label}</strong>
          </span>
          <motion.button
            whileHover={{ scale: 1.2 }}
            onClick={() => setVisible(false)}
            className="ml-1 opacity-60 hover:opacity-100 transition-opacity text-xs"
          >
            ✕
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
