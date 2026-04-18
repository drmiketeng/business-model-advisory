export interface LeanCanvasDimension {
  id: string;
  name: string;
  pFactor: string;
  question: string;
  choices: string[];
  ratingPrompt: string;
  ratingLabels: { [key: number]: string };
}

export interface Answer {
  selectedChoiceIndex: number | null;
  rating: number;
}

export interface Score {
    name: string;
    score: number;
    weightedScore: number;
    pFactor: string;
    qualitative: string;
}