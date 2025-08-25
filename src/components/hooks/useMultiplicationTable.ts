import { useState, useCallback, useMemo, useRef } from "react";
import { Question, MultipleChoiceOptions, UserAnswers, QuestionType, CurrentQuestionData } from "../types";
import questionsData from "../../data/questions.json";

export const useMultiplicationTable = () => {
  // Selected table numbers (1-10) for multiplication/division practice
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
  const [isGenerating, setIsGenerating] = useState(false);

  // Use refs to store timers to prevent memory leaks
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scoreCheckTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize available table numbers (1-10) to prevent recreation on every render
  const numbers = useMemo(() => Array.from({ length: 10 }, (_, i) => i + 1), []);

  // Memoize filtered questions based on selected numbers and question type
  const availableQuestions = useMemo(() => {
    return (questionsData.questions as Question[]).filter((question) => {
      // Filter by question type first
      let matchesType = false;
      if (questionType === "mixed") {
        matchesType = true;
      } else if (questionType === "multiplication") {
        matchesType = question.type === "multiplication";
      } else if (questionType === "division") {
        matchesType = question.type === "division";
      }
      
      if (!matchesType) return false;
      
      // Filter by tableNumber (selected numbers represent the tables to practice)
      const matchesTable = selectedNumbers.includes(question.tableNumber);
      
      return matchesTable;
    });
  }, [selectedNumbers, questionType]);

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
    setIsGenerating(false);
    clearAllTimers();
  }, [clearAllTimers]);

  // Toggle selection of multiplication/division tables (1-10)
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

  const generateQuestions = useCallback(() => {
    setIsGenerating(true);
    
    // Use setTimeout to prevent blocking the UI
    setTimeout(() => {
      // Use pre-generated questions from questions.json
      const allQuestions: Question[] = [...availableQuestions];
      
      // Debug: Log available questions for verification
      console.log('Available questions from JSON:', availableQuestions.length);
      console.log('Selected table numbers:', selectedNumbers);
      console.log('Question type:', questionType);
      if (availableQuestions.length > 0) {
        console.log('Sample questions:', availableQuestions.slice(0, 3).map(q => 
          `Table ${q.tableNumber} - ${q.type}: ${q.number} ${q.type === 'multiplication' ? '×' : '÷'} ${q.multiplier} = ${q.answer}`
        ));
      }
      
      // If we don't have enough questions, add some basic ones as fallback
      if (allQuestions.length < 10) {
        const basicNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        basicNumbers.forEach((number) => {
          if (allQuestions.length >= 20) return; // Limit fallback questions
          
          for (let multiplier = 1; multiplier <= 10; multiplier++) {
            if (allQuestions.length >= 20) break;
            
                    if (questionType === "multiplication" || questionType === "mixed") {
          allQuestions.push({
            tableNumber: number,
            number,
            multiplier,
            answer: number * multiplier,
            type: "multiplication" as const,
            question: `${number} × ${multiplier} = ?`,
            difficulty: Math.ceil((number + multiplier) / 3),
            options: []
          });
        }
          }
        });
      }
      
      // Shuffle questions and select 10
      const shuffled = [...allQuestions];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      const selectedQuestions = shuffled.slice(0, 10);
      
      // Generate multiple choice options for each question
      const optionsMap: MultipleChoiceOptions = {};
      selectedQuestions.forEach((question) => {
        const questionKey = getQuestionKey(question);
        
        // Use pre-generated options if available, otherwise generate new ones
        if (question.options && question.options.length === 4) {
          optionsMap[questionKey] = question.options;
        } else {
          // Generate options for questions without pre-generated options
          const options = [question.answer];
          while (options.length < 4) {
            let wrongAnswer: number;
            
            if (question.type === "multiplication") {
              wrongAnswer = question.answer + Math.floor(Math.random() * 10) - 5;
            } else {
              wrongAnswer = Math.max(1, question.answer + Math.floor(Math.random() * 6) - 3);
            }
            
            if (
              wrongAnswer > 0 &&
              wrongAnswer !== question.answer &&
              !options.includes(wrongAnswer)
            ) {
              options.push(wrongAnswer);
            }
          }
          optionsMap[questionKey] = options.sort(() => Math.random() - 0.5);
        }
      });
      
      // Batch all state updates to prevent multiple re-renders
      setMultipleChoiceOptions(optionsMap);
      setCurrentQuestions(selectedQuestions);
      setUserAnswers({});
      setScore(0);
      setCurrentQuestionIndex(0);
      setShowFeedback(false);
      clearAllTimers();
      setIsGenerating(false);
    }, 0);
  }, [availableQuestions, questionType, clearAllTimers, getQuestionKey]);

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
    const isCorrect: boolean = Boolean(userAnswer && parseInt(userAnswer) === question.answer);
    
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
    isGenerating,
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
