"use client";

import { useEffect, useMemo, useState } from "react";
import type { ConceptActivation } from "../types";

interface NeuralTickerProps {
  concepts: ConceptActivation[];
}

interface TickerItem {
  label: string;
  description: string;
  rationale?: string;
  intensity: number;
}

export function NeuralTicker({ concepts }: NeuralTickerProps) {
  const items = useMemo<TickerItem[]>(() => {
    return concepts.map((concept) => ({
      label: concept.label,
      description: concept.description,
      rationale: concept.rationale,
      intensity: concept.intensity
    }));
  }, [concepts]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length === 0) {
      return undefined;
    }
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  const item = items[index];

  return (
    <div className="rounded-2xl border border-amber-300/40 bg-amber-500/5 p-5 text-sm text-amber-100 shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-amber-200">Live Synapse Spotlight</p>
          <h4 className="text-lg font-semibold text-amber-100">{item.label}</h4>
        </div>
        <span className="text-xs text-amber-200/70">Intensity {(item.intensity * 100).toFixed(0)}%</span>
      </div>
      <p className="mt-3 text-amber-100/90">{item.description}</p>
      {item.rationale ? (
        <p className="mt-2 rounded-lg border border-amber-300/30 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-100/90">
          {item.rationale}
        </p>
      ) : null}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-amber-500/10">
        <div
          className="h-full rounded-full bg-amber-300 transition-all duration-500 ease-out"
          style={{ width: `${Math.max(item.intensity, 0.1) * 100}%` }}
        />
      </div>
    </div>
  );
}
