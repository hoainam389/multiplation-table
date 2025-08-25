import React from "react";
import { CurrentQuestionData } from "./types";

interface QuestionDisplayProps {
  questionType: string;
  currentQuestionData: CurrentQuestionData | null;
  currentQuestionOptions: number[];
  multipleChoice: boolean;
  showFeedback: boolean;
  currentQuestionIndex: number;
  currentQuestions: any[];
  onAnswerChange: (questionKey: string, value: string) => void;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  questionType,
  currentQuestionData,
  currentQuestionOptions,
  multipleChoice,
  showFeedback,
  currentQuestionIndex,
  currentQuestions,
  onAnswerChange,
}) => {
  if (!currentQuestionData) return null;

  return (
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

      <div className="max-w-2xl mx-auto">
        <div
          className={`p-8 sm:p-10 rounded-xl border-2 transition-all duration-200 ${
            currentQuestionData.userAnswer
              ? currentQuestionData.isCorrect
                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                : "border-red-500 bg-red-50 dark:bg-red-900/20"
              : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"
          }`}
        >
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-8">
            {currentQuestionData.question.question}
          </div>

          {multipleChoice ? (
            <div className="space-y-4 sm:space-y-5">
              {currentQuestionOptions.map(
                (option, optionIndex) => (
                  <button
                    key={optionIndex}
                    onClick={() =>
                      onAnswerChange(
                        currentQuestionData.questionKey,
                        option.toString()
                      )
                    }
                    disabled={currentQuestionData.userAnswer !== ""}
                    className={`w-full p-4 sm:p-5 rounded-xl border-2 font-bold text-xl sm:text-2xl transition-colors ${
                      currentQuestionData.userAnswer === option.toString()
                        ? currentQuestionData.isCorrect
                          ? "border-green-500 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                          : "border-red-500 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                    } ${
                      currentQuestionData.userAnswer !== ""
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
                value={currentQuestionData.userAnswer}
                onChange={(e) =>
                  onAnswerChange(currentQuestionData.questionKey, e.target.value)
                }
                disabled={currentQuestionData.userAnswer !== ""}
                className={`w-40 sm:w-48 text-center p-4 sm:p-5 rounded-xl border-2 font-bold text-2xl sm:text-3xl ${
                  currentQuestionData.userAnswer
                    ? currentQuestionData.isCorrect
                      ? "border-green-500 bg-green-100 dark:bg-green-900/30"
                      : "border-red-500 bg-red-100 dark:bg-red-900/30"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                } ${
                  currentQuestionData.userAnswer !== "" ? "cursor-not-allowed" : ""
                }`}
                placeholder="?"
              />
            </div>
          )}

          {/* Auto-advance feedback */}
          {showFeedback && (
            <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700">
              <div className="text-lg sm:text-xl text-blue-800 dark:text-blue-200 font-medium">
                {currentQuestionData.isCorrect ? "✅ Đúng!" : "❌ Sai!"}
                {currentQuestionIndex <
                currentQuestions.length - 1
                  ? "Chuyển sang câu hỏi tiếp theo sau 2 giây..."
                  : "Hoàn thành! Xem kết quả bên dưới."}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
