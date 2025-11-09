export interface ConceptActivation {
  index: number;
  label: string;
  description: string;
  intensity: number;
  rationale?: string;
}

export interface SimulatedActivationPayload {
  sampleId: string;
  text: string;
  context: string;
  title?: string;
  language?: string;
  notes?: string;
  generatedBy?: string;
  disclaimer: string;
  transformer: {
    size: number;
    activations: number[];
  };
  hatchling: {
    size: number;
    activations: number[];
    concepts: ConceptActivation[];
  };
}
