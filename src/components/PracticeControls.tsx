import React from "react";

interface PracticeControlsProps {
  selectedNumbers: number[];
  questionType: string;
  currentQuestions: any[];
  isGenerating: boolean;
  onGenerateQuestions: () => void;
  onResetPractice: () => void;
  getQuestionCount: () => number;
}

export const PracticeControls: React.FC<PracticeControlsProps> = ({
  selectedNumbers,
  questionType,
  currentQuestions,
  isGenerating,
  onGenerateQuestions,
  onResetPractice,
  getQuestionCount,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-6">
      <div className="text-center">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          Tạo câu hỏi luyện tập
        </h3>
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <button
            onClick={onGenerateQuestions}
            disabled={selectedNumbers.length === 0 || isGenerating}
            className="px-8 py-4 sm:px-10 sm:py-5 bg-blue-600 text-white rounded-xl font-medium text-lg sm:text-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang tạo câu hỏi...
              </span>
            ) : (
              `Tạo ${selectedNumbers.length > 0 ? getQuestionCount() : ""} câu hỏi`
            )}
          </button>
          <button
            onClick={onResetPractice}
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
  );
};
