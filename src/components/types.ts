export interface Question {
  number: number;
  multiplier: number;
  answer: number;
  type: "multiplication" | "division";
  question: string;
}

export interface MultipleChoiceOptions {
  [key: string]: number[];
}

export interface UserAnswers {
  [key: string]: string;
}

export type QuestionType = "multiplication" | "division" | "mixed";

export interface CurrentQuestionData {
  question: Question;
  questionKey: string;
  userAnswer: string;
  isCorrect: boolean;
}
