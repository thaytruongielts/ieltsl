
export interface QuestionOption {
  letter: string;
  label: string;
}

export interface Answers {
  mcq: string[];
  gapFill: Record<number, string>;
}

export interface ValidationResults {
  mcqResults: Record<string, boolean>;
  gapFillResults: Record<number, boolean>;
  score: number;
  isSubmitted: boolean;
}
