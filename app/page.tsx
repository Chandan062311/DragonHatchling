"use client";

import { useEffect, useState } from "react";
import { ActivationGrid } from "./components/ActivationGrid";
import { SampleSelector } from "./components/SampleSelector";
import { SimulationControls } from "./components/SimulationControls";
import { ActivationInsights } from "./components/ActivationInsights";
import { NeuralTicker } from "./components/NeuralTicker";
import { FlashCards } from "./components/FlashCards";
import type { ConceptActivation, SimulatedActivationPayload } from "./types";

type SampleOption = {
  id: string;
  title: string;
  text: string;
};

const BUILT_IN_SAMPLES: SampleOption[] = [
  {
    id: "sample4",
    title: "Sample 4 • BDH Abstract",
    text: "BDH couples strong theoretical foundations and inherent interpretability without sacrificing Transformer-like performance."
  },
  {
    id: "sample1",
    title: "Sample 1 • English",
    text: "The US Dollar has appreciated with respect to the British Pound."
  },
  {
    id: "sample2",
    title: "Sample 2 • French",
    text: "Le dollar américain s'est apprécié par rapport à la livre sterling."
  },
  {
    id: "sample3",
    title: "Sample 3 • Rumor",
    text: "Belgium's prime minister confirmed the unfounded rumors..."
  }
];

interface ActivationViewModel {
  transformer: number[];
  hatchling: number[];
  concepts: ConceptActivation[];
  transformerSize: number;
  hatchlingSize: number;
  disclaimer: string;
  sampleText: string;
  sampleContext: string;
  notes?: string;
  title?: string;
  language?: string;
  sampleId: string;
  generatedBy?: string;
}

