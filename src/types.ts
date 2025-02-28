export interface Book {
  Author: string;
  AuthorURL: string;
  ISBN: string;
  NumScans: number;
  Title: string;
  YearWritten: number;
  MainGenre: string;
}

export interface UserAnswer {
  answer: string;
  correct: boolean;
}

export interface UserAnswers {
  author?: UserAnswer;
  title?: UserAnswer;
  year?: UserAnswer;
}

export interface RoundResult {
  genre: string;
  score: number;
  userAnswers: UserAnswers;
  passages?: string[]; // Optional array of daily passages
  correctAuthor?: string;   // Add these properties
  correctTitle?: string;    // to match what we're passing
  correctYear?: string;     // from App.tsx
}

export interface DailyData {
  genre: string;
  correctBook: Book;
  wrongBooks: Book[];
  dailyPassages: string[];
}

export interface WrongAnswer {
  [key: string]: number;
}

export interface MostMissed {
  round: number;
  type: string;
  accuracy: number;
  popularWrongAnswers: [string, number][];  // Array of tuples
}

export interface GenreStat {
  Correct: number;
  Plays: number;
  Total: number;
}

export interface GenreStats {
  [genre: string]: GenreStat;
}

export interface DailyStats {
  date: string;
  plays: number;
  avgScore: number;
  avgAccuracy: number;
  mostMissed?: MostMissed;
  genreStats?: GenreStats;
}

export interface FinalSummaryProps {
  roundResults: RoundResult[];
  timelineResults: boolean[];
  totalQuestions: number;
}