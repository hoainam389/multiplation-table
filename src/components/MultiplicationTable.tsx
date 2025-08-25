"use client";

import React, { useEffect } from "react";
import { NumberSelector } from "./NumberSelector";
import { ModeToggle } from "./ModeToggle";
import { PracticeControls } from "./PracticeControls";
import { QuestionDisplay } from "./QuestionDisplay";
import { ResultsSummary } from "./ResultsSummary";
import { TableView } from "./TableView";
import { useMultiplicationTable } from "./hooks/useMultiplicationTable";

export default function MultiplicationTable() {
  const {
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
  } = useMultiplicationTable();

  // Cleanup all timers on unmount and when dependencies change
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Number Selection */}
      <NumberSelector
        numbers={numbers}
        selectedNumbers={selectedNumbers}
        onNumberToggle={handleNumberToggle}
      />

      {/* Mode Toggle */}
      <ModeToggle
        practiceMode={practiceMode}
        multipleChoice={multipleChoice}
        questionType={questionType}
        onPracticeModeToggle={() => setPracticeMode(!practiceMode)}
        onMultipleChoiceToggle={() => setMultipleChoice(!multipleChoice)}
        onQuestionTypeChange={setQuestionType}
      />

      {/* Practice Mode Controls */}
      {practiceMode && (
        <PracticeControls
          selectedNumbers={selectedNumbers}
          questionType={questionType}
          currentQuestions={currentQuestions}
          onGenerateQuestions={generateQuestions}
          onResetPractice={resetPractice}
          getQuestionCount={getQuestionCount}
        />
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
            {getAnsweredCount() < currentQuestions.length && currentQuestionData ? (
              <QuestionDisplay
                questionType={questionType}
                currentQuestionData={currentQuestionData}
                currentQuestionOptions={currentQuestionOptions}
                multipleChoice={multipleChoice}
                showFeedback={showFeedback}
                currentQuestionIndex={currentQuestionIndex}
                currentQuestions={currentQuestions}
                onAnswerChange={handleAnswerChange}
              />
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
                <ResultsSummary
                  score={score}
                  currentQuestions={currentQuestions}
                  onResetPractice={resetPractice}
                  onBackToViewMode={() => setPracticeMode(false)}
                />
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
          <TableView
            selectedNumbers={selectedNumbers}
            numbers={numbers}
          />
        )}
      </div>
    </div>
  );
}
