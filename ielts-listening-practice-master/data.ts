
import { QuestionOption } from './types';

export const MCQ_OPTIONS: QuestionOption[] = [
  { letter: 'A', label: 'yoga' },
  { letter: 'B', label: 'pilates' },
  { letter: 'C', label: 'step dance' },
  { letter: 'D', label: 'aerobics' },
  { letter: 'E', label: 'belly dance' },
  { letter: 'F', label: 'barbell classes' },
  { letter: 'G', label: 'kickboxing' },
  { letter: 'H', label: 'zumba' },
  { letter: 'I', label: 'stretching' },
];

export const CORRECT_MCQ = ['A', 'C', 'F', 'H', 'I'];

export const GAP_FILL_QUESTIONS = [
  { id: 16, day: 'Monday' },
  { id: 17, day: 'Tuesday' },
  { id: 18, day: 'Wednesday' },
  { id: 19, day: 'Thursday' },
  { id: 20, day: 'Friday' },
];

export const CORRECT_GAP_FILL: Record<number, string> = {
  16: 'muscle building',
  17: 'fat loss',
  18: 'healthy body',
  19: 'relaxation',
  20: 'interval trainings',
};

export const AUDIO_LINK = 'https://tinyurl.com/ieltslisten2';
