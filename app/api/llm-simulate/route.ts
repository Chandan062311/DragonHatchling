import { NextResponse } from "next/server";
import {
  assignConceptIndices,
  generateDenseActivations,
  generateSparseActivations
} from "@/app/lib/simulation";
import {
  SPECULATIVE_SYSTEM_PROMPT,
  callOpenRouterJson
} from "@/app/lib/openrouter";
import type { ConceptActivation, SimulatedActivationPayload } from "@/app/types";

interface GenerateRequestBody {
  prompt?: string;
  creativity?: number;
  languageHint?: string;
}

interface LlmConcept {
  label: string;
  description: string;
  rationale?: string;
  intensity: number;
}

interface LlmSimulationPlan {
  title: string;
  primary_text: string;
  alternate_text?: string;
  context: string;
  concepts: LlmConcept[];
  transformer_seed: string;
  hatchling_seed: string;
  notes?: string;
  language?: string;
}

const DEFAULT_PROMPT =
  "Show how BDH's scale-free neuron graph coordinates excitatory and inhibitory loops, using Hebbian plasticity to sustain a reasoning concept over time.";
const TRANSFORMER_SIZE = 768;
const HATCHLING_SIZE = 256;

export async function POST(request: Request) {
  let body: GenerateRequestBody;

  try {
    body = (await request.json()) as GenerateRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const prompt = body.prompt?.trim() || DEFAULT_PROMPT;
  const creativity = clamp(body.creativity ?? 0.4, 0, 1);
  const languageHint = body.languageHint?.trim();

  let plan: LlmSimulationPlan;

  try {
    plan = await requestSimulationPlan(prompt, languageHint, creativity);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error:
          "The LLM could not produce a simulation plan. Adjust your prompt or verify the OpenRouter credentials."
      },
      { status: 502 }
    );
  }

  const normalizedConcepts = sanitizeConcepts(plan.concepts);
  const conceptsWithIndices = assignConceptIndices(normalizedConcepts, HATCHLING_SIZE);

  const transformerActivations = generateDenseActivations(TRANSFORMER_SIZE, plan.transformer_seed);
  const hatchlingActivations = generateSparseActivations(
    HATCHLING_SIZE,
    plan.hatchling_seed,
    conceptsWithIndices
  );

  const sampleId = `llm-${Date.now()}`;

  const payload: SimulatedActivationPayload = {
    sampleId,
    title: plan.title,
    text: plan.primary_text,
    context: buildContext(plan),
    notes: plan.notes,
    language: plan.language,
    generatedBy: "openrouter",
    disclaimer:
      "LLM-generated scenario based on user guidance. The Dragon Hatchling framing remains speculative fiction.",
    transformer: {
      size: TRANSFORMER_SIZE,
      activations: transformerActivations
    },
    hatchling: {
      size: HATCHLING_SIZE,
      activations: hatchlingActivations,
      concepts: conceptsWithIndices as ConceptActivation[]
    }
  };

  return NextResponse.json(payload);
}

async function requestSimulationPlan(prompt: string, languageHint: string | undefined, creativity: number) {
  const userMessage = [
    "You produce scenario descriptions that highlight how a Dragon Hatchling style sparse model might behave.",
    "Return ONLY strict JSON following this schema:",
    JSON.stringify(
      {
        title: "string",
        primary_text: "string",
        alternate_text: "string optional",
        context: "string",
        concepts: [
          {
            label: "string",
            description: "string",
            rationale: "string optional",
            intensity: "float 0-1"
          }
        ],
        transformer_seed: "short string",
        hatchling_seed: "short string",
        notes: "string optional",
        language: "string optional"
      },
      null,
      2
    ),
    "Guidelines:",
    "- Focus on one or two core concepts that map to interpretable neurons.",
    "- Provide intensities between 0.5 and 1.0 for key concepts and lower values for supporting cues.",
    "- If you reference multiple languages, mention them in `language` and include the secondary sentence in `alternate_text`.",
    "- Seeds should be stable lower-case strings (e.g., 'currency-cross-lingual').",
    "- When possible, connect the scenario to the published BDH claims (scale-free topology, excitatory/inhibitory loops, Hebbian working memory, sparse positive activations).",
    languageHint ? `Language preference: ${languageHint}.` : ""
  ]
    .filter(Boolean)
    .join("\n");

  return callOpenRouterJson<LlmSimulationPlan>({
    messages: [
      {
        role: "system",
        content: `${SPECULATIVE_SYSTEM_PROMPT}\nRespond only with JSON matching the documented schema.`
      },
      {
        role: "user",
        content: `Prompt: ${prompt}\n\n${userMessage}`
      }
    ],
    temperature: creativity,
    maxTokens: 700
  });
}

function sanitizeConcepts(concepts: LlmConcept[]) {
  if (!Array.isArray(concepts) || concepts.length === 0) {
    return [
      {
        label: "Fallback Concept",
        description: "LLM failed to provide a concept; using a placeholder node.",
        rationale: "Use this to illustrate mismatch scenarios.",
        intensity: 0.75
      }
    ];
  }

  return concepts.slice(0, 6).map((concept) => ({
    label: concept.label?.trim() || "Unnamed Concept",
    description: concept.description?.trim() || "No description provided.",
    rationale: concept.rationale?.trim(),
    intensity: clamp(concept.intensity ?? 0.7, 0, 1)
  }));
}

function buildContext(plan: LlmSimulationPlan) {
  const contextLines = [plan.context];
  if (plan.alternate_text) {
    contextLines.push(`Alternate phrasing: ${plan.alternate_text}`);
  }
  return contextLines.filter(Boolean).join("\n\n");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
