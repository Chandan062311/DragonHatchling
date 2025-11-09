import type { ConceptActivation } from "@/app/types";

export function seededRandom(seed: string) {
  let state = 0;
  for (let i = 0; i < seed.length; i += 1) {
    state = (state * 31 + seed.charCodeAt(i)) >>> 0;
  }

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967295;
  };
}

export function generateDenseActivations(size: number, seed: string) {
  const random = seededRandom(seed);
  return Array.from({ length: size }, () => Math.pow(random(), 1.2));
}

export function generateSparseActivations(
  size: number,
  seed: string,
  concepts: ConceptActivation[]
) {
  const baseNoise = seededRandom(seed);
  const activations = Array.from({ length: size }, () => baseNoise() * 0.08);
  concepts.forEach((concept) => {
    activations[concept.index] = concept.intensity;
    const neighbor = concept.index + 1 < size ? concept.index + 1 : concept.index - 1;
    if (neighbor >= 0 && neighbor < size) {
      activations[neighbor] = Math.max(activations[neighbor], concept.intensity * 0.35);
    }
  });
  return activations;
}

export function assignConceptIndices(
  concepts: Omit<ConceptActivation, "index">[],
  size: number
): ConceptActivation[] {
  return concepts.map((concept) => ({
    ...concept,
    index: hashLabelToIndex(concept.label, size)
  }));
}

function hashLabelToIndex(label: string, size: number) {
  let hash = 0;
  const normalized = label.toLowerCase();
  for (let i = 0; i < normalized.length; i += 1) {
    hash = (hash * 31 + normalized.charCodeAt(i)) >>> 0;
  }
  return hash % size;
}
