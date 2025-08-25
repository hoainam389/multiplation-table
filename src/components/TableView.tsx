import React from "react";

interface TableViewProps {
  selectedNumbers: number[];
  numbers: number[];
}

export const TableView: React.FC<TableViewProps> = ({
  selectedNumbers,
  numbers,
}) => {
  return (
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
  );
};
