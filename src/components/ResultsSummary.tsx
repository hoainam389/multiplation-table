import React from "react";

interface ResultsSummaryProps {
  score: number;
  currentQuestions: any[];
  onResetPractice: () => void;
  onBackToViewMode: () => void;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  score,
  currentQuestions,
  onResetPractice,
  onBackToViewMode,
}) => {
  return (
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
            onClick={onResetPractice}
            className="px-8 py-4 sm:px-10 sm:py-5 bg-blue-600 text-white rounded-xl font-medium text-lg sm:text-xl hover:bg-blue-700 transition-colors mr-4"
          >
            Luyện tập lại
          </button>
          <button
            onClick={onBackToViewMode}
            className="px-8 py-4 sm:px-10 sm:py-5 bg-gray-600 text-white rounded-xl font-medium text-lg sm:text-xl hover:bg-gray-700 transition-colors"
          >
            Về chế độ xem
          </button>
        </div>
      </div>
    </div>
  );
};
