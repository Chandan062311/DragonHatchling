"use client";

interface FlashCardsProps {
  projectTitle: string;
}

const CARDS = [
  {
    title: "Scale-Free Neuron Graph",
    summary:
      "BDH is framed as a scale-free network of locally interacting neuron particles, echoing how brain regions self-organize.",
    takeaway:
      "Track the 'Scale-Free Topology' badge in the sparse grid to see that idea translated into a glowing concept."
  },
  {
    title: "Excitatory & Inhibitory Loops",
    summary:
      "The paper models BDH as paired excitatory and inhibitory circuits with integrate-and-fire thresholds.",
    takeaway:
      "Look for the loop-focused synapse to pulse alongside dense bursts—our visual shorthand for that circuit dynamic."
  },
  {
    title: "Hebbian Working Memory",
    summary:
      "Inference relies on synaptic plasticity that can persist for hundreds of tokens, standing in for working memory.",
    takeaway:
      "Use Explain to ask DeepSeek why 'Hebbian Working Memory' lights up when scenarios reference long reasoning chains."
  },
  {
    title: "Sparse Positive Codes",
    summary:
      "BDH activations are sparse and positive, enabling monosemantic interpretations even below 100M parameters.",
    takeaway:
      "Switch between samples to notice how only a handful of BDH cells blaze at once compared to the dense transformer smear."
  }
];

export function FlashCards({ projectTitle }: FlashCardsProps) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl backdrop-blur">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Concept Flash Cards</p>
          <h2 className="text-2xl font-semibold text-slate-100">Understanding {projectTitle}</h2>
        </div>
        <span className="text-xs text-slate-400">
          Tap a card mentally as you explore—each maps to a visual cue in the grids below.
        </span>
      </header>
  <div className="mt-5 grid gap-4 md:grid-cols-4">
        {CARDS.map((card) => (
          <article
            key={card.title}
            className="group flex h-full flex-col gap-3 rounded-2xl border border-amber-300/30 bg-amber-500/5 p-4 text-sm text-amber-100 transition hover:-translate-y-1 hover:border-amber-300/70 hover:bg-amber-500/10 hover:shadow-lg hover:shadow-amber-500/20"
          >
            <h3 className="text-lg font-semibold text-amber-100 group-hover:text-amber-200">{card.title}</h3>
            <p className="text-amber-100/80">{card.summary}</p>
            <div className="rounded-xl border border-amber-300/20 bg-slate-950/40 p-3 text-xs text-amber-100/90">
              <span className="font-semibold text-amber-200">Remember:</span> {card.takeaway}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
