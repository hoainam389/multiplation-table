"use client";

import { useState, useEffect } from "react";

export default function MultiplicationTable() {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([1]);
  const [practiceMode, setPracticeMode] = useState(false);
  const [multipleChoice, setMultipleChoice] = useState(true);
  const [questionType, setQuestionType] = useState<
    "multiplication" | "division" | "mixed"
  >("mixed");
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [score, setScore] = useState(0);
  const [currentQuestions, setCurrentQuestions] = useState<
    Array<{
      number: number;
      multiplier: number;
      answer: number;
      type: "multiplication" | "division";
      question: string;
    }>
  >([]);
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<{
    [key: string]: number[];
  }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [autoAdvanceTimer, setAutoAdvanceTimer] =
    useState<NodeJS.Timeout | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const numbers = Array.from({ length: 10 }, (_, i) => i + 1);

  const handleNumberToggle = (num: number) => {
    setSelectedNumbers((prev) => {
      if (prev.includes(num)) {
        return prev.filter((n) => n !== num);
      } else {
        return [...prev, num];
      }
    });
    setUserAnswers({});
    setScore(0);
    setCurrentQuestions([]);
    setMultipleChoiceOptions({});
    setCurrentQuestionIndex(0);
    setShowFeedback(false);
  };

  const handleAnswerChange = (questionKey: string, value: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionKey]: value,
    }));

    // Show feedback and start auto-advance timer
    setShowFeedback(true);

    // Clear any existing timer
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
    }

    // Set new timer to advance to next question after 2 seconds
    const timer = setTimeout(() => {
      goToNextQuestion();
      setShowFeedback(false);
    }, 2000);

    setAutoAdvanceTimer(timer);

    // Auto-check answers when all questions are answered
    const newAnswers = { ...userAnswers, [questionKey]: value };
    if (Object.keys(newAnswers).length === currentQuestions.length) {
      setTimeout(() => {
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
  };

  const generateQuestions = () => {
    const questions: Array<{
      number: number;
      multiplier: number;
      answer: number;
      type: "multiplication" | "division";
      question: string;
    }> = [];

    // Generate exactly 10 questions
    const targetQuestionCount = 10;
    let questionCount = 0;

    // Create a pool of all possible questions
    const allQuestions: Array<{
      number: number;
      multiplier: number;
      answer: number;
      type: "multiplication" | "division";
      question: string;
    }> = [];

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
    const optionsMap: { [key: string]: number[] } = {};
    selectedQuestions.forEach((question) => {
      const questionKey = getQuestionKey(question);
      optionsMap[questionKey] = generateMultipleChoiceOptions(
        question.answer,
        question.type
      );
    });

    setMultipleChoiceOptions(optionsMap);
    setCurrentQuestions(selectedQuestions);
    setUserAnswers({});
    setScore(0);
    setCurrentQuestionIndex(0);
    setShowFeedback(false);
  };

  const generateMultipleChoiceOptions = (
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
  };

  const checkAnswers = () => {
    let correct = 0;
    currentQuestions.forEach((question) => {
      const questionKey = getQuestionKey(question);
      const userAnswer = parseInt(userAnswers[questionKey] || "0");
      if (userAnswer === question.answer) {
        correct++;
      }
    });
    setScore(correct);
  };

  const resetPractice = () => {
    setUserAnswers({});
    setScore(0);
    setCurrentQuestions([]);
    setMultipleChoiceOptions({});
    setCurrentQuestionIndex(0);
    setShowFeedback(false);
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
  };

  const getQuestionKey = (question: {
    type: string;
    number: number;
    multiplier: number;
  }) => `${question.type}-${question.number}-${question.multiplier}`;

  const getQuestionCount = () => {
    return 10;
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowFeedback(false);
    }
    // If we're on the last question, don't advance - show results instead
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setShowFeedback(false);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowFeedback(false);
  };

  const getCurrentQuestion = () => {
    return currentQuestions[currentQuestionIndex];
  };

  const getAnsweredCount = () => {
    return Object.keys(userAnswers).length;
  };

  const getProgressPercentage = () => {
    return Math.round((getAnsweredCount() / currentQuestions.length) * 100);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
      }
    };
  }, [autoAdvanceTimer]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Number Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
          Chọn số (Có thể chọn nhiều)
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3 sm:gap-4">
          {numbers.map((num) => (
            <button
              key={num}
              onClick={() => handleNumberToggle(num)}
              className={`p-4 sm:p-5 rounded-xl font-bold text-lg sm:text-xl transition-all duration-200 ${
                selectedNumbers.includes(num)
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
        <div className="mt-6 text-center text-base sm:text-lg text-gray-600 dark:text-gray-400">
          Đã chọn: {selectedNumbers.length} số
          {selectedNumbers.length !== 1 ? "" : ""}
          {selectedNumbers.length > 0 && ` (${selectedNumbers.join(", ")})`}
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white text-center lg:text-left">
            Tùy chọn luyện tập
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <button
              onClick={() => setPracticeMode(!practiceMode)}
              className={`px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-medium text-base sm:text-lg transition-colors ${
                practiceMode
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {practiceMode ? "Chế độ xem" : "Chế độ luyện tập"}
            </button>
            {practiceMode && (
              <>
                <button
                  onClick={() => setMultipleChoice(!multipleChoice)}
                  className={`px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-medium text-base sm:text-lg transition-colors ${
                    multipleChoice
                      ? "bg-orange-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {multipleChoice ? "Nhập văn bản" : "Trắc nghiệm"}
                </button>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <span className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-medium">
                    Loại:
                  </span>
                  <select
                    value={questionType}
                    onChange={(e) =>
                      setQuestionType(
                        e.target.value as
                          | "multiplication"
                          | "division"
                          | "mixed"
                      )
                    }
                    className="px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-base sm:text-lg font-medium min-w-[160px]"
                  >
                    <option value="multiplication">Nhân</option>
                    <option value="division">Chia</option>
                    <option value="mixed">Hỗn hợp</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Practice Mode Controls */}
      {practiceMode && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-6">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-6">
              Tạo câu hỏi luyện tập
            </h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <button
                onClick={generateQuestions}
                disabled={selectedNumbers.length === 0}
                className="px-8 py-4 sm:px-10 sm:py-5 bg-blue-600 text-white rounded-xl font-medium text-lg sm:text-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tạo {selectedNumbers.length > 0 ? getQuestionCount() : ""} câu
                hỏi
              </button>
              <button
                onClick={resetPractice}
                className="px-8 py-4 sm:px-10 sm:py-5 bg-gray-600 text-white rounded-xl font-medium text-lg sm:text-xl hover:bg-gray-700 transition-colors"
              >
                Đặt lại
              </button>
            </div>
            {currentQuestions.length > 0 && (
              <div className="mt-6 text-base sm:text-lg text-gray-600 dark:text-gray-400">
                10 câu hỏi được tạo từ {selectedNumbers.length} số
                {selectedNumbers.length !== 1 ? "" : ""}(
                {questionType === "mixed"
                  ? "nhân và chia"
                  : questionType === "multiplication"
                  ? "nhân"
                  : "chia"}
                )
              </div>
            )}
          </div>
        </div>
      )}

      {/* Multiplication Table / Practice Questions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
        {practiceMode && currentQuestions.length > 0 ? (
          // Practice Mode with Questions - One at a time
          <>
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                <span className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-medium">
                  Câu hỏi {currentQuestionIndex + 1} / {currentQuestions.length}
                </span>
                <span className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-medium">
                  {getAnsweredCount()}/{currentQuestions.length} đã trả lời (
                  {getProgressPercentage()}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 sm:h-4">
                <div
                  className="bg-blue-600 h-3 sm:h-4 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>

            {/* Current Question - Only show if not all questions answered */}
            {getAnsweredCount() < currentQuestions.length ? (
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-8">
                  Câu hỏi luyện tập (
                  {questionType === "mixed"
                    ? "Nhân và Chia"
                    : questionType === "multiplication"
                    ? "Nhân"
                    : "Chia"}
                  )
                </h2>

                {(() => {
                  const question = getCurrentQuestion();
                  const questionKey = getQuestionKey(question);
                  const userAnswer = userAnswers[questionKey] || "";
                  const isCorrect =
                    userAnswer && parseInt(userAnswer) === question.answer;

                  return (
                    <div className="max-w-2xl mx-auto">
                      <div
                        className={`p-8 sm:p-10 rounded-xl border-2 transition-all duration-200 ${
                          userAnswer
                            ? isCorrect
                              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                              : "border-red-500 bg-red-50 dark:bg-red-900/20"
                            : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"
                        }`}
                      >
                        <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-8">
                          {question.question}
                        </div>

                        {multipleChoice ? (
                          <div className="space-y-4 sm:space-y-5">
                            {multipleChoiceOptions[questionKey]?.map(
                              (option, optionIndex) => (
                                <button
                                  key={optionIndex}
                                  onClick={() =>
                                    handleAnswerChange(
                                      questionKey,
                                      option.toString()
                                    )
                                  }
                                  disabled={userAnswer !== ""}
                                  className={`w-full p-4 sm:p-5 rounded-xl border-2 font-bold text-xl sm:text-2xl transition-colors ${
                                    userAnswer === option.toString()
                                      ? isCorrect
                                        ? "border-green-500 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                                        : "border-red-500 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                                      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                                  } ${
                                    userAnswer !== ""
                                      ? "cursor-not-allowed"
                                      : "cursor-pointer"
                                  }`}
                                >
                                  {option}
                                </button>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <input
                              type="number"
                              value={userAnswer}
                              onChange={(e) =>
                                handleAnswerChange(questionKey, e.target.value)
                              }
                              disabled={userAnswer !== ""}
                              className={`w-40 sm:w-48 text-center p-4 sm:p-5 rounded-xl border-2 font-bold text-2xl sm:text-3xl ${
                                userAnswer
                                  ? isCorrect
                                    ? "border-green-500 bg-green-100 dark:bg-green-900/30"
                                    : "border-red-500 bg-red-100 dark:bg-red-900/30"
                                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                              } ${
                                userAnswer !== "" ? "cursor-not-allowed" : ""
                              }`}
                              placeholder="?"
                            />
                          </div>
                        )}

                        {/* Auto-advance feedback */}
                        {showFeedback && (
                          <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700">
                            <div className="text-lg sm:text-xl text-blue-800 dark:text-blue-200 font-medium">
                              {isCorrect ? "✅ Đúng!" : "❌ Sai!"}
                              {currentQuestionIndex <
                              currentQuestions.length - 1
                                ? "Chuyển sang câu hỏi tiếp theo sau 2 giây..."
                                : "Hoàn thành! Xem kết quả bên dưới."}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : null}

            {/* Quick Navigation (Optional) */}
            <div className="flex justify-center mb-8">
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {currentQuestions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full text-sm sm:text-base font-bold transition-colors ${
                      index === currentQuestionIndex
                        ? "bg-blue-600 text-white"
                        : userAnswers[getQuestionKey(currentQuestions[index])]
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Practice Mode Controls */}
            <div className="text-center">
              {getAnsweredCount() === currentQuestions.length ? (
                // Show Results Summary
                <div className="space-y-6">
                  <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-2 border-blue-200 dark:border-blue-700">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4">
                      Hoàn thành! 🎉
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
                      <div className="text-center p-4 rounded-xl bg-green-100 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-700">
                        <div className="text-3xl sm:text-4xl font-bold text-green-800 dark:text-green-200">
                          {score}
                        </div>
                        <div className="text-sm sm:text-base text-green-700 dark:text-green-300 font-medium">
                          Đúng
                        </div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-red-100 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-700">
                        <div className="text-3xl sm:text-4xl font-bold text-red-800 dark:text-red-200">
                          {currentQuestions.length - score}
                        </div>
                        <div className="text-sm sm:text-base text-red-700 dark:text-red-300 font-medium">
                          Sai
                        </div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700">
                        <div className="text-3xl sm:text-4xl font-bold text-blue-800 dark:text-blue-200">
                          {Math.round((score / currentQuestions.length) * 100)}%
                        </div>
                        <div className="text-sm sm:text-base text-blue-700 dark:text-blue-300 font-medium">
                          Điểm
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <button
                        onClick={resetPractice}
                        className="px-8 py-4 sm:px-10 sm:py-5 bg-blue-600 text-white rounded-xl font-medium text-lg sm:text-xl hover:bg-blue-700 transition-colors mr-4"
                      >
                        Luyện tập lại
                      </button>
                      <button
                        onClick={() => setPracticeMode(false)}
                        className="px-8 py-4 sm:px-10 sm:py-5 bg-gray-600 text-white rounded-xl font-medium text-lg sm:text-xl hover:bg-gray-700 transition-colors"
                      >
                        Về chế độ xem
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Show Check Answers Button
                <>
                  <button
                    onClick={checkAnswers}
                    className="px-8 py-4 sm:px-10 sm:py-5 bg-blue-600 text-white rounded-xl font-medium text-lg sm:text-xl hover:bg-blue-700 transition-colors"
                  >
                    Kiểm tra tất cả câu trả lời
                  </button>

                  {score > 0 && (
                    <div className="mt-6 text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">
                      Điểm: {score} / {currentQuestions.length} (
                      {Math.round((score / currentQuestions.length) * 100)}%)
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        ) : practiceMode ? (
          // Practice Mode - No Questions Generated Yet
          <div className="text-center py-16 sm:py-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-6">
              Sẵn sàng luyện tập?
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-8">
              Chọn số ở trên và nhấn "Tạo câu hỏi" để bắt đầu luyện tập{" "}
              {questionType === "mixed"
                ? "nhân và chia"
                : questionType === "multiplication"
                ? "nhân"
                : "chia"}
              !
            </p>
            <div className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Bạn có thể chọn:
              <ul className="mt-4 space-y-2">
                <li>
                  • <strong>Nhân</strong>: Luyện tập bảng cửu chương
                </li>
                <li>
                  • <strong>Chia</strong>: Luyện tập phép chia dựa trên bảng cửu
                  chương
                </li>
                <li>
                  • <strong>Hỗn hợp</strong>: Kết hợp cả hai để luyện tập toàn
                  diện
                </li>
              </ul>
            </div>
          </div>
        ) : (
          // View Mode - Show Selected Tables
          <>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
              {selectedNumbers.length === 1
                ? `Bảng cửu chương ${selectedNumbers[0]}`
                : `${selectedNumbers.length} bảng cửu chương được chọn`}
            </h2>

            {selectedNumbers.map((selectedNumber) => (
              <div key={selectedNumber} className="mb-10 last:mb-0">
                <h3 className="text-2xl sm:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-6 text-center">
                  Bảng cửu chương {selectedNumber}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                  {numbers.map((num) => {
                    const correctAnswer = selectedNumber * num;
                    return (
                      <div
                        key={num}
                        className="p-4 sm:p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"
                      >
                        <div className="text-center">
                          <div className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-3">
                            {selectedNumber} × {num} = ?
                          </div>
                          <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {correctAnswer}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
