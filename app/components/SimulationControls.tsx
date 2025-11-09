"use client";

import { useState } from "react";

interface SimulationControlsProps {
  onGenerate: (prompt: string, creativity: number, languageHint?: string) => void | Promise<void>;
  busy: boolean;
}

export function SimulationControls({ onGenerate, busy }: SimulationControlsProps) {
  const [prompt, setPrompt] = useState(
    "Design a scene that shows BDH's scale-free neuron graph coordinating excitatory and inhibitory loops over a reasoning task."
  );
  const [creativity, setCreativity] = useState(0.4);
  const [languageHint, setLanguageHint] = useState("English • cite Kosowski et al. (2025) wording");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onGenerate(prompt, creativity, languageHint.trim() ? languageHint.trim() : undefined);
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <header className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-100">Generate a Fresh Scenario</h2>
          <p className="text-sm text-slate-400">
            Use the DeepSeek 3.1v model via OpenRouter to draft a new narrative grounded in the BDH paper highlights, then
            watch the activations shift in real time. The assistant keeps citations speculative yet transparent.
          </p>
        </header>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-slate-300">Guidance Prompt</span>
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            className="h-28 w-full resize-vertical rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-slate-100 focus:border-amber-300 focus:outline-none"
            placeholder="Describe the concept you want the BDH model to highlight..."
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-slate-300">Language Hint (optional)</span>
          <input
            type="text"
            value={languageHint}
            onChange={(event) => setLanguageHint(event.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-slate-100 focus:border-amber-300 focus:outline-none"
            placeholder="e.g. English & Japanese"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-slate-300">Creativity</span>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(creativity * 100)}
              onChange={(event) => setCreativity(Number(event.target.value) / 100)}
              className="flex-1"
            />
            <span className="w-16 text-right text-xs text-slate-400">{creativity.toFixed(2)}</span>
          </div>
          <p className="text-xs text-slate-500">
            Lower values keep the scenario close to the paper&apos;s claims; higher values invite more playful BDH fiction.
          </p>
        </label>
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Requires <code className="text-amber-200">OPENROUTER_API_KEY</code> in your environment. Keys are never logged.
          </p>
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg border border-amber-300 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Generating..." : "Generate Scenario"}
          </button>
        </div>
      </form>
    </section>
  );
}