export default function Page() {
  const PROJECT_TITLE = "Dragon Hatchling Synapse Monitor";
  const STUDIO_NAME = "Chandan AI Labs";
  const [samples, setSamples] = useState<SampleOption[]>(BUILT_IN_SAMPLES);
  const [selectedId, setSelectedId] = useState<string>(BUILT_IN_SAMPLES[0].id);
  const [viewModel, setViewModel] = useState<ActivationViewModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [explaining, setExplaining] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [generatedSamples, setGeneratedSamples] = useState<Record<string, SimulatedActivationPayload>>({});

  useEffect(() => {
    let ignore = false;
    async function loadData(sampleId: string) {
      const cached = generatedSamples[sampleId];
      if (cached) {
        updateViewModel(cached);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/sim-synapse?sample=${sampleId}`);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const body = (await response.json()) as SimulatedActivationPayload;
        if (ignore) {
          return;
        }
        updateViewModel(body);
      } catch (fetchError) {
        console.error(fetchError);
        if (!ignore) {
          setError(
            "Unable to load simulation data. Please retry or check the developer console for details."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    loadData(selectedId);
    return () => {
      ignore = true;
    };
  }, [selectedId, generatedSamples]);

  function updateViewModel(payload: SimulatedActivationPayload) {
    setViewModel({
      transformer: payload.transformer.activations,
      hatchling: payload.hatchling.activations,
      concepts: payload.hatchling.concepts,
      transformerSize: payload.transformer.size,
      hatchlingSize: payload.hatchling.size,
      disclaimer: payload.disclaimer,
      sampleText: payload.text,
      sampleContext: payload.context,
      notes: payload.notes,
      title: payload.title,
      language: payload.language,
      sampleId: payload.sampleId,
      generatedBy: payload.generatedBy
    });
  }

  async function handleExplain() {
    if (!viewModel) {
      return;
    }
    setExplaining(true);
    setExplanation(null);
    try {
      const response = await fetch("/api/llm-explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sampleId: viewModel.sampleId,
          text: viewModel.sampleText,
          context: viewModel.sampleContext,
          concepts: viewModel.concepts
        })
      });
      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error ?? `Request failed with status ${response.status}`);
      }
      const data = (await response.json()) as { explanation: string };
      setExplanation(data.explanation);
    } catch (apiError) {
      console.error(apiError);
      setExplanation(
        "The assistant could not generate an explanation. Verify your OpenRouter credentials and try again."
      );
    } finally {
      setExplaining(false);
    }
  }

  async function handleGenerate(prompt: string, creativity: number, languageHint?: string) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/llm-simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt, creativity, languageHint })
      });
      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error ?? `Request failed with status ${response.status}`);
      }
      const payload = (await response.json()) as SimulatedActivationPayload;
      const newSample: SampleOption = {
        id: payload.sampleId,
        title: payload.title ?? `Generated Scenario (${new Date().toLocaleTimeString()})`,
        text: payload.text
      };
      setSamples((prev) => [newSample, ...prev]);
      setSelectedId(newSample.id);
      updateViewModel(payload);
      setGeneratedSamples((prev) => ({ ...prev, [payload.sampleId]: payload }));
      setExplanation(null);
    } catch (apiError) {
      console.error(apiError);
      setError(
        "Unable to generate a new scenario. Check the OpenRouter API key and consider lowering the creativity dial."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-6 py-8">
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 text-center shadow-2xl">
        <p className="text-xs uppercase tracking-[0.4em] text-amber-200">Immersive Visualization</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-100 md:text-4xl">{PROJECT_TITLE}</h1>
        <p className="mt-3 text-sm text-slate-300 md:text-base">
          Explore how a scale-free, locally interacting BDH network might mirror brain attention while keeping Transformer-level performance.
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Anchored to highlights from Kosowski et al. (2025), <em>The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain</em>.
        </p>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
          Crafted by {STUDIO_NAME}
        </p>
      </section>
      <FlashCards projectTitle={PROJECT_TITLE} />
      <SimulationControls onGenerate={handleGenerate} busy={loading} />
      <SampleSelector
        samples={samples}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
        <header className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-100">
            {viewModel?.title ?? "Input Text"}
          </h2>
          <p className="text-sm text-slate-400">
            Active sample: <span className="text-amber-200">{selectedId}</span>
          </p>
          <p className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-200">
            {viewModel?.sampleText ?? "Loading the selected sample..."}
          </p>
          <p className="text-xs text-slate-500">
            Context: {viewModel?.sampleContext ?? "Retrieving context..."}
          </p>
          {viewModel?.language ? (
            <p className="text-xs text-slate-500">Language: {viewModel.language}</p>
          ) : null}
        </header>
      </section>
      {error ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}
      {loading ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
          Simulating activations...
        </div>
      ) : null}
      <section className="grid gap-6 md:grid-cols-2">
        <ActivationGrid
          title="Transformer • Dense Activations"
          subtitle="Chaotic energy: dense layers flare broadly, masking the underlying meaning."
          variant="dense"
          size={viewModel?.transformerSize ?? 768}
          activations={viewModel?.transformer ?? new Array(768).fill(0)}
        />
        <ActivationGrid
          title="Dragon Hatchling • Sparse Activations"
          subtitle="Laser focus: monosemantic synapses ignite with intense clarity for the detected concepts."
          variant="sparse"
          size={viewModel?.hatchlingSize ?? 256}
          activations={viewModel?.hatchling ?? new Array(256).fill(0)}
          concepts={viewModel?.concepts}
        />
      </section>
      <ActivationInsights
        viewModel={viewModel}
        explanation={explanation}
        explaining={explaining}
        onExplain={handleExplain}
      />
      {viewModel ? <NeuralTicker concepts={viewModel.concepts} /> : null}
      <footer className="rounded-2xl border border-amber-300/40 bg-amber-500/10 p-4 text-xs text-amber-100">
        <p>
          Disclaimer: The &quot;Dragon Hatchling&quot; model is treated here as a speculative construct. References to Kosowski et
          al. (2025) exist for storytelling context only—the animations remain illustrative, not empirical findings.
        </p>
      </footer>
    </main>
  );
}
