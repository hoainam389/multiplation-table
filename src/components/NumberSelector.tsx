import React from "react";

interface NumberSelectorProps {
  numbers: number[];
  selectedNumbers: number[];
  onNumberToggle: (num: number) => void;
}

export const NumberSelector: React.FC<NumberSelectorProps> = ({
  numbers,
  selectedNumbers,
  onNumberToggle,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-6">
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
        Chọn số (Có thể chọn nhiều)
      </h2>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3 sm:gap-4">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => onNumberToggle(num)}
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
  );
};
