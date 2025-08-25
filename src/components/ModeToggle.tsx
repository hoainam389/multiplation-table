import React from "react";
import { QuestionType } from "./types";

interface ModeToggleProps {
  practiceMode: boolean;
  multipleChoice: boolean;
  questionType: QuestionType;
  onPracticeModeToggle: () => void;
  onMultipleChoiceToggle: () => void;
  onQuestionTypeChange: (type: QuestionType) => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({
  practiceMode,
  multipleChoice,
  questionType,
  onPracticeModeToggle,
  onMultipleChoiceToggle,
  onQuestionTypeChange,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white text-center lg:text-left">
          Tùy chọn luyện tập
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <button
            onClick={onPracticeModeToggle}
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
                onClick={onMultipleChoiceToggle}
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
                    onQuestionTypeChange(
                      e.target.value as QuestionType
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
  );
};
