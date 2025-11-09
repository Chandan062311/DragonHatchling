# Synapse Monitor

_Crafted by Chandan AI Labs_

A conceptual Next.js 14 demo that contrasts a dense transformer "black box" with a sparse, monosemantic "Dragon Hatchling" (BDH) simulation. The interface visualises parallel activation grids for the same input text to highlight the difference between opaque and interpretable internal states, and now lets you generate new scenarios and explanations with OpenRouter’s DeepSeek 3.1v model.

> **Disclaimer**: The "Dragon Hatchling" framing remains speculative. Where the UI references Kosowski et al. (2025), *The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain* (arXiv:2509.26507), it does so for narrative grounding only; no proprietary checkpoints or unpublished data are bundled here.

## Features

- Next.js App Router UI with a two-column layout (Transformer vs. Dragon Hatchling).
- Deterministic simulation API (`/api/sim-synapse`) that produces:
  - Dense activation patterns for a traditional transformer.
  - Sparse activations with labelled concept synapses for the hypothetical BDH model.
- Pre-baked sample excerpting the BDH abstract so you can compare simulated concepts (scale-free topology, excitatory/inhibitory loops, Hebbian working memory) against the paper's claims.
- Tailwind CSS-powered neuron grid visualisations with concept tooltips and badges.
- Sample selector covering multilingual currency statements, a rumor snippet, and the BDH abstract excerpt.
- Scenario generator that calls OpenRouter’s DeepSeek 3.1v model to draft fresh BDH narratives, seeds, and concept labels.
- One-click activation explainer that asks the model why each sparse synapse fired, reinforcing the speculative framing.
- Animated neuron grids and a live synapse ticker that make the "glass brain" feel active instead of static.
- Concept flash cards that teach monosemantic intuition before users dive into the visualizations.
  - Updated cards now call out the paper's scale-free graph, excitatory/inhibitory circuits, Hebbian memory, and sparse positive activations.

## Environment Setup

Create a `.env.local` file based on the included sample:

```bash
cp .env.local.example .env.local
```

Populate `OPENROUTER_API_KEY` with your OpenRouter key (keep it out of version control). Adjust the optional `OPENROUTER_MODEL`, `OPENROUTER_REFERRER`, and `OPENROUTER_APP_TITLE` values as needed.

## Getting Started

```bash
npm install
npm run dev
```

Then open `http://localhost:3000` to explore the dashboard.

### Available Scripts

- `npm run dev` – start the development server with hot reloading.
- `npm run build` – create a production build.
- `npm run start` – serve the production build.
- `npm run lint` – run ESLint using Next.js defaults.

## Simulation Model

The `/api/sim-synapse` endpoint is a deterministic simulator:

- **Dense activations**: seeded pseudo-random values across 768 virtual neurons emulate opaque transformer embeddings.
- **Sparse activations**: most of the 256 neurons remain near-zero, while specific indices (e.g., index `42` labelled "Currency Synapse") illuminate to reinforce the monosemantic storytelling hook.
- **Concept labels**: metadata returned from the API is rendered in the UI to connect highlighted synapses to human-readable concepts.
- **Paper-aligned sample**: Sample 4 mirrors language from the published abstract to spotlight how the visualization maps theoretical claims onto interpretable nodes.

## LLM-Driven Play Loop

- `/api/llm-simulate` prompts the model for a JSON simulation plan (sample prose, concept list, seeds). The frontend caches each generated scenario so you can revisit it without another API call.
- `/api/llm-explain` hands the active sample and its concepts back to the model, which narrates why the highlighted synapses fired.
- Rationales appear inline beside the sparse activations to guide the Aha! moment.

### Future Enhancements

1. Add retrieval to ground scenarios in verifiable sources before handing them to the model.
2. Stream activation explanations for faster feedback.
3. Let users edit model-suggested concepts manually and re-run the simulator.

## Contributing

- Keep UI copy explicit about the speculative nature of the BDH concept.
- Cite reputable, verifiable sources before expanding the RAG corpus.
- Prefer deterministic simulations so the experience stays reproducible and cheap to host.

## References

- A. Kosowski, P. Uznański, J. Chorowski, Z. Stamirowska, M. Bartoszkiewicz (2025). *The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain*. arXiv:2509.26507. <https://pathway.com/research/bdh>

## License

This project is released under the MIT License. See [LICENSE](LICENSE) for details.
