import { useState, useCallback, useMemo, useRef } from "react";
import { Question, MultipleChoiceOptions, UserAnswers, QuestionType, CurrentQuestionData } from "../types";

export const useMultiplicationTable = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([1]);
  const [practiceMode, setPracticeMode] = useState(false);
  const [multipleChoice, setMultipleChoice] = useState(true);
  const [questionType, setQuestionType] = useState<QuestionType>("mixed");
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [score, setScore] = useState(0);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<MultipleChoiceOptions>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  // Use refs to store timers to prevent memory leaks
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scoreCheckTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize numbers array to prevent recreation on every render
  const numbers = useMemo(() => Array.from({ length: 10 }, (_, i) => i + 1), []);

  // Clear all timers to prevent memory leaks
  const clearAllTimers = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    if (scoreCheckTimerRef.current) {
      clearTimeout(scoreCheckTimerRef.current);
      scoreCheckTimerRef.current = null;
    }
  }, []);

  // Reset all state in one batch to prevent multiple re-renders
  const resetAllState = useCallback(() => {
    setUserAnswers({});
    setScore(0);
    setCurrentQuestions([]);
    setMultipleChoiceOptions({});
    setCurrentQuestionIndex(0);
    setShowFeedback(false);
    clearAllTimers();
  }, [clearAllTimers]);

  const handleNumberToggle = useCallback((num: number) => {
    setSelectedNumbers((prev) => {
      if (prev.includes(num)) {
        return prev.filter((n) => n !== num);
      } else {
        return [...prev, num];
      }
    });
    resetAllState();
  }, [resetAllState]);

  const getQuestionKey = useCallback((question: {
    type: string;
    number: number;
    multiplier: number;
  }) => `${question.type}-${question.number}-${question.multiplier}`, []);

  const generateMultipleChoiceOptions = useCallback((
    correctAnswer: number,
    questionType: "multiplication" | "division"
  ) => {
    const options = [correctAnswer];

    // Generate 3 wrong answers based on question type
    while (options.length < 4) {
      let wrongAnswer: number;

      if (questionType === "multiplication") {
        // For multiplication, wrong answers should be close to correct
        wrongAnswer = correctAnswer + Math.floor(Math.random() * 10) - 5;
      } else {
        // For division, wrong answers should be reasonable divisors
        wrongAnswer = Math.max(
          1,
          correctAnswer + Math.floor(Math.random() * 6) - 3
        );
      }

      if (
        wrongAnswer > 0 &&
        wrongAnswer !== correctAnswer &&
        !options.includes(wrongAnswer)
      ) {
        options.push(wrongAnswer);
      }
    }

    // Shuffle options
    return options.sort(() => Math.random() - 0.5);
  }, []);

  const generateQuestions = useCallback(() => {
    const questions: Question[] = [];

    // Generate exactly 10 questions
    const targetQuestionCount = 10;

    // Create a pool of all possible questions
    const allQuestions: Question[] = [];

    selectedNumbers.forEach((number) => {
      numbers.forEach((multiplier) => {
        if (questionType === "multiplication" || questionType === "mixed") {
          allQuestions.push({
            number,
            multiplier,
            answer: number * multiplier,
            type: "multiplication",
            question: `${number} × ${multiplier} = ?`,
          });
        }

        if (questionType === "division" || questionType === "mixed") {
          const dividend = number * multiplier;
          allQuestions.push({
            number: dividend,
            multiplier: number,
            answer: multiplier,
            type: "division",
            question: `${dividend} ÷ ${number} = ?`,
          });
        }
      });
    });

    // Shuffle all questions and take the first 10
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, targetQuestionCount);

    // Generate multiple choice options for each question
    const optionsMap: MultipleChoiceOptions = {};
    selectedQuestions.forEach((question) => {
      const questionKey = getQuestionKey(question);
      optionsMap[questionKey] = generateMultipleChoiceOptions(
        question.answer,
        question.type
      );
    });

    // Batch all state updates to prevent multiple re-renders
    setMultipleChoiceOptions(optionsMap);
    setCurrentQuestions(selectedQuestions);
    setUserAnswers({});
    setScore(0);
    setCurrentQuestionIndex(0);
    setShowFeedback(false);
    clearAllTimers();
  }, [selectedNumbers, numbers, questionType, clearAllTimers, getQuestionKey, generateMultipleChoiceOptions]);

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowFeedback(false);
    }
  }, [currentQuestionIndex, currentQuestions.length]);

  const handleAnswerChange = useCallback((questionKey: string, value: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionKey]: value,
    }));

    // Show feedback
    setShowFeedback(true);

    // Clear any existing timer
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }

    // Set new timer to advance to next question after 2 seconds
    autoAdvanceTimerRef.current = setTimeout(() => {
      goToNextQuestion();
      setShowFeedback(false);
    }, 2000);

    // Auto-check answers when all questions are answered
    const newAnswers = { ...userAnswers, [questionKey]: value };
    if (Object.keys(newAnswers).length === currentQuestions.length) {
      // Clear any existing score check timer
      if (scoreCheckTimerRef.current) {
        clearTimeout(scoreCheckTimerRef.current);
      }
      
      scoreCheckTimerRef.current = setTimeout(() => {
        let correct = 0;
        currentQuestions.forEach((question) => {
          const qKey = getQuestionKey(question);
          const userAns = parseInt(newAnswers[qKey] || "0");
          if (userAns === question.answer) {
            correct++;
          }
        });
        setScore(correct);
      }, 100);
    }
  }, [userAnswers, currentQuestions, goToNextQuestion, getQuestionKey]);

  const checkAnswers = useCallback(() => {
    let correct = 0;
    currentQuestions.forEach((question) => {
      const questionKey = getQuestionKey(question);
      const userAnswer = parseInt(userAnswers[questionKey] || "0");
      if (userAnswer === question.answer) {
        correct++;
      }
    });
    setScore(correct);
  }, [currentQuestions, userAnswers, getQuestionKey]);

  const resetPractice = useCallback(() => {
    resetAllState();
  }, [resetAllState]);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setShowFeedback(false);
    }
  }, [currentQuestionIndex]);

  const goToQuestion = useCallback((index: number) => {
    setCurrentQuestionIndex(index);
    setShowFeedback(false);
  }, []);

  const getCurrentQuestion = useCallback(() => {
    return currentQuestions[currentQuestionIndex];
  }, [currentQuestions, currentQuestionIndex]);

  const getAnsweredCount = useCallback(() => {
    return Object.keys(userAnswers).length;
  }, [userAnswers]);

  const getProgressPercentage = useCallback(() => {
    return Math.round((getAnsweredCount() / currentQuestions.length) * 100);
  }, [getAnsweredCount, currentQuestions.length]);

  const getQuestionCount = useCallback(() => {
    return 10;
  }, []);

  // Memoize current question data to prevent unnecessary recalculations
  const currentQuestionData = useMemo((): CurrentQuestionData | null => {
    if (currentQuestions.length === 0) return null;
    
    const question = getCurrentQuestion();
    if (!question) return null;
    
    const questionKey = getQuestionKey(question);
    const userAnswer = userAnswers[questionKey] || "";
    const isCorrect = userAnswer && parseInt(userAnswer) === question.answer;
    
    return { question, questionKey, userAnswer, isCorrect };
  }, [currentQuestions, getCurrentQuestion, getQuestionKey, userAnswers]);

  // Memoize multiple choice options for current question
  const currentQuestionOptions = useMemo(() => {
    if (!currentQuestionData) return [];
    return multipleChoiceOptions[currentQuestionData.questionKey] || [];
  }, [currentQuestionData, multipleChoiceOptions]);

  return {
    // State
    selectedNumbers,
    practiceMode,
    multipleChoice,
    questionType,
    userAnswers,
    score,
    currentQuestions,
    multipleChoiceOptions,
    currentQuestionIndex,
    showFeedback,
    numbers,
    
    // Computed values
    currentQuestionData,
    currentQuestionOptions,
    
    // Actions
    setPracticeMode,
    setMultipleChoice,
    setQuestionType,
    handleNumberToggle,
    generateQuestions,
    handleAnswerChange,
    checkAnswers,
    resetPractice,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    
    // Getters
    getCurrentQuestion,
    getAnsweredCount,
    getProgressPercentage,
    getQuestionCount,
    getQuestionKey,
    
    // Cleanup
    clearAllTimers,
  };
};
