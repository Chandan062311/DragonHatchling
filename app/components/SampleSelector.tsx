"use client";

interface SampleOption {
  id: string;
  title: string;
  text: string;
}

interface SampleSelectorProps {
  samples: SampleOption[];
  selectedId: string;
  onSelect: (sampleId: string) => void;
}

export function SampleSelector({ samples, selectedId, onSelect }: SampleSelectorProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
      <div>
        <h1 className="text-xl font-semibold text-slate-100">Synapse Monitor</h1>
        <p className="mt-1 text-sm text-slate-400">
          Compare a dense transformer &quot;black box&quot; with the hypothetical Dragon Hatchling &quot;glass brain&quot;.
        </p>
      </div>
  <p className="text-xs uppercase tracking-wide text-slate-500">Browse curated samples, including the BDH abstract excerpt</p>
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {samples.map((sample) => {
          const isActive = selectedId === sample.id;
          return (
            <button
              key={sample.id}
              type="button"
              onClick={() => onSelect(sample.id)}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                isActive
                  ? "border-amber-300 bg-amber-500/10 text-amber-100 shadow-lg shadow-amber-500/10"
                  : "border-slate-800 bg-slate-950/60 text-slate-200 hover:border-amber-200/40 hover:text-amber-100"
              }`}
            >
              <span className="text-sm font-semibold">{sample.title}</span>
              <p className="mt-1 text-xs text-slate-400">{sample.text}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
