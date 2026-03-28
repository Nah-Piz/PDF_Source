import { useState, } from "react";

const ReadingProgress = ({ progress, onUpdateProgress }) => {
  const [localProgress, setLocalProgress] = useState(progress || 0);

  const handleProgressChange = (e) => {
    const value = parseInt(e.target.value);
    setLocalProgress(value);
    onUpdateProgress(value);
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Reading Progress
        </span>
        <span className="text-sm text-emerald-600 font-medium">
          {localProgress}%
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={localProgress}
        onChange={handleProgressChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
      />
      <p className="text-xs text-gray-500 mt-2">
        {localProgress === 100
          ? "🎉 Completed!"
          : localProgress > 0
            ? "Keep reading!"
            : "Start reading to track progress"}
      </p>
    </div>
  );
};

export default ReadingProgress;
