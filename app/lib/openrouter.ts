const DEFAULT_MODEL = process.env.OPENROUTER_MODEL ?? "openrouter/deepseek-3.1-v";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

type MessageRole = "system" | "user" | "assistant";

export interface OpenRouterMessage {
  role: MessageRole;
  content: string;
}

interface OpenRouterChoice {
  message?: {
    role?: MessageRole;
    content?: string;
  };
}

interface OpenRouterResponse {
  choices?: OpenRouterChoice[];
}

export interface OpenRouterCallOptions {
  messages: OpenRouterMessage[];
  maxTokens?: number;
  temperature?: number;
  responseFormat?: "text" | "json_object";
}

export const SPECULATIVE_SYSTEM_PROMPT = `You are a careful assistant helping users explore a speculative "Dragon Hatchling" narrative.\n- Explain concepts plainly.\n- Surface caveats when the story departs from verifiable science.\n- Remind readers that BDH details are user-supplied fiction when relevant.\n- Use any provided context to ground outputs, otherwise acknowledge the gap.\n- When helpful, cite highlights from Kosowski et al. (2025), "The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain" (arXiv:2509.26507).\n- Key takeaways you can lean on: BDH is modeled as a scale-free graph of locally interacting neuron particles, couples excitatory and inhibitory circuits with integrate-and-fire thresholds, relies on Hebbian plasticity for working memory, and yields sparse, positive, monosemantic activations that rival GPT-2 era Transformers.\n`;

export async function callOpenRouter({
  messages,
  maxTokens = 512,
  temperature = 0.4,
  responseFormat = "text"
}: OpenRouterCallOptions) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }

  const inferredReferer = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
  const referer = process.env.OPENROUTER_REFERRER ?? inferredReferer;
  const appTitle = process.env.OPENROUTER_APP_TITLE ?? "Synapse Monitor";

  const body: Record<string, unknown> = {
    model: DEFAULT_MODEL,
    messages,
    max_tokens: maxTokens,
    temperature
  };

  if (responseFormat === "json_object") {
    body.response_format = { type: "json_object" };
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": referer,
      "X-Title": appTitle
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter request failed (${response.status}): ${errorText}`);
  }

  const payload = (await response.json()) as OpenRouterResponse;
  const answer = payload.choices?.[0]?.message?.content?.trim();

  if (!answer) {
    throw new Error("Model response was empty");
  }

  return answer;
}

export async function callOpenRouterJson<T>(options: OpenRouterCallOptions) {
  const raw = await callOpenRouter({ ...options, responseFormat: "json_object" });
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    throw new Error(`Failed to parse model JSON: ${(error as Error).message}. Raw response: ${raw}`);
  }
}
