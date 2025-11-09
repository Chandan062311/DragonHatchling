"use client";

import { useEffect, useMemo, useState } from "react";
import type { ConceptActivation } from "../types";

type Variant = "dense" | "sparse";

interface ActivationGridProps {
  title: string;
  subtitle: string;
  variant: Variant;
  size: number;
  activations: number[];
  concepts?: ConceptActivation[];
}

const VARIANT_THEME: Record<Variant, { base: [number, number, number]; accent: string; background: string; }> = {
  dense: {
    base: [96, 165, 250],
    accent: "text-sky-300",
    background: "bg-slate-900/70"
  },
  sparse: {
    base: [249, 115, 22],
    accent: "text-amber-200",
    background: "bg-slate-900/40 backdrop-blur"
  }
};

export function ActivationGrid({
  title,
  subtitle,
  variant,
  size,
  activations,
  concepts
}: ActivationGridProps) {
  const columns = useMemo(() => Math.ceil(Math.sqrt(size)), [size]);
  const [burstSet, setBurstSet] = useState<Set<number>>(new Set());
  const conceptMap = useMemo(() => {
    const map = new Map<number, ConceptActivation>();
    concepts?.forEach((concept) => {
      map.set(concept.index, concept);
    });
    return map;
  }, [concepts]);

  useEffect(() => {
    if (variant === "dense") {
      const initial = new Set<number>();
      const initialCount = Math.max(12, Math.floor(size * 0.05));
      for (let i = 0; i < initialCount; i += 1) {
        initial.add(Math.floor(Math.random() * size));
      }
      setBurstSet(initial);

      const interval = setInterval(() => {
        const next = new Set<number>();
        const burstCount = Math.max(12, Math.floor(size * 0.05));
        for (let i = 0; i < burstCount; i += 1) {
          next.add(Math.floor(Math.random() * size));
        }
        setBurstSet(next);
      }, 720);
      return () => clearInterval(interval);
    }

    const highlighted = new Set<number>();
    concepts?.forEach((concept) => {
      highlighted.add(concept.index);
      const neighbor = concept.index + 1 < size ? concept.index + 1 : concept.index - 1;
      if (neighbor >= 0) {
        highlighted.add(neighbor);
      }
    });
    setBurstSet(highlighted);
    return () => setBurstSet(new Set());
  }, [variant, size, concepts]);

  return (
    <section
      className={`space-y-4 rounded-2xl border border-slate-800 p-6 shadow-lg ${VARIANT_THEME[variant].background}`}
    >
      <header className="space-y-1">
        <h2 className={`text-lg font-semibold ${VARIANT_THEME[variant].accent}`}>{title}</h2>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </header>
      <div
        className="grid gap-[2px] rounded-xl border border-slate-800 bg-slate-950/70 p-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: size }).map((_, index) => {
          const intensity = clamp(activations[index] ?? 0, 0, 1);
          const [r, g, b] = VARIANT_THEME[variant].base;
          const opacity = variant === "dense" ? Math.max(intensity, 0.12) : Math.max(intensity, 0.1);
          const concept = conceptMap.get(index);
          const isBursting = burstSet.has(index);
          const cellClasses = [
            "grid-cell",
            "aspect-square",
            "rounded-sm",
            "border",
            "border-slate-900",
            "transition-shadow"
          ];
          if (concept) {
            cellClasses.push(
              "ring-2",
              "ring-amber-300",
              "shadow-amber-200/40",
              "grid-cell--concept"
            );
          }
          if (isBursting && variant === "dense") {
            cellClasses.push("grid-cell--burst");
          }
          return (
            <div
              key={index}
              className={cellClasses.join(" ")}
              style={{
                backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})`,
                opacity: concept ? 1 : variant === "dense" ? 0.8 : 0.5,
                boxShadow:
                  concept && variant === "sparse"
                    ? `0 0 20px rgba(${r}, ${g}, ${b}, ${Math.max(intensity, 0.6)})`
                    : undefined
              }}
              title={concept ? `${concept.label}: ${concept.description}` : undefined}
            />
          );
        })}
      </div>
      {concepts && concepts.length > 0 ? (
        <div className="flex flex-wrap gap-3 text-sm">
          {concepts.map((concept) => (
            <div
              key={concept.index}
              className="flex flex-col gap-1 rounded-lg border border-amber-300/40 bg-amber-500/10 px-3 py-2 text-amber-100"
            >
              <span className="font-medium uppercase tracking-wide text-xs text-amber-200">
                {concept.label}
              </span>
              <p className="text-xs text-amber-100/80">{concept.description}</p>
              {concept.rationale ? (
                <p className="text-[11px] text-amber-100/70">
                  Insight: {concept.rationale}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
