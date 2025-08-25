import React from "react";

interface PracticeControlsProps {
  selectedNumbers: number[];
  questionType: string;
  currentQuestions: any[];
  onGenerateQuestions: () => void;
  onResetPractice: () => void;
  getQuestionCount: () => number;
}

export const PracticeControls: React.FC<PracticeControlsProps> = ({
  selectedNumbers,
  questionType,
  currentQuestions,
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
            disabled={selectedNumbers.length === 0}
            className="px-8 py-4 sm:px-10 sm:py-5 bg-blue-600 text-white rounded-xl font-medium text-lg sm:text-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tạo {selectedNumbers.length > 0 ? getQuestionCount() : ""} câu
            hỏi
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
