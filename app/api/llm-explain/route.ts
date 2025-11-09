import { NextResponse } from "next/server";
import { SPECULATIVE_SYSTEM_PROMPT, callOpenRouter } from "@/app/lib/openrouter";
import type { ConceptActivation } from "@/app/types";

interface ExplainRequestBody {
  sampleId?: string;
  text?: string;
  context?: string;
  concepts?: ConceptActivation[];
}

export async function POST(request: Request) {
  let body: ExplainRequestBody;

  try {
    body = (await request.json()) as ExplainRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const text = body.text?.trim();
  if (!text) {
    return NextResponse.json({ error: "Sample text is required." }, { status: 400 });
  }

  const concepts = normalizeConcepts(body.concepts);
  const context = body.context?.trim();
  const sampleId = body.sampleId ?? "unknown";

  const conceptSummary = concepts
    .map(
      (concept) =>
        `- ${concept.label} (index ${concept.index}, intensity ${concept.intensity.toFixed(2)}): ${concept.description}`
    )
    .join("\n");

  const rationaleBlock = concepts
    .map((concept) => (concept.rationale ? `• ${concept.label}: ${concept.rationale}` : null))
    .filter(Boolean)
    .join("\n");

  const messageLines = [
    `Sample ID: ${sampleId}`,
    `Sample text: ${text}`,
    context ? `Additional context: ${context}` : undefined,
    "Concept activations:",
    conceptSummary,
    rationaleBlock ? `Existing rationales:\n${rationaleBlock}` : undefined,
    "Instructions: Provide a concise explanation (2-3 paragraphs) of why these concept synapses activated, referencing the sample text. Reinforce that the BDH framing is speculative." 
  ]
    .filter(Boolean)
    .join("\n\n");

  try {
    const explanation = await callOpenRouter({
      messages: [
        {
          role: "system",
          content: `${SPECULATIVE_SYSTEM_PROMPT}\nAdopt a didactic tone suitable for an interactive visualization.`
        },
        {
          role: "user",
          content: messageLines
        }
      ],
      temperature: 0.3,
      maxTokens: 500
    });

    return NextResponse.json({ explanation: explanation.trim() });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to obtain an explanation from the LLM. (${message})` },
      { status: 502 }
    );
  }
}

function normalizeConcepts(concepts: ConceptActivation[] | undefined): ConceptActivation[] {
  if (!concepts || concepts.length === 0) {
    return [
      {
        index: 0,
        label: "Unknown Concept",
        description: "No concept metadata was provided for this sample.",
        intensity: 0.5
      }
    ];
  }

  return concepts.slice(0, 6).map((concept) => ({
    ...concept,
    label: concept.label || "Unnamed Concept",
    description: concept.description || "No description provided.",
    intensity: clamp(concept.intensity, 0, 1)
  }));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
