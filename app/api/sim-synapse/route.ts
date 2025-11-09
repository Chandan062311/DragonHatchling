import { NextResponse } from "next/server";
import { generateDenseActivations, generateSparseActivations } from "@/app/lib/simulation";
import type { ConceptActivation, SimulatedActivationPayload } from "@/app/types";

type SampleKey = "sample1" | "sample2" | "sample3" | "sample4";

type SampleDefinition = {
  id: SampleKey;
  label: string;
  text: string;
  context: string;
  transformerSize: number;
  hatchlingSize: number;
  denseSeed: string;
  sparseSeed: string;
  concepts: ConceptActivation[];
  language?: string;
  notes?: string;
};

const SAMPLES: Record<SampleKey, SampleDefinition> = {
  sample1: {
    id: "sample1",
    label: "Sample 1 • English",
    text: "The US Dollar has appreciated with respect to the British Pound.",
    context: "Currency appreciation statement (English).",
    transformerSize: 768,
    hatchlingSize: 256,
    denseSeed: "usd-pound-english",
    sparseSeed: "currency-cross-lingual",
    language: "English",
    concepts: [
      {
        index: 42,
        label: "Currency Synapse",
        description: "Hypothetical neuron that fires for currency concepts across languages.",
        intensity: 1
      },
      {
        index: 128,
        label: "Country Synapse",
        description: "Signals the presence of country or nationality cues (e.g. British).",
        intensity: 0.72
      }
    ]
  },
  sample2: {
    id: "sample2",
    label: "Sample 2 • French",
    text: "Le dollar américain s'est apprécié par rapport à la livre sterling.",
    context: "Currency appreciation statement (French).",
    transformerSize: 768,
    hatchlingSize: 256,
    denseSeed: "usd-pound-french",
    sparseSeed: "currency-cross-lingual",
    language: "French",
    concepts: [
      {
        index: 42,
        label: "Currency Synapse",
        description: "Same hypothetical neuron as Sample 1, highlighting cross-language concept binding.",
        intensity: 1
      },
      {
        index: 144,
        label: "Language Synapse",
        description: "Tracks discourse language shift without changing the underlying concept.",
        intensity: 0.58
      }
    ]
  },
  sample3: {
    id: "sample3",
    label: "Sample 3 • Rumor",
    text: "Belgium's prime minister confirmed the unfounded rumors...",
    context: "Rumor confirmation statement (English).",
    transformerSize: 768,
    hatchlingSize: 256,
    denseSeed: "rumor-confirmation",
    sparseSeed: "rumor-signal",
    language: "English",
    concepts: [
      {
        index: 72,
        label: "Rumor Synapse",
        description: "Flags speculative or rumor-labeled language elements.",
        intensity: 0.88
      },
      {
        index: 188,
        label: "Authority Synapse",
        description: "Highlights authoritative confirmation cues (e.g. prime minister).",
        intensity: 0.63
      }
    ]
  },
  sample4: {
    id: "sample4",
    label: "Sample 4 • BDH Abstract",
    text: "BDH couples strong theoretical foundations and inherent interpretability without sacrificing Transformer-like performance.",
    context:
      "Abstract excerpt from 'The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain' (arXiv:2509.26507).",
    transformerSize: 768,
    hatchlingSize: 256,
    denseSeed: "bdh-abstract",
    sparseSeed: "bdh-theory-link",
    language: "English",
    notes:
      "Highlights the paper's claim that BDH uses a scale-free, locally interacting neuron graph with excitatory/inhibitory circuits and Hebbian plasticity to mirror brain attention while matching Transformer scaling laws.",
    concepts: [
      {
        index: 18,
        label: "Scale-Free Topology",
        description: "Captures the heavy-tailed, high-modularity neuron graph BDH relies on for distributed reasoning.",
        intensity: 0.92,
        rationale: "Linked to Section 5 of the paper discussing modularity and scale-free structure."
      },
      {
        index: 57,
        label: "Excitatory/Inhibitory Loop",
        description: "Represents the paired circuits with integrate-and-fire thresholding that emulate biological attention.",
        intensity: 0.83,
        rationale: "Grounded in Section 2.5 that expresses BDH as brain-like oscillator circuits."
      },
      {
        index: 142,
        label: "Hebbian Working Memory",
        description: "Illustrates synaptic plasticity over hundreds of tokens acting as BDH's reasoning memory.",
        intensity: 0.78,
        rationale: "Draws from the abstract's emphasis on potentiation-driven memory without external buffers."
      }
    ]
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = (searchParams.get("sample") as SampleKey) ?? "sample1";
  const sample = SAMPLES[key] ?? SAMPLES.sample1;

  const transformerActivations = generateDenseActivations(sample.transformerSize, sample.denseSeed);
  const hatchlingActivations = generateSparseActivations(sample.hatchlingSize, sample.sparseSeed, sample.concepts);

  const payload: SimulatedActivationPayload = {
    sampleId: sample.id,
    text: sample.text,
    context: sample.context,
    language: sample.language,
    notes: sample.notes,
    disclaimer:
      "Conceptual simulation referencing Kosowski et al. (2025) for inspiration; activations remain illustrative and non-empirical.",
    transformer: {
      size: sample.transformerSize,
      activations: transformerActivations
    },
    hatchling: {
      size: sample.hatchlingSize,
      activations: hatchlingActivations,
      concepts: sample.concepts
    }
  };

  return NextResponse.json(payload);
}
