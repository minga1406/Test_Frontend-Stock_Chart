import React from "react";
import { TimeFrame } from "../types";

interface TimeFrameButtonsProps {
  selectedTimeFrame: TimeFrame;
  onTimeFrameChange: (timeFrame: TimeFrame) => void;
}

export const TimeFrameButtons: React.FC<TimeFrameButtonsProps> = ({
  selectedTimeFrame,
  onTimeFrameChange,
}) => {
  const timeFrames: { key: TimeFrame; label: string }[] = [
    { key: "hourly", label: "1h" },
    { key: "daily", label: "1d" },
    { key: "weekly", label: "1w" },
    { key: "monthly", label: "1m" },
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      {timeFrames.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onTimeFrameChange(key)}
          className={`px-2 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
            selectedTimeFrame === key
              ? "bg-gray-300 text-gray-800 border hover:bg-gray-50"
              : "text-gray-600"
          }`}>
          {label}
        </button>
      ))}
    </div>
  );
};
